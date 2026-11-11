import { events as builtInEvents } from "../data/events-data";
import { mentors as builtInMentors } from "../data/mentors-data";
import { opportunities as builtInOpportunities } from "../data/opportunities-data";
import type { Mentor, Opportunity, TalentLabEvent } from "./types";

/**
 * Talent Lab Events, Opportunities and Mentors, as curated in cms-hub under
 * Talent Lab → Events / Opportunities / Mentors. The API returns these in
 * exactly the shapes of `types.ts`, which is why that file was written "like an
 * API response".
 *
 * Never throws. Any failure — no API base, network error, non-200 — serves the
 * built-in data files, so a Talent Lab page never breaks because the CMS is
 * down. The built-in data is also served until staff have created anything in
 * the CMS (`configured: false`); after that an empty list is respected, which
 * is how staff hide every item.
 *
 * Nothing is cached, for the reason given at the top of
 * `festivals/lib/festival-api.ts`: Amplify runs from a read-only bundle, so ISR
 * would freeze these pages on whatever the CMS held at build time. Routes that
 * call this set `dynamic = "force-dynamic"`.
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

type ApiList<T> = { success?: boolean; configured?: boolean; data?: T[] };

async function fetchList<T>(path: string, fallback: T[]): Promise<T[]> {
  if (!API_BASE) return fallback;
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Talent Lab API ${path} responded ${res.status}`);
      return fallback;
    }
    const body = (await res.json()) as ApiList<T>;
    if (!body.configured || !Array.isArray(body.data)) return fallback;
    return body.data;
  } catch (error) {
    console.error(`Talent Lab API ${path} failed:`, error);
    return fallback;
  }
}

export const fetchEvents = () => fetchList<TalentLabEvent>("/talent-lab/events", builtInEvents);
export const fetchOpportunities = () =>
  fetchList<Opportunity>("/talent-lab/opportunities", builtInOpportunities);
export const fetchMentors = () => fetchList<Mentor>("/talent-lab/mentors", builtInMentors);
