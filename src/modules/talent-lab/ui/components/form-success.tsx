import Link from "next/link";

type FormSuccessProps = {
  /** Mono line above the heading — the application's reference number. */
  eyebrow?: string;
  heading: string;
  body: string;
  /** "What happens next" / "Assessment timeline". */
  panelTitle: string;
  panelLines: readonly string[];
  /** The honest statement that nothing was transmitted (§11.4). Required. */
  notConnectedNote: string;
  primary: { label: string; href: string };
  /** "Back to the form" — resets the form rather than navigating. */
  onReset: () => void;
  resetLabel: string;
};

/**
 * The screen both forms swap to on a valid submit.
 *
 * `notConnectedNote` is not optional, and that is the point. The forms validate
 * locally and go no further (plan D4), so a success screen that says "we have
 * emailed you" — as the design's copy does — would be the one place in this
 * whole section that tells a user something untrue. The note replaces that
 * claim and says plainly what did and did not happen.
 *
 * `role="status"` so the swap from form to confirmation is announced rather
 * than silently replacing the page for anyone not watching.
 */
export function FormSuccess({
  eyebrow,
  heading,
  body,
  panelTitle,
  panelLines,
  notConnectedNote,
  primary,
  onReset,
  resetLabel,
}: FormSuccessProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 py-24 text-center md:px-8 md:py-32">
      <span
        aria-hidden="true"
        className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-yellow-400/50 bg-yellow-400/12 text-2xl text-yellow-400"
      >
        ✓
      </span>

      <div role="status" className="flex flex-col items-center gap-5">
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-yellow-400">
            {eyebrow}
          </p>
        )}

        <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
          {heading}
        </h1>

        <p className="text-sm font-light leading-relaxed text-white/70 md:text-base">
          {body}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-6 text-left">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-yellow-400">
          {panelTitle}
        </h2>

        <ol className="flex flex-col gap-2">
          {panelLines.map((line) => (
            <li
              key={line}
              className="text-sm font-light leading-relaxed text-white/70"
            >
              {line}
            </li>
          ))}
        </ol>
      </div>

      <p className="w-full rounded-xl border border-[#7FB2F0]/35 bg-[#7FB2F0]/[0.07] p-5 text-left text-[13px] font-light leading-relaxed text-white/75">
        <span aria-hidden="true" className="pr-2 text-[#7FB2F0]">
          ⓘ
        </span>
        {notConnectedNote}
      </p>

      <div className="flex flex-wrap justify-center gap-3 pt-1">
        <Link
          href={primary.href}
          className="inline-flex items-center justify-center rounded-sm border border-yellow-400 bg-yellow-400 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {primary.label}
        </Link>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-sm border border-white/20 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          {resetLabel}
        </button>
      </div>
    </section>
  );
}
