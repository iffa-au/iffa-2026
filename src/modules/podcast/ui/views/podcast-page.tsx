"use client";

import { useEffect, useRef, useState } from "react";

import {
  fetchPodcasts,
  formatPodcastDate,
  formatRuntime,
  pickFeatured,
  type Podcast,
} from "../../lib/podcasts";
import { usePodcastMotion } from "../../lib/use-podcast-motion";
import { PodcastArchiveRow } from "../components/podcast-archive-row";
import { PodcastBackdrop } from "../components/podcast-backdrop";
import { PodcastCard } from "../components/podcast-card";
import {
  Eyebrow,
  PodcastEmptyState,
  PodcastGridSkeleton,
  PodcastHeroSkeleton,
  SectionHeading,
  SERIF,
} from "../components/podcast-chrome";
import { PodcastPlayer } from "../components/podcast-player";

/**
 * The Podcast landing page.
 *
 * Introduction, then a playable hero, then the recent conversations, then the
 * back catalogue. The hero is whichever episode is starred in CMS-Hub, falling
 * back to the newest published one when nothing is; everything else follows in
 * publish order. No ordering is maintained here.
 *
 * The hero holds the only player on the page. The rest are posters that link
 * to an episode's own page, which is where a second player is worth its weight.
 */

const RECENT_COUNT = 3;

export function PodcastPage() {
  const scope = useRef<HTMLDivElement>(null);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setPodcasts(await fetchPodcasts(controller.signal));
      } catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          setError("We could not load the podcast right now.");
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  // The hero is a choice made in the CMS, not a position in the list, so the
  // rest is everything *except* it rather than everything after it — a
  // featured episode from the middle of the archive must not leave a gap where
  // it used to be, or appear twice.
  const featured = pickFeatured(podcasts);
  const rest = podcasts.filter((podcast) => podcast.id !== featured?.id);
  const recent = rest.slice(0, RECENT_COUNT);
  const archive = rest.slice(RECENT_COUNT);

  usePodcastMotion(scope, !loading && !!featured);

  return (
    <div ref={scope} className="min-h-screen bg-black text-white">
      {/* ------------------------------ introduction ----------------------------- */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(70% 100% at 50% 0%, rgba(234,179,8,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-12 sm:pt-14">
          <Eyebrow>Podcast</Eyebrow>
          <h1
            className="mt-4 max-w-3xl text-4xl leading-[1.05] font-bold text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: SERIF }}
          >
            Stories Behind the Screen
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
            Conversations, perspectives and stories from the filmmakers, artists and
            voices shaping cinema — recorded with the people who make the work, and
            played here in full.
          </p>
          <div className="mt-8 h-px w-full bg-gradient-to-r from-yellow-500/40 via-white/10 to-transparent" />
        </div>
      </section>

      {/* -------------------------------- the hero ------------------------------- */}
      {loading ? (
        <section className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
          <PodcastHeroSkeleton />
        </section>
      ) : error ? (
        <PodcastEmptyState title="Podcast unavailable" message={error} />
      ) : !featured ? (
        <PodcastEmptyState />
      ) : (
        <FeaturedHero podcast={featured} />
      )}

      {/* ---------------------------- recent episodes ---------------------------- */}
      {loading ? (
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-8">
          <SectionHeading title="Latest" accent="Conversations" />
          <PodcastGridSkeleton count={RECENT_COUNT} />
        </section>
      ) : (
        recent.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 pb-20 pt-14 lg:pt-16">
            <SectionHeading title="Latest" accent="Conversations" />
            <div
              data-reveal-group
              className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {recent.map((podcast, index) => (
                <PodcastCard
                  key={podcast.id}
                  podcast={podcast}
                  priority={index === 0}
                />
              ))}
            </div>
          </section>
        )
      )}

      {/* ------------------------------- the archive ----------------------------- */}
      {archive.length > 0 && (
        <section className="border-t border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
            <SectionHeading title="The" accent="Archive">
              <span className="text-xs uppercase tracking-[0.25em] text-white/35 sm:shrink-0">
                {archive.length} episode{archive.length === 1 ? "" : "s"}
              </span>
            </SectionHeading>
            <div data-reveal-group className="border-t border-white/10">
              {archive.map((podcast, index) => (
                <PodcastArchiveRow
                  key={podcast.id}
                  podcast={podcast}
                  position={index + 1 + RECENT_COUNT + 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * The featured episode, playable where it stands.
 *
 * One column: the player runs the full width of the section and everything
 * else reads centred beneath it. The video is the thing being offered, so it
 * takes the width and gets there first; the title and metadata are what a
 * visitor checks *after* deciding whether to watch, and centred type under a
 * wide frame is the composition a title card already has.
 *
 * It also means desktop and mobile are the same layout at two sizes rather
 * than two arrangements, so nothing reflows into a different reading order.
 */
function FeaturedHero({ podcast }: { podcast: Podcast }) {
  const published = formatPodcastDate(podcast.publishedAt);
  const runtime = formatRuntime(podcast.durationMinutes);

  return (
    <section className="relative overflow-hidden">
      <PodcastBackdrop podcast={podcast} />

      <div className="relative mx-auto max-w-6xl px-6 py-10 lg:py-14">
        <div data-enter>
          {/* The glow is the only thing separating the player from a black
              page — a border alone reads as a hole rather than a screen. */}
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-70 blur-2xl"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 50%, rgba(234,179,8,0.18) 0%, transparent 100%)",
              }}
            />
            <PodcastPlayer
              podcast={podcast}
              mode="facade"
              priority
              className="relative shadow-2xl shadow-black/60"
            />
          </div>
        </div>

        <div className="mx-auto mt-9 max-w-3xl text-center lg:mt-11">
          <div
            data-enter
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] font-bold uppercase tracking-[0.3em]"
          >
            {/* Says which rule put this episode here, so an old episode at the
                top of the page does not read as a sorting bug. */}
            <span className="text-yellow-500">
              {podcast.isFeatured ? "Featured Episode" : "Latest Episode"}
            </span>
            {podcast.category && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-white/50">{podcast.category}</span>
              </>
            )}
          </div>

          <h2
            data-enter
            className="mt-5 text-3xl leading-[1.1] font-bold text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: SERIF }}
          >
            {podcast.title}
          </h2>

          {podcast.excerpt && (
            <p
              data-enter
              className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base"
            >
              {podcast.excerpt}
            </p>
          )}

          <div
            data-enter
            className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-white/45"
          >
            {published && (
              <span>
                Published ·{" "}
                <time dateTime={podcast.publishedAt} className="text-white/70">
                  {published}
                </time>
              </span>
            )}
            {runtime && (
              <>
                <span className="text-white/20">•</span>
                <span>{runtime}</span>
              </>
            )}
            {podcast.episodeNumber > 0 && (
              <>
                <span className="text-white/20">•</span>
                <span>Episode {podcast.episodeNumber}</span>
              </>
            )}
          </div>

          {podcast.guests.length > 0 && (
            <p data-enter className="mt-4 text-xs text-white/45">
              <span className="uppercase tracking-[0.2em] text-white/30">With</span>{" "}
              <span className="text-white/70">{podcast.guests.join(", ")}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
