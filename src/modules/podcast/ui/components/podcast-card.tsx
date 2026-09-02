"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import {
  formatPodcastDate,
  formatRuntime,
  podcastHref,
  posterCandidates,
  type Podcast,
} from "../../lib/podcasts";
import { PodcastPoster } from "./podcast-poster";

type PodcastCardProps = {
  podcast: Podcast;
  /** Raise the poster's loading priority for the first row of the archive. */
  priority?: boolean;
};

/**
 * One episode in the archive.
 *
 * The whole card is a single link to the episode's own IFFA page, and it holds
 * no player: an archive of live iframes would mean a dozen YouTube players
 * booting on a page where nobody has pressed play yet. The play mark here is
 * an affordance, not a control — the video starts on the page it links to.
 *
 * One link rather than a link plus a separate button, so keyboard users get a
 * single tab stop and screen readers get one destination — named explicitly,
 * because the default accessible name is everything inside the link in visual
 * order, and that starts at the runtime chip sitting over the artwork:
 * "52 min Production Ep 06 Oman as a Location…".
 */
export function PodcastCard({ podcast, priority = false }: PodcastCardProps) {
  const runtime = formatRuntime(podcast.durationMinutes);
  const published = formatPodcastDate(podcast.publishedAt);
  const eyebrow = podcast.category || "Podcast";

  return (
    <Link
      href={podcastHref(podcast.slug)}
      aria-label={[podcast.title, eyebrow, published].filter(Boolean).join(" — ")}
      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
    >
      <article className="flex h-full flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition-colors duration-500 group-hover:border-yellow-500/40">
          <PodcastPoster
            candidates={posterCandidates(podcast)}
            alt={`${podcast.title} episode artwork`}
            loading={priority ? "eager" : "lazy"}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />

          {/* Sits at rest so the artwork keeps its footing against the page,
              then deepens on hover to lift the play mark clear of it. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/50 backdrop-blur-sm transition-all duration-300 group-hover:border-yellow-400 group-hover:bg-yellow-400 motion-reduce:transition-none">
              <Play className="ml-0.5 h-4 w-4 fill-white text-white transition-colors duration-300 group-hover:fill-black group-hover:text-black" />
            </span>
            {runtime && (
              <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
                {runtime}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col px-1 pt-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold uppercase tracking-[0.25em]">
            <span className="text-yellow-500">{eyebrow}</span>
            {podcast.episodeNumber > 0 && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-white/45">
                  Ep {String(podcast.episodeNumber).padStart(2, "0")}
                </span>
              </>
            )}
          </div>

          <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-white transition-colors duration-300 group-hover:text-yellow-500 sm:text-xl">
            {podcast.title}
          </h3>

          {podcast.excerpt && (
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-white/55">
              {podcast.excerpt}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            {published && (
              <time
                dateTime={podcast.publishedAt}
                className="text-xs text-white/40"
              >
                {published}
              </time>
            )}
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 group-hover:text-yellow-500">
              Explore Episode
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
