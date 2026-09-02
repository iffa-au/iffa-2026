"use client";

import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";

import {
  formatPodcastDate,
  formatRuntime,
  podcastHref,
  posterCandidates,
  type Podcast,
} from "../../lib/podcasts";
import { PodcastPoster } from "./podcast-poster";

type PodcastArchiveRowProps = {
  podcast: Podcast;
  /** Editorial index, printed at the head of the row: "01", "02", … */
  position: number;
};

/**
 * One line of the back catalogue.
 *
 * Deliberately a different object from `PodcastCard`. The recent episodes are
 * being shown off, so they get artwork at full width; the archive is being
 * scanned, so it gets a dense index a visitor can run their eye down — a
 * numbered row, a small poster, and the title doing the work. Two densities
 * for two jobs, rather than the same card grid repeated until the page ends.
 *
 * The link is named explicitly for the same reason PodcastCard is: left to
 * itself the announced name would open with the decorative index number.
 */
export function PodcastArchiveRow({ podcast, position }: PodcastArchiveRowProps) {
  const runtime = formatRuntime(podcast.durationMinutes);
  const published = formatPodcastDate(podcast.publishedAt);

  return (
    <Link
      href={podcastHref(podcast.slug)}
      aria-label={[podcast.title, podcast.category || "Podcast", published]
        .filter(Boolean)
        .join(" — ")}
      className="group block border-b border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <article className="flex items-center gap-5 py-6 transition-colors duration-500 sm:gap-8 sm:py-7">
        <span
          aria-hidden="true"
          className="hidden w-10 shrink-0 self-start pt-1 text-xs font-bold tabular-nums tracking-[0.15em] text-white/25 transition-colors duration-300 group-hover:text-yellow-500 lg:block"
        >
          {String(position).padStart(2, "0")}
        </span>

        <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 transition-colors duration-500 group-hover:border-yellow-500/40 sm:w-44 lg:w-52">
          <PodcastPoster
            candidates={posterCandidates(podcast)}
            alt={`${podcast.title} episode artwork`}
            sizes="(min-width: 1024px) 208px, (min-width: 640px) 176px, 112px"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span className="absolute inset-0 bg-black/25 transition-opacity duration-500 group-hover:opacity-0" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition-all duration-300 group-hover:border-yellow-400 group-hover:bg-yellow-400 sm:h-10 sm:w-10">
              <Play className="ml-0.5 h-3 w-3 fill-white text-white transition-colors duration-300 group-hover:fill-black group-hover:text-black sm:h-3.5 sm:w-3.5" />
            </span>
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold uppercase tracking-[0.25em]">
            <span className="text-yellow-500">{podcast.category || "Podcast"}</span>
            {podcast.episodeNumber > 0 && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-white/45">
                  Ep {String(podcast.episodeNumber).padStart(2, "0")}
                </span>
              </>
            )}
          </div>

          <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-white transition-colors duration-300 group-hover:text-yellow-500 sm:text-lg lg:text-xl">
            {podcast.title}
          </h3>

          {podcast.excerpt && (
            <p className="mt-2 hidden line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/50 sm:block">
              {podcast.excerpt}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40 lg:hidden">
            {published && <time dateTime={podcast.publishedAt}>{published}</time>}
            {published && runtime && <span className="text-white/20">•</span>}
            {runtime && <span>{runtime}</span>}
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-2 self-start pt-1 text-right lg:flex">
          {published && (
            <time dateTime={podcast.publishedAt} className="text-xs text-white/40">
              {published}
            </time>
          )}
          {runtime && <span className="text-xs text-white/30">{runtime}</span>}
        </div>

        <ArrowUpRight className="hidden h-5 w-5 shrink-0 self-start text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-yellow-500 motion-reduce:transition-none lg:block" />
      </article>
    </Link>
  );
}
