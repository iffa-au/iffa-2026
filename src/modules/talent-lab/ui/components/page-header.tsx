import { Breadcrumb, type BreadcrumbCrumb } from "@/modules/shared/components/breadcrumb";

type PageHeaderProps = {
  crumbs: BreadcrumbCrumb[];
  /** Optional gold mono line above the title, e.g. an event's format. */
  eyebrow?: string;
  title: string;
  /** The lede. One paragraph, capped so it stays readable on wide screens. */
  intro?: string;
  /** Status pills, badge legends, meta chips — anything above the title. */
  badges?: React.ReactNode;
  /** Anything below the intro. Buttons, notes, a legend row. */
  children?: React.ReactNode;
  /** Adds the gold-washed hero treatment used by the two detail pages. */
  tone?: "plain" | "hero";
};

const TONE_BACKGROUND =
  "bg-[repeating-linear-gradient(112deg,rgba(255,255,255,0.028)_0_2px,transparent_2px_11px),radial-gradient(80%_90%_at_76%_12%,rgba(230,186,53,0.13),transparent_62%),linear-gradient(180deg,#131118,#000)]";

/**
 * The opening band of every Talent Lab page except the landing.
 *
 * Breadcrumb, `<h1>`, lede — one component, so all nine routes agree on where
 * the page title sits and no page accidentally ships two `<h1>`s or none. The
 * breadcrumb is the promoted shared component, not a local copy.
 */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  intro,
  badges,
  children,
  tone = "plain",
}: PageHeaderProps) {
  const isHero = tone === "hero";

  return (
    <section
      className={`relative overflow-hidden border-b border-white/8 ${isHero ? "" : "bg-black"}`}
    >
      {isHero && <div aria-hidden="true" className={`absolute inset-0 ${TONE_BACKGROUND}`} />}

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-8 md:px-8 md:pb-14 md:pt-12">
        <Breadcrumb crumbs={crumbs} />

        <div className="flex flex-col gap-5">
          {badges && <div className="flex flex-wrap items-center gap-2.5">{badges}</div>}

          {eyebrow && (
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-yellow-400">
              {eyebrow}
            </p>
          )}

          <h1 className="max-w-4xl text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {intro && (
            <p className="max-w-3xl text-sm font-light leading-relaxed text-white/70 md:text-base">
              {intro}
            </p>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
