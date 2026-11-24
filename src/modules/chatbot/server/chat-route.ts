import {
	cacheGet,
	cacheKey,
	cachePut,
	smallTalkReply,
} from "@/modules/chatbot/lib/fastpath";
import {
	canaryFilter,
	NO_INFO,
	noInfoFilter,
	signAnswer,
	signQuestionId,
	stripNoInfo,
	trustedHistory,
	type ChatMessage,
} from "@/modules/chatbot/lib/guard";
import {
	buildSystemPrompt,
	knowledgeStatus,
} from "@/modules/chatbot/lib/knowledge";
import {
	hasProvider,
	providerNames,
	streamAnswer,
} from "@/modules/chatbot/lib/providers";
import {
	findTemplate,
	recordQuestion,
	type InsightSource,
} from "@/modules/chatbot/lib/insights";
import { checkLimit } from "@/modules/chatbot/lib/rate-limit";

/**
 * POST /api/chat — the site chatbot.
 *
 * Body: { messages: { role: "user" | "assistant", content: string, sig?: string }[], page?: "/path" }
 *
 * Reply: the answer as a plain-text stream, then one TRAILER character
 * (\u001e, "record separator") followed by JSON:
 *   { sig }          signature for the answer; the widget sends it back with the history
 *     + qid, qsig    the logged question's id and its signature, for thumbs up / down (feedback-route.ts)
 *     + noInfo       true when the bot didn't have the information (the widget offers "Ask the team")
 *   { blocked: true} the answer was cut by the leak check; the widget shows a polite refusal
 * When nothing could be answered: JSON { error } with a status code. The error
 * text is written for visitors and shown as-is in the widget.
 *
 * Order of work, cheapest first:
 *   small talk -> fixed answer (staff-written, CMS) -> cached answer -> rate limit -> AI (Gemini, then Groq)
 */

const MAX_MESSAGES = 10;
const MAX_CHARS = 1000; // visitor messages (the input box allows 1000)
const MAX_ANSWER_CHARS = 6000; // bot answers come back whole, or their signature wouldn't match
const MAX_BODY_CHARS = 100_000; // 10 messages of up to 6000 chars fit easily; anything bigger is not the widget
const TRAILER = "\u001e";

/**
 * How much of the conversation the AI sees. The whole history is still
 * checked (signatures) and used by the search; only the copy sent to the AI
 * is trimmed, because every message sent costs tokens on every question.
 */
const MODEL_HISTORY_MESSAGES = 6; // the last 3 questions and answers
const MODEL_HISTORY_ANSWER_CHARS = 800; // older answers are cut to this; the AI only needs the gist

function forModel(messages: ChatMessage[]): ChatMessage[] {
	const recent = messages.slice(-MODEL_HISTORY_MESSAGES);
	while (recent.length > 1 && recent[0].role !== "user") recent.shift(); // providers want a visitor message first
	return recent.map((m) =>
		m.role === "assistant" && m.content.length > MODEL_HISTORY_ANSWER_CHARS
			? { ...m, content: `${m.content.slice(0, MODEL_HISTORY_ANSWER_CHARS)}…` }
			: m,
	);
}

const fail = (status: number, error: string) =>
	Response.json({ error }, { status });

function parseMessages(body: unknown): ChatMessage[] | null {
	const raw = (body as { messages?: unknown })?.messages;
	if (!Array.isArray(raw) || raw.length === 0) return null;

	const messages = raw.slice(-MAX_MESSAGES).map((m) => {
		const role = m?.role === "assistant" ? "assistant" : "user";
		const max = role === "assistant" ? MAX_ANSWER_CHARS : MAX_CHARS;
		return {
			role,
			content:
				typeof m?.content === "string" ? m.content.trim().slice(0, max) : "",
			sig: typeof m?.sig === "string" ? m.sig.slice(0, 100) : undefined,
		};
	}) as ChatMessage[];

	// Providers expect the conversation to start and end with the visitor.
	while (messages.length && messages[0].role !== "user") messages.shift();
	if (!messages.length || messages.at(-1)!.role !== "user") return null;
	if (messages.some((m) => !m.content)) return null;
	return messages;
}

