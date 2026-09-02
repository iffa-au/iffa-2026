import type {
  Festival,
  FestivalMonth,
  Screening,
  ScreeningDay,
  SeatStatus,
} from "./types";

/**
 * Every label, count and range rendered in the Festivals section is derived
 * from the schedule data through these helpers rather than hardcoded, so a
 * content edit can never leave a headline number or a date range stale.
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
 * Parses "2026-08-07" without going through `new Date(string)`.
 *
 * `new Date("2026-08-07")` is parsed as UTC midnight and then rendered in the
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

/** "2026-08-07" -> "Friday, 7 August" */
export const formatDayHeading = (iso: string): string => {
  const { month, day } = parseIsoDate(iso);
  return `${WEEKDAYS_LONG[weekdayIndex(iso)]}, ${day} ${MONTHS_LONG[month - 1]}`;
};

/** "2026-08-07" -> "Fri 7 Aug" */
export const formatShortDate = (iso: string): string => {
  const { month, day } = parseIsoDate(iso);
  return `${WEEKDAYS_SHORT[weekdayIndex(iso)]} ${day} ${MONTHS_SHORT[month - 1]}`;
};

/** "2026-08-07" -> "7 August 2026" */
export const formatFullDate = (iso: string): string => {
  const { year, month, day } = parseIsoDate(iso);
  return `${day} ${MONTHS_LONG[month - 1]} ${year}`;
};

/** 106 -> "106 min" */
export const formatRuntime = (minutes: number): string => `${minutes} min`;

/** 1-12 -> "August" */
export const monthName = (month: number): string => MONTHS_LONG[month - 1];

/** A month's own label, e.g. "August 2026". */
export const monthLabel = (month: FestivalMonth): string =>
  `${monthName(month.month)} ${month.year}`;

/**
 * The DOM id of a month's section, e.g. "month-2026-08".
 *
 * Prefixed on purpose: an id may not start with a digit in a CSS selector, so
 * a bare "2026-08" would throw in `querySelector` even though `getElementById`
 * accepts it. Both the section and the month nav go through this.
 */
export const monthSectionId = (month: FestivalMonth): string => `month-${month.id}`;

/**
 * A festival's dates, collapsed as tightly as they allow:
 *   same month + year -> "7-9 August 2026"
 *   same year         -> "28 August - 2 September 2026"
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

/**
 * Every festival across the given months, in programme order.
 *
 * These helpers take the schedule as an argument rather than importing it: the
 * data now arrives from cms-hub per request, so there is no module-level
 * schedule to reach for.
 */
export const allFestivals = (months: FestivalMonth[]): Festival[] =>
  months.flatMap((month) => month.festivals);

/** Only the months that actually have a published programme. */
export const announcedMonths = (months: FestivalMonth[]): FestivalMonth[] =>
  months.filter((month) => month.status === "announced");

export const countScreeningsInMonth = (month: FestivalMonth): number =>
  month.festivals.reduce((total, festival) => total + festival.screenings.length, 0);

/** Number of distinct dates a festival screens on. */
export const countFestivalDays = (festival: Festival): number =>
  new Set(festival.screenings.map((screening) => screening.date)).size;

/** Countries represented in a festival, first-seen order, no duplicates. */
export const festivalCountries = (festival: Festival): string[] => [
  ...new Set(festival.screenings.map((screening) => screening.country)),
];

/** Every country across the whole schedule. */
export const allCountries = (months: FestivalMonth[]): string[] => [
  ...new Set(
    allFestivals(months).flatMap((festival) => festivalCountries(festival))
  ),
];

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
 * A festival can add or drop a day here with no UI change.
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
      /** "01", "02" — the festival's own day numbering, not a calendar date. */
      index: String(index + 1).padStart(2, "0"),
      screenings: [...screenings].sort((a, b) => toMinutes(a.time) - toMinutes(b.time)),
    }));
};

export const findFestival = (
  months: FestivalMonth[],
  slug: string
): Festival | undefined =>
  allFestivals(months).find((festival) => festival.slug === slug);

/** The month a festival belongs to — used for the detail page's eyebrow. */
export const monthOfFestival = (
  months: FestivalMonth[],
  slug: string
): FestivalMonth | undefined =>
  months.find((month) => month.festivals.some((festival) => festival.slug === slug));

/** Previous / next festival in programme order, for the detail page footer. */
export const festivalNeighbours = (
  months: FestivalMonth[],
  slug: string
): { previous: Festival | null; next: Festival | null } => {
  const festivals = allFestivals(months);
  const index = festivals.findIndex((festival) => festival.slug === slug);

  return {
    previous: index > 0 ? festivals[index - 1] : null,
    next: index >= 0 && index < festivals.length - 1 ? festivals[index + 1] : null,
  };
};

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
  available: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  limited: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "sold-out": "border-white/15 bg-white/5 text-white/45",
};
