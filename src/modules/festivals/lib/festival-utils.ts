import type {
  Festival,
  FestivalPhase,
  Screening,
  ScreeningDay,
  SeatStatus,
} from "./types";

/**
 * Every label, count and range rendered in the Festival section is derived
 * from the schedule data through these helpers rather than hardcoded, so a
 * content edit can never leave a headline number or a date range stale.
 *
 * The month helpers that used to live here are gone: IFFA runs one festival a
 * year, so there is no month grouping left to label.
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

/** 106 -> "106 min" */
export const formatRuntime = (minutes: number): string => `${minutes} min`;

/** 1-12 -> "October" */
export const monthName = (month: number): string => MONTHS_LONG[month - 1];

/**
 * A festival's dates, collapsed as tightly as they allow:
 *   same month + year -> "14-18 October 2026"
 *   same year         -> "28 October - 2 November 2026"
 *   otherwise         -> "28 December 2026 - 2 January 2027"
 */
export const formatFestivalDates = (festival: Festival): string => {
  const start = parseIsoDate(festival.startDate);
  const end = parseIsoDate(festival.endDate);

  if (festival.startDate === festival.endDate) return formatFullDate(festival.startDate);

  if (start.year === end.year && start.month === end.month) {
    return `${start.day}-${end.day} ${MONTHS_LONG[end.month - 1]} ${end.year}`;
  }

  if (start.year === end.year) {
    return `${start.day} ${MONTHS_LONG[start.month - 1]} - ${end.day} ${MONTHS_LONG[end.month - 1]} ${end.year}`;
  }

  return `${formatFullDate(festival.startDate)} - ${formatFullDate(festival.endDate)}`;
};

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

/** Number of distinct dates a festival screens on. */
export const countFestivalDays = (festival: Festival): number =>
  new Set(festival.screenings.map((screening) => screening.date)).size;

/** Countries represented in a festival, first-seen order, no duplicates, blanks dropped. */
export const festivalCountries = (festival: Festival): string[] => [
  ...new Set(festival.screenings.map((screening) => screening.country).filter(Boolean)),
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

/** "7:30 PM" -> 1170, so a day's screenings can be ordered by start time. */
const toMinutes = (time: string): number => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return 0;

  const [, rawHour, rawMinute, meridiem] = match;
  const hour = Number(rawHour) % 12;
  const offset = meridiem.toUpperCase() === "PM" ? 12 : 0;
  return (hour + offset) * 60 + Number(rawMinute);
};

/**
 * The schedule's display shape: one group per date, each ordered by start time.
 * A festival can add or drop a night here with no UI change.
 */
export const groupScreeningsByDay = (festival: Festival): ScreeningDay[] => {
  const byDate = new Map<string, Screening[]>();

  for (const screening of festival.screenings) {
    const existing = byDate.get(screening.date);
    if (existing) existing.push(screening);
    else byDate.set(screening.date, [screening]);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, screenings], index) => ({
      date,
      /** "01", "02" — the festival's own night numbering, not a calendar date. */
      index: String(index + 1).padStart(2, "0"),
      screenings: [...screenings].sort((a, b) => toMinutes(a.time) - toMinutes(b.time)),
    }));
};

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
 * Seat status is never communicated by colour alone — every consumer pairs the
 * colour with this text label.
 */
export const SEAT_STATUS_LABEL: Record<SeatStatus, string> = {
  available: "Seats available",
  limited: "Seats limited",
  "sold-out": "Sold out",
};
