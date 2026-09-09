"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  PodcastGridSkeleton,
  PodcastHeroSkeleton,
  PodcastLoadError,
  SectionHeading,
  SERIF,
} from "../components/podcast-chrome";
import { PodcastComingSoon } from "../components/podcast-coming-soon";
import { PodcastPlayer } from "../components/podcast-player";

/**
 * The Podcast landing page.
 *
 * A masthead, then a playable hero, then the recent conversations, then the
 * back catalogue. The hero is whichever episode is starred in CMS-Hub, falling
 * back to the newest published one when nothing is; everything else follows in
 * publish order. No ordering is maintained here.
 *
 * The hero holds the only player on the page. The rest are posters that link
 * to an episode's own page, which is where a second player is worth its weight.
 *
 * Three outcomes are kept strictly apart. A request still in flight shows
 * skeletons; a request that came back with nothing shows the illustrated
 * "between episodes" state; a request that actually failed shows an error with
 * a retry. Collapsing the last two — which the page used to do — tells a
 * visitor the site is broken on the day before the first episode ships.
 */

const RECENT_COUNT = 3;

/** The breadth of the show, said structurally rather than in a longer sentence. */
const ON_THE_SHOW = [
  "Conversations & interviews",
  "Creative journeys",
  "Cinema & culture",
  "Emerging voices",
];

export function PodcastPage() {
  const scope = useRef<HTMLDivElement>(null);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  // Bumped by the retry button; the effect below keys off it, so retrying is
  // the same code path as the first load rather than a second copy of it.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setFailed(false);
        setPodcasts(await fetchPodcasts(controller.signal));
      } catch (e) {
        // An aborted request is this effect cleaning up after itself, not a
        // failure — treating it as one would flash an error on every unmount.
        if (e instanceof Error && e.name !== "AbortError") setFailed(true);
      } finally {
        // Only the live request may clear the loading flag. On a retry, React
        // aborts the previous request before running this effect again, and
        // that rejection settles a microtask *later* — after the new attempt
        // has already set the flag. Unguarded, it would switch the skeletons
        // off while the replacement request is still in the air.
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // The hero is a choice made in the CMS, not a position in the list, so the
  // rest is everything *except* it rather than everything after it — a
  // featured episode from the middle of the archive must not leave a gap where
  // it used to be, or appear twice.
  const featured = pickFeatured(podcasts);
  const rest = podcasts.filter((podcast) => podcast.id !== featured?.id);
  const recent = rest.slice(0, RECENT_COUNT);
  const archive = rest.slice(RECENT_COUNT);

  // The entrance sequence covers the featured hero *and* the between-episodes
  // state — both carry `data-enter` markers. Only a failed load has nothing to
  // animate in.
  usePodcastMotion(scope, !loading && !failed);

  return (
    <div ref={scope} className="min-h-screen bg-black text-white">
      {/* -------------------------------- masthead ------------------------------- */}
      {/* Two columns rather than a stacked title and paragraph: the headline
          states what the show is, and the column beside it states how wide it
          reaches. Saying the range structurally keeps the positioning from
          living inside one sentence that has to be rewritten every time the
          show covers something new.

          The top padding is generous by necessity as well as by taste — the
          fixed header is taller than the 88px the shared layout reserves for
          it, so a short pt- here would tuck the eyebrow under the nav. */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(70% 100% at 50% 0%, rgba(234,179,8,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 sm:pt-20 lg:pt-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow>Podcast</Eyebrow>
              <h1
                className="mt-4 text-4xl leading-[1.05] font-bold text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: SERIF }}
              >
                Conversations worth listening to.
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
                Ideas, journeys and stories from the people shaping cinema,
                creativity and culture — recorded in full and played here.
              </p>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/35">
                On the show
              </span>
              {/* Hairline rows, the same density the archive uses. Not
                  numbered: these are the range of the show, not a sequence. */}
              <ul className="mt-5 border-t border-white/10">
                {ON_THE_SHOW.map((strand) => (
                  <li
                    key={strand}
                    className="border-b border-white/10 py-3 text-sm text-white/55"
                  >
                    {strand}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 h-px w-full bg-gradient-to-r from-yellow-500/40 via-white/10 to-transparent" />
        </div>
      </section>

      {/* -------------------------------- the hero ------------------------------- */}
      {loading ? (
        <section className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
          <PodcastHeroSkeleton />
        </section>
      ) : failed ? (
        <PodcastLoadError onRetry={retry} />
      ) : !featured ? (
        <PodcastComingSoon />
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
