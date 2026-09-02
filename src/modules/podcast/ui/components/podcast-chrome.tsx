import type { ReactNode } from "react";
import Link from "next/link";

/**
 * The furniture the podcast pages share: section headings, the shapes shown
 * while CMS-Hub is answering, and the page as it looks before the first
 * episode is published.
 *
 * The loading shapes are skeletons rather than a spinner on purpose — they
 * hold the exact geometry of what replaces them, so the page settles into
 * place instead of jumping when the data lands.
 */

export const SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";

/** Matches the eyebrow used across the site's editorial sections. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-500">
      {children}
    </span>
  );
}

/**
 * The site's section-header idiom: a title, then a rule running to the edge.
 * Same shape as the one on the news and IFFA Global pages.
 */
export function SectionHeading({
  title,
  accent,
  children,
}: {
  title: string;
  /** Rendered in yellow after the title, as on the news page. */
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
      <h2
        className="whitespace-nowrap text-2xl font-bold text-white sm:text-3xl"
        style={{ fontFamily: SERIF }}
      >
        {title} {accent && <span className="text-yellow-500">{accent}</span>}
      </h2>
      <div className="hidden h-px flex-1 bg-gradient-to-r from-white/20 to-transparent sm:block" />
      {children}
    </div>
  );
}

export function PodcastCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video w-full rounded-2xl border border-white/10 bg-white/[0.05]" />
      <div className="px-1 pt-5">
        <div className="h-2.5 w-24 rounded bg-white/[0.07]" />
        <div className="mt-4 h-4 w-11/12 rounded bg-white/[0.07]" />
        <div className="mt-2 h-4 w-2/3 rounded bg-white/[0.07]" />
        <div className="mt-5 h-px w-full bg-white/10" />
        <div className="mt-4 h-2.5 w-28 rounded bg-white/[0.07]" />
      </div>
    </div>
  );
}

export function PodcastGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <PodcastCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PodcastHeroSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video w-full rounded-2xl border border-white/10 bg-white/[0.05]" />
      <div className="mx-auto mt-9 flex max-w-3xl flex-col items-center lg:mt-11">
        <div className="h-2.5 w-40 rounded bg-white/[0.07]" />
        <div className="mt-6 h-9 w-11/12 rounded bg-white/[0.07]" />
        <div className="mt-3 h-9 w-2/3 rounded bg-white/[0.07]" />
        <div className="mt-7 h-3.5 w-10/12 rounded bg-white/[0.06]" />
        <div className="mt-2.5 h-3.5 w-7/12 rounded bg-white/[0.06]" />
        <div className="mt-8 h-2.5 w-56 rounded bg-white/[0.07]" />
      </div>
    </div>
  );
}

/**
 * Shown when CMS-Hub has nothing published, and when it could not be reached.
 * Deliberately the same shape in both cases — a visitor can do nothing about
 * either, and a stack trace in the middle of an editorial page helps no one.
 * The distinction that matters (an error) is still surfaced in `message`.
 */
export function PodcastEmptyState({
  title = "No podcasts yet",
  message = "New conversations and stories are coming soon.",
  action,
}: {
  title?: string;
  message?: string;
  /** A way onward, for the states a visitor can actually act on. */
  action?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center sm:py-32">
      <div className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent" />
      <h2
        className="text-2xl font-bold text-white sm:text-3xl"
        style={{ fontFamily: SERIF }}
      >
        {title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-white/50">{message}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-8 inline-flex items-center rounded-md border border-white/20 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-yellow-500 hover:text-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
