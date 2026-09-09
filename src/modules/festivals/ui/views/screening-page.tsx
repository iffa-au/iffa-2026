"use client";

import { useState } from "react";
import Link from "next/link";

import { getYouTubeEmbedUrl } from "@/lib/youtube";
import TrailerModal from "@/modules/home/ui/views/carousel/TrailerModal";

import type { Festival, Screening, SeatStatus } from "../../lib/types";
import {
  SEAT_STATUS_LABEL,
  formatDayHeading,
  formatRuntime,
  screeningHref,
} from "../../lib/festival-utils";
import { festivalFontClass } from "../../lib/festival-fonts";
import { FestivalBreadcrumb } from "../components/festival-breadcrumb";
import { PosterFrame } from "../components/poster-frame";

/**
 * One film, on its own page.
 *
 * Split out of the programme card, which had grown a synopsis, a trailer
 * button and a seat status inside something that was already a link. A film in
 * a festival programme is a thing people send each other; it deserves a URL, a
 * title and a share preview of its own.
 *
 * The page stays on the dark ground rather than the programme's paper: this is
 * the film, not the booklet, and the poster is the largest thing on it.
 *
 * The other films on the same night sit at the bottom, because the question
 * after "what is this" is almost always "what else is on that evening".
 */

const SEAT_STATUS_CLASSES: Record<SeatStatus, string> = {
  available: "border-fest-beam/25 text-fest-beam/75",
  limited: "border-fest-lamp/50 text-fest-lamp",
  "sold-out": "border-fest-curtain text-[#e07185]",
};

export function ScreeningPage({
  screening,
  festival,
  sameNight,
}: {
  screening: Screening;
  festival: Festival;
  /** The other films screening on the same date, in programme order. */
  sameNight: Screening[];
}) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(screening.trailerUrl);

  const facts = [
    { label: "Screening", value: formatDayHeading(screening.date) },
    { label: "Time", value: screening.time || "To be confirmed" },
    { label: "Venue", value: screening.venue || "To be confirmed" },
    {
      label: "Running time",
      value: screening.runtimeMinutes ? formatRuntime(screening.runtimeMinutes) : "—",
    },
    { label: "Country", value: screening.country || "—" },
    { label: "Year", value: screening.year ? String(screening.year) : "—" },
  ];

  return (
    <div className={`${festivalFontClass} relative min-h-screen bg-fest-room`}>
      <section className="mx-auto max-w-[1400px] px-5 pt-10 md:px-10 md:pt-14">
        <FestivalBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Festival", href: "/festivals" },
            { label: screening.title },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <PosterFrame
              title={screening.title}
              country={screening.country}
              year={screening.year}
              posterUrl={screening.posterUrl}
              sizes="(max-width: 1024px) 60vw, 420px"
              priority
              className="w-full border border-fest-beam/10"
            />
          </div>

          <div className="min-w-0">
            {/* Most festivals are named for their year ("IFFA 2026"), so the
                year is only appended when the name does not already carry it —
                otherwise this reads "IFFA 2026 · 2026". */}
            <p className="font-fest-text text-base italic text-fest-lamp/80">
              {festival.name.includes(String(festival.year))
                ? festival.name
                : `${festival.name}, ${festival.year}`}
            </p>

            <h1 className="mt-4 font-fest-display text-[clamp(2.5rem,6.5vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.015em] text-fest-beam">
              {screening.title}
            </h1>

            {screening.genre && (
              <p className="mt-4 font-fest-text text-xl italic text-fest-beam/60">
                {screening.genre}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span
                className={`border px-4 py-2 font-fest-text text-sm ${SEAT_STATUS_CLASSES[screening.seatStatus]}`}
              >
                {SEAT_STATUS_LABEL[screening.seatStatus]}
              </span>

              {embedUrl && (
                <button
                  type="button"
                  onClick={() => setIsTrailerOpen(true)}
                  className="inline-flex items-center bg-fest-lamp px-7 py-3 font-fest-display text-sm font-bold uppercase tracking-[0.16em] text-fest-ink transition-colors duration-300 hover:bg-fest-beam focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-lamp"
                >
                  Play trailer
                </button>
              )}
            </div>

            {screening.synopsis && (
              <p className="mt-9 max-w-[64ch] font-fest-text text-[1.0625rem] leading-[1.75] text-fest-beam/75 md:text-lg">
                {screening.synopsis}
              </p>
            )}

            <dl className="mt-12 grid grid-cols-2 gap-x-10 gap-y-7 border-t border-fest-beam/12 pt-8 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-fest-text text-sm italic text-fest-lamp/75">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 font-fest-text text-base leading-snug text-fest-beam/85">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {sameNight.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pt-16 md:px-10 md:pt-24">
          <h2 className="font-fest-text text-base italic text-fest-beam/55">
            Also on {formatDayHeading(screening.date)}
          </h2>

          <ul className="mt-6 flex flex-col border-t border-fest-beam/12">
            {sameNight.map((other) => (
              <li key={other.id}>
                <Link
                  href={screeningHref(other.id)}
                  className="group grid gap-x-8 gap-y-1 border-b border-fest-beam/12 py-5 transition-colors duration-300 hover:bg-fest-beam/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fest-lamp md:grid-cols-[7rem_minmax(0,1fr)_auto] md:items-baseline"
                >
                  <span className="font-fest-display text-xl font-bold tabular-nums text-fest-lamp">
                    {other.time || "TBC"}
                  </span>
                  <span className="font-fest-display text-xl font-semibold uppercase leading-tight text-fest-beam transition-colors duration-300 group-hover:text-fest-lamp md:text-2xl">
                    {other.title}
                  </span>
                  <span className="font-fest-text text-sm italic text-fest-beam/45">
                    {other.venue}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Link
          href="/festivals#programme"
          className="inline-flex items-center border border-fest-beam/25 px-9 py-4 font-fest-display text-sm font-bold uppercase tracking-[0.16em] text-fest-beam transition-colors duration-300 hover:border-fest-lamp hover:text-fest-lamp focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-lamp"
        >
          Back to the programme
        </Link>
      </section>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        embedUrl={embedUrl}
        title={screening.title}
      />
    </div>
  );
}
