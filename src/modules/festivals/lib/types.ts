/**
 * Festivals section data model.
 *
 * IFFA runs ONE festival a year. The hierarchy is:
 *
 *   Festival (one per year) -> Screening
 *
 * This replaced a Month -> Festival -> Screening model from when the plan was
 * two festivals a month. Months are gone entirely: with a single annual
 * festival there is nothing for a month to group, and the year is already
 * carried by the festival itself.
 *
 * The public site shows exactly one festival — the current or next one — and
 * files the rest as an archive. `festival-api.ts` decides which is which.
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
  /** ISO date of this screening, e.g. "2026-10-14". */
  date: string;
  /** Display-ready local time, e.g. "7:30 PM". */
  time: string;
  venue: string;
  seatStatus: SeatStatus;
};

export type Festival = {
  /** URL segment: /festivals/<slug>. */
  slug: string;
  /**
   * The festival year, derived from `startDate` rather than read from the API.
   * One festival owns a year outright, so this is the festival's identity —
   * "IFFA 2026" — and what the archive is keyed on.
   */
  year: number;
  name: string;
  /** One line, shown under the festival name. */
  tagline: string;
  /** Two or three sentences, shown in the opening section. */
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
  /** ISO date, e.g. "2026-10-14". */
  date: string;
  /** The festival's own day numbering — "01", "02". A genuine sequence. */
  index: string;
  /** Ordered by start time. */
  screenings: Screening[];
};

/**
 * Where a festival sits relative to today.
 *
 * Drives the countdown: `upcoming` counts down to opening night, `running`
 * says which night is on, `past` sends the viewer to the archive.
 */
export type FestivalPhase = "upcoming" | "running" | "past";

/** Venue on the festival's venue band. */
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
 * Everything on the Festival page that is not the festival itself: the hero,
 * the intro, the award spotlight, the closing call to action, the venue list.
 *
 * Edited in cms-hub. `festival-api.ts` carries a full set of defaults, so the
 * page renders complete and correct before staff have saved anything — and
 * also when the API is unreachable.
 */
export type FestivalPageSettings = {
  city: string;
  country: string;
  planTitle: string;
  planBody: string;
  /**
   * `seriesLabel` and `scheduleEyebrow` are deliberately absent. Both still
   * exist on the settings document in cms-hub and neither is rendered:
   * seriesLabel was already unused, and scheduleEyebrow was the tracked-out
   * caps label above the schedule, which the paper inversion replaced. Their
   * inputs are gone from the CMS so nobody edits a field that does nothing.
   */
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
    /** Wide banner above the stats. Empty renders the section without one. */
    imageUrl: string;
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
