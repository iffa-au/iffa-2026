import Link from "next/link";

import type { Resource } from "../../lib/types";

/**
 * One row in the resource library.
 *
 * No resource file exists yet, so every `href` is currently `null` and the
 * action renders as a disabled `<button>` with `aria-disabled` and a plain-text
 * reason beside it. It is never a dead `<a>` and never a clickable `<div>`:
 * both of those look live and go nowhere, which is worse than an honest
 * disabled control.
 *
 * Populating `href` in `resources-data.ts` swaps in a real `<Link>` with no
 * layout change and no edit here.
 */
export function ResourceRow({
  resource,
  showTags = false,
}: {
  resource: Resource;
  /**
   * Shows the topic tags and career stage under the title. On the library page
   * they explain what the topic chips are filtering; in the landing-page
   * preview, where there are no filters, they would be noise.
   */
  showTags?: boolean;
}) {
  const isInert = resource.href === null;

  return (
    <li className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-white/8 bg-white/[0.03] px-5 py-4 last:border-b-0 sm:flex-nowrap">
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-sm border border-white/15 font-mono text-[9px] tracking-[0.06em] text-yellow-400"
      >
        {resource.badge}
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[15px] font-semibold text-white">{resource.title}</span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/45">
          {resource.meta}
        </span>

        {showTags && (
          <span className="flex flex-wrap gap-1.5 pt-1">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-white/15 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/80"
              >
                {tag}
              </span>
            ))}
            <span className="rounded-sm border border-yellow-400/35 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-yellow-400">
              {resource.stage}
            </span>
          </span>
        )}
      </span>

      {isInert ? (
        <span className="flex flex-none items-center gap-2.5">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="cursor-not-allowed rounded-sm border border-white/12 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35"
          >
            {resource.actionLabel}
          </button>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
            Coming soon
          </span>
        </span>
      ) : (
        <Link
          href={resource.href as string}
          className="flex-none rounded-sm border border-yellow-400/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-yellow-400 transition-colors hover:border-yellow-400 hover:bg-yellow-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          {resource.actionLabel} <span aria-hidden="true">→</span>
        </Link>
      )}
    </li>
  );
}

/** Bordered container that draws the list as one panel. */
export function ResourceList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex flex-col overflow-hidden rounded-xl border border-white/10">
      {children}
    </ul>
  );
}
