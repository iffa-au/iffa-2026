import "server-only";

/**
 * Free-tier LLM providers, tried in order. If one fails before it has sent
 * any text (no key, rate limit, outage, too slow), the next one answers.
 *
 * Both are called over plain HTTP, so there is no SDK to install, and adding a
 * provider is one more entry in `providers()`. Model ids come from env vars so
 * they can be changed without a deploy when a free model is renamed or retired.
 */

export type ChatMessage = { role: "user" | "assistant"; content: string };

type Provider = {
  name: string;
  stream: (system: string, messages: ChatMessage[], signal: AbortSignal) => AsyncGenerator<string>;
};

/**
 * Answers are 2 to 5 sentences (~150 tokens). 1024 leaves room for Groq's
 * gpt-oss "thinking" tokens, which count towards this and towards Groq's
 * daily token limit.
 */
const MAX_OUTPUT_TOKENS = 1024;
/** How long a provider gets to start answering before the next one is tried. */
const FIRST_TOKEN_TIMEOUT_MS = 10_000;
/** No new provider is started after this long; the visitor gets the "busy" message instead. */
const TOTAL_BUDGET_MS = 30_000;

/** Yields the JSON payload of each `data:` line in a server-sent event stream. */
async function* sseData(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data:")) yield trimmed.slice(5).trim();
    }
  }
}

async function ensureOk(res: Response, name: string) {
  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`${name} ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.body;
}

/**
 * Flash-Lite, not Flash: in testing (Nov 2026) the free Flash models either
 * hung or returned "high demand" 503s, while Flash-Lite answered in ~1.2s and
 * is plenty for FAQ-style questions. GEMINI_MODEL takes a comma-separated list;
 * each model is tried in turn.
 */
const DEFAULT_GEMINI_MODELS = "gemini-flash-lite-latest,gemini-3.1-flash-lite";

function gemini(apiKey: string, model: string): Provider {
  return {
    name: `gemini:${model}`,
    async *stream(system, messages, signal) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
        {
          method: "POST",
          signal,
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: messages.map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
            generationConfig: { temperature: 0.3, maxOutputTokens: MAX_OUTPUT_TOKENS },
          }),
        },
      );
      for await (const data of sseData(await ensureOk(res, "Gemini"))) {
        const json = JSON.parse(data);
        for (const part of json.candidates?.[0]?.content?.parts ?? []) {
          if (part.text && !part.thought) yield part.text as string;
        }
      }
    },
  };
}

function groq(apiKey: string): Provider {
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  return {
    name: `groq:${model}`,
    async *stream(system, messages, signal) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          stream: true,
          temperature: 0.3,
          max_completion_tokens: MAX_OUTPUT_TOKENS,
          // gpt-oss models think before answering; keep that short for a chat widget.
          ...(model.includes("gpt-oss") ? { reasoning_effort: "low" } : {}),
          messages: [{ role: "system", content: system }, ...messages],
        }),
      });
      for await (const data of sseData(await ensureOk(res, "Groq"))) {
        if (data === "[DONE]") return;
        const text = JSON.parse(data).choices?.[0]?.delta?.content;
        if (text) yield text as string;
      }
    },
  };
}

/**
 * Order: first Gemini model, then Groq, then any other Gemini models.
 * When the free Gemini tier is slow or rate-limited, its other models usually
 * are too, so a different company (Groq) is the better second try.
 */
function providers(): Provider[] {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const models = geminiKey
    ? (process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODELS).split(",").map((m) => m.trim()).filter(Boolean)
    : [];
  const geminis = models.map((model) => gemini(geminiKey!, model));
  return [...geminis.slice(0, 1), ...(groqKey ? [groq(groqKey)] : []), ...geminis.slice(1)];
}

export const hasProvider = () => providers().length > 0;

/** Provider names in the order they are tried, for the health check. Never includes keys. */
export const providerNames = () => providers().map((p) => p.name);

/**
 * Streams the answer from the first provider that works. Once a provider has
 * sent text we stay with it: switching mid-answer would print two half-answers.
 */
export async function* streamAnswer(
  system: string,
  messages: ChatMessage[],
  signal: AbortSignal,
  onProvider?: (name: string, failed: string[]) => void,
): AsyncGenerator<string> {
  let lastError: unknown = new Error("No chatbot provider configured");
  const startedAt = Date.now();
  const failed: string[] = [];
  for (const provider of providers()) {
    if (Date.now() - startedAt > TOTAL_BUDGET_MS - 5_000) break; // not enough time left to be worth it
    // A busy free tier can hang for a minute before failing. Give each
    // provider a few seconds to start answering, then move on.
    const attempt = new AbortController();
    const onAbort = () => attempt.abort();
    signal.addEventListener("abort", onAbort);
    const timer = setTimeout(() => attempt.abort(), FIRST_TOKEN_TIMEOUT_MS);

    let started = false;
    try {
      for await (const chunk of provider.stream(system, messages, attempt.signal)) {
        if (!started) {
          clearTimeout(timer);
          onProvider?.(provider.name, failed);
        }
        started = true;
        yield chunk;
      }
      if (started) return;
      lastError = new Error(`${provider.name} returned an empty answer`);
      failed.push(provider.name);
    } catch (error) {
      if (started || signal.aborted) throw error;
      lastError = error;
      failed.push(provider.name);
      console.warn(`Chatbot provider ${provider.name} failed, trying next:`, error);
    } finally {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
    }
  }
  throw lastError;
}
