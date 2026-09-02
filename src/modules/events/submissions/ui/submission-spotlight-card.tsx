"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import { RobustBackdropImage } from "@/components/RobustBackdropImage";
import TrailerModal from "@/modules/home/ui/views/carousel/TrailerModal";
import { getTrailerEmbedUrl, type FilmCardItem } from "../lib/submissions";

const DESCRIPTION_PLACEHOLDER = "Synopsis coming soon.";
const MAX_CAST = 4;

type SubmissionSpotlightCardProps = {
  film: FilmCardItem;
};

/**
 * The wide, landscape-framed variant of MoviesCard. The submissions grid
 * drops a pair of these in every so often to break up the run of portrait
 * posters — see SPOTLIGHT_INTERVAL in submissions-page.tsx.
 *
 * It carries the same information as MoviesCard and behaves the same way
 * (the parent wraps it in the link to the synopsis page, so the trailer
 * trigger has to stop its click from bubbling into that navigation).
 */
export function SubmissionSpotlightCard({ film }: SubmissionSpotlightCardProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const title = film.title || "Untitled";
  const directors = Array.isArray(film.directors) ? film.directors : [];
  const cast = Array.isArray(film.cast) ? film.cast : [];
  const embedUrl = getTrailerEmbedUrl(film.trailerUrl);
  const meta = [film.year, film.genre, film.duration].filter(Boolean);

  const openTrailer = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsTrailerOpen(true);
  };

  return (
    <>
      <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 text-left shadow-lg transition-all duration-300 hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/10">
        <RobustBackdropImage
          key={film.movieId}
          src={film.backdropUrl}
          fallbackSrc={film.posterUrl}
          className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end gap-2 p-5 sm:p-6">
          <div className="max-w-[78%]">
            <h3 className="line-clamp-2 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              {title}
            </h3>
            {directors.length > 0 && (
              <p className="mt-1.5 truncate text-sm text-white/70">
                {directors.join(", ")}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-yellow-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-black">
              IFFA
            </span>
            {film.year && (
              <span className="text-xs font-medium text-white/80">
                {film.year} Selection
              </span>
            )}
          </div>

          {meta.length > 0 && (
            <p className="truncate text-xs text-white/70 sm:text-sm">
              {meta.join(" · ")}
            </p>
          )}

          {cast.length > 0 && (
            <p className="truncate text-xs text-white/70 sm:text-sm">
              {cast.slice(0, MAX_CAST).join(", ")}
            </p>
          )}

          {/* Side by side once there's room; stacked on phones, where sharing
              the row squeezes the synopsis into a two-word column. */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <p className="line-clamp-2 text-xs leading-relaxed text-white/60 sm:flex-1 sm:text-sm">
              {film.description ?? DESCRIPTION_PLACEHOLDER}
            </p>

            <span
              role="button"
              tabIndex={0}
              onClick={openTrailer}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openTrailer(e);
              }}
              className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-yellow-500 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-yellow-500 transition-all duration-300 hover:scale-105 hover:bg-yellow-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Play className="h-3 w-3 fill-current" />
              Watch Trailer
            </span>
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        embedUrl={embedUrl}
        title={title}
      />
    </>
  );
}
