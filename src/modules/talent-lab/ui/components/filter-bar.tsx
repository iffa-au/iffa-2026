/**
 * The tinted band that holds a page's filter controls.
 *
 * Four routes filter a collection and all four put the controls in the same
 * place, immediately under the page header and visually separated from the
 * results. Keeping the band here means a page contributes only its own chip
 * rows, not another copy of the chrome around them.
 */
export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <section
      aria-label="Filters"
      className="border-b border-white/8 bg-white/[0.02] py-7 md:py-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:px-8">{children}</div>
    </section>
  );
}

/** The responsive grid the chip groups sit in, side by side where there is room. */
export function FilterGroups({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
  );
}
