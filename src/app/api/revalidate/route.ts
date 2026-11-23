import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";

// Called by the CMS (cms-hub) after a submission, nomination, winner or
// carousel change, so the ISR event pages refresh on their next visit
// instead of after the 10-minute window.
//
// POST /api/revalidate
//   header  x-revalidate-secret: <REVALIDATE_SECRET>
//   body    { "year": "2025" }   optional; omit to refresh every year

const EVENT_PAGES = ["winners", "nominations", "submissions"];

function secretMatches(given: string | null): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  // Fail closed: an unset secret must not let an empty header through.
  if (!expected || !given) return false;
  // Hash both so timingSafeEqual gets equal lengths.
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(given), digest(expected));
}

export async function POST(request: Request) {
  if (!secretMatches(request.headers.get("x-revalidate-secret"))) {
    return Response.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
  }

  const body: { year?: unknown } = await request.json().catch(() => ({}));
  const year = body.year == null ? null : String(body.year);
  if (year !== null && !/^\d{4}$/.test(year)) {
    return Response.json({ revalidated: false, message: "Invalid year" }, { status: 400 });
  }

  for (const page of EVENT_PAGES) {
    if (year) revalidatePath(`/events/${year}/${page}`);
    // The pages sit in the (root) route group; the pattern names it, as the docs do.
    else revalidatePath(`/(root)/events/[year]/${page}`, "page");
  }

  return Response.json({ revalidated: true, year: year ?? "all", now: Date.now() });
}
