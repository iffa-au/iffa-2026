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
