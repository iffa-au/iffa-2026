import Link from "next/link";

import { STATUS_PILL } from "../../lib/status";

/**
 * The one status slot each cohort card carries.
 *
 * A discriminated union rather than two optional props: a card shows exactly
 * one of these, and the type makes "both" and "neither" unrepresentable.
 */
export type CohortCardStatus =
  /** e.g. "8 programs listed" — always derived at the call site, never typed. */
  | { kind: "count"; label: string }
  /** The pill label plus the plain-English reason shown beside the action. */
  | { kind: "coming-soon"; label: string; note: string };

type CohortCardProps = {
  /** Mono gold line above the title, e.g. "Cohort 1". */
  eyebrow: string;
  title: string;
  description: string;
  status: CohortCardStatus;
  /** `null` => the card is inert, exactly as `resource-row` treats a null href. */
  href: string | null;
  actionLabel: string;
};

/**
 * "Coming Soon" borrows the neutral grey of `opening-soon` rather than
 * introducing an eighth colour. The palette is black, white, gold and the seven
 * functional status hues (plan §3.7) — a cohort that has not opened yet is the
 * same idea `opening-soon` already names, so it reuses the same treatment with
 * its label overridden.
 */
const COMING_SOON = STATUS_PILL["opening-soon"];

/**
 * The card chrome, shared by both cohorts so the page reads as one choice
 * between two comparable things rather than a live card beside a dead one.
 */
const CARD =
  "flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-7 md:p-8";

const PILL =
  "inline-flex max-w-full items-center gap-1.5 self-start rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]";

/**
 * One cohort on the opportunities chooser.
 *
 * The active cohort is a single `<Link>` wrapping the whole card, so the click
 * target and the focus target are the same rectangle — the same reasoning as
 * `stream-card`.
 *
 * The inert cohort is not that shape. Its body stays ordinary markup and only
 * the trailing action becomes a `disabled` button with `aria-disabled` and a
 * reason beside it, which is what `resource-row` does. Wrapping the whole card
 * in a `<button>` would fold the heading and description into the button's
 * accessible name, and a heading inside a button is not valid HTML either. It
 * is never a dead `<a>` and never a clickable `<div>`.
 */
export function CohortCard({
  eyebrow,
  title,
  description,
  status,
  href,
  actionLabel,
}: CohortCardProps) {
  const body = (
    <>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-yellow-400">
        {eyebrow}
      </p>

      <h2 className="text-xl font-semibold leading-snug text-white md:text-2xl">
        {title}
      </h2>

      <p className="text-sm font-light leading-relaxed text-white/70">
        {description}
      </p>

      {status.kind === "count" ? (
        <span
          className={`${PILL} border-yellow-400/40 bg-yellow-400/10 text-yellow-400`}
        >
          {status.label}
        </span>
      ) : (
        <span
          className={`${PILL} ${COMING_SOON.borderClass} ${COMING_SOON.bgClass} ${COMING_SOON.textClass}`}
        >
          <span aria-hidden="true">{COMING_SOON.icon}</span>
          {status.label}
        </span>
      )}
    </>
  );

  if (href !== null) {
    return (
      <Link
        href={href}
        className={`${CARD} group transition-colors hover:border-yellow-400/55 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400`}
      >
        {body}

        <span className="mt-auto pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-yellow-400">
          {actionLabel} <span aria-hidden="true">→</span>
        </span>
      </Link>
    );
  }

  return (
    <div className={CARD}>
      {body}

      <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-3">
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="cursor-not-allowed rounded-sm border border-white/12 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35"
        >
          {actionLabel}
        </button>

        {status.kind === "coming-soon" && (
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
            {status.note}
          </span>
        )}
      </span>
    </div>
  );
}
