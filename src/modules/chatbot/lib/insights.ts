import "server-only";

/**
 * The chatbot's link to cms-hub, for the CMS "Chatbot insights" page:
 *
 *   recordQuestion()  logs each question + answer (POST /chatbot-questions)
 *   sendFeedback()    the visitor's 👍 / 👎 on an answer (PATCH /chatbot-questions/:id/feedback)
 *   findTemplate()    a staff-written fixed answer for this question, if any
 *                     (GET /chatbot-templates/active, cached for 5 minutes)
 *
 * Needs CHATBOT_INSIGHTS_KEY (the same value as the backend's) and uses the
 * site's NEXT_PUBLIC_API_BASE_URL. Without the key nothing is sent, no fixed
 * answers are used, and the chat works exactly as before.
 *
 * Privacy: only the question, the answer, how it was answered and the page
 * path. No IP, no conversation, no visitor id. The backend also strips emails
 * and phone numbers and deletes everything after 90 days (CHATBOT_RETENTION_DAYS).
 */

export type InsightSource = "ai" | "cache" | "smalltalk" | "template";

/** How long the chat waits for the backend; the visitor already has the answer by then. */
const TIMEOUT_MS = 1500;
const TEMPLATES_TTL_MS = 5 * 60 * 1000; // staff edits reach the bot within 5 minutes
const TEMPLATES_RETRY_MS = 60 * 1000; // after a failed load, try again in a minute

function backend(): { base: string; key: string } | null {
  const key = process.env.CHATBOT_INSIGHTS_KEY?.trim();
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  return key && base ? { base, key } : null;
}

/**
 * Backup check for "the bot didn't have the answer", for when the model
 * forgets the [[NO_INFO]] marker (RULES 1 in knowledge.ts). Add a phrase here
 * if the report shows such an answer counted as answered.
 */
export function isUnanswered(answer: string): boolean {
  const not = "(?:don['’]t|do not|doesn['’]t|does not|isn['’]t|is not|aren['’]t|are not|can['’]t|cannot)";
  return new RegExp(
    `${not} (?:have|list|publish|include|mention|show|cover|see)\\b` +
      `|${not} (?:listed|published|included|mentioned|available)\\b` +
      `|\\bno (?:information|details?) (?:about|on|for)\\b` +
      `|\\bnot sure\\b`,
    "i",
  ).test(answer);
}

/**
 * Logs one question. Never throws. Returns the saved question's id (for 👍 / 👎),
 * or null when logging is off or failed; `failed` tells the two apart for the log.
 */
export async function recordQuestion(entry: {
  question: string;
  answer: string;
  source: InsightSource;
  /** The bot marked the answer [[NO_INFO]]. */
  noInfo?: boolean;
  /** The page the chat was opened on, e.g. "/submit-film". */
  page?: string;
}): Promise<{ id: string | null; failed: boolean }> {
  const api = backend();
  if (!api) return { id: null, failed: false };

  const answered =
    entry.source === "smalltalk" || entry.source === "template"
      ? true
      : !entry.noInfo && !isUnanswered(entry.answer);
  try {
    const res = await fetch(`${api.base}/chatbot-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Chatbot-Key": api.key },
      body: JSON.stringify({
        question: entry.question.slice(0, 1000),
        answer: entry.answer.slice(0, 6000),
        answered,
        source: entry.source,
        page: entry.page ?? "",
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (res.status !== 201) return { id: null, failed: true };
    const data = (await res.json().catch(() => null)) as { id?: string } | null;
    return { id: typeof data?.id === "string" ? data.id : null, failed: false };
  } catch {
    return { id: null, failed: true };
  }
}

/** Passes on a 👍 / 👎. The caller must have checked the question id's signature. */
export async function sendFeedback(id: string, helpful: boolean): Promise<boolean> {
  const api = backend();
  if (!api) return false;
  try {
    const res = await fetch(`${api.base}/chatbot-questions/${id}/feedback`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-Chatbot-Key": api.key },
      body: JSON.stringify({ helpful }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ---- fixed answers (staff-written, managed in the CMS) ---- */

/**
 * Must stay identical to `normalize()` in cms-hub's
 * backend/models/chatQuestion.model.ts: a fixed answer matches when the
 * visitor's question normalizes to one of its `matches`.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]s\b/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type Template = { id: string; matches: string[]; answer: string };
let templates: { list: Template[]; expires: number } | null = null;
let loadingTemplates: Promise<void> | null = null;

async function refreshTemplates(): Promise<void> {
  const api = backend();
  if (!api) {
    templates = { list: [], expires: Date.now() + TEMPLATES_TTL_MS };
    return;
  }
  try {
    const res = await fetch(`${api.base}/chatbot-templates/active`, {
      headers: { "X-Chatbot-Key": api.key },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const data = (await res.json()) as { data?: Template[] };
    if (!res.ok || !Array.isArray(data.data)) throw new Error(`status ${res.status}`);
    templates = { list: data.data, expires: Date.now() + TEMPLATES_TTL_MS };
  } catch (error) {
    console.warn("Chatbot: couldn't load fixed answers; retrying in a minute.", error);
    // Keep using the last good list, if there is one.
    templates = { list: templates?.list ?? [], expires: Date.now() + TEMPLATES_RETRY_MS };
  }
}

/** The fixed answer for this question, or null. Many questions at once share one reload. */
export async function findTemplate(question: string): Promise<string | null> {
  if (!templates || Date.now() >= templates.expires) {
    loadingTemplates ??= refreshTemplates().finally(() => {
      loadingTemplates = null;
    });
    await loadingTemplates;
  }
  const key = normalize(question);
  if (!key) return null;
  return templates?.list.find((t) => t.matches.includes(key))?.answer ?? null;
}
