import "server-only";

import { createHash } from "node:crypto";

/**
 * Answers that don't need the AI: instant, and they use no free-tier quota.
 *   1. Small talk ("hi", "thanks", "bye")  -> a friendly fixed reply
 *   2. Repeated first questions (e.g. the suggestion buttons) -> an earlier answer
 */

/** Lowercase, letters/digits/spaces only: "Hi!! How are you?" -> "hi how are you" */
export function normalizeQuestion(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const HOW = "(how are you|how are you doing|how's it going|hows it going|how r u)";
const SMALL_TALK: [RegExp, string][] = [
  [
    new RegExp(`^((hi|hello|hey|hiya|g'day|gday|good (morning|afternoon|evening))( there)?( ${HOW})?|${HOW})$`),
    "Hi! I'm doing well, thanks. I can help with the festival programme, submitting a film, the awards or the Talent Lab. What would you like to know?",
  ],
  [
    /^(all good|you there|are you there|ok|okay|k|cool|nice|great|awesome|got it|alright|i see|hmm+)$/,
    "All good! Ask me anything about IFFA, for example when the festival is on or how to submit a film.",
  ],
  [
    /^(thanks|thank you|thank u|thx|ty|cheers|many thanks|thanks a lot|thank you so much)( for( the| your| all the)? (info|information|help|answers?))?$/,
    "You're welcome! Let me know if there's anything else I can help with.",
  ],
  [
    /^(nice|good|great) (to talk|talking|to chat|chatting|to meet you)( to you| with you)?$/,
    "Nice chatting with you too! Feel free to ask anything else about IFFA.",
  ],
  [
    /^(bye|goodbye|bye bye|see you|see ya|cya|good night|take care)$/,
    "Thanks for stopping by! If you need anything else, the team is on the [contact page](/contact).",
  ],
];

/** A reply for pure small talk, or null if the message needs a real answer. */
export function smallTalkReply(question: string): string | null {
  const q = normalizeQuestion(question);
  if (!q || q.length > 40) return null; // long messages are real questions
  return SMALL_TALK.find(([re]) => re.test(q))?.[1] ?? null;
}

/* ---- answer cache ---------------------------------------------------------
 * Only for the FIRST question of a conversation (no history), so the answer
 * can't depend on earlier context. The key includes a fingerprint of the whole
 * prompt, so when the site content or festival programme changes, old answers
 * are no longer used. Kept in memory per server instance.
 */

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_MAX = 300;
const cache = new Map<string, { answer: string; at: number }>();

export function cacheKey(question: string, systemPrompt: string): string {
  return createHash("sha1")
    .update(`${normalizeQuestion(question)}|${createHash("md5").update(systemPrompt).digest("hex")}`)
    .digest("hex");
}

export function cacheGet(key: string): string | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.answer;
}

export function cachePut(key: string, answer: string) {
  cache.delete(key);
  cache.set(key, { answer, at: Date.now() });
  // Maps keep insertion order, so the first key is the oldest.
  while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value!);
}
