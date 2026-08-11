"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import { getYouTubeEmbedUrl } from "@/lib/youtube";
import TrailerModal from "@/modules/home/ui/views/carousel/TrailerModal";

import type { ScreeningFilm } from "../../lib/types";
import {
  formatRuntime,
  formatScreeningDate,
  isFallbackPoster,
} from "../../lib/screening-utils";
import { ShowtimeCard } from "./showtime-card";

export function ScreeningFilmCard({ film }: { film: ScreeningFilm }) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const embedUrl = getYouTubeEmbedUrl(film.trailerUrl);
  const bookingNoteId = `${film.id}-booking-note`;

  return (
    <article className="border-b border-white/10 pb-10 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 sm:w-[180px]">
          <Image
            src={film.posterUrl}
            alt={`${film.title} poster`}
            fill
            sizes="(max-width: 640px) 100vw, 180px"
            // The image optimiser rejects SVG unless `dangerouslyAllowSVG` is
            // enabled in next.config.ts, which this work must not touch.
            unoptimized={isFallbackPoster(film.posterUrl)}
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold leading-tight text-white md:text-2xl">
            {film.title}
          </h3>

          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-white/50">
            {formatRuntime(film.runtimeMinutes)}
            <span aria-hidden className="px-2 text-white/25">
              |
            </span>
            {formatScreeningDate(film.screeningDate)}
            <span aria-hidden className="px-2 text-white/25">
              |
            </span>
            {film.genre}
          </p>

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-white/70">
            {film.synopsis}
          </p>

          {embedUrl ? (
            <button
              type="button"
              onClick={() => setIsTrailerOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-yellow-400 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-yellow-400 transition-colors duration-300 hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              <Play aria-hidden className="h-3 w-3 fill-current" />
              Trailer
            </button>
          ) : (
            <p className="mt-5 text-[11px] uppercase tracking-[0.15em] text-white/35">
              Trailer coming soon
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Screening Time &amp; Tickets
        </h4>

        <div className="mt-4 flex flex-wrap gap-3">
          {film.showtimes.map((showtime) => (
            <ShowtimeCard key={showtime.id} showtime={showtime} />
          ))}
        </div>

        {/* Deliberately inert: the internal booking form is a later project.
            Rendered as a disabled <button>, never an <a>, so it cannot navigate. */}
        <div className="mt-5">
          <button
            type="button"
            disabled
            aria-disabled="true"
            aria-describedby={bookingNoteId}
            title="Booking opens soon"
            className="w-full cursor-not-allowed rounded-md border border-yellow-400/50 bg-transparent px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-400/70 opacity-70 sm:w-auto"
          >
            Continue to Book
          </button>
          <p id={bookingNoteId} className="mt-2 text-[11px] leading-relaxed text-white/45">
            Booking opens soon.
          </p>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        embedUrl={embedUrl}
        title={film.title}
      />
    </article>
  );
}
