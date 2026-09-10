import { isValidMediaUrl } from "@/modules/events/submissions/lib/submissions";

import type {
  Festival,
  FestivalPageSettings,
  Film,
  LinkedCta,
  Screening,
  SeatStatus,
} from "./types";
import { melbourneToday } from "./festival-utils";

/**
 * The Festival page's data source: cms-hub.
 *
 * IFFA runs one festival a year. The API still returns a list — a festival is
 * a record, and last year's does not stop existing — so the job here is to
 * pick which one the page is about and file the rest as an archive. That
 * choice lives on this side rather than in the API because "the current
 * festival" is a function of today's date, and the API is cached by nobody but
 * answers the same for everyone.
 *
 * Nothing in this file throws. A failed fetch returns no festival and the page
 * renders its empty state: the Amplify build calls these functions, and a cold
 * App Runner instance must not be able to fail a deploy. Serving a stale
 * hardcoded schedule instead was considered and rejected — a festival page
 * that quietly lies about dates is worse than one that says nothing yet.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const apiBase = () =>
  API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

type ApiFilm = {
  _id?: string;
  title?: string;
  posterUrl?: string;
  country?: string;
  year?: number;
  genre?: string;
  startDate?: string;
  startTime?: string;
  runtimeMinutes?: number;
  runtimeSeconds?: number;
  synopsis?: string;
  trailerUrl?: string;
};

type ApiScreening = {
  _id?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  venue?: string;
  seatStatus?: string;
  films?: ApiFilm[];

  /**
   * Pre-restructure fields, still accepted. A screening used to be a film, so
   * a row carried the film's own metadata and a single `date`. See
   * `legacyScreening` below for why these are read rather than ignored.
   */
  date?: string;
  posterUrl?: string;
  country?: string;
  year?: number;
  genre?: string;
  runtimeMinutes?: number;
  runtimeSeconds?: number;
  synopsis?: string;
  trailerUrl?: string;
};

