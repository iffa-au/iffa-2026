import type { Festival, FestivalPhase, Film, Screening, SeatStatus } from "./types";

/**
 * Every label, count and range rendered in the Festival section is derived
 * from the schedule data through these helpers rather than hardcoded, so a
 * content edit can never leave a headline number or a date range stale.
 *
 * The month helpers that used to live here are gone: IFFA runs one festival a
 * year, so there is no month grouping left to label. The night grouping went
 * the same way when screenings became sessions — a session can span several
 * days, so it does not belong to a single night to be grouped under.
 */

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTHS_SHORT = [
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

const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/**
 * Parses "2026-10-14" without going through `new Date(string)`.
 *
 * `new Date("2026-10-14")` is parsed as UTC midnight and then rendered in the
 * viewer's timezone, which shifts the date backwards for anyone west of UTC and
 * produces a server/client hydration mismatch. Splitting the string, and using
 * only `Date.UTC` + `getUTCDay` for the weekday, keeps formatting identical
 * everywhere.
 */
const parseIsoDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
};

const weekdayIndex = (iso: string): number => {
  const { year, month, day } = parseIsoDate(iso);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
};

/** "2026-10-14" -> "Wednesday, 14 October" */
export const formatDayHeading = (iso: string): string => {
  const { month, day } = parseIsoDate(iso);
  return `${WEEKDAYS_LONG[weekdayIndex(iso)]}, ${day} ${MONTHS_LONG[month - 1]}`;
};

/** "2026-10-14" -> "Wed 14 Oct" */
export const formatShortDate = (iso: string): string => {
  const { month, day } = parseIsoDate(iso);
  return `${WEEKDAYS_SHORT[weekdayIndex(iso)]} ${day} ${MONTHS_SHORT[month - 1]}`;
};

/** "2026-10-14" -> "14 October 2026" */
export const formatFullDate = (iso: string): string => {
  const { year, month, day } = parseIsoDate(iso);
  return `${day} ${MONTHS_LONG[month - 1]} ${year}`;
};

/** "2026-10-14" -> { day: "14", month: "Oct", weekday: "Wed" } */
export const splitDateParts = (iso: string) => {
  const { month, day } = parseIsoDate(iso);
  return {
    day: String(day).padStart(2, "0"),
    month: MONTHS_SHORT[month - 1],
    weekday: WEEKDAYS_SHORT[weekdayIndex(iso)],
  };
};

/**
 * 106, 0 -> "106 min"; 3, 40 -> "3 min 40 sec"; 0, 40 -> "40 sec".
 *
 * Returns "" when nothing is known, so callers can fall back with `||` rather
 * than testing the two halves themselves — a short with only seconds entered
 * still has a runtime worth printing.
 */
export const formatRuntime = (minutes: number, seconds = 0): string =>
  [minutes ? `${minutes} min` : "", seconds ? `${seconds} sec` : ""]
    .filter(Boolean)
    .join(" ");

/** 1-12 -> "October" */
export const monthName = (month: number): string => MONTHS_LONG[month - 1];

/**
 * Two ISO dates, collapsed as tightly as they allow:
 *   same day           -> "14 October 2026"
 *   same month + year  -> "14-18 October 2026"
 *   same year          -> "28 October - 2 November 2026"
 *   otherwise          -> "28 December 2026 - 2 January 2027"
 *
 * Shared by festivals and screenings: both are a span with the same collapsing
 * rules, and having written it twice once already, the second copy is where
 * the two quietly drift apart.
 */
export const formatDateRange = (startIso: string, endIso: string): string => {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);

  if (startIso === endIso) return formatFullDate(startIso);

  if (start.year === end.year && start.month === end.month) {
    return `${start.day}-${end.day} ${MONTHS_LONG[end.month - 1]} ${end.year}`;
  }

  if (start.year === end.year) {
    return `${start.day} ${MONTHS_LONG[start.month - 1]} - ${end.day} ${MONTHS_LONG[end.month - 1]} ${end.year}`;
  }

  return `${formatFullDate(startIso)} - ${formatFullDate(endIso)}`;
};

/** A festival's dates, collapsed. */
export const formatFestivalDates = (festival: Festival): string =>
  formatDateRange(festival.startDate, festival.endDate);

/** The same range without the year, for use beside a year set as display type. */
export const formatFestivalDatesShort = (festival: Festival): string => {
  const start = parseIsoDate(festival.startDate);
  const end = parseIsoDate(festival.endDate);

  if (festival.startDate === festival.endDate) {
    return `${start.day} ${MONTHS_LONG[start.month - 1]}`;
  }
  if (start.month === end.month) {
    return `${start.day}-${end.day} ${MONTHS_LONG[end.month - 1]}`;
  }
  return `${start.day} ${MONTHS_SHORT[start.month - 1]} - ${end.day} ${MONTHS_SHORT[end.month - 1]}`;
};

/**
 * When a screening runs, written the way a programme would write it.
 *
 * A single sitting names its weekday — that is the useful fact for a session
 * you attend once. A run across days drops the weekday, because "Wed 14 - Sat
 * 17 October" is already four words longer than the date it is replacing.
 */
export const formatScreeningDates = (screening: Screening): string => {
  if (screening.startDate === screening.endDate) {
    return formatDayHeading(screening.startDate);
  }

  const start = parseIsoDate(screening.startDate);
  const end = parseIsoDate(screening.endDate);

  if (start.month === end.month && start.year === end.year) {
    return `${start.day}-${end.day} ${MONTHS_LONG[end.month - 1]}`;
  }
  return `${formatShortDate(screening.startDate)} - ${formatShortDate(screening.endDate)}`;
};

