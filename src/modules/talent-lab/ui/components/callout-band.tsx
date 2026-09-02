import Link from "next/link";

type CalloutBandProps = {
  eyebrow: string;
  heading: string;
  body: string;
  actionLabel: string;
  /** `null` => the action renders inert, exactly as `resource-row` does. */
  actionHref: string | null;
  /** Required when `actionHref` is null: why the button does nothing. */
  inertNote?: string;
  /** Optional live alternative shown beside an inert action. */
  children?: React.ReactNode;
};

/**
 * The gold-bordered horizontal band that closes the opportunities and partners
 * pages.
 *
 * Not `cta-band`: that one is the full-width centred closer used at the foot of
 * the landing page. This is an inline panel that sits inside a section, beside
 * its content rather than under it — a different shape carrying a different
 * weight, so it is a different component rather than a variant prop.
 */
export function CalloutBand({
  eyebrow,
  heading,
  body,
  actionLabel,
  actionHref,
  inertNote,
  children,
}: CalloutBandProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-yellow-400/30 bg-yellow-400/5 p-7 md:p-9">
      <div className="flex max-w-2xl flex-col gap-2.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-yellow-400">
          {eyebrow}
        </p>

        <p className="text-lg font-semibold leading-snug text-white md:text-xl">{heading}</p>

        <p className="text-sm font-light leading-relaxed text-white/70 md:text-[15px]">
          {body}
        </p>
      </div>

      {actionHref === null ? (
        <div className="flex max-w-sm flex-col gap-2.5">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-fit cursor-not-allowed rounded-sm border border-white/12 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35"
          >
            {actionLabel}
          </button>

          {inertNote && (
            <p className="font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-white/40">
              {inertNote}
            </p>
          )}

          {children}
        </div>
      ) : (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center rounded-sm border border-yellow-400 bg-yellow-400 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
