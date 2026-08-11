/**
 * Festivals section data model.
 *
 * These types are deliberately API-shaped: `cms-hub` has no screening / night /
 * venue / showtime model yet, so the section is driven by static typed data in
 * `src/modules/festivals/data/`. When a CMS endpoint eventually exists it can
 * return these same shapes and the UI will not need to change.
 */

export type SeatStatus = "available" | "limited" | "sold-out";

export type Showtime = {
  id: string;
  /** Display-ready local time, e.g. "2:30 PM". */
  time: string;
  venue: string;
  seatStatus: SeatStatus;
  /**
   * Booking is a later project. When the internal booking form is built, a
   * `bookingUrl` / `screeningId` field lands here and `showtime-card` +
   * `CONTINUE TO BOOK` become live without a UI rewrite.
   */
};

export type ScreeningFilm = {
  id: string;
  title: string;
  /** CloudFront URL, or "/fallbacks/no-poster.svg" when no real poster exists. */
  posterUrl: string;
  runtimeMinutes: number;
  /** ISO date, e.g. "2026-08-20". */
  screeningDate: string;
  genre: string;
  synopsis: string;
  /** Raw YouTube URL. `undefined` means no trailer is available. */
  trailerUrl?: string;
  showtimes: Showtime[];
};

export type FestivalNight = {
  id: string;
  /** e.g. "Opening Night", "Night 2", "Closing Night". */
  label: string;
  /** ISO date, e.g. "2026-08-20". */
  date: string;
  /** Multiple films in one night stack vertically in the UI. */
  films: ScreeningFilm[];
};

export type ScreeningCountry = {
  /** Filter key, also URL-safe. e.g. "oman". */
  code: string;
  name: string;
  nights: FestivalNight[];
};

export type ProgramCard = {
  slug: string;
  title: string;
  description: string;
  /** Key into the Hugeicons map in `program-card.tsx`. */
  iconName: string;
  /** `null` => Coming Soon, rendered non-interactive. */
  href: string | null;
  status: "live" | "coming-soon";
};
