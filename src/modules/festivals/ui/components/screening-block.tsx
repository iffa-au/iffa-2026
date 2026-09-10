import Link from "next/link";

import type { Screening, SeatStatus } from "../../lib/types";
import {
  SEAT_STATUS_LABEL,
  filmScreeningWhen,
  formatScreeningDates,
  screeningHref,
} from "../../lib/festival-utils";
import { FilmTile } from "./film-tile";

/**
 * One session on the programme: its own heading, then its running order.
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
 *
 * The lineup is a grid of poster tiles, five across at the widest breakpoint
 * and two on a phone. It used to be a column of wide `FilmCard` rows, which
 * put a session of twenty shorts — two and a half screens of poster, meta and
 * synopsis — between the reader and the next day of the festival. Same
 * posters, a fifth of the height, because the tiles are read across as well as
 * down and carry three facts each instead of six. See `film-tile.tsx`.
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

/**
 * How many films a session prints on the programme before it stops.
 *
 * Twenty is four full rows at the widest breakpoint — enough that a normal
 * session, however large, is shown whole. It is a ceiling on the outlier: a
 * rotating exhibition or an all-day marathon with forty titles would otherwise
 * be a session nobody scrolls past, which is the problem this treatment exists
 * to fix. Everything above the ceiling is on the session's own page, which is
 * the full record anyway.
 */
const LINEUP_LIMIT = 20;

export function ScreeningBlock({
  screening,
  index,
}: {
  screening: Screening;
  /** "01", "02" — position in the programme, not a calendar date. */
  index: string;
}) {
  const facts = [formatScreeningDates(screening), screening.venue].filter(Boolean);
  const shown = screening.films.slice(0, LINEUP_LIMIT);
  const hidden = screening.films.length - shown.length;


  return (
    <section id={screening.id} className="scroll-mt-[200px]">
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

      <div className="mt-5 h-0.5 w-full bg-fest-ink" />

      {shown.length > 0 ? (
        <>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
            {shown.map((film) => (
              <FilmTile
                key={film.id}
                film={film}
                // The film's own date and time once cms-hub carries them, the
                // session's until then. See the note on `Film.startDate`.
                when={filmScreeningWhen(film, screening)}
              />
            ))}
          </div>

          {hidden > 0 && (
            <Link
              href={screeningHref(screening.id)}
              className="mt-8 inline-block font-fest-text text-[0.9375rem] italic text-fest-ink/70 underline decoration-fest-ink/30 decoration-1 underline-offset-4 transition-colors duration-300 hover:text-fest-ink hover:decoration-fest-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-ink"
            >
              {hidden} more {hidden === 1 ? "film" : "films"} in this session
            </Link>
          )}
        </>
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
