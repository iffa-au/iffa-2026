import { STATUS_PILL } from "../../lib/status";
import type { OpportunityStatus } from "../../lib/types";

/**
 * The seven opportunity states.
 *
 * The icon is `aria-hidden` and the label is real text, so the state survives
 * being read by a screen reader, printed in greyscale, or seen by someone who
 * cannot distinguish the green pill from the orange one. Colour is the third
 * signal here, never the only one.
 */
export function StatusPill({ status }: { status: OpportunityStatus }) {
  const pill = STATUS_PILL[status];

  return (
    <span
      className={`inline-flex flex-none items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${pill.borderClass} ${pill.bgClass} ${pill.textClass}`}
    >
      <span aria-hidden="true">{pill.icon}</span>
      {pill.label}
    </span>
  );
}
