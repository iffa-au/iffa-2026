import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbCrumb = {
  label: string;
  /** Omit on the final crumb — the current page is not a link. */
  href?: string;
};

export function FestivalBreadcrumb({ crumbs }: { crumbs: BreadcrumbCrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-white/50 sm:text-xs">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={crumb.label} className="flex items-center gap-x-1.5">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="rounded-sm transition-colors hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-yellow-400">
                  {crumb.label}
                </span>
              )}

              {!isLast && (
                <ChevronRight aria-hidden="true" className="h-3 w-3 text-white/30" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
