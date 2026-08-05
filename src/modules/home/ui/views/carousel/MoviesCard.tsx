"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import TrailerModal from "./TrailerModal";

type Film = {
  posterUrl?: string;
  title?: string;
  directors?: string[];
  year?: string;
  genre?: string;
  // Not yet returned by the submissions API — falls back to a placeholder
  // until the API response includes this field.
  duration?: string;
  cast?: string[];
  description?: string;
  trailerUrl?: string;
};

type MoviesCardProps = {
  film: Film;
};

const GENRE_PLACEHOLDER = "Genre TBA";
const DURATION_PLACEHOLDER = "Duration TBA";
const DESCRIPTION_PLACEHOLDER = "Synopsis coming soon.";

const getYouTubeEmbedUrl = (url?: string): string | null => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.pathname.startsWith("/embed/")
        ? parsed.pathname.split("/embed/")[1]
        : parsed.searchParams.get("v");
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  } catch {
    return null;
  }
};

const MoviesCard = ({ film }: MoviesCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const directors = Array.isArray(film.directors) ? film.directors : [];
  const cast = Array.isArray(film.cast) ? film.cast : [];
  const title = film.title || "Untitled";
  const embedUrl = getYouTubeEmbedUrl(film.trailerUrl);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/fallbacks/no-poster.svg";
    setImageLoaded(true);
  };

  const openTrailer = (e: React.MouseEvent | React.KeyboardEvent) => {
    // This trigger sits inside the card's own <Link>/<button> wrapper
    // (rendered by the parent page) that navigates to the synopsis page,
    // so this must stop the click from bubbling into that navigation.
    e.preventDefault();
    e.stopPropagation();
    setIsTrailerOpen(true);
  };

  return (
    <>
      <div
        className="group relative mx-auto w-full max-w-[340px] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/10"
        style={{ aspectRatio: "2/3" }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          </div>
        )}

        <img
          src={film.posterUrl ?? "/fallbacks/no-poster.svg"}
          alt={`${title} poster`}
          className="absolute -inset-px object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent transition-colors duration-300 group-hover:from-black group-hover:via-black/85" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-4">
          <div>
            <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white sm:text-base">
              {title}
            </h3>
            {directors.length > 0 && (
              <p className="mt-1 truncate text-xs text-white/60">
                {directors.join(", ")}
              </p>
            )}
          </div>

          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100">
            <div className="flex flex-col gap-2 overflow-hidden">
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

              <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                <span>
                  {film.genre ?? GENRE_PLACEHOLDER} ·{" "}
                  {film.duration ?? DURATION_PLACEHOLDER}
                </span>
              </div>

              {cast.length > 0 && (
                <p className="truncate text-xs text-white/70">
                  {cast.join(", ")}
                </p>
              )}

              <p className="line-clamp-2 text-xs leading-relaxed text-white/60">
                {film.description ?? DESCRIPTION_PLACEHOLDER}
              </p>
            </div>
          </div>

          <span
            role="button"
            tabIndex={0}
            onClick={openTrailer}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openTrailer(e);
            }}
            className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full border border-yellow-500 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-yellow-500 transition-all duration-300 hover:scale-105 hover:bg-yellow-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black group-hover:scale-105 group-hover:bg-yellow-500 group-hover:text-black"
          >
            <Play className="h-3 w-3 fill-current" />
            Watch Trailer
          </span>
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
};

export default MoviesCard;
