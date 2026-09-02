import { isValidMediaUrl } from "@/modules/events/submissions/lib/submissions";

import type {
  Festival,
  FestivalMonth,
  FestivalPageSettings,
  LinkedCta,
  Screening,
  SeatStatus,
} from "./types";

/**
 * The Festivals page's data source: cms-hub.
 *
 * Everything here maps the API's shape onto the types the UI already speaks, so
 * no component under `ui/` had to change when the page stopped being static.
 * The month grouping lives on this side rather than in the API because a month
 * is a display concept — an admin creates a festival, never a month.
 *
 * Nothing in this file throws. A failed fetch returns empty data and the page
 * renders its empty state: the Amplify build calls these functions, and a cold
 * App Runner instance must not be able to fail a deploy. Serving a stale
 * hardcoded schedule instead was considered and rejected — a festival page
 * that quietly lies about dates is worse than one that says nothing yet.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** Seconds before a cached response is considered stale. */
export const FESTIVAL_REVALIDATE_SECONDS = 300;

const apiBase = () =>
  API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

type ApiScreening = {
  _id?: string;
  title?: string;
  posterUrl?: string;
  country?: string;
  year?: number;
  genre?: string;
  runtimeMinutes?: number;
  synopsis?: string;
  trailerUrl?: string;
  date?: string;
  time?: string;
  venue?: string;
  seatStatus?: string;
};

type ApiFestival = {
  _id?: string;
  slug?: string;
  edition?: string;
  name?: string;
  tagline?: string;
  description?: string;
  heroImageUrl?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  screenings?: ApiScreening[];
};

type ApiCta = { label?: string; href?: string };

type ApiSettings = {
  seriesLabel?: string;
  city?: string;
  country?: string;
  planTitle?: string;
  planBody?: string;
  scheduleEyebrow?: string;
  scheduleHeading?: string;
  scheduleIntro?: string;
  venues?: { name?: string; suburb?: string }[];
  comingSoonMonths?: { year?: number; month?: number; note?: string }[];
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    backgroundImageUrl?: string;
    primaryCta?: ApiCta;
    secondaryCta?: ApiCta;
  };
  about?: {
    eyebrow?: string;
    heading?: string;
    body?: string[];
    stats?: { value?: string; label?: string }[];
  };
  award?: {
    eyebrow?: string;
    heading?: string;
    body?: string;
    imageUrl?: string;
    points?: string[];
  };
  cta?: {
    eyebrow?: string;
    heading?: string;
    body?: string;
    primaryCta?: ApiCta;
    secondaryCta?: ApiCta;
  };
};

/**
 * Mirrors the schema defaults in cms-hub's `festivalSettings.model.ts`.
 *
 * Duplicated on purpose: this is what renders when the API is unreachable, so
 * it cannot be fetched from the thing that is down. Keep the two in step — the
 * page should look identical whether the CMS answers or not.
 */
