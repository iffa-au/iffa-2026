"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  fetchPodcastBySlug,
  fetchPodcasts,
  formatPodcastDate,
  formatRuntime,
  formatTimestampDate,
  type Podcast,
} from "../../lib/podcasts";
import { usePodcastMotion } from "../../lib/use-podcast-motion";
import { PodcastBackdrop } from "../components/podcast-backdrop";
import { PodcastCard } from "../components/podcast-card";
import {
  Eyebrow,
  PodcastEmptyState,
  SectionHeading,
  SERIF,
} from "../components/podcast-chrome";
import { PodcastPlayer } from "../components/podcast-player";

/**
 * One episode, on its own page.
 *
 * This is the page a card links to and the page the full conversation plays
 * on, so the player is mounted with the page rather than behind a poster —
 * watching is why the visitor is here, and the click they would have to make
 * has already happened on the card. For the same reason it leads the page:
 * the title and metadata read centred beneath it, matching the hero on the
 * archive, and the short description is left off entirely — a visitor who has
 * arrived from a card has already read it, and the full write-up is directly
 * below.
 *
 * Two requests in parallel: the episode, and a short list for the rail at the
 * bottom. The rail is capped server-side so continuing to browse never costs
 * the whole archive.
 */

const MORE_COUNT = 3;
/** One over, so dropping the current episode still leaves a full row. */
const MORE_FETCH_LIMIT = MORE_COUNT + 1;

type PodcastDetailPageProps = {
  slug: string;
};

