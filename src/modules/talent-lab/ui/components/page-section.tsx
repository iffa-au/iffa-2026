/**
 * The shared band: container, horizontal padding and vertical rhythm.
 *
 * Extracted from the landing page in Phase 2 once nine more routes needed the
 * identical shell. Ten copies of `max-w-7xl px-5 md:px-8 py-16 md:py-24` is ten
 * chances for one page's spacing to drift away from the section.
 */
export function PageSection({
  children,
  className = "",
  bordered = true,
}: {
  children: React.ReactNode;
  className?: string;
  /**
   * The hairline rule above the band. Off for the first section on a page,
   * where the header already draws its own bottom border.
   *
   * A boolean rather than a `border-t-0` override in `className`: Tailwind
   * resolves conflicting utilities by stylesheet order, not by the order they
   * appear in the attribute, so "add the negating class after" is not a rule
   * you can rely on.
   */
  bordered?: boolean;
}) {
  return (
    <section
      className={`py-16 md:py-24 ${bordered ? "border-t border-white/8" : ""} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">{children}</div>
    </section>
  );
}

/** A faint top-down wash, used to alternate the bands. */
export const TINTED = "bg-gradient-to-b from-white/[0.02] to-transparent";