const DEFAULT_SETTINGS: FestivalPageSettings = {
  seriesLabel: "Festival Series 2026",
  city: "Melbourne",
  country: "Australia",
  planTitle: "Plan your festival nights",
  planBody:
    "Booking opens closer to each festival weekend — until then, every screening time and venue below is confirmed programming.",
  scheduleEyebrow: "What's on",
  scheduleHeading: "Upcoming festivals",
  scheduleIntro:
    "Discover upcoming festivals and explore the films screening throughout each festival.",
  venues: [],
  hero: {
    eyebrow: "International Film Festival of Australia",
    title: "Where the world's cinema meets Australia",
    subtitle:
      "Two festivals a month, curated from across the world and screened in Melbourne. Discover the films, the nights and the filmmakers coming next.",
    backgroundImageUrl: "/assets/iffa big banner.jpg",
    primaryCta: { label: "Explore Festivals", href: "#schedule" },
    secondaryCta: { label: "Submit Your Film", href: "/submit-film" },
  },
  about: {
    eyebrow: "The Festival",
    heading: "A festival built around the films, not the fanfare",
    body: [
      "IFFA programmes two festivals every month — compact, themed weekends that put a handful of films in front of an audience properly, rather than burying them in a fortnight-long schedule nobody can follow.",
      "Every screening is curated. Every filmmaker is in the room. What began as a showcase for cinema from Oman, India, Malaysia and Spain now brings work from across the world to Melbourne's screens.",
    ],
    stats: [
      { value: "2", label: "Festivals every month" },
      { value: "20+", label: "Films screened a season" },
      { value: "5", label: "Venues across Melbourne" },
    ],
  },
  award: {
    eyebrow: "The IFFA Award",
    heading: "Recognition that travels further than the screening",
    body: "The IFFA Award is presented across every competitive category of the festival year. Judged by a rotating international jury of filmmakers, programmers and critics, it is awarded on the work alone — not on budget, country or reputation.",
    imageUrl: "/assets/logos/iffa-award.png",
    points: [
      "Judged by an international jury, rotated every season",
      "Open to every film in competition, at no additional cost",
      "Winners announced at the closing night of each festival",
    ],
  },
  cta: {
    eyebrow: "Join us",
    heading: "Be in the room when the lights go down",
    body: "Tickets open closer to each festival weekend. Register now and we will let you know the moment the schedule you are watching goes on sale.",
    primaryCta: { label: "Register Interest", href: "/submit-film-enquiry" },
    secondaryCta: { label: "Contact the Team", href: "/contact" },
  },
};

const SEAT_STATUSES: SeatStatus[] = ["available", "limited", "sold-out"];

const toSeatStatus = (value?: string): SeatStatus =>
  SEAT_STATUSES.includes(value as SeatStatus) ? (value as SeatStatus) : "available";

/** Lowercase, dash-joined, safe as a DOM id and a URL fragment. */
const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Screening ids double as the `#anchor` a rail card deep-links to, so they are
 * derived from the title rather than taken from Mongo: saving a festival
 * rewrites the embedded array and issues fresh subdocument _ids, which would
 * silently break every shared link. A numeric suffix disambiguates a film that
 * screens twice in one festival.
 */
const screeningId = (title: string, index: number, seen: Set<string>): string => {
  const base = slugify(title) || `screening-${index + 1}`;
  if (!seen.has(base)) {
    seen.add(base);
    return base;
  }
  let suffix = 2;
  while (seen.has(`${base}-${suffix}`)) suffix += 1;
  const unique = `${base}-${suffix}`;
  seen.add(unique);
  return unique;
};

const mapScreening = (
  raw: ApiScreening,
  index: number,
  seen: Set<string>,
): Screening | null => {
  const title = String(raw.title ?? "").trim();
  const date = String(raw.date ?? "").trim();
  // A screening with no title or no date cannot be placed on the schedule at
  // all, so it is dropped rather than rendered as an undated blank.
  if (!title || !ISO_DATE.test(date)) return null;

  const poster = String(raw.posterUrl ?? "").trim();
  const trailer = String(raw.trailerUrl ?? "").trim();

  return {
    id: screeningId(title, index, seen),
    title,
    // isValidMediaUrl guards against CMS data entry putting a bare domain in an
    // image field, which the browser would resolve against the current route.
    // Null is not a failure here — PosterFrame draws a typographic poster.
    posterUrl: isValidMediaUrl(poster) ? poster : null,
    country: String(raw.country ?? "").trim(),
    year: Number(raw.year) || 0,
    genre: String(raw.genre ?? "").trim(),
    runtimeMinutes: Number(raw.runtimeMinutes) || 0,
    synopsis: String(raw.synopsis ?? "").trim(),
    trailerUrl: trailer || undefined,
    date,
    time: String(raw.time ?? "").trim(),
    venue: String(raw.venue ?? "").trim(),
    seatStatus: toSeatStatus(raw.seatStatus),
  };
};

