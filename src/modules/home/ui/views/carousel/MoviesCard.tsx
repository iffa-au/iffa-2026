"use client";

import { useState } from "react";

type Film = {
  posterUrl?: string;
  title?: string;
  directors?: string[];
};

type MoviesCardProps = {
  film: Film;
};

const MoviesCard = ({ film }: MoviesCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const directors = Array.isArray(film.directors) ? film.directors : [];

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/fallbacks/no-poster.svg";
    setImageLoaded(true);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative hover:shadow-lg hover:shadow-gray-400 transition-shadow duration-300 rounded-xl overflow-hidden border border-accent-2 w-full max-w-[340px] mx-auto"
      style={{ aspectRatio: "2/3", minWidth: "280px" }}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      )}

      <img
        src={film.posterUrl ?? "/fallbacks/no-poster.svg"}
        alt={(film.title ?? "Film") + " Poster"}
        className="h-full w-full object-cover"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ opacity: imageLoaded ? 1 : 0 }}
      />

      <div
        style={{ opacity: isHovered ? 1 : 0 }}
        className="flex flex-col justify-center items-center absolute inset-0 px-6 py-8 bg-black/80 text-white text-center gap-y-6 transition-opacity duration-300"
      >
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight">
          {film.title}
        </h1>

        <div className="text-sm sm:text-base md:text-lg font-semibold">
          {directors.length > 0 ? (
            <div className="space-y-1">
              {directors.map((director, index) => (
                <div key={index}>{director}</div>
              ))}
            </div>
          ) : (
            <div className="text-gray-300">Director Unknown</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesCard;
