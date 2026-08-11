import type { ScreeningCountry, ScreeningFilm, SeatStatus } from "./types";

/**
 * Every stat rendered in the Festivals section is derived from the data through
 * these helpers rather than hardcoded, so a content edit can never leave a
 * headline number stale.
 */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Parses "2026-08-20" without going through `new Date()`.
 *
 * `new Date("2026-08-20")` is parsed as UTC midnight and then rendered in the
 * viewer's timezone, which shifts the date backwards for anyone west of UTC and
 * produces a server/client hydration mismatch. Splitting the string keeps
 * formatting identical everywhere.
 */
const parseIsoDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
};

export const countFilmsForCountry = (country: ScreeningCountry): number =>
  country.nights.reduce((total, night) => total + night.films.length, 0);

export const countAllFilms = (countries: ScreeningCountry[]): number =>
  countries.reduce((total, country) => total + countFilmsForCountry(country), 0);

export const countAllNights = (countries: ScreeningCountry[]): number =>
  countries.reduce((total, country) => total + country.nights.length, 0);

/** 126 -> "126min" */
export const formatRuntime = (minutes: number): string => `${minutes}min`;

/** "2026-08-20" -> "20 Aug 2026" */
export const formatScreeningDate = (iso: string): string => {
  const { year, month, day } = parseIsoDate(iso);
  return `${day} ${MONTHS[month - 1]} ${year}`;
};

/**
 * First night -> last night, collapsed as tightly as the dates allow:
 *   same month + year -> "20-24 Aug 2026"
 *   same year         -> "28 Aug - 2 Sep 2026"
 *   otherwise         -> "28 Dec 2026 - 2 Jan 2027"
 */
export const dateRangeForCountry = (country: ScreeningCountry): string => {
  const dates = country.nights.map((night) => night.date).sort();
  if (dates.length === 0) return "Dates to be announced";

  const start = parseIsoDate(dates[0]);
  const end = parseIsoDate(dates[dates.length - 1]);

  if (dates[0] === dates[dates.length - 1]) {
    return formatScreeningDate(dates[0]);
  }

  if (start.year === end.year && start.month === end.month) {
    return `${start.day}-${end.day} ${MONTHS[end.month - 1]} ${end.year}`;
  }

  if (start.year === end.year) {
    return `${start.day} ${MONTHS[start.month - 1]} - ${end.day} ${MONTHS[end.month - 1]} ${end.year}`;
  }

  return `${formatScreeningDate(dates[0])} - ${formatScreeningDate(dates[dates.length - 1])}`;
};

/** Flattens a country's nights into `{ film, nightLabel }` pairs for the ALL overview. */
export const filmsWithNightLabel = (
  country: ScreeningCountry
): { film: ScreeningFilm; nightLabel: string }[] =>
  country.nights.flatMap((night) =>
    night.films.map((film) => ({ film, nightLabel: night.label }))
  );

/**
 * Seat status is never communicated by colour alone — every consumer pairs the
 * colour with this text label.
 */
export const SEAT_STATUS_LABEL: Record<SeatStatus, string> = {
  available: "Seats available",
  limited: "Seats limited",
  "sold-out": "Sold out",
};

export const SEAT_STATUS_CLASSES: Record<SeatStatus, string> = {
  available: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  limited: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  "sold-out": "border-white/15 bg-white/5 text-white/45",
};

const FALLBACK_POSTER = "/fallbacks/no-poster.svg";

/**
 * The image optimiser rejects SVG unless `dangerouslyAllowSVG` is set in
 * `next.config.ts`, which this task must not touch. The placeholder poster is a
 * local SVG, so it is served unoptimised; real CloudFront posters still go
 * through the optimiser.
 */
export const isFallbackPoster = (posterUrl: string): boolean =>
  posterUrl === FALLBACK_POSTER || posterUrl.endsWith(".svg");