const mapFestival = (raw: ApiFestival): Festival | null => {
  const slug = String(raw.slug ?? "").trim();
  const name = String(raw.name ?? "").trim();
  const startDate = String(raw.startDate ?? "").trim();
  const endDate = String(raw.endDate ?? "").trim();

  // Without a slug there is no detail route to link to, and without dates the
  // festival cannot be placed in a month.
  if (!slug || !name || !ISO_DATE.test(startDate) || !ISO_DATE.test(endDate)) {
    return null;
  }

  const seen = new Set<string>();
  const hero = String(raw.heroImageUrl ?? "").trim();

  return {
    slug,
    edition: String(raw.edition ?? "01").trim() || "01",
    name,
    tagline: String(raw.tagline ?? "").trim(),
    description: String(raw.description ?? "").trim(),
    heroImage: isValidMediaUrl(hero) ? hero : "",
    city: String(raw.city ?? "").trim(),
    startDate,
    endDate,
    screenings: (raw.screenings ?? [])
      .map((screening, index) => mapScreening(screening, index, seen))
      .filter((screening): screening is Screening => screening !== null),
  };
};

const text = (value: unknown, fallback: string): string => {
  const trimmed = String(value ?? "").trim();
  return trimmed || fallback;
};

/**
 * Local asset paths may contain spaces (the banner ships as
 * "iffa big banner.jpg"). A raw space in an image src is not a valid URL;
 * replacing only spaces is idempotent, so an already-encoded CloudFront URL
 * passes through untouched.
 */
const encodeSpaces = (url: string): string => url.replace(/ /g, "%20");

const mapImage = (value: unknown, fallback: string): string => {
  const url = String(value ?? "").trim();
  return encodeSpaces(isValidMediaUrl(url) ? url : fallback);
};

const mapCta = (raw: ApiCta | undefined, fallback: LinkedCta): LinkedCta => ({
  label: text(raw?.label, fallback.label),
  href: text(raw?.href, fallback.href),
});

/** Blank entries are dropped — an empty paragraph is not content. */
const mapLines = (raw: unknown, fallback: string[]): string[] => {
  if (!Array.isArray(raw)) return fallback;
  const lines = raw.map((line) => String(line ?? "").trim()).filter(Boolean);
  return lines.length > 0 ? lines : fallback;
};

const mapSettings = (raw?: ApiSettings): FestivalPageSettings => {
  const d = DEFAULT_SETTINGS;
  return {
    seriesLabel: text(raw?.seriesLabel, d.seriesLabel),
    city: text(raw?.city, d.city),
    country: text(raw?.country, d.country),
    planTitle: text(raw?.planTitle, d.planTitle),
    planBody: text(raw?.planBody, d.planBody),
    scheduleEyebrow: text(raw?.scheduleEyebrow, d.scheduleEyebrow),
    scheduleHeading: text(raw?.scheduleHeading, d.scheduleHeading),
    scheduleIntro: text(raw?.scheduleIntro, d.scheduleIntro),
    venues: (raw?.venues ?? [])
      .map((venue) => ({
        name: String(venue.name ?? "").trim(),
        suburb: String(venue.suburb ?? "").trim(),
      }))
      .filter((venue) => venue.name),
    hero: {
      eyebrow: text(raw?.hero?.eyebrow, d.hero.eyebrow),
      title: text(raw?.hero?.title, d.hero.title),
      subtitle: text(raw?.hero?.subtitle, d.hero.subtitle),
      backgroundImageUrl: mapImage(
        raw?.hero?.backgroundImageUrl,
        d.hero.backgroundImageUrl,
      ),
      primaryCta: mapCta(raw?.hero?.primaryCta, d.hero.primaryCta),
      secondaryCta: mapCta(raw?.hero?.secondaryCta, d.hero.secondaryCta),
    },
    about: {
      eyebrow: text(raw?.about?.eyebrow, d.about.eyebrow),
      heading: text(raw?.about?.heading, d.about.heading),
      body: mapLines(raw?.about?.body, d.about.body),
      stats: Array.isArray(raw?.about?.stats)
        ? raw.about.stats
            .map((stat) => ({
              value: String(stat.value ?? "").trim(),
              label: String(stat.label ?? "").trim(),
            }))
            .filter((stat) => stat.value || stat.label)
        : d.about.stats,
    },
    award: {
      eyebrow: text(raw?.award?.eyebrow, d.award.eyebrow),
      heading: text(raw?.award?.heading, d.award.heading),
      body: text(raw?.award?.body, d.award.body),
      imageUrl: mapImage(raw?.award?.imageUrl, d.award.imageUrl),
      points: mapLines(raw?.award?.points, d.award.points),
    },
    cta: {
      eyebrow: text(raw?.cta?.eyebrow, d.cta.eyebrow),
      heading: text(raw?.cta?.heading, d.cta.heading),
      body: text(raw?.cta?.body, d.cta.body),
      primaryCta: mapCta(raw?.cta?.primaryCta, d.cta.primaryCta),
      secondaryCta: mapCta(raw?.cta?.secondaryCta, d.cta.secondaryCta),
    },
  };
};

