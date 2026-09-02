/**
 * Festivals section data model.
 *
 * The hierarchy the Festivals page is built around is:
 *
 *   Month -> Festival -> Screening
 *
 * IFFA runs two festivals a month; each festival programmes a handful of
 * screenings across a weekend. A `Screening` is deliberately one film at one
 * date/time/venue — that is what a screening actually is, and it keeps the
 * schedule groupable by day without a second level of showtimes.
 *
 * These types are API-shaped: `cms-hub` has no festival / screening model yet,
 * so the section is driven by static typed data in `src/modules/festivals/data/`.
 * When a CMS endpoint eventually exists it can return these same shapes and the
 * UI will not need to change.
 */

export type SeatStatus = "available" | "limited" | "sold-out";

export type Screening = {
  id: string;
  title: string;
  /**
   * CloudFront URL, or `null` when no artwork exists yet. Null is not a broken
   * state — `PosterFrame` draws a typographic poster from the title instead.
   */
  posterUrl: string | null;
  /** Country of origin. Displayed on every card; never a filter. */
  country: string;
  /** Year of production, not of the screening. */
  year: number;
  genre: string;
  runtimeMinutes: number;
  synopsis: string;
  /** Raw YouTube URL. `undefined` means no trailer is available. */
  trailerUrl?: string;
  /** ISO date of this screening, e.g. "2026-08-07". */
  date: string;
  /** Display-ready local time, e.g. "7:30 PM". */
  time: string;
  venue: string;
  seatStatus: SeatStatus;
};

export type Festival = {
  /** URL segment: /festivals/<slug>. */
  slug: string;
  /** Position within its month, shown as an index: "01", "02". */
  edition: string;
  name: string;
  /** One line, shown under the festival name. */
  tagline: string;
  /** Two or three sentences, shown on the card and the detail hero. */
  description: string;
  /** Landscape artwork. Must be a real, reachable asset. */
  heroImage: string;
  city: string;
  /** ISO dates. Derived labels come from `festival-utils`, never hardcoded. */
  startDate: string;
  endDate: string;
  screenings: Screening[];
};

/** One day of a festival's schedule, as `groupScreeningsByDay` returns it. */
export type ScreeningDay = {
  /** ISO date, e.g. "2026-08-07". */
  date: string;
  /** The festival's own day numbering — "01", "02" — not a calendar date. */
  index: string;
  /** Ordered by start time. */
  screenings: Screening[];
};

export type FestivalMonth = {
  /** "2026-08". The DOM id it scrolls to comes from `monthSectionId`. */
  id: string;
  /** 1-12. */
  month: number;
  year: number;
  /**
   * `coming-soon` months render a locked panel. Never put unannounced
   * festivals in one to "hide" them — the array must genuinely be empty.
   */
  status: "announced" | "coming-soon";
  festivals: Festival[];
  /** Shown inside the coming-soon panel. */
  note?: string;
};

/** Venue on the Festivals page's closing band. */
export type FestivalVenue = {
  name: string;
  suburb: string;
};

/** A labelled link. An empty `label` hides the button entirely. */
export type LinkedCta = {
  label: string;
  href: string;
};

export type FestivalStat = {
  value: string;
  label: string;
};

/**
 * Everything on the Festivals page that is not a festival: the hero, the
 * intro, the award spotlight, the closing call to action, the venue list.
 *
 * Edited in cms-hub. `festival-api.ts` carries a full set of defaults, so the
 * page renders complete and correct before staff have saved anything — and
 * also when the API is unreachable.
 */
export type FestivalPageSettings = {
  seriesLabel: string;
  city: string;
  country: string;
  planTitle: string;
  planBody: string;
  scheduleEyebrow: string;
  scheduleHeading: string;
  scheduleIntro: string;
  venues: FestivalVenue[];
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    backgroundImageUrl: string;
    primaryCta: LinkedCta;
    secondaryCta: LinkedCta;
  };
  about: {
    eyebrow: string;
    heading: string;
    /** One paragraph per entry. */
    body: string[];
    stats: FestivalStat[];
  };
  award: {
    eyebrow: string;
    heading: string;
    body: string;
    imageUrl: string;
    points: string[];
  };
  cta: {
    eyebrow: string;
    heading: string;
    body: string;
    primaryCta: LinkedCta;
    secondaryCta: LinkedCta;
  };
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
