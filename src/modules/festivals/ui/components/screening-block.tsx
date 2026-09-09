import Link from "next/link";

import type { Screening, SeatStatus } from "../../lib/types";
import {
  SEAT_STATUS_LABEL,
  formatScreeningDates,
  screeningHref,
} from "../../lib/festival-utils";
import { FilmCard } from "./film-card";

/**
 * One session on the programme: its own heading, then its lineup.
 *
 * The heading carries everything that is true of the session — when it runs,
 * at what time, where, and whether there are seats — so that none of it has to
 * be repeated on the films underneath. That is the whole point of the
 * restructure: a shorts block is one row of session facts and six films, not
 * six copies of the same row.
 *
 * Numbered because sessions genuinely are a sequence through the festival.
 * The number is the sequence position, not a date — a session that runs across
 * three days has no single date to number by, which is exactly why nights
 * stopped working as the organising unit.
 */

/**
 * Ink and oxblood rather than the site's amber: at this size on a cream ground
 * amber is the one accent that fails contrast, and "sold out" is the only state
 * urgent enough to earn colour at all.
 */
const SEAT_STATUS_CLASSES: Record<SeatStatus, string> = {
  available: "text-fest-ink/55",
  limited: "text-[#8a5300]",
  "sold-out": "text-fest-curtain",
};

export function ScreeningBlock({
  screening,
  index,
}: {
  screening: Screening;
  /** "01", "02" — position in the programme, not a calendar date. */
  index: string;
}) {
  const facts = [formatScreeningDates(screening), screening.venue].filter(Boolean);

  return (
    <section id={screening.id} className="scroll-mt-[140px]">
      <header className="screening-heading">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <span className="font-fest-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[0.8] tracking-[-0.01em]">
            {index}
          </span>

          <h3 className="font-fest-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.01em]">
            <Link
              href={screeningHref(screening.id)}
              className="underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors duration-300 hover:decoration-fest-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-ink"
            >
              {screening.title}
            </Link>
          </h3>

          {/* The time is the one number a reader scans a programme for, so it
              is set in display type and pushed to the far edge where the eye
              can run down a column of them. */}
          {screening.time && (
            <span className="ml-auto font-fest-display text-2xl font-bold tabular-nums leading-none md:text-[1.75rem]">
              {screening.time}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 font-fest-text text-[0.9375rem]">
          {facts.map((fact) => (
            <span key={fact} className="italic text-fest-ink/70">
              {fact}
            </span>
          ))}
          <span className={SEAT_STATUS_CLASSES[screening.seatStatus]}>
            {SEAT_STATUS_LABEL[screening.seatStatus]}
          </span>
          <span className="text-fest-ink/45">
            {screening.films.length}{" "}
            {screening.films.length === 1 ? "film" : "films"}
          </span>
        </div>

        {screening.description && (
          <p className="mt-4 max-w-[62ch] font-fest-text text-base leading-[1.7] text-fest-ink/75">
            {screening.description}
          </p>
        )}
      </header>

      <div className="screening-rule mt-5 h-0.5 w-full origin-left bg-fest-ink" />

      {screening.films.length > 0 ? (
        <div className="grid gap-x-12 lg:grid-cols-2">
          {screening.films.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      ) : (
        // A session announced before its lineup is confirmed. Says so rather
        // than rendering a heading above nothing.
        <p className="border-b border-fest-ink/20 py-8 font-fest-text text-base italic text-fest-ink/55">
          Lineup to be announced.
        </p>
      )}
    </section>
  );
}