/**
 * Groups festivals into the month sections the page renders, then appends the
 * months staff have announced as coming without a programme.
 *
 * A coming-soon month that already holds a published festival is dropped: the
 * real programme wins over the promise of one.
 */
const buildMonths = (
  festivals: Festival[],
  settings: ApiSettings | undefined,
): FestivalMonth[] => {
  const byMonth = new Map<string, Festival[]>();

  for (const festival of festivals) {
    const key = festival.startDate.slice(0, 7);
    const existing = byMonth.get(key);
    if (existing) existing.push(festival);
    else byMonth.set(key, [festival]);
  }

  const months: FestivalMonth[] = [...byMonth.entries()].map(([key, items]) => {
    const [year, month] = key.split("-").map(Number);
    return {
      id: key,
      month,
      year,
      status: "announced" as const,
      festivals: items.sort((a, b) => a.startDate.localeCompare(b.startDate)),
    };
  });

  const announced = new Set(months.map((month) => month.id));

  for (const entry of settings?.comingSoonMonths ?? []) {
    const year = Number(entry.year);
    const month = Number(entry.month);
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      continue;
    }
    const id = `${year}-${String(month).padStart(2, "0")}`;
    if (announced.has(id)) continue;
    announced.add(id);
    months.push({
      id,
      month,
      year,
      status: "coming-soon",
      festivals: [],
      note: String(entry.note ?? "").trim() || undefined,
    });
  }

  return months.sort((a, b) => a.id.localeCompare(b.id));
};

const getJson = async <T>(path: string): Promise<T | null> => {
  if (!apiBase()) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not set — the Festivals page has no data source.");
    return null;
  }
  try {
    const response = await fetch(`${apiBase()}${path}`, {
      next: { revalidate: FESTIVAL_REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      console.error(`Festivals API ${path} responded ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    // Swallowed on purpose — see the note at the top of this file.
    console.error(`Festivals API ${path} failed:`, error);
    return null;
  }
};

export type FestivalsPageData = {
  months: FestivalMonth[];
  settings: FestivalPageSettings;
};

export const fetchFestivalsPageData = async (): Promise<FestivalsPageData> => {
  const payload = await getJson<{
    success?: boolean;
    data?: { festivals?: ApiFestival[]; settings?: ApiSettings };
  }>("/festivals");

  const festivals = (payload?.data?.festivals ?? [])
    .map(mapFestival)
    .filter((festival): festival is Festival => festival !== null);

  return {
    months: buildMonths(festivals, payload?.data?.settings),
    settings: mapSettings(payload?.data?.settings),
  };
};

/*
 * There is deliberately no fetch-one-festival helper. The detail page needs the
 * whole schedule anyway — for its month eyebrow and its previous/next links —
 * and taking both from one response is what stops the two from disagreeing.
 * `GET /festivals/slug/:slug` exists on the API for other consumers.
 */