/**
 * One line per question in the server log. No message text and no IP
 * addresses: only what is needed to see how the bot is doing.
 */
function log(entry: Record<string, unknown>) {
	console.log(
		JSON.stringify({ chatbot: true, at: new Date().toISOString(), ...entry }),
	);
}

/** The page the chat was opened on ("/submit-film"); anything that isn't a plain site path becomes "". */
function pagePath(body: unknown): string {
	const page = (body as { page?: unknown })?.page;
	return typeof page === "string" && page.length <= 200 && /^\/[\w\-./]*$/.test(page)
		? page
		: "";
}

/**
 * Logs the question for the CMS report (lib/insights.ts) and returns what the
 * trailer needs: the question id + its signature for thumbs up / down, and noInfo.
 */
async function logForReport(
	question: string,
	answer: string,
	source: InsightSource,
	page: string,
	noInfo = false,
) {
	const { id, failed } = await recordQuestion({ question, answer, source, page, noInfo });
	return {
		meta: {
			...(id ? { qid: id, qsig: signQuestionId(id) } : {}),
			...(noInfo ? { noInfo: true } : {}),
		},
		insights: failed ? "failed" : undefined,
	};
}

/** A complete answer in the same format as a streamed one. */
function fixedAnswer(answer: string, meta: Record<string, unknown> = {}) {
	return new Response(
		`${answer}${TRAILER}${JSON.stringify({ sig: signAnswer(answer), ...meta })}`,
		{
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Cache-Control": "no-store",
			},
		},
	);
}

/**
 * GET /api/chat: health check for whoever looks after the bot. Shows whether
 * an AI key is set and whether the live festival programme is loading. No keys,
 * no visitor data. Status 503 when the bot can't answer at all.
 *   curl https://<site>/api/chat
 */
export async function GET() {
	const providers = providerNames();
	const status = {
		ok: providers.length > 0,
		providers,
		...(await knowledgeStatus()),
	};
	return Response.json(status, {
		status: status.ok ? 200 : 503,
		headers: { "Cache-Control": "no-store" },
	});
}

