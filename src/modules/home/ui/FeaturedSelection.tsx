"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FeaturedFilm } from "@/modules/home/data/featured-films";
import { fetchFeaturedFilms } from "@/modules/home/lib/featured-films-api";

const INTERVAL_MS = 5000;
const SLIDE_MS = 450;

const mod = (n: number, m: number) => ((n % m) + m) % m;

function SlideContent({ film }: { film: FeaturedFilm }) {
  // A one-word title leaves `titlePart1` empty, so the joining space has to
  // go with it — otherwise the heading opens on an indent.
  const title = [film.titlePart1, film.titlePart2].filter(Boolean).join(" ");
  const metadata: [string, string][] = [
    ["Director", film.director],
    ["Genre", film.genre],
    ["Runtime", film.runtime],
    ["Country", film.country],
  ];

  return (
    // From `lg` the whole row fits one screen: the slide takes what the
    // viewport has left after the header and this section's own heading,
    // padding and dots (~220px), and the poster takes its width from that
    // height rather than from half the row — a half-width portrait poster
    // was ~900px tall.
    <div className="flex flex-col items-center gap-8 lg:h-[clamp(420px,calc(100svh-var(--header-h)-220px),600px)] lg:flex-row lg:items-stretch lg:gap-10">
      <div className="group aspect-[2/3] w-full max-w-xs shrink-0 overflow-hidden rounded-sm shadow-2xl lg:h-full lg:w-auto lg:max-w-none">
        <img
          src={film.posterUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex w-full min-w-0 flex-col justify-center overflow-hidden rounded-sm border border-white/5 bg-zinc-900/30 p-6 md:p-8 lg:flex-1 xl:p-10">
        <div className="mb-4 text-yellow-500">
          <span className="text-xs font-bold uppercase tracking-[0.3em]">
            * {film.badge}
          </span>
        </div>
        <h3 className="mb-5 text-3xl font-bold leading-none text-white md:text-4xl xl:text-5xl">
          {film.titlePart1}
          {film.titlePart1 && film.titlePart2 ? " " : ""}
          <span className="text-yellow-500">{film.titlePart2}</span>
        </h3>
        {film.description && (
          <p className="mb-6 line-clamp-4 text-base font-light leading-relaxed text-gray-400 lg:line-clamp-3">
            {film.description}
          </p>
        )}
        <div className="mb-7 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-white/10 pt-5 lg:grid-cols-4">
          {/* CMS records can be missing any of these, so a blank one is
              dropped rather than left as an orphaned label. */}
          {metadata.map(([label, value]) =>
            value ? (
              <div key={label}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
                  {label}
                </p>
                <p className="font-medium text-white">{value}</p>
              </div>
            ) : null,
          )}
        </div>
        {film.trailerUrl && (
          <a
            href={film.trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-fit rounded-sm border border-yellow-500 px-8 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black"
          >
            Watch Trailer
          </a>
        )}
      </div>
    </div>
  );
}

const FeaturedSelection = () => {
  // null while loading. Curated in cms-hub; see featured-films-api.ts for when
  // the hand-written list stands in.
  const [films, setFilms] = useState<FeaturedFilm[] | null>(null);
  const count = films?.length ?? 0;

  useEffect(() => {
    const controller = new AbortController();
    fetchFeaturedFilms(controller.signal)
      .then(setFilms)
      .catch(() => {
        // Aborted on unmount — nothing to update.
      });
    return () => controller.abort();
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  // translateX percentage on the 300%-wide track. -33.333% shows the middle (current) slot.
  const [trackX, setTrackX] = useState(-(100 / 3));
  const [sliding, setSliding] = useState(false);
  const [paused, setPaused] = useState(false);
  // The slide being moved to, while it is moving. The track only ever holds
  // three slots, so a jump to a distant film has to load that film into the
  // incoming slot instead of stepping through everything in between.
  const [incoming, setIncoming] = useState<{
    index: number;
    dir: "left" | "right";
  } | null>(null);
  const lockRef = useRef(false);
  const activeRef = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      if (count < 2 || lockRef.current || index === activeRef.current) return;
      lockRef.current = true;

      // Shortest way round the ring, so the dots never scroll the long way
      // through five films to reach the neighbour on the other side. Ties go
      // forward, which matches the direction the autoplay is already moving.
      const dir =
        mod(index - activeRef.current, count) <=
        mod(activeRef.current - index, count)
          ? "left"
          : "right";

      setIncoming({ index, dir });
      setSliding(true);
      // Animate to the next or previous slot
      setTrackX(dir === "left" ? -(200 / 3) : 0);

      setTimeout(() => {
        activeRef.current = index;
        setActiveIndex(index);
        // Snap back to middle slot without transition
        setIncoming(null);
        setSliding(false);
        setTrackX(-(100 / 3));
        lockRef.current = false;
      }, SLIDE_MS);
    },
    [count],
  );

  const next = useCallback(
    () => goTo(mod(activeRef.current + 1, count)),
    [goTo, count],
  );
  const prev = useCallback(
    () => goTo(mod(activeRef.current - 1, count)),
    [goTo, count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, next, count]);

  // Emptied in the CMS: the row is hidden rather than drawn as a blank frame.
  if (films && films.length === 0) return null;

  const heading = (
    <div className="mx-auto max-w-[1400px] px-6 md:px-20">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
        Featured <span className="text-yellow-500">Selection</span>
      </h2>
    </div>
  );

  // Holds the slide's height while loading so the trailers below don't jump.
  if (!films) {
    return (
      <section className="w-full bg-black py-10 md:py-12" aria-busy="true">
        {heading}
        <div className="mx-auto h-[600px] max-w-[1400px] px-6 md:px-20 lg:h-[clamp(420px,calc(100svh-var(--header-h)-220px),600px)]" />
      </section>
    );
  }

  const slots = [
    films[
      incoming?.dir === "right" ? incoming.index : mod(activeIndex - 1, count)
    ],
    films[activeIndex],
    films[
      incoming?.dir === "left" ? incoming.index : mod(activeIndex + 1, count)
    ],
  ];

  return (
    <section
      className="w-full bg-black py-10 md:py-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {heading}

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-20">
        <div className="overflow-hidden">
          <div
            style={{
              display: "flex",
              width: "300%",
              transform: `translateX(${trackX}%)`,
              transition: sliding
                ? `transform ${SLIDE_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
                : "none",
            }}
          >
            {slots.map((film, i) => (
              <div key={i} style={{ width: "33.333%" }}>
                <SlideContent film={film} />
              </div>
            ))}
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous film"
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 p-2 text-yellow-500 transition-opacity duration-200 hover:opacity-70"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>

            <button
              onClick={next}
              aria-label="Next film"
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 p-2 text-yellow-500 transition-opacity duration-200 hover:opacity-70"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        {count > 1 &&
          films.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-10 bg-yellow-500" : "w-4 bg-white/20"
              }`}
            />
          ))}
      </div>
    </section>
  );
};

export default FeaturedSelection;