type ApiFestival = {
  _id?: string;
  slug?: string;
  year?: number;
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
  scheduleHeading?: string;
  scheduleIntro?: string;
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    backgroundImageUrl?: string;
    primaryCta?: ApiCta;
    secondaryCta?: ApiCta;
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
  scheduleHeading: "Every film, every night",
  scheduleIntro:
    "The full programme, night by night. Times and venues are confirmed; booking opens closer to opening night.",
  hero: {
    eyebrow: "International Film Festival of Australia",
    title: "Where the world's cinema meets Australia",
    subtitle:
      "One festival a year, curated from across the world and screened in Melbourne. Discover the films, the nights and the filmmakers coming next.",
    backgroundImageUrl: "/assets/iffa big banner.jpg",
    primaryCta: { label: "See the programme", href: "#programme" },
    secondaryCta: { label: "Submit your film", href: "/submit-film" },
  },
  award: {
    eyebrow: "The IFFA Award",
    heading: "Recognition that travels further than the screening",
    body: "The IFFA Award is presented across every competitive category of the festival. Judged by a rotating international jury of filmmakers, programmers and critics, it is awarded on the work alone — not on budget, country or reputation.",
    imageUrl: "/assets/logos/iffa-award.png",
    points: [
      "Judged by an international jury, rotated every year",
      "Open to every film in competition, at no additional cost",
      "Winners announced on closing night",
    ],
  },
  cta: {
    eyebrow: "Join us",
    heading: "Be in the room when the lights go down",
    body: "Tickets open closer to opening night. Register now and we will let you know the moment the programme goes on sale.",
    primaryCta: { label: "Register interest", href: "/submit-film-enquiry" },
    secondaryCta: { label: "Contact the team", href: "/contact" },
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
 * Ids double as the `#anchor` a programme row deep-links to, so they are
 * derived from the title rather than taken from Mongo: saving a festival
 * rewrites the embedded array and issues fresh subdocument _ids, which would
 * silently break every shared link. A numeric suffix disambiguates a repeated
 * title.
 *
 * Screenings and films are minted from separate `seen` sets. They live under
 * different URL prefixes, so a session called "Shorts" and a film called
 * "Shorts" do not collide and neither should have to wear a "-2".
 */
const mintId = (
  title: string,
  index: number,
  seen: Set<string>,
  prefix: string,
): string => {
  const base = slugify(title) || `${prefix}-${index + 1}`;
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

const mapFilm = (raw: ApiFilm, index: number, seen: Set<string>): Film | null => {
  const title = String(raw.title ?? "").trim();
  // A film with no title cannot be listed or linked to, so it is dropped
  // rather than rendered as an untitled row.
  if (!title) return null;

  const poster = String(raw.posterUrl ?? "").trim();
  const trailer = String(raw.trailerUrl ?? "").trim();

  return {
    id: mintId(title, index, seen, "film"),
    title,
    // isValidMediaUrl guards against CMS data entry putting a bare domain in an
    // image field, which the browser would resolve against the current route.
    // Null is not a failure here — PosterFrame draws a typographic poster.
    posterUrl: isValidMediaUrl(poster) ? poster : null,
    country: String(raw.country ?? "").trim(),
    year: Number(raw.year) || 0,
    genre: String(raw.genre ?? "").trim(),
    // Absent for every film until cms-hub grows the fields, and absent after
    // that for any session whose films all play together. `filmScreeningWhen`
    // prints the session's own date and time in their place — see the note on
    // `Film.startDate`.
    //
    // A malformed date is dropped rather than passed on: it would reach
    // `formatShortDate` as a NaN weekday, and the session's date is a correct
    // answer where "Invalid Date" is not.
    startDate: ISO_DATE.test(String(raw.startDate ?? "").trim())
      ? String(raw.startDate).trim()
      : "",
    startTime: String(raw.startTime ?? "").trim(),
    runtimeMinutes: Number(raw.runtimeMinutes) || 0,
    runtimeSeconds: Number(raw.runtimeSeconds) || 0,
    synopsis: String(raw.synopsis ?? "").trim(),
    trailerUrl: trailer || undefined,
  };
};

/**
 * Reads a pre-restructure screening — one that IS a film — as a session of one.
 *
 * The alternative was to drop rows without a `films` array, which would empty
 * the programme for as long as the frontend was deployed ahead of the backend
 * migration. Since the two repos deploy separately and the backfill is a
 * manual step, that window is real. A one-film session is exactly what the old
 * row meant, so nothing is invented here.
 */
const legacyScreening = (raw: ApiScreening): ApiScreening | null => {
  const date = String(raw.date ?? "").trim();
  if (!ISO_DATE.test(date)) return null;

  return {
    title: raw.title,
    description: "",
    startDate: date,
    endDate: date,
    time: raw.time,
    venue: raw.venue,
    seatStatus: raw.seatStatus,
    films: [
      {
        title: raw.title,
        posterUrl: raw.posterUrl,
        country: raw.country,
        year: raw.year,
        genre: raw.genre,
        runtimeMinutes: raw.runtimeMinutes,
        runtimeSeconds: raw.runtimeSeconds,
        synopsis: raw.synopsis,
        trailerUrl: raw.trailerUrl,
      },
    ],
  };
};

const mapScreening = (
  input: ApiScreening,
  index: number,
  seenScreenings: Set<string>,
  seenFilms: Set<string>,
): Screening | null => {
  // `films` present is what marks a row as the new shape. An empty array is
  // still the new shape — a session announced before its lineup is confirmed.
  const raw = Array.isArray(input.films) ? input : legacyScreening(input);
  if (!raw) return null;

  const title = String(raw.title ?? "").trim();
  const startDate = String(raw.startDate ?? "").trim();
  // A screening with no title or no opening date cannot be placed on the
  // programme at all, so it is dropped rather than rendered as an undated blank.
  if (!title || !ISO_DATE.test(startDate)) return null;

  // A missing or malformed end date means a single sitting, which is the
  // common case — not an error worth dropping the session over. An end that
  // precedes the start is treated the same way: the start is the date staff
  // are most likely to have got right.
  const rawEnd = String(raw.endDate ?? "").trim();
  const endDate = ISO_DATE.test(rawEnd) && rawEnd >= startDate ? rawEnd : startDate;

  return {
    id: mintId(title, index, seenScreenings, "screening"),
    title,
    description: String(raw.description ?? "").trim(),
    startDate,
    endDate,
    time: String(raw.time ?? "").trim(),
    venue: String(raw.venue ?? "").trim(),
    seatStatus: toSeatStatus(raw.seatStatus),
    films: (raw.films ?? [])
      .map((film, filmIndex) => mapFilm(film, filmIndex, seenFilms))
      .filter((film): film is Film => film !== null),
  };
};

const mapFestival = (raw: ApiFestival): Festival | null => {
  const slug = String(raw.slug ?? "").trim();
  const name = String(raw.name ?? "").trim();
  const startDate = String(raw.startDate ?? "").trim();
  const endDate = String(raw.endDate ?? "").trim();

  // Without a slug there is no archive route to link to, and without dates the
  // festival cannot be placed on a timeline.
  if (!slug || !name || !ISO_DATE.test(startDate) || !ISO_DATE.test(endDate)) {
    return null;
  }

  const seenScreenings = new Set<string>();
  const seenFilms = new Set<string>();
  const hero = String(raw.heroImageUrl ?? "").trim();

  return {
    slug,
    // Derived, never read from the API: a festival's year and its start date
    // cannot be allowed to disagree, and the dates are the thing staff edit.
    // The stored `year` on the backend exists only to enforce one-per-year.
    year: Number(startDate.slice(0, 4)),
    name,
    tagline: String(raw.tagline ?? "").trim(),
    description: String(raw.description ?? "").trim(),
    heroImage: isValidMediaUrl(hero) ? hero : "",
    city: String(raw.city ?? "").trim(),
    startDate,
    endDate,
    screenings: (raw.screenings ?? [])
      .map((screening, index) =>
        mapScreening(screening, index, seenScreenings, seenFilms),
      )
      .filter((screening): screening is Screening => screening !== null),
  };
};

const text = (value: unknown, fallback: string): string => {
  const trimmed = String(value ?? "").trim();
  return trimmed || fallback;
};

/**
 * Passed through verbatim, spaces included: next/image percent-encodes the src
 * when it builds its `/_next/image?url=` request. Encoding here as well was a
 * bug — the optimiser received "%2520" and looked for a file whose name
 * literally contained "%20", which 404s. The banner ships as
 * "iffa big banner.jpg", so this path is load-bearing.
 */
const mapImage = (value: unknown, fallback: string): string => {
  const url = String(value ?? "").trim();
  return isValidMediaUrl(url) ? url : fallback;
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
    scheduleHeading: text(raw?.scheduleHeading, d.scheduleHeading),
    scheduleIntro: text(raw?.scheduleIntro, d.scheduleIntro),
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
 * Splits the published festivals into the one the page is about and the rest.
 *
 * "The one" is whichever festival has not finished yet — this year's if it is
 * still to come or currently running, otherwise next year's. Only once every
 * festival on record is over does the most recent past one take the hero, so
 * the page shows the last festival rather than an empty screen in the months
 * between one year's closing night and the next year's announcement.
 *
 * `today` is Melbourne's date, not the server's: a festival in Melbourne
 * changes phase at midnight in Melbourne, and App Runner runs in UTC.
 */
const splitByPhase = (
  festivals: Festival[],
  todayIso: string,
): { festival: Festival | null; archive: Festival[] } => {
  const chronological = [...festivals].sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );

  const current = chronological.find((entry) => entry.endDate >= todayIso);
  const festival = current ?? chronological[chronological.length - 1] ?? null;

  return {
    festival,
    archive: chronological
      .filter((entry) => entry.slug !== festival?.slug)
      .reverse(),
  };
};

/**
 * Nothing here is cached, by fetch or by the routes that call it.
 *
 * Amplify runs the app from a read-only bundle, so a regenerated ISR entry can
 * never be written back: time-based revalidation serves the stale copy while
 * the fresh render is discarded, and the page stays frozen on whatever the CMS
 * held at build time until the next deploy. Rendering on demand costs one API
 * call per view and is the only version of this that stays correct.
 */

const getJson = async <T>(path: string): Promise<T | null> => {
  if (!apiBase()) {
    console.warn("NEXT_PUBLIC_API_BASE_URL is not set — the Festival page has no data source.");
    return null;
  }
  try {
    const response = await fetch(`${apiBase()}${path}`, { cache: "no-store" });
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
  /** The festival the page is about. `null` only when none is published. */
  festival: Festival | null;
  /** Every other published festival, most recent first. */
  archive: Festival[];
  settings: FestivalPageSettings;
  /** Melbourne's date at render time, so phase is decided once and passed down. */
  today: string;
};

export const fetchFestivalsPageData = async (): Promise<FestivalsPageData> => {
  const payload = await getJson<{
    success?: boolean;
    data?: { festivals?: ApiFestival[]; settings?: ApiSettings };
  }>("/festivals");

  const festivals = (payload?.data?.festivals ?? [])
    .map(mapFestival)
    .filter((festival): festival is Festival => festival !== null);

  const today = melbourneToday();

  return {
    ...splitByPhase(festivals, today),
    settings: mapSettings(payload?.data?.settings),
    today,
  };
};

/**
 * Finds a festival by slug across the current one and the archive.
 *
 * `/festivals/<slug>` is kept alive for links shared before the site moved to
 * a single festival page: the current festival's slug redirects to
 * `/festivals`, and a past one renders its archive recap.
 */
/**
 * Finds one screening, and the festival it belongs to, by screening id.
 *
 * The current festival is searched first: ids are minted per festival from the
 * title, so the same session name in two different years produces the same id,
 * and "the one that is on now" is the one a bare link means. The archive is
 * only reached when the current programme has no match.
 */
export const findScreening = (
  data: FestivalsPageData,
  id: string,
): { screening: Screening; festival: Festival } | null => {
  for (const festival of [data.festival, ...data.archive]) {
    if (!festival) continue;
    const screening = festival.screenings.find((entry) => entry.id === id);
    if (screening) return { screening, festival };
  }
  return null;
};

/**
 * Finds one film, with the screening that programmes it and the festival it
 * belongs to.
 *
 * Searched in the same order and for the same reason as `findScreening`. A
 * film programmed in two sessions of one festival resolves to the first — the
 * film's page is about the film, and the screening it names is context rather
 * than the subject, so either answer is correct and the first is stable.
 */
export const findFilm = (
  data: FestivalsPageData,
  id: string,
): { film: Film; screening: Screening; festival: Festival } | null => {
  for (const festival of [data.festival, ...data.archive]) {
    if (!festival) continue;
    for (const screening of festival.screenings) {
      const film = screening.films.find((entry) => entry.id === id);
      if (film) return { film, screening, festival };
    }
  }
  return null;
};

export const findFestivalBySlug = (
  data: FestivalsPageData,
  slug: string,
): Festival | undefined =>
  [data.festival, ...data.archive].find(
    (festival): festival is Festival => festival?.slug === slug,
  );