export async function POST(request: Request) {
	const started = Date.now();
	const raw = await request.text().catch(() => "");
	if (raw.length > MAX_BODY_CHARS)
		return fail(413, "That message is too long. Please ask a shorter question.");
	let json: unknown = null;
	try {
		json = JSON.parse(raw);
	} catch {}
	const parsed = parseMessages(json);
	if (!parsed) return fail(400, "Please type a question.");

	const { messages, forged } = trustedHistory(parsed);
	const question = messages.at(-1)!.content;
	const page = pagePath(json);
	const base: Record<string, unknown> = {
		turns: messages.length,
		forged: forged || undefined,
	};

	// 1. Small talk: instant, no AI.
	const small = smallTalkReply(question);
	if (small) {
		const { meta, insights } = await logForReport(question, small, "smalltalk", page);
		log({ ...base, source: "smalltalk", ms: Date.now() - started, insights });
		return fixedAnswer(small, meta);
	}

	// 2. Fixed answer written by staff in the CMS: instant, no AI, approved
	//    wording. Used for every question in a chat, not just the first, so
	//    asking it again later still gets the approved answer. Staff are told
	//    (in the CMS editor) to write questions that make sense on their own.
	const fixed = await findTemplate(question);
	if (fixed) {
		const { meta, insights } = await logForReport(question, fixed, "template", page);
		log({ ...base, source: "template", ms: Date.now() - started, insights });
		return fixedAnswer(fixed, meta);
	}

	if (!hasProvider()) {
		return fail(
			503,
			"The assistant isn't available right now. Please use the contact page.",
		);
	}

	let system: string;
	let retrieved: string[];
	let programme: string;
	try {
		({
			prompt: system,
			retrieved,
			programme,
		} = await buildSystemPrompt(messages));
	} catch (error) {
		console.error("Chatbot prompt failed:", error);
		return fail(
			503,
			"The assistant isn't available right now. Please use the contact page.",
		);
	}

	// What retrieval picked, and the size of what the AI is sent (about 4 characters per token), for the log.
	const history = forModel(messages);
	base.retrieved = retrieved;
	if (programme !== "live") base.programme = programme; // only logged when cms-hub is down
	base.promptTokens = Math.round(
		(system.length + history.reduce((n, m) => n + m.content.length, 0)) / 4,
	);

	// 3. Cache: only for the first question of a chat, so earlier messages can't change the answer.
	//    Cached answers keep their [[NO_INFO]] marker, so they still count as unanswered.
	const key = messages.length === 1 ? cacheKey(question, system) : null;
	const cached = key ? cacheGet(key) : null;
	if (cached) {
		const { text, noInfo } = stripNoInfo(cached);
		const { meta, insights } = await logForReport(question, text, "cache", page, noInfo);
		log({ ...base, source: "cache", ms: Date.now() - started, insights });
		return fixedAnswer(text, meta);
	}

	// 4. Rate limit: only real AI calls count.
	const visitor =
		request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
	const limit = checkLimit(visitor);
	if (!limit.ok) {
		log({ ...base, source: "limited", reason: limit.reason });
		return fail(
			429,
			limit.reason === "visitor"
				? "You've asked a lot of questions in a short time. Please wait a few minutes and try again."
				: "The assistant has reached its limit for today. Please use the contact page and the team will help.",
		);
	}

	// 5. The AI.
	let provider = "";
	let fallbackAfter: string[] = [];
	const stream = streamAnswer(
		system,
		history,
		request.signal,
		(name, failed) => {
			provider = name;
			fallbackAfter = [...failed];
		},
	);

	// Wait for the first piece of the answer, so a provider failure becomes a
	// proper error response instead of an empty 200.
	let first: IteratorResult<string>;
	try {
		first = await stream.next();
	} catch (error) {
		console.error("Chatbot failed:", error);
		log({ ...base, source: "error", ms: Date.now() - started });
		return fail(
			503,
			"The assistant is busy right now. Please try again shortly, or use the contact page.",
		);
	}
	const firstMs = Date.now() - started;

	const encoder = new TextEncoder();
	const filter = canaryFilter();
	const marker = noInfoFilter(); // removes [[NO_INFO]] before anything reaches the visitor
	const body = new ReadableStream<Uint8Array>({
		async start(controller) {
			let answer = "";
			const send = (text: string) => {
				if (!text) return;
				answer += text;
				controller.enqueue(encoder.encode(text));
			};
			let complete = false;
			try {
				if (!first.done) send(filter.push(marker.push(first.value)));
				for await (const chunk of stream) {
					send(filter.push(marker.push(chunk)));
					if (filter.state.blocked) break;
				}
				send(filter.push(marker.flush()));
				send(filter.flush());
				complete = true;
			} catch (error) {
				if (!request.signal.aborted) console.error("Chatbot stream broke:", error);
			}

			const blocked = filter.state.blocked;
			const noInfo = marker.state.noInfo;
			let insights: string | undefined;
			if (blocked) {
				controller.enqueue(
					encoder.encode(`${TRAILER}${JSON.stringify({ blocked: true })}`),
				);
			} else if (complete && answer.trim()) {
				if (key) cachePut(key, `${noInfo ? `${NO_INFO} ` : ""}${answer.trim()}`);
				// The visitor already has the whole answer text; log it for the CMS
				// report before the trailer (it carries the logged question's id) and
				// before closing (work after close may not run on serverless hosts).
				// Blocked or cut-off answers aren't logged.
				const logged = await logForReport(question, answer.trim(), "ai", page, noInfo);
				insights = logged.insights;
				controller.enqueue(
					encoder.encode(
						`${TRAILER}${JSON.stringify({ sig: signAnswer(answer), ...logged.meta })}`,
					),
				);
			}
			log({
				...base,
				source: "ai",
				provider,
				fallbackAfter: fallbackAfter.length ? fallbackAfter : undefined,
				firstMs,
				ms: Date.now() - started,
				blocked: blocked || undefined,
				incomplete: complete ? undefined : true,
				noInfo: noInfo || undefined,
				insights,
			});
			controller.close();
		},
	});

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}
