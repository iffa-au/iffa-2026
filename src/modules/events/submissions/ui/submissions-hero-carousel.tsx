"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { RobustBackdropImage } from "@/components/RobustBackdropImage";
import TrailerModal from "@/modules/home/ui/views/carousel/TrailerModal";
import { synopsisHrefForFilm } from "../lib/submissions";
import { fetchCarouselFilms, type CarouselFilmItem } from "../lib/submissions";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";
const ROTATE_INTERVAL_MS = 3000;

function hrefFor(film: CarouselFilmItem): string | null {
  return synopsisHrefForFilm({
    movieId: film.movieId,
    submissionObjectId: film.movieId,
    title: film.title,
    posterUrl: film.posterUrl,
    directors: [],
  });
}

export function SubmissionsHeroCarousel() {
  const [films, setFilms] = useState<CarouselFilmItem[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [trailerFilm, setTrailerFilm] = useState<CarouselFilmItem | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const items = await fetchCarouselFilms(controller.signal);
        setFilms(items);
        // Auto-rotation is unattended — without this, whichever slide the
        // timer lands on next would show a blank backdrop for however long
        // its image takes to load over the network.
        for (const item of items) {
          const preload = new Image();
          preload.src = item.backdropUrl;
        }
      } catch {
        setFilms([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % films.length) + films.length) % films.length);
    },
    [films.length]
  );

  useEffect(() => {
    if (films.length <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % films.length);
    }, ROTATE_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [films.length, paused]);

  const handleManualNav = (next: number) => {
    goTo(next);
    // A manual pick shouldn't be immediately overridden by the auto-rotate
    // firing a moment later — restart the interval's countdown.
    if (timerRef.current) clearInterval(timerRef.current);
    setPaused(true);
    setTimeout(() => setPaused(false), 50);
  };

  if (loading || films.length === 0) return null;

  const film = films[index];
  const href = hrefFor(film);
  const meta = [film.year, film.genres.slice(0, 2).join(", "), film.duration].filter(Boolean);

  return (
    <section
      className="relative h-[520px] w-full overflow-hidden bg-black sm:h-[600px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <RobustBackdropImage
        key={film.movieId}
        src={film.backdropUrl}
        fallbackSrc={film.posterUrl}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10 sm:via-black/55 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/30" />

      <div className="relative z-10 flex h-full items-center px-6 sm:px-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded bg-yellow-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-black">
            Official Selection
          </span>

          <h2
            className="mt-4 text-3xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: SERIF }}
          >
            {film.title}
          </h2>

          {film.director && (
            <p className="mt-3 text-sm text-white/70 sm:text-base">Dir. {film.director}</p>
          )}

          {meta.length > 0 && (
            <p className="mt-1 text-sm text-white/60 sm:text-base">{meta.join(" · ")}</p>
          )}

          {film.cast && film.cast.length > 0 && (
            <p className="mt-3 text-sm text-white/60 sm:text-base">
              Cast {film.cast.slice(0, 4).join(", ")}
            </p>
          )}

          {film.description && (
            <p className="mt-4 line-clamp-2 max-w-xl text-sm text-white/70 sm:text-base">
              {film.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            {film.trailerEmbedUrl && (
              <button
                onClick={() => setTrailerFilm(film)}
                className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-yellow-400"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Trailer
              </button>
            )}
            {href && (
              <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-white/50"
              >
                View Details
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Arrows sit alongside the dots, not on the sides of the banner —
          the text block's height varies a lot per film (cast/description
          may or may not be present), so a side-mounted, vertically-centred
          arrow would risk overlapping it again for a different film. */}
      {films.length > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-4">
          <button
            onClick={() => handleManualNav(index - 1)}
            aria-label="Previous slide"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {films.map((f, i) => (
              <button
                key={f.movieId}
                onClick={() => handleManualNav(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-yellow-500" : "w-1.5 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => handleManualNav(index + 1)}
            aria-label="Next slide"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <TrailerModal
        isOpen={trailerFilm !== null}
        onClose={() => setTrailerFilm(null)}
        embedUrl={trailerFilm?.trailerEmbedUrl ?? null}
        title={trailerFilm?.title ?? ""}
      />
    </section>
  );
}
