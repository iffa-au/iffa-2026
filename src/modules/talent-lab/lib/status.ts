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
