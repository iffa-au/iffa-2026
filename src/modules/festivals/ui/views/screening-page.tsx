import Link from "next/link";

import type { Festival, Screening, SeatStatus } from "../../lib/types";
import {
  SEAT_STATUS_LABEL,
  formatScreeningDates,
  screeningHref,
} from "../../lib/festival-utils";
import { festivalFontClass } from "../../lib/festival-fonts";
import { FestivalBreadcrumb } from "../components/festival-breadcrumb";
import { FestivalButton } from "../components/festival-button";
import { FilmCard } from "../components/film-card";

/**
 * One screening, on its own page: what the session is, and everything in it.
 *
 * New with the restructure. A session now has a name, a blurb and a date range
 * of its own, and none of that had anywhere to live — the programme could show
 * it, but nobody could link to it, and "come to the shorts night" had no URL.
 *
 * The page repeats the main page's inversion rather than inventing a third
 * treatment: the billing is on the dark ground, because that is where this
 * festival announces things, and the lineup is on paper, because a lineup is
 * the booklet. That also means `FilmCard` is reused exactly as the programme
 * uses it, instead of a near-copy drawn for a dark background that would drift
 * from it within a release.
 *
 * No trailer control and no synopsis here — those belong to a film, and every
 * film in the lineup is one click away on its own page.
 */

const SEAT_STATUS_CLASSES: Record<SeatStatus, string> = {
  available: "border-fest-beam/25 text-fest-beam/75",
  limited: "border-fest-lamp/50 text-fest-lamp",
  "sold-out": "border-fest-curtain text-[#e07185]",
};

export function ScreeningPage({
  screening,
  festival,
  otherScreenings,
}: {
  screening: Screening;
  festival: Festival;
  /** The rest of the festival's programme, in programme order. */
  otherScreenings: Screening[];
}) {
  const facts = [
    { label: "Dates", value: formatScreeningDates(screening) },
    { label: "Time", value: screening.time || "To be confirmed" },
    { label: "Venue", value: screening.venue || "To be confirmed" },
    {
      label: screening.films.length === 1 ? "Film" : "Films",
      value: String(screening.films.length),
    },
  ];

  return (
    <div className={`${festivalFontClass} relative min-h-screen bg-fest-room`}>
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-14">
        <FestivalBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Festival", href: "/festivals" },
            { label: screening.title },
          ]}
        />

        <p className="font-fest-text text-base italic text-fest-lamp/80">
          {festival.name.includes(String(festival.year))
            ? festival.name
            : `${festival.name}, ${festival.year}`}
        </p>

        <h1 className="mt-4 max-w-[18ch] font-fest-display text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.015em] text-fest-beam">
          {screening.title}
        </h1>

        {screening.description && (
          <p className="mt-8 max-w-[64ch] font-fest-text text-[1.0625rem] leading-[1.75] text-fest-beam/75 md:text-lg">
            {screening.description}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span
            className={`border px-4 py-2 font-fest-text text-sm ${SEAT_STATUS_CLASSES[screening.seatStatus]}`}
          >
            {SEAT_STATUS_LABEL[screening.seatStatus]}
          </span>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-10 gap-y-7 border-t border-fest-beam/12 pt-8 sm:grid-cols-4">
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
      </section>

      {/* The lineup, on paper — same inversion, same card, as the programme. */}
      <section className="relative bg-fest-stock py-16 text-fest-ink md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22p%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22/></filter><rect width=%22160%22 height=%22160%22 filter=%22url(%23p)%22/></svg>')] [background-size:160px_160px]"
        />

        <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
          <h2 className="font-fest-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold uppercase leading-[0.9]">
            {screening.films.length > 0 ? "In this screening" : "Lineup to be announced"}
          </h2>

          <div className="mt-8 h-0.5 w-full bg-fest-ink" />

          {screening.films.length > 0 ? (
            <div className="grid gap-x-12 lg:grid-cols-2">
              {screening.films.map((film) => (
                <FilmCard key={film.id} film={film} />
              ))}
            </div>
          ) : (
            <p className="max-w-[54ch] py-8 font-fest-text text-lg leading-[1.7] text-fest-ink/70">
              This session is programmed but its films have not been announced
              yet. It will be listed here as soon as the lineup is confirmed.
            </p>
          )}

          <div className="mt-12">
            <FestivalButton variant="ink" href="/festivals#programme" withArrow>
              The full programme
            </FestivalButton>
          </div>
        </div>
      </section>

      {otherScreenings.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <h2 className="font-fest-text text-base italic text-fest-beam/55">
            Also at {festival.name}
          </h2>

          <ul className="mt-6 flex flex-col border-t border-fest-beam/12">
            {otherScreenings.map((other) => (
              <li key={other.id}>
                <Link
                  href={screeningHref(other.id)}
                  className="group grid gap-x-8 gap-y-1 border-b border-fest-beam/12 py-5 transition-colors duration-300 hover:bg-fest-beam/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fest-lamp md:grid-cols-[9rem_minmax(0,1fr)_auto] md:items-baseline"
                >
                  <span className="font-fest-display text-lg font-bold tabular-nums text-fest-lamp">
                    {other.time || "TBC"}
                  </span>
                  <span className="font-fest-display text-xl font-semibold uppercase leading-tight text-fest-beam transition-colors duration-300 group-hover:text-fest-lamp md:text-2xl">
                    {other.title}
                  </span>
                  <span className="font-fest-text text-sm italic text-fest-beam/45">
                    {formatScreeningDates(other)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
