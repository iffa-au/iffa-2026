"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import type { ScreeningCountry } from "../../lib/types";
import {
  SEAT_STATUS_CLASSES,
  SEAT_STATUS_LABEL,
  countFilmsForCountry,
  dateRangeForCountry,
  filmsWithNightLabel,
  formatRuntime,
  isFallbackPoster,
} from "../../lib/screening-utils";

type CountryOverviewSectionProps = {
  country: ScreeningCountry;
  /** Switches the active filter to this country. */
  onViewFullSchedule: (code: string) => void;
};

export function CountryOverviewSection({
  country,
  onViewFullSchedule,
}: CountryOverviewSectionProps) {
  const filmCount = countFilmsForCountry(country);
  const entries = filmsWithNightLabel(country);

  return (
    <section className="border border-white/10 bg-white/[0.03] p-5 md:p-7">
      <header className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-[0.1em] text-white md:text-2xl">
            {country.name}
          </h3>
          <p className="mt-1.5 text-xs text-white/50">
            Showing {filmCount} {filmCount === 1 ? "film" : "films"}
            <span aria-hidden className="px-2 text-white/25">
              |
            </span>
            {country.nights.length} {country.nights.length === 1 ? "night" : "nights"}
            <span aria-hidden className="px-2 text-white/25">
              |
            </span>
            {dateRangeForCountry(country)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onViewFullSchedule(country.code)}
          className="group inline-flex w-fit items-center gap-2 rounded-md border border-white/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          View full schedule
          <ArrowRight
            aria-hidden
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </header>

      <ul className="mt-5 flex flex-col gap-5">
        {entries.map(({ film, nightLabel }) => (
          <li key={film.id} className="flex gap-4">
            <div className="relative aspect-[2/3] w-[64px] shrink-0 overflow-hidden rounded border border-white/10 bg-zinc-900 sm:w-[76px]">
              <Image
                src={film.posterUrl}
                alt={`${film.title} poster`}
                fill
                sizes="76px"
                unoptimized={isFallbackPoster(film.posterUrl)}
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-400">
                {nightLabel}
              </p>
              <h4 className="mt-1 text-base font-semibold leading-tight text-white">
                {film.title}
              </h4>
              <p className="mt-1 text-xs text-white/50">
                {formatRuntime(film.runtimeMinutes)}
                <span aria-hidden className="px-1.5 text-white/25">
                  ·
                </span>
                {film.genre}
              </p>

              <ul className="mt-2.5 flex flex-wrap gap-2">
                {film.showtimes.map((showtime) => (
                  <li
                    key={showtime.id}
                    className={`rounded-full border px-2.5 py-1 text-[10px] leading-none ${
                      SEAT_STATUS_CLASSES[showtime.seatStatus]
                    }`}
                  >
                    {showtime.time} — {SEAT_STATUS_LABEL[showtime.seatStatus]}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
