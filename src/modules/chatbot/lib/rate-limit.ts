import "server-only";

/**
 * In-memory limits that keep one visitor (or a bot) from using up the free
 * LLM quota for everyone.
 *
 * Memory is per server instance, so on a multi-instance host the real limit is
 * a few times higher. That is fine for protecting a free tier. If the bot gets
 * heavy traffic, move these counters to a shared store (Redis, DynamoDB).
 */

const PER_VISITOR = Number(process.env.CHATBOT_LIMIT_PER_VISITOR) || 20;
const WINDOW_MS = 10 * 60 * 1000;
const PER_DAY = Number(process.env.CHATBOT_DAILY_LIMIT) || 1000;

const visitors = new Map<string, number[]>();
let day = { key: "", count: 0 };

export type LimitResult = { ok: true } | { ok: false; reason: "visitor" | "daily" };

export function checkLimit(visitorKey: string): LimitResult {
  const now = Date.now();

  const today = new Date(now).toISOString().slice(0, 10);
  if (day.key !== today) day = { key: today, count: 0 };
  if (day.count >= PER_DAY) return { ok: false, reason: "daily" };

  const recent = (visitors.get(visitorKey) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_VISITOR) {
    visitors.set(visitorKey, recent);
    return { ok: false, reason: "visitor" };
  }

  recent.push(now);
  visitors.set(visitorKey, recent);
  day.count += 1;

  // Stop the map growing forever on a long-running instance.
  if (visitors.size > 5000) {
    for (const [key, times] of visitors) {
      if (!times.some((t) => now - t < WINDOW_MS)) visitors.delete(key);
    }
  }
  return { ok: true };
}
