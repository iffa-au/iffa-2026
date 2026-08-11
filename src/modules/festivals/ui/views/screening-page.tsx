"use client";

import { useState } from "react";

import { screeningCountries } from "../../data/screening-data";
import { countFilmsForCountry, dateRangeForCountry } from "../../lib/screening-utils";
import { ALL_COUNTRIES, CountryFilterBar } from "../components/country-filter-bar";
import { CountryOverviewSection } from "../components/country-overview-section";
import { FestivalBreadcrumb } from "../components/festival-breadcrumb";
import { NightRail } from "../components/night-rail";
import { ScreeningFilmCard } from "../components/screening-film-card";

export function ScreeningPage() {
  const [selectedCode, setSelectedCode] = useState<string>(ALL_COUNTRIES);
  const [selectedNightId, setSelectedNightId] = useState<string | null>(null);

  const selectedCountry =
    screeningCountries.find((country) => country.code === selectedCode) ?? null;

  // Falling back to the first night means the UI can never land on a night that
  // does not exist for the current country, whatever the stored id says.
  const activeNight = selectedCountry
    ? selectedCountry.nights.find((night) => night.id === selectedNightId) ??
      selectedCountry.nights[0]
    : null;

  const handleSelectCountry = (code: string) => {
    setSelectedCode(code);
    // Reset the night whenever the country changes.
    const next = screeningCountries.find((country) => country.code === code);
    setSelectedNightId(next?.nights[0]?.id ?? null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-12 pb-20 md:px-8 md:pt-16 md:pb-28">
        <FestivalBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: "Screening" },
          ]}
        />

        <header className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
            Festival 2026-2027
          </p>
          <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-white md:text-5xl">
            Screening Schedule
          </h1>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-white/70 md:text-base">
            Explore screening times, venues and featured films throughout the festival.
          </p>
          <div className="mt-6 h-px w-40 bg-gradient-to-r from-yellow-400 to-transparent" />
        </header>

        <div className="mt-10 md:mt-12">
          <CountryFilterBar
            countries={screeningCountries}
            selected={selectedCode}
            onSelect={handleSelectCountry}
          />
        </div>

        {selectedCountry && activeNight ? (
          <div className="mt-10 md:mt-14">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold uppercase tracking-[0.08em] text-white md:text-3xl">
                {selectedCountry.name} Film Screenings
              </h2>
              <p className="text-sm text-white/55">
                Showing {countFilmsForCountry(selectedCountry)}{" "}
                {countFilmsForCountry(selectedCountry) === 1 ? "film" : "films"}
                <span aria-hidden className="px-2 text-white/25">
                  |
                </span>
                {dateRangeForCountry(selectedCountry)}
              </p>
            </div>

            <hr className="mt-6 border-white/10" />

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(200px,240px)_1fr] lg:gap-12">
              <NightRail
                nights={selectedCountry.nights}
                activeNightId={activeNight.id}
                onSelect={setSelectedNightId}
              />

              <div className="min-w-0">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                  {activeNight.label}
                  <span aria-hidden className="px-2 text-white/25">
                    |
                  </span>
                  {activeNight.films.length}{" "}
                  {activeNight.films.length === 1 ? "film" : "films"}
                </h3>

                <div className="mt-6 flex flex-col gap-10">
                  {activeNight.films.map((film) => (
                    <ScreeningFilmCard key={film.id} film={film} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-6 md:mt-14">
            {screeningCountries.map((country) => (
              <CountryOverviewSection
                key={country.code}
                country={country}
                onViewFullSchedule={handleSelectCountry}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
