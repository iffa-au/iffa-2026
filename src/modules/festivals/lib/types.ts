/**
 * Festivals section data model.
 *
 * IFFA runs ONE festival a year. The hierarchy is:
 *
 *   Festival (one per year) -> Screening (a session) -> Film
 *
 * A screening used to BE a film — one row carrying both the film's metadata
 * and the time it played. That collapsed the moment a session programmed more
 * than one title: a shorts block of six films had to be entered as six
 * screenings sharing a time and a venue, with nothing tying them together and
 * nowhere to put the block's own name or blurb.
 *
 * So a screening is now the session — what a ticket admits you to — and the
 * films it programmes hang underneath it. Time, venue and seat status belong
 * to the session, because that is what they describe; a film carries only
 * what is true of the film wherever it plays.
 *
 * The public site shows exactly one festival — the current or next one — and
 * files the rest as an archive. `festival-api.ts` decides which is which.
 */

export type SeatStatus = "available" | "limited" | "sold-out";

/**
 * One film in a screening.
 *
 * Carries nothing about where it plays, and only a clock time for when. A
 * venue or a date copied onto a film is how a title programmed twice starts
 * disagreeing with itself. `startTime` cannot: films are stored inside the
 * screening that programmes them, so a title in two sessions is two rows, each
 * with its own time.
 */
export type Film = {
  /**
   * URL segment: /festivals/film/<id>. Minted from the title in
   * `festival-api.ts`, not taken from Mongo — see the note there.
   */
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
  /**
   * When this film actually plays: an ISO date, e.g. "2026-10-16", and a
   * display-ready local time, e.g. "7:45 PM". Either may be empty.
   *
   * A session's own date range and `time` answer the same question for every
   * film in it. That is right for a feature and wrong for everything else. A
   * shorts block starts six films at six different minutes, and "7:30 PM"
   * printed six times tells you nothing about which one you are in time for; a
   * strand running Thursday to Saturday plays a different film each day, and
   * "14-16 Oct" on all three is worse than useless to someone with one free
   * evening.
   *
   * So a film may carry its own date and time, and `filmScreeningWhen` falls
   * back to the session's for whichever half is missing — which is both halves
   * until cms-hub carries the fields.
   *
   * Safe to hold on the film because the film row belongs to one screening:
   * see the note above. Not validated against the session's range, because the
   * CMS is the authority on its own programme and a frontend that silently
   * corrected a date would hide the typo rather than surface it.
   */
  startDate: string;
  startTime: string;
  /**
   * Runtime as two fields, the shape the CMS stores. Shorts are programmed to
   * the second, so a lone minutes figure rounds away the difference between a
   * 3:10 and a 3:50 film.
   */
  runtimeMinutes: number;
  runtimeSeconds: number;
  synopsis: string;
  /** Raw YouTube URL. `undefined` means no trailer is available. */
  trailerUrl?: string;
};

/**
 * One session on the programme: a named block of films at a time and place.
 *
 * `startDate` and `endDate` are usually the same day — most sessions run once.
 * A strand that repeats across several days (a shorts programme on rotation,
 * an exhibition) sets a real range, which is why the programme cannot group by
 * night any more: a screening does not necessarily belong to one.
 */
export type Screening = {
  /** URL segment: /festivals/screening/<id>. Minted from the title. */
  id: string;
  title: string;
  /** A short blurb for the session as a whole. May be empty. */
  description: string;
  /** ISO date the session opens, e.g. "2026-10-14". */
  startDate: string;
  /** ISO date it closes. Equal to `startDate` for a single sitting. */
  endDate: string;
  /** Display-ready local start time, e.g. "7:30 PM". May be empty. */
  time: string;
  venue: string;
  seatStatus: SeatStatus;
  /** In programme order, as entered in the CMS. */
  films: Film[];
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

/**
 * Where a festival sits relative to today.
 *
 * Drives the countdown: `upcoming` counts down to opening night, `running`
 * says which night is on, `past` sends the viewer to the archive.
 */
export type FestivalPhase = "upcoming" | "running" | "past";

/** A labelled link. An empty `label` hides the button entirely. */
export type LinkedCta = {
  label: string;
  href: string;
};

/**
 * Everything on the Festival page that is not the festival itself: the hero,
 * the award spotlight and the closing call to action.
 *
 * Edited in cms-hub. `festival-api.ts` carries a full set of defaults, so the
 * page renders complete and correct before staff have saved anything — and
 * also when the API is unreachable.
 */
export type FestivalPageSettings = {
  /**
   * `seriesLabel` and `scheduleEyebrow` are deliberately absent. Both still
   * exist on the settings document in cms-hub and neither is rendered:
   * seriesLabel was already unused, and scheduleEyebrow was the tracked-out
   * caps label above the schedule, which the paper inversion replaced. Their
   * inputs are gone from the CMS so nobody edits a field that does nothing.
   *
   * `about` is gone outright — schema, CMS inputs and stored field — because
   * the section that rendered it was cut. See the note in `festival-page.tsx`.
   *
   * So are `venues`, `planTitle`, `planBody`, `city` and `country`, which the
   * venue band read. See the note in `closing-band.tsx`.
   */
  scheduleHeading: string;
  scheduleIntro: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    backgroundImageUrl: string;
    primaryCta: LinkedCta;
    secondaryCta: LinkedCta;
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
