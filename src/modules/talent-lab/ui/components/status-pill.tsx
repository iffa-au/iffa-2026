import { STATUS_PILL } from "../../lib/status";
import type { OpportunityStatus } from "../../lib/types";

/**
 * The seven opportunity states.
 *
 * The icon is `aria-hidden` and the label is real text, so the state survives
 * being read by a screen reader, printed in greyscale, or seen by someone who
 * cannot distinguish the green pill from the orange one. Colour is the third
 * signal here, never the only one.
 *
 * The pill is allowed to shrink and wrap. It previously carried `flex-none`,
 * which pins a flex item to its max-content width — and "Applications Opening
 * Soon" at max-content is wider than an opportunity card at 320px, so the card
 * pushed the page into horizontal scroll. Flex items only shrink when their
 * container would otherwise overflow, so dropping it changes nothing at normal
 * widths and wraps the label to a second line at narrow ones.
 */
export function StatusPill({ status }: { status: OpportunityStatus }) {
  const pill = STATUS_PILL[status];

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${pill.borderClass} ${pill.bgClass} ${pill.textClass}`}
    >
      <span aria-hidden="true">{pill.icon}</span>
      {pill.label}
    </span>
  );
}
