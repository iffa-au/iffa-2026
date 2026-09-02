import Link from "next/link";

type SectionHeaderProps = {
  /** Gold mono eyebrow above the heading. */
  eyebrow: string;
  heading: string;
  subtitle?: string;
  /** Optional "view all →" link, right-aligned on wide viewports. */
  viewAllHref?: string;
  viewAllLabel?: string;
  /** `h2` everywhere except a page's own top-level heading. */
  as?: "h1" | "h2";
};

/**
 * The eyebrow / heading / optional-link cluster that opens nearly every section
 * in the Talent Lab. One component means the vertical rhythm cannot drift
 * between fifteen sections on the landing page and nine more routes after it.
 */
export function SectionHeader({
  eyebrow,
  heading,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="flex max-w-3xl flex-col gap-3.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-yellow-400">
          {eyebrow}
        </p>

        <Heading className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
          {heading}
        </Heading>

        {subtitle && (
          <p className="max-w-prose text-sm font-light leading-relaxed text-white/70 md:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="rounded-sm border-b border-yellow-400/50 pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-yellow-400 transition-colors hover:border-yellow-400 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          {viewAllLabel} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
