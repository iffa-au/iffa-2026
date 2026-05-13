"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { featuredFilms, type FeaturedFilm } from "@/modules/home/data/featured-films";

const INTERVAL_MS = 5000;
const SLIDE_MS = 450;
const count = featuredFilms.length;

const mod = (n: number, m: number) => ((n % m) + m) % m;

function SlideContent({ film }: { film: FeaturedFilm }) {
  return (
    <div className="flex min-h-[600px] flex-col items-center gap-12 lg:flex-row lg:items-stretch">
      <div className="group w-full overflow-hidden rounded-sm shadow-2xl lg:w-1/2">
        <img
          src={film.posterUrl}
          alt={`${film.titlePart1} ${film.titlePart2}`}
          className="h-auto w-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex w-full flex-col justify-center rounded-sm border border-white/5 bg-zinc-900/30 p-8 md:p-12 lg:w-1/2">
        <div className="mb-6 text-yellow-500">
          <span className="text-xs font-bold uppercase tracking-[0.3em]">
            * {film.badge}
          </span>
        </div>
        <h3 className="mb-8 text-4xl font-bold leading-none text-white md:text-6xl">
          {film.titlePart1}{" "}
          <span className="text-yellow-500">{film.titlePart2}</span>
        </h3>
        <p className="mb-10 text-lg font-light leading-relaxed text-gray-400">
          {film.description}
        </p>
        <div className="mb-12 grid grid-cols-2 gap-x-4 gap-y-8 border-t border-white/10 pt-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Director
            </p>
            <p className="font-medium text-white">{film.director}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Genre
            </p>
            <p className="font-medium text-white">{film.genre}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Runtime
            </p>
            <p className="font-medium text-white">{film.runtime}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
              Country
            </p>
            <p className="font-medium text-white">{film.country}</p>
          </div>
        </div>
        <a
          href={film.trailerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-fit rounded-sm border border-yellow-500 px-10 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black"
        >
          Watch Trailer
        </a>
      </div>
    </div>
  );
}

const FeaturedSelection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  // translateX percentage on the 300%-wide track. -33.333% shows the middle (current) slot.
  const [trackX, setTrackX] = useState(-(100 / 3));
  const [sliding, setSliding] = useState(false);
  const [paused, setPaused] = useState(false);
  const lockRef = useRef(false);
  const activeRef = useRef(0);

  const slide = useCallback((dir: "left" | "right") => {
    if (lockRef.current) return;
    lockRef.current = true;
    setSliding(true);
    // Animate to the next or previous slot
    setTrackX(dir === "left" ? -(200 / 3) : 0);

    setTimeout(() => {
      const newIndex =
        dir === "left"
          ? mod(activeRef.current + 1, count)
          : mod(activeRef.current - 1, count);
      activeRef.current = newIndex;
      setActiveIndex(newIndex);
      // Snap back to middle slot without transition
      setSliding(false);
      setTrackX(-(100 / 3));
      lockRef.current = false;
    }, SLIDE_MS);
  }, []);

  const next = useCallback(() => slide("left"), [slide]);
  const prev = useCallback(() => slide("right"), [slide]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slots = [
    featuredFilms[mod(activeIndex - 1, count)],
    featuredFilms[activeIndex],
    featuredFilms[mod(activeIndex + 1, count)],
  ];

  return (
    <section
      className="w-full bg-black py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-20">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-white md:text-5xl">
          Featured <span className="text-yellow-500">Selection</span>
        </h2>
      </div>

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
      </div>

      <div className="mt-10 flex justify-center gap-3">
        {featuredFilms.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (i !== activeRef.current) {
                slide(i > activeRef.current ? "left" : "right");
              }
            }}
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