export function PodcastDetailPage({ slug }: PodcastDetailPageProps) {
  const scope = useRef<HTMLDivElement>(null);
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [more, setMore] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [episode, recent] = await Promise.all([
          fetchPodcastBySlug(slug, controller.signal),
          // A failed rail must not take the episode down with it — the page is
          // still complete without somewhere to go next.
          fetchPodcasts(controller.signal, MORE_FETCH_LIMIT).catch(() => []),
        ]);
        setPodcast(episode);
        setMore(recent.filter((item) => item.slug !== slug).slice(0, MORE_COUNT));
      } catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          setError("We could not load this episode right now.");
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [slug]);

  usePodcastMotion(scope, !loading && !!podcast);

  if (loading) return <DetailSkeleton />;

  if (error || !podcast) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <BackLink />
        </div>
        <PodcastEmptyState
          title={error ? "Episode unavailable" : "Episode not found"}
          message={
            error ??
            "This conversation may have moved, or is no longer published."
          }
          action={{ label: "All episodes", href: "/podcast" }}
        />
      </div>
    );
  }

  const published = formatPodcastDate(podcast.publishedAt);
  const runtime = formatRuntime(podcast.durationMinutes);

  return (
    <div ref={scope} className="min-h-screen bg-black text-white">
      {/* ------------------------- editorial header + player ------------------------- */}
      <article>
        <header className="relative overflow-hidden">
          <PodcastBackdrop podcast={podcast} />

          <div className="relative mx-auto max-w-5xl px-6 pb-14 pt-12 lg:pb-16 lg:pt-14">
            <div data-enter>
              <BackLink />
            </div>

            <div data-enter className="mt-8">
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
                  mode="embed"
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
                <Eyebrow>Podcast</Eyebrow>
                {podcast.category && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="text-white/50">{podcast.category}</span>
                  </>
                )}
              </div>

              <h1
                data-enter
                className="mt-5 text-3xl leading-[1.08] font-bold text-white sm:text-4xl lg:text-5xl"
                style={{ fontFamily: SERIF }}
              >
                {podcast.title}
              </h1>

              <div
                data-enter
                className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-white/45"
              >
                {published && (
                  <span>
                    Published ·{" "}
                    <time dateTime={podcast.publishedAt} className="text-white/70">
                      {published}
                    </time>
                  </span>
                )}
                {podcast.episodeNumber > 0 && (
                  <>
                    <span className="text-white/20">•</span>
                    <span>Episode {podcast.episodeNumber}</span>
                  </>
                )}
                {runtime && (
                  <>
                    <span className="text-white/20">•</span>
                    <span>{runtime}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* -------------------------- story + metadata -------------------------- */}
        <div className="mx-auto max-w-5xl px-6 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-14">
            <div className="lg:col-span-2">
              {podcast.paragraphs.length > 0 ? (
                <div data-reveal-group className="space-y-6">
                  {podcast.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={
                        index === 0
                          ? "text-base leading-[1.85] text-white/80 sm:text-lg"
                          : "text-base leading-[1.85] text-white/65"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-white/45">
                  Press play above for the full conversation.
                </p>
              )}
            </div>

            <aside className="lg:col-span-1">
              <PodcastMeta podcast={podcast} />
            </aside>
          </div>
        </div>
      </article>

      {/* ---------------------------- more podcasts ---------------------------- */}
      {more.length > 0 && (
        <section className="border-t border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
            <SectionHeading title="More" accent="Podcasts">
              <Link
                href="/podcast"
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45 transition-colors hover:text-yellow-500 sm:shrink-0"
              >
                All episodes
              </Link>
            </SectionHeading>
            <div
              data-reveal-group
              className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {more.map((item) => (
                <PodcastCard key={item.id} podcast={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/podcast"
      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to Podcasts
    </Link>
  );
}

/**
 * The details panel.
 *
 * Every row is conditional and the panel itself disappears when nothing
 * qualifies — CMS-Hub leaves most of these blank on most episodes, and a
 * column of labels with nothing beside them looks like a page that failed to
 * load rather than one with less to say.
 */
function PodcastMeta({ podcast }: { podcast: Podcast }) {
  const updated = formatTimestampDate(podcast.updatedAt);
  const published = formatPodcastDate(podcast.publishedAt);

  const rows: { label: string; value: string }[] = [
    podcast.host && { label: "Host", value: podcast.host },
    podcast.guests.length > 0 && {
      label: podcast.guests.length === 1 ? "Guest" : "Guests",
      value: podcast.guests.join(", "),
    },
    podcast.category && { label: "Series", value: podcast.category },
    podcast.relatedFestival && { label: "Festival", value: podcast.relatedFestival },
    podcast.durationMinutes > 0 && {
      label: "Runtime",
      value: formatRuntime(podcast.durationMinutes),
    },
    published && { label: "Published", value: published },
    // Only when it says something the publish date does not.
    updated && updated !== published && { label: "Updated", value: updated },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  if (rows.length === 0) return null;

  return (
    <div
      data-reveal-group
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-28"
    >
      <h2 className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-500">
        Episode details
      </h2>
      <dl className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-white/75">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-black">
      <div className="mx-auto max-w-5xl px-6 pt-12">
        <div className="h-2.5 w-36 rounded bg-white/[0.07]" />
        <div className="mt-8 aspect-video w-full rounded-2xl border border-white/10 bg-white/[0.05]" />
        <div className="mx-auto mt-9 flex max-w-3xl flex-col items-center">
          <div className="h-2.5 w-28 rounded bg-white/[0.07]" />
          <div className="mt-6 h-9 w-11/12 rounded bg-white/[0.07]" />
          <div className="mt-3 h-9 w-2/3 rounded bg-white/[0.07]" />
          <div className="mt-7 h-2.5 w-56 rounded bg-white/[0.06]" />
        </div>
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <div className="h-3.5 w-full rounded bg-white/[0.06]" />
            <div className="h-3.5 w-11/12 rounded bg-white/[0.06]" />
            <div className="h-3.5 w-10/12 rounded bg-white/[0.06]" />
            <div className="h-3.5 w-full rounded bg-white/[0.06]" />
          </div>
          <div className="h-48 rounded-2xl border border-white/10 bg-white/[0.04] lg:col-span-1" />
        </div>
      </div>
    </div>
  );
}
