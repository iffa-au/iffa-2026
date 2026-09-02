"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Location01Icon } from "@hugeicons/core-free-icons";

import { getYouTubeEmbedUrl } from "@/lib/youtube";
import TrailerModal from "@/modules/home/ui/views/carousel/TrailerModal";

import type { Screening } from "../../lib/types";
import {
  SEAT_STATUS_CLASSES,
  SEAT_STATUS_LABEL,
  formatRuntime,
} from "../../lib/festival-utils";
import { PosterFrame } from "./poster-frame";

/**
 * One screening in a festival's schedule.
 *
 * The date lives on the day heading above the card, not on the card, so a row
 * of screenings from the same night does not repeat it six times. Country sits
 * directly under the title — visible on every card, and never a filter.
 *
 * `scroll-mt` clears the fixed site header plus the sticky month bar, so the
 * `#screening-id` links from the index land with the card in view.
 */
export function ScreeningCard({ screening }: { screening: Screening }) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(screening.trailerUrl);

  return (
    <article
      id={screening.id}
      className="group flex h-full scroll-mt-[190px] gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors duration-500 hover:border-white/20 hover:bg-white/[0.04] sm:gap-6 sm:p-5"
    >
      <PosterFrame
        title={screening.title}
        country={screening.country}
        year={screening.year}
        posterUrl={screening.posterUrl}
        sizes="(max-width: 640px) 108px, 140px"
        className="w-[108px] shrink-0 sm:w-[140px]"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h4 className="text-lg font-bold leading-tight text-white md:text-xl">
            {screening.title}
          </h4>

          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] ${
              SEAT_STATUS_CLASSES[screening.seatStatus]
            }`}
          >
            {SEAT_STATUS_LABEL[screening.seatStatus]}
          </span>
        </div>

        <p className="mt-2 text-sm text-white/70">
          {screening.country}
          <span aria-hidden className="px-2 text-white/25">
            ·
          </span>
          {screening.year}
        </p>

        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/40">
          {screening.genre}
          <span aria-hidden className="px-2 text-white/20">
            ·
          </span>
          {formatRuntime(screening.runtimeMinutes)}
        </p>

        <p className="mt-3.5 line-clamp-3 text-sm leading-relaxed text-white/60">
          {screening.synopsis}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-xs text-white/60 sm:mt-5">
          <span className="inline-flex items-center gap-1.5 font-semibold text-white">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={13}
              color="currentColor"
              aria-hidden
            />
            {screening.time}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Location01Icon}
              size={13}
              color="currentColor"
              aria-hidden
            />
            {screening.venue}
          </span>

          {embedUrl ? (
            <button
              type="button"
              onClick={() => setIsTrailerOpen(true)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-yellow-400/70 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-yellow-400 transition-colors duration-300 hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              <Play aria-hidden className="h-2.5 w-2.5 fill-current" />
              Trailer
            </button>
          ) : (
            <span className="ml-auto text-[10px] uppercase tracking-[0.15em] text-white/25">
              Trailer soon
            </span>
          )}
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        embedUrl={embedUrl}
        title={screening.title}
      />
    </article>
  );
}
