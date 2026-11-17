import type { OpportunityStatus } from "./types";

/**
 * The seven opportunity states, each carrying an icon, a text label and a
 * colour — in that order of importance.
 *
 * Status is never communicated by colour alone, so the label and the colour are
 * defined together in one place and consumed as a pair. That pairing is what
 * stops the rule from drifting as pages are added; it is the same reason
 * `SEAT_STATUS_LABEL` exists in the Festivals module.
 *
 * These hues are the only sanctioned exception to the section's black / white /
 * gold palette. They are functional, not decorative — do not "correct" them.
 */

export type StatusPill = {
  label: string;
  /** Rendered `aria-hidden`; the label carries the meaning. */
  icon: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
};

export const STATUS_PILL: Record<OpportunityStatus, StatusPill> = {
  eoi: {
    label: "EOI Open",
    icon: "●",
    textClass: "text-[#E6BA35]",
    bgClass: "bg-[#E6BA35]/12",
    borderClass: "border-[#E6BA35]/45",
  },
  "opening-soon": {
    label: "Applications Opening Soon",
    icon: "◔",
    textClass: "text-[#B3B3B3]",
    bgClass: "bg-white/6",
    borderClass: "border-white/20",
  },
  open: {
    label: "Applications Open",
    icon: "●",
    textClass: "text-[#5FD68A]",
    bgClass: "bg-[#5FD68A]/12",
    borderClass: "border-[#5FD68A]/45",
  },
  "closing-soon": {
    label: "Closing Soon",
    icon: "◑",
    textClass: "text-[#F5A25A]",
    bgClass: "bg-[#F5A25A]/12",
    borderClass: "border-[#F5A25A]/45",
  },
  closed: {
    label: "Applications Closed",
    icon: "○",
    textClass: "text-[#8A8796]",
    bgClass: "bg-white/4",
    borderClass: "border-white/14",
  },
  "in-progress": {
    label: "In Progress",
    icon: "►",
    textClass: "text-[#7FB2F0]",
    bgClass: "bg-[#7FB2F0]/12",
    borderClass: "border-[#7FB2F0]/45",
  },
  completed: {
    label: "Completed",
    icon: "✓",
    textClass: "text-[#D4D4D8]",
    bgClass: "bg-white/5",
    borderClass: "border-white/18",
  },
};

/** Every status key, in the order the opportunity filter row presents them. */
export const STATUS_ORDER: OpportunityStatus[] = [
  "eoi",
  "opening-soon",
  "open",
  "closing-soon",
  "closed",
  "in-progress",
  "completed",
];

/**
 * Whether an application form can actually be submitted for a program in this
 * state.
 *
 * The program detail page uses it to choose which of its two actions is the
 * primary one. Sending someone to `/apply` for a closed or completed program
 * would be a dead end dressed as a call to action, so the routing is derived
 * from the state the user is looking at rather than stored beside it — the same
 * reasoning as `opportunity-card`'s CTA.
 */
export const canApply = (status: OpportunityStatus): boolean =>
  status === "open" || status === "closing-soon";

/** Statuses that still invite people in, so a passed close date overrides them. */
const STILL_INVITING: readonly OpportunityStatus[] = ["eoi", "opening-soon", "open", "closing-soon"];

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/**
 * The last day applications are accepted, as "YYYY-MM-DD", read from the
 * display string staff type in the CMS: "29 Aug 2026" is that day; "Feb 2027"
 * is the last day of that month. Anything else ("Rolling", "TBC") is null, so
 * it never closes on its own.
 */
export function closingDay(closesOn: string): string | null {
  const text = closesOn.trim().toLowerCase();
  const pad = (n: number) => String(n).padStart(2, "0");
  const full = /^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3})[a-z]*\.?,?\s+(\d{4})$/.exec(text);
  if (full) {
    const month = MONTHS.indexOf(full[2]);
    const day = Number(full[1]);
    if (month < 0 || day < 1 || day > 31) return null;
    return `${full[3]}-${pad(month + 1)}-${pad(day)}`;
  }
  const monthOnly = /^([a-z]{3})[a-z]*\.?\s+(\d{4})$/.exec(text);
  if (monthOnly) {
    const month = MONTHS.indexOf(monthOnly[1]);
    if (month < 0) return null;
    const year = Number(monthOnly[2]);
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return `${year}-${pad(month + 1)}-${pad(lastDay)}`;
  }
  return null;
}

/** Today in Sydney as "YYYY-MM-DD": applications close at the end of the day, Australian time. */
const todayInAustralia = (now: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Sydney" }).format(now);

/**
 * The status to show. Staff set it by hand in the CMS, which goes stale once
 * the close date passes; past that date an "open"-type status reads as closed,
 * so the site never invites applications for a round that has ended. Later
 * stages ("in-progress", "completed") are left as staff set them.
 */
export function effectiveStatus(
  opportunity: { status: OpportunityStatus; closesOn: string },
  now: Date = new Date()
): OpportunityStatus {
  if (!STILL_INVITING.includes(opportunity.status)) return opportunity.status;
  const day = closingDay(opportunity.closesOn);
  return day && todayInAustralia(now) > day ? "closed" : opportunity.status;
}
