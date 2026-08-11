import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Film01Icon,
  GlobalIcon,
  Location01Icon,
  TeachingIcon,
} from "@hugeicons/core-free-icons";

import { festivalEdition } from "../../data/festival-edition";
import { programCards } from "../../data/programs-data";
import { screeningCountries } from "../../data/screening-data";
import {
  countAllFilms,
  countAllNights,
  formatRuntime,
  formatScreeningDate,
  isFallbackPoster,
} from "../../lib/screening-utils";
import { ProgramCardItem } from "../components/program-card";
import { ShowtimeCard } from "../components/showtime-card";
import { StatTile } from "../components/stat-tile";

// The spotlight is derived, not hardcoded: it is whatever film currently sits
// first on Oman's opening night.
const openingCountry = screeningCountries.find((country) => country.code === "oman");
const openingNight = openingCountry?.nights[0];
const spotlightFilm = openingNight?.films[0];

export function FestivalsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-yellow-300/5 blur-3xl" />
      </div>

      {/* 1. Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-12 md:px-8 md:pt-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
          {festivalEdition.editionLabel}
        </p>

        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          {festivalEdition.title}
        </h1>

        <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-white/60 md:text-base">
          {festivalEdition.tagline}
        </p>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
          {festivalEdition.intro}
        </p>

        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 md:aspect-[21/9]">
          <Image
            src={festivalEdition.bannerImage}
            alt=""
            aria-hidden
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/festivals/screening"
            className="inline-flex items-center justify-center rounded-md border border-yellow-400/70 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 transition-colors duration-300 hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Screening Schedule
          </Link>
          <Link
            href="/festivals/programs"
            className="inline-flex items-center justify-center rounded-md border border-yellow-400/70 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 transition-colors duration-300 hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Programs
          </Link>
        </div>
      </section>

      {/* 2. Festival at a glance */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <h2 className="text-2xl font-bold text-white md:text-3xl">Festival at a glance</h2>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-8">
          <StatTile
            value={countAllFilms(screeningCountries)}
            label="Films screening"
            icon={Film01Icon}
          />
          <StatTile
            value={screeningCountries.length}
            label="Participating countries"
            icon={GlobalIcon}
          />
          <StatTile
            value={countAllNights(screeningCountries)}
            label="Festival nights"
            icon={Calendar03Icon}
          />
          <StatTile
            value={programCards.length}
            label="Program streams"
            icon={TeachingIcon}
          />
        </div>
      </section>

      {/* 3. Opening Night spotlight */}
      {spotlightFilm && openingNight && (
        <section className="relative z-10 mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            {openingNight.label} spotlight
          </h2>
          <p className="mt-2 text-sm text-white/55">
            {openingCountry?.name}
            <span aria-hidden className="px-2 text-white/25">
              |
            </span>
            {formatScreeningDate(openingNight.date)}
          </p>

          <div className="mt-6 flex flex-col gap-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row md:mt-8 md:p-8">
            <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 sm:w-[200px]">
              <Image
                src={spotlightFilm.posterUrl}
                alt={`${spotlightFilm.title} poster`}
                fill
                sizes="(max-width: 640px) 100vw, 200px"
                unoptimized={isFallbackPoster(spotlightFilm.posterUrl)}
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-2xl font-bold leading-tight text-white md:text-3xl">
                {spotlightFilm.title}
              </h3>

              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-white/50">
                {formatRuntime(spotlightFilm.runtimeMinutes)}
                <span aria-hidden className="px-2 text-white/25">
                  |
                </span>
                {formatScreeningDate(spotlightFilm.screeningDate)}
                <span aria-hidden className="px-2 text-white/25">
                  |
                </span>
                {spotlightFilm.genre}
              </p>

              <p className="mt-4 max-w-prose text-sm leading-relaxed text-white/70">
                {spotlightFilm.synopsis}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {spotlightFilm.showtimes.map((showtime) => (
                  <ShowtimeCard key={showtime.id} showtime={showtime} />
                ))}
              </div>

              <Link
                href="/festivals/screening"
                className="mt-7 inline-flex items-center justify-center rounded-md border border-yellow-400/60 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 transition-colors duration-300 hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                Full Screening Schedule
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4. Programs preview */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            <Link
              href="/festivals/programs"
              className="rounded-sm transition-colors duration-300 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Programs
            </Link>
          </h2>
          <Link
            href="/festivals/programs"
            className="rounded-sm text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow-400 transition-opacity duration-300 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            View all programs
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-8">
          {programCards.map((program) => (
            <ProgramCardItem key={program.slug} program={program} />
          ))}
        </div>
      </section>

      {/* 5. Festival info */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
        <h2 className="text-2xl font-bold text-white md:text-3xl">Festival information</h2>

        <div className="mt-6 grid gap-5 lg:grid-cols-3 md:mt-8">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300/40 bg-yellow-400/10">
              <HugeiconsIcon icon={Calendar03Icon} size={18} color="#e6ba35" aria-hidden />
            </div>
            <h3 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Dates
            </h3>
            <p className="mt-2 text-base leading-relaxed text-white">
              {formatScreeningDate(festivalEdition.startDate)} –{" "}
              {formatScreeningDate(festivalEdition.endDate)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300/40 bg-yellow-400/10">
              <HugeiconsIcon icon={Location01Icon} size={18} color="#e6ba35" aria-hidden />
            </div>
            <h3 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              City
            </h3>
            <p className="mt-2 text-base leading-relaxed text-white">
              {festivalEdition.city}, {festivalEdition.country}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300/40 bg-yellow-400/10">
              <HugeiconsIcon icon={Film01Icon} size={18} color="#e6ba35" aria-hidden />
            </div>
            <h3 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Venues
            </h3>
            <ul className="mt-2 flex flex-col gap-1.5">
              {festivalEdition.venues.map((venue) => (
                <li key={venue.name} className="text-sm leading-relaxed text-white">
                  {venue.name}
                  <span className="text-white/45"> — {venue.suburb}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-yellow-300/30 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] p-8 md:p-10">
          <h3 className="text-xl font-bold text-white md:text-2xl">
            Plan your festival week
          </h3>
          <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-white/80 md:text-base">
            Browse every night, country by country, and see which films are screening
            where before tickets open.
          </p>
          <Link
            href="/festivals/screening"
            className="mt-6 inline-flex items-center justify-center rounded-md border border-yellow-400/60 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 transition-colors duration-300 hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Screening Schedule
          </Link>
        </div>
      </section>
    </div>
  );
}