/**
 * The same span, compressed hard for the sticky programme index.
 *
 * The index prints every session at once on one line, so a weekday name that
 * is useful in a section heading is eight characters that push the next
 * session off the strip. "Wed 14 Oct" is enough to place a session in a
 * festival that runs a fortnight at most.
 */
export const formatScreeningDatesShort = (screening: Screening): string => {
  if (screening.startDate === screening.endDate) {
    return formatShortDate(screening.startDate);
  }

  const start = parseIsoDate(screening.startDate);
  const end = parseIsoDate(screening.endDate);

  if (start.month === end.month && start.year === end.year) {
    return `${start.day}-${end.day} ${MONTHS_SHORT[end.month - 1]}`;
  }
  return `${start.day} ${MONTHS_SHORT[start.month - 1]} - ${end.day} ${MONTHS_SHORT[end.month - 1]}`;
};

/**
 * When a film plays, written for a programme tile: "Wed 16 Oct, 7:45 PM".
 *
 * The film answers if it can and the session answers if it cannot, half by
 * half — a film given its own start time but no date of its own is a real
 * case, and it should get its own time beside the session's dates rather than
 * losing both to the fallback.
 *
 * The session's half is the compressed range, so a film with no date of its
 * own inside a strand that runs three days reads "14-16 Oct" — vague, but
 * true, which is the honest answer when nobody has said which day it is on.
 */
export const filmScreeningWhen = (film: Film, screening: Screening): string => {
  const date = film.startDate
    ? formatShortDate(film.startDate)
    : formatScreeningDatesShort(screening);

  return [date, film.startTime || screening.time].filter(Boolean).join(", ");
};

/** Every ISO date a span covers, inclusive of both ends. */
const datesInRange = (startIso: string, endIso: string): string[] => {
  const { year, month, day } = parseIsoDate(startIso);
  const cursor = new Date(Date.UTC(year, month - 1, day));
  const dates: string[] = [];

  // Bounded rather than a bare while: a mis-entered end date decades out
  // would otherwise spin here, and no festival runs longer than a year.
  for (let guard = 0; guard < 366; guard += 1) {
    const iso = cursor.toISOString().slice(0, 10);
    if (iso > endIso) break;
    dates.push(iso);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
};

/** Number of distinct dates a festival actually screens on. */
export const countFestivalDays = (festival: Festival): number => {
  const days = new Set<string>();
  for (const screening of festival.screenings) {
    for (const date of datesInRange(screening.startDate, screening.endDate)) {
      days.add(date);
    }
  }
  return days.size;
};

/** Every film in a festival, in programme order, across all its screenings. */
export const festivalFilms = (festival: Festival) =>
  festival.screenings.flatMap((screening) => screening.films);

/** How many films a festival programmes in total. */
export const countFestivalFilms = (festival: Festival): number =>
  festivalFilms(festival).length;

/** Countries represented in a festival, first-seen order, no duplicates, blanks dropped. */
export const festivalCountries = (festival: Festival): string[] => [
  ...new Set(festivalFilms(festival).map((film) => film.country).filter(Boolean)),
];

/**
 * Where a festival sits relative to a given day, as an ISO date string.
 *
 * Takes `today` rather than reading the clock so the caller decides — the page
 * computes it once on the server and passes the answer down, which is what
 * stops the server and the client from disagreeing about what day it is.
 */
export const festivalPhase = (festival: Festival, todayIso: string): FestivalPhase => {
  if (todayIso < festival.startDate) return "upcoming";
  if (todayIso > festival.endDate) return "past";
  return "running";
};

/** Today in Melbourne, as an ISO date — the festival's own timezone, not the server's. */
export const melbourneToday = (): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Melbourne",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

/** "7:30 PM" -> 1170, so screenings on one day can be ordered by start time. */
const toMinutes = (time: string): number => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return 0;

  const [, rawHour, rawMinute, meridiem] = match;
  const hour = Number(rawHour) % 12;
  const offset = meridiem.toUpperCase() === "PM" ? 12 : 0;
  return (hour + offset) * 60 + Number(rawMinute);
};

/**
 * The programme's display order: by opening date, then by start time.
 *
 * This replaced `groupScreeningsByDay`. Screenings are the organising unit
 * now, and a screening that runs Thursday to Saturday cannot be filed under a
 * single night without either duplicating it or picking one arbitrarily.
 */
export const orderScreenings = (festival: Festival): Screening[] =>
  [...festival.screenings].sort(
    (a, b) =>
      a.startDate.localeCompare(b.startDate) || toMinutes(a.time) - toMinutes(b.time),
  );

/**
 * Where a screening's own page lives.
 *
 * `/festivals/screening/<id>` reuses the segment the old standalone schedule
 * had, which is now a redirect stub. The id is the title slug minted in
 * `festival-api.ts` rather than a Mongo subdocument id — saving a festival
 * rewrites the embedded array and issues fresh ids, which would break every
 * shared link.
 */
export const screeningHref = (id: string): string => `/festivals/screening/${id}`;

/**
 * Where a film's own page lives.
 *
 * Flat rather than nested under its screening: a film can be programmed in two
 * sessions, and a URL that names one of them makes the other unreachable at
 * that address. The film is the thing being linked to, so the film owns the
 * URL.
 */
export const filmHref = (id: string): string => `/festivals/film/${id}`;

/**
 * Seat status is never communicated by colour alone — every consumer pairs the
 * colour with this text label.
 */
export const SEAT_STATUS_LABEL: Record<SeatStatus, string> = {
  available: "Seats available",
  limited: "Seats limited",
  "sold-out": "Sold out",
};
