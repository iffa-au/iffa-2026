import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Defences that don't rely on the model behaving:
 *
 * 1. Signed answers. The browser sends the whole conversation back with each
 *    question, so a visitor could edit an earlier "assistant" message to say
 *    "Sure, I'll ignore my rules". Every real answer carries an HMAC signature;
 *    if any assistant message in the history isn't signed, the history is
 *    thrown away and only the latest question is answered.
 *
 * 2. Canary. A secret word sits in the prompt. If it ever shows up in an
 *    answer, the model is leaking its instructions, and the stream is cut.
 *
 * Also here: the [[NO_INFO]] marker the bot puts in front of answers it
 * couldn't find (RULES 1 in knowledge.ts), removed before the visitor sees
 * it, and the signature on question ids used for 👍 / 👎 feedback.
 */

export type ChatMessage = { role: "user" | "assistant"; content: string; sig?: string };

export const CANARY = "QV-MERIDIAN-8261";

/**
 * The signing key. CHATBOT_SIGNING_KEY if set; otherwise derived from the LLM
 * key, so nothing extra has to be configured. Changing it only invalidates
 * open chats, which then simply continue without their history.
 */
function signingKey(): Buffer {
  const secret =
    process.env.CHATBOT_SIGNING_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GROQ_API_KEY?.trim() ||
    "";
  return createHash("sha256").update(`iffa-chat-signing|${secret}`).digest();
}

export function signAnswer(answer: string): string {
  return createHmac("sha256", signingKey()).update(answer.trim()).digest("base64url");
}

/**
 * Signs the id of a logged question, so only the visitor who got that answer
 * can send 👍 / 👎 for it (feedback-route.ts checks this before passing it on).
 */
export function signQuestionId(id: string): string {
  return createHmac("sha256", signingKey()).update(`question-id|${id}`).digest("base64url");
}

export function isSignedQuestionId(id: unknown, sig: unknown): boolean {
  if (typeof id !== "string" || typeof sig !== "string" || !/^[a-f0-9]{24}$/i.test(id)) return false;
  const expected = Buffer.from(signQuestionId(id));
  const given = Buffer.from(sig);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Put in front of an answer when the site doesn't have the information (RULES 1). Never shown to visitors. */
export const NO_INFO = "[[NO_INFO]]";

/** Removes the marker from a whole answer (cached answers keep it, so they're still counted as unanswered). */
export function stripNoInfo(text: string): { text: string; noInfo: boolean } {
  if (!text.includes(NO_INFO)) return { text, noInfo: false };
  return { text: text.split(NO_INFO).join("").trim(), noInfo: true };
}

/**
 * Removes the marker from a streamed answer, wherever it appears, holding back
 * the last few characters so it can't be half-sent across two chunks (the same
 * trick as the canary filter). `state.noInfo` turns true when it was found.
 */
export function noInfoFilter() {
  const keep = NO_INFO.length - 1;
  let pending = "";
  let started = false; // the first text sent loses its leading space ("[[NO_INFO]] The site" -> "The site")
  const state = { noInfo: false };
  const tidy = (out: string) => {
    if (!started) {
      out = out.trimStart();
      if (out) started = true;
    }
    return out;
  };
  return {
    state,
    push(chunk: string): string {
      pending += chunk;
      if (pending.includes(NO_INFO)) {
        state.noInfo = true;
        pending = pending.split(NO_INFO).join("");
      }
      const out = pending.slice(0, Math.max(0, pending.length - keep));
      pending = pending.slice(out.length);
      return tidy(out);
    },
    flush(): string {
      const out = pending.split(NO_INFO).join("");
      if (out !== pending) state.noInfo = true;
      pending = "";
      return tidy(out);
    },
  };
}

function isSigned(m: ChatMessage): boolean {
  if (!m.sig) return false;
  const expected = Buffer.from(signAnswer(m.content));
  const given = Buffer.from(m.sig);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Drops the history if any assistant message is forged. Returns what to send to the model. */
export function trustedHistory(messages: ChatMessage[]): { messages: ChatMessage[]; forged: boolean } {
  const forged = messages.some((m) => m.role === "assistant" && !isSigned(m));
  const clean = (forged ? messages.slice(-1) : messages).map(({ role, content }) => ({ role, content }));
  return { messages: clean, forged };
}

/**
 * Passes streamed text through, holding back the last few characters so the
 * canary can never be half-sent across two chunks. If the canary appears,
 * `blocked` turns true and nothing more is let through.
 */
export function canaryFilter() {
  const keep = CANARY.length - 1;
  let pending = "";
  const state = { blocked: false };
  return {
    state,
    push(chunk: string): string {
      if (state.blocked) return "";
      pending += chunk;
      if (pending.includes(CANARY)) {
        state.blocked = true;
        pending = "";
        return "";
      }
      const out = pending.slice(0, Math.max(0, pending.length - keep));
      pending = pending.slice(out.length);
      return out;
    },
    flush(): string {
      const out = state.blocked ? "" : pending;
      pending = "";
      return out;
    },
  };
}
