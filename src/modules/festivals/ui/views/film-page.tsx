"use client";

import { useState } from "react";
import Link from "next/link";

import { getYouTubeEmbedUrl } from "@/lib/youtube";
import TrailerModal from "@/modules/home/ui/views/carousel/TrailerModal";

import type { Festival, Film, Screening, SeatStatus } from "../../lib/types";
import {
  SEAT_STATUS_LABEL,
  filmHref,
  formatDayHeading,
  formatRuntime,
  formatScreeningDates,
  screeningHref,
} from "../../lib/festival-utils";
import { festivalFontClass } from "../../lib/festival-fonts";
import { FestivalBreadcrumb } from "../components/festival-breadcrumb";
import { FestivalButton } from "../components/festival-button";
import { PosterFrame } from "../components/poster-frame";

/**
 * One film, on its own page.
 *
 * This was the screening page, back when a screening was a film. It now sits
 * a level lower and the facts panel says so: the session is named and linked
 * rather than being implied, because the film's venue is a property of the
 * session it plays in, and that session is a thing a reader can book. Its date
 * and time can now be the film's own — see `Film.startDate` — and the panel
 * prefers them, falling back to the session's.
 *
 * The page stays on the dark ground rather than the programme's paper: this is
 * the film, not the booklet, and the poster is the largest thing on it.
 *
 * The rest of the session's lineup sits at the bottom. It used to be the rest
 * of the night, which was the closest thing available to "what am I actually
 * sitting through" — now that a session really does have a lineup, that is the
 * question this answers.
 */

const SEAT_STATUS_CLASSES: Record<SeatStatus, string> = {
  available: "border-fest-beam/25 text-fest-beam/75",
  limited: "border-fest-lamp/50 text-fest-lamp",
  "sold-out": "border-fest-curtain text-[#e07185]",
};

export function FilmPage({
  film,
  screening,
  festival,
  alsoInScreening,
}: {
  film: Film;
  /** The session this film plays in — where its time and venue come from. */
  screening: Screening;
  festival: Festival;
  /** The other films in the same session, in programme order. */
  alsoInScreening: Film[];
}) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(film.trailerUrl);

  const facts = [
    { label: "Screening", value: screening.title, href: screeningHref(screening.id) },
    // This film's own date and time where cms-hub has them, the session's
    // where it does not. The session's are a range and a door time that can
    // cover several days and a dozen films, so a film that knows its own slot
    // has to say so here of all places — the reader is on this page precisely
    // because this is the film they are trying to catch.
    {
      label: film.startDate ? "Date" : "Dates",
      value: film.startDate
        ? formatDayHeading(film.startDate)
        : formatScreeningDates(screening),
    },
    { label: "Time", value: film.startTime || screening.time || "To be confirmed" },
    { label: "Venue", value: screening.venue || "To be confirmed" },
    {
      label: "Running time",
      value: formatRuntime(film.runtimeMinutes, film.runtimeSeconds) || "—",
    },
    { label: "Country", value: film.country || "—" },
    { label: "Year", value: film.year ? String(film.year) : "—" },
    { label: "Genre", value: film.genre || "—" },
  ];

  return (
    <div className={`${festivalFontClass} relative min-h-screen bg-fest-room`}>
      <section className="mx-auto max-w-[1400px] px-5 pt-10 md:px-10 md:pt-14">
        <FestivalBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Festival", href: "/festivals" },
            { label: screening.title, href: screeningHref(screening.id) },
            { label: film.title },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div>
            <PosterFrame
              title={film.title}
              country={film.country}
              year={film.year}
              posterUrl={film.posterUrl}
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
              {film.title}
            </h1>

            {film.genre && (
              <p className="mt-4 font-fest-text text-xl italic text-fest-beam/60">
                {film.genre}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span
                className={`border px-4 py-2 font-fest-text text-sm ${SEAT_STATUS_CLASSES[screening.seatStatus]}`}
              >
                {SEAT_STATUS_LABEL[screening.seatStatus]}
              </span>

              {embedUrl && (
                <FestivalButton size="md" onClick={() => setIsTrailerOpen(true)}>
                  Play trailer
                </FestivalButton>
              )}

              <FestivalButton
                variant="secondary"
                size="md"
                href={screeningHref(screening.id)}
                withArrow
              >
                The full session
              </FestivalButton>
            </div>

            {film.synopsis && (
              <p className="mt-9 max-w-[64ch] font-fest-text text-[1.0625rem] leading-[1.75] text-fest-beam/75 md:text-lg">
                {film.synopsis}
              </p>
            )}

            <dl className="mt-12 grid grid-cols-2 gap-x-10 gap-y-7 border-t border-fest-beam/12 pt-8 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-fest-text text-sm italic text-fest-lamp/75">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 font-fest-text text-base leading-snug text-fest-beam/85">
                    {fact.href ? (
                      <Link
                        href={fact.href}
                        className="underline decoration-fest-beam/30 underline-offset-4 transition-colors duration-300 hover:text-fest-lamp hover:decoration-fest-lamp focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-lamp"
                      >
                        {fact.value}
                      </Link>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {alsoInScreening.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pt-16 md:px-10 md:pt-24">
          <h2 className="font-fest-text text-base italic text-fest-beam/55">
            Also in {screening.title}
          </h2>

          <ul className="mt-6 flex flex-col border-t border-fest-beam/12">
            {alsoInScreening.map((other) => (
              <li key={other.id}>
                <Link
                  href={filmHref(other.id)}
                  className="group grid gap-x-8 gap-y-1 border-b border-fest-beam/12 py-5 transition-colors duration-300 hover:bg-fest-beam/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fest-lamp md:grid-cols-[minmax(0,1fr)_auto] md:items-baseline"
                >
                  <span className="font-fest-display text-xl font-semibold uppercase leading-tight text-fest-beam transition-colors duration-300 group-hover:text-fest-lamp md:text-2xl">
                    {other.title}
                  </span>
                  <span className="font-fest-text text-sm italic text-fest-beam/45">
                    {[other.country, formatRuntime(other.runtimeMinutes, other.runtimeSeconds) || null]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <FestivalButton variant="secondary" href="/festivals#programme">
          Back to the programme
        </FestivalButton>
      </section>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        embedUrl={embedUrl}
        title={film.title}
      />
    </div>
  );
}
