import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Festival, FestivalMonth } from "../../lib/types";
import {
  countFestivalDays,
  festivalCountries,
  festivalNeighbours,
  formatDayHeading,
  formatFestivalDates,
  groupScreeningsByDay,
  monthLabel,
  monthOfFestival,
} from "../../lib/festival-utils";
import { FestivalBreadcrumb } from "../components/festival-breadcrumb";
import { Reveal } from "../components/reveal";
import { ScreeningCard } from "../components/screening-card";

/**
 * A single festival and its full screening schedule, grouped by night.
 *
 * The index answers "what is on"; this page answers "what is on when". Nights
 * come from the screenings themselves, so a festival can run one night or six
 * without a UI change — and there is no country filter anywhere: each film's
 * country is on its own card.
 *
 * Takes the whole schedule alongside the festival: the month eyebrow and the
 * previous/next links are positions within the programme, not properties of one
 * festival, and both come from the same fetch so they can never disagree.
 */
export function FestivalDetailPage({
  festival,
  months,
}: {
  festival: Festival;
  months: FestivalMonth[];
}) {
  const month = monthOfFestival(months, festival.slug);
  const days = groupScreeningsByDay(festival);
  const countries = festivalCountries(festival);
  const nights = countFestivalDays(festival);
  const { previous, next } = festivalNeighbours(months, festival.slug);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-12 md:px-8 md:pt-16">
        <FestivalBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Festivals", href: "/festivals" },
            { label: festival.name },
          ]}
        />

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 sm:aspect-[16/9] lg:aspect-[21/9]">
          {/* A festival can be published before its artwork is uploaded. next/image
              throws on an empty src, so the gradient stands in for it. */}
          {festival.heroImage ? (
            <Image
              src={festival.heroImage}
              alt=""
              aria-hidden
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-[#241f12] via-[#12100b] to-black"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10"
          />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-yellow-400">
              {month ? monthLabel(month) : formatFestivalDates(festival)}
              <span aria-hidden className="px-2 text-yellow-400/40">
                ·
              </span>
              Festival {festival.edition}
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-6xl">
              {festival.name}
            </h1>

            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/60 md:text-sm">
              {festival.tagline}
            </p>
          </div>
        </div>

        <div className="mt-9 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <p className="max-w-prose text-sm leading-relaxed text-white/70 md:text-base">
            {festival.description}
          </p>

          {/* Two columns, not four: at four the country list and "5 across 3
              nights" both wrap mid-phrase in the narrower right-hand column. */}
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-white/10 pt-6 lg:border-t-0 lg:pt-0">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Dates
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-white">
                {formatFestivalDates(festival)}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Screenings
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-white">
                {festival.screenings.length} across {nights}{" "}
                {nights === 1 ? "night" : "nights"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Countries
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-white">
                {countries.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                City
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-white">{festival.city}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-white/10 pb-5">
          <h2 className="text-2xl font-bold uppercase tracking-[0.06em] text-white md:text-3xl">
            Screening Schedule
          </h2>
          {/* Booking is a later project — said once here rather than on every card. */}
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
            Booking opens closer to the festival
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-14 md:gap-16">
          {days.map((day) => (
            <div key={day.date}>
              <Reveal>
                <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5 border-b border-white/10 pb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-400">
                    Night {day.index}
                  </span>
                  <h3 className="text-xl font-bold text-white md:text-2xl">
                    {formatDayHeading(day.date)}
                  </h3>
                  <span className="ml-auto text-[11px] uppercase tracking-[0.18em] text-white/40">
                    {day.screenings.length}{" "}
                    {day.screenings.length === 1 ? "screening" : "screenings"}
                  </span>
                </header>
              </Reveal>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {day.screenings.map((screening, index) => (
                  <Reveal key={screening.id} delay={index * 70} className="h-full">
                    <ScreeningCard screening={screening} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
        <div className="grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/festivals/${previous.slug}`}
              className="group rounded-xl border border-white/10 p-5 transition-colors duration-300 hover:border-yellow-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 md:p-6"
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                <ArrowLeft
                  aria-hidden
                  className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
                Previous festival
              </span>
              <span className="mt-2 block text-lg font-bold text-white transition-colors duration-300 group-hover:text-yellow-400">
                {previous.name}
              </span>
              <span className="mt-1 block text-xs text-white/45">
                {formatFestivalDates(previous)}
              </span>
            </Link>
          ) : (
            <span aria-hidden />
          )}

          {next && (
            <Link
              href={`/festivals/${next.slug}`}
              className="group rounded-xl border border-white/10 p-5 text-right transition-colors duration-300 hover:border-yellow-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 md:p-6"
            >
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Next festival
                <ArrowRight
                  aria-hidden
                  className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </span>
              <span className="mt-2 block text-lg font-bold text-white transition-colors duration-300 group-hover:text-yellow-400">
                {next.name}
              </span>
              <span className="mt-1 block text-xs text-white/45">
                {formatFestivalDates(next)}
              </span>
            </Link>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/festivals"
            className="inline-flex items-center justify-center rounded-md border border-yellow-400/70 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 transition-colors duration-300 hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            All Festivals
          </Link>
        </div>
      </section>
    </div>
  );
}
