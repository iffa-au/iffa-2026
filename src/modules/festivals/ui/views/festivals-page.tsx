import { Fragment } from "react";

import type { FestivalMonth, FestivalPageSettings } from "../../lib/types";
import {
  allCountries,
  allFestivals,
  announcedMonths,
  countScreeningsInMonth,
  monthLabel,
  monthName,
  monthSectionId,
} from "../../lib/festival-utils";
import { AboutSection } from "../components/about-section";
import { AwardSpotlight } from "../components/award-spotlight";
import { ComingSoonMonth } from "../components/coming-soon-month";
import { FestivalCard } from "../components/festival-card";
import { FestivalCta } from "../components/festival-cta";
import { FestivalHero } from "../components/festival-hero";
import { MonthNav } from "../components/month-nav";
import { Reveal } from "../components/reveal";

/**
 * The Festivals page: Hero -> About -> Award -> Schedule -> Venues -> CTA.
 *
 * The schedule in the middle is the working part of the page and is unchanged
 * in behaviour: Month -> Festival -> Screenings, every month on the page, the
 * month bar highlighting and jumping rather than filtering. The sections around
 * it are editorial and come from the CMS settings document.
 *
 * Everything here is a pure function of its props, including when those props
 * are empty because the API was unreachable — the surrounding sections still
 * render, so the page is never a blank screen.
 *
 * Programs are a separate module and are deliberately absent from this page.
 */

type FestivalsPageProps = {
  months: FestivalMonth[];
  settings: FestivalPageSettings;
};

export function FestivalsPage({ months, settings }: FestivalsPageProps) {
  const navItems = months.map((month) => ({
    id: monthSectionId(month),
    label: monthLabel(month),
    meta:
      month.status === "coming-soon"
        ? "Coming soon"
        : `${month.festivals.length} ${month.festivals.length === 1 ? "festival" : "festivals"}`,
  }));

  const published = announcedMonths(months);
  const totalFestivals = allFestivals(months).length;
  const totalScreenings = published.reduce(
    (total, month) => total + countScreeningsInMonth(month),
    0
  );
  const countryCount = allCountries(months).length;

  return (
    <div className="relative bg-black text-white">
      <FestivalHero settings={settings} />

      <AboutSection settings={settings} />

      <AwardSpotlight settings={settings} />

      {/*
        The schedule and its sticky month bar share one wrapper on purpose: a
        sticky element sticks for the length of its parent, so without this the
        bar would follow the viewer all the way through the closing CTA.
        `#schedule` is also what the hero's primary button anchors to.
      */}
      <div id="schedule" className="relative scroll-mt-[120px] border-t border-white/10">
        <section className="relative mx-auto max-w-7xl px-5 pt-20 pb-10 md:px-8 md:pt-28 md:pb-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-400/[0.07] blur-3xl"
          />

          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              {settings.scheduleEyebrow}
            </p>

            <h2 className="mt-5 text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white md:text-6xl">
              {settings.scheduleHeading}
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              {settings.scheduleIntro}
            </p>

            <div className="mt-6 h-px w-40 bg-gradient-to-r from-yellow-400 to-transparent" />

            <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold uppercase tracking-[0.2em] text-white md:text-base">
                {published.map((month, index) => (
                  <Fragment key={month.id}>
                    {index > 0 && (
                      <span
                        aria-hidden
                        className="h-px w-8 bg-gradient-to-r from-yellow-400/70 to-yellow-400/15 md:w-12"
                      />
                    )}
                    {monthLabel(month)}
                  </Fragment>
                ))}
              </p>

              {/* Suppressed when there is nothing programmed: "0 festivals · 0
                  screenings" reads like a failure rather than an announcement. */}
              {totalFestivals > 0 && (
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                  {totalFestivals} {totalFestivals === 1 ? "festival" : "festivals"}
                  <span aria-hidden className="px-2 text-white/20">
                    ·
                  </span>
                  {totalScreenings} {totalScreenings === 1 ? "screening" : "screenings"}
                  <span aria-hidden className="px-2 text-white/20">
                    ·
                  </span>
                  {countryCount} {countryCount === 1 ? "country" : "countries"}
                </p>
              )}
            </div>
          </div>
        </section>

        {months.length > 0 && <MonthNav months={navItems} />}

        <div className="relative mx-auto max-w-7xl px-5 pb-4 md:px-8">
          {months.length === 0 && (
            /* No published festivals, or the API was unreachable. Deliberately
               says nothing about dates rather than showing a stale schedule. */
            <div className="pt-4 md:pt-8">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center md:px-10 md:py-24">
                <h3 className="text-2xl font-bold uppercase tracking-[0.14em] text-white md:text-3xl">
                  Coming Soon
                </h3>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/55 md:text-base">
                  The next festivals are being programmed. Screening schedules will be
                  published here as soon as they are announced.
                </p>
              </div>
            </div>
          )}

          {months.map((month) => (
            <section
              key={month.id}
              id={monthSectionId(month)}
              className="scroll-mt-[190px] pt-16 md:pt-24"
            >
              <Reveal>
                <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-white/10 pb-6">
                  <h3 className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold uppercase leading-none tracking-tight text-white md:text-6xl">
                      {monthName(month.month)}
                    </span>
                    <span className="text-lg font-semibold leading-none text-white/30 md:text-2xl">
                      {month.year}
                    </span>
                  </h3>

                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                    {month.status === "coming-soon" ? (
                      "Programme to be announced"
                    ) : (
                      <>
                        {month.festivals.length}{" "}
                        {month.festivals.length === 1 ? "festival" : "festivals"}
                        <span aria-hidden className="px-2 text-white/20">
                          ·
                        </span>
                        {countScreeningsInMonth(month)} screenings
                      </>
                    )}
                  </p>
                </header>
              </Reveal>

              <div className="mt-8 flex flex-col gap-8 md:mt-10 md:gap-10">
                {month.status === "coming-soon" ? (
                  <Reveal>
                    <ComingSoonMonth note={month.note} />
                  </Reveal>
                ) : (
                  month.festivals.map((festival, index) => (
                    <Reveal key={festival.slug} delay={index * 90}>
                      <FestivalCard festival={festival} />
                    </Reveal>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Where it all happens. */}
      <section className="relative mx-auto max-w-7xl px-5 pt-16 pb-16 md:px-8 md:pt-24 md:pb-20">
        <Reveal>
          <div className="rounded-2xl border border-yellow-300/30 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
              <div>
                <h2 className="text-xl font-bold text-white md:text-2xl">
                  {settings.planTitle}
                </h2>
                <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-white/80 md:text-base">
                  Every festival in the series screens across {settings.city},{" "}
                  {settings.country}. {settings.planBody}
                </p>
              </div>

              {settings.venues.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    Venues
                  </h3>
                  <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                    {settings.venues.map((venue) => (
                      <li key={venue.name} className="text-sm leading-relaxed text-white">
                        {venue.name}
                        {venue.suburb && <span className="text-white/50"> — {venue.suburb}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      <FestivalCta settings={settings} />
    </div>
  );
}
