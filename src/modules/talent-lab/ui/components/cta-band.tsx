import Link from "next/link";

export type CtaAction = {
  label: string;
  href: string;
  /** Exactly one action per band should be `primary`. */
  variant: "primary" | "outline";
};

type CtaBandProps = {
  eyebrow: string;
  heading: string;
  body?: string;
  actions: CtaAction[];
};

const ACTION_CLASSES: Record<CtaAction["variant"], string> = {
  primary:
    "border-yellow-400 bg-yellow-400 text-black hover:bg-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
  outline:
    "border-white/25 text-white hover:border-yellow-400 hover:text-yellow-400",
};

/**
 * The gold closing band that ends a page.
 *
 * The radial gradient is `aria-hidden` decoration behind the content, not a
 * background on the text container — keeping them separate is what stops the
 * gradient from washing out the contrast of the copy sitting on it.
 */
export function CtaBand({ eyebrow, heading, body, actions }: CtaBandProps) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_50%_0%,rgba(230,186,53,0.12),transparent_70%)]"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 text-center md:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-yellow-400">
          {eyebrow}
        </p>

        <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          {heading}
        </h2>

        {body && (
          <p className="max-w-xl text-sm font-light leading-relaxed text-white/70 md:text-base">
            {body}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {actions.map((action) => (
            <Link
              key={action.href + action.label}
              href={action.href}
              className={`inline-flex items-center justify-center rounded-sm border px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${ACTION_CLASSES[action.variant]}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
