import Link from "next/link";

import type { Film } from "../../lib/types";
import { filmHref, formatRuntime } from "../../lib/festival-utils";
import { PosterFrame } from "./poster-frame";

/**
 * One film inside a screening.
 *
 * This was `screening-card.tsx`, back when a screening was a film. The change
 * is not only the rename: time, venue and seat status have gone off the card
 * entirely, because they now describe the session and the session prints them
 * once in its own header. A block of six shorts used to repeat "7:30 PM,
 * Capitol Theatre, seats available" six times down a column.
 *
 * What is left is what is true of the film itself, which is also what makes
 * the card scannable — a reader going down a lineup is comparing titles and
 * countries, not re-reading a time they already have.
 *
 * The programme no longer renders these. It lays out `FilmTile` in a grid,
 * because twenty of these rows is two and a half screens between one day of
 * the festival and the next. The card is now the session page's treatment
 * only, which is where a lineup is the content rather than the evidence for a
 * choice — and it is why country still has a home on the way to a film.
 *
 * The whole card is one link to the film's own page, which is why nothing here
 * is interactive on its own: a play button inside a link is two targets in one
 * place, and the card would swallow the click either way.
 *
 * Set on paper with a hairline rule rather than as a rounded tile: this is a
 * printed programme, and eight identical bordered boxes would flatten a
 * lineup into eight equal blocks.
 */
export function FilmCard({ film, when = "" }: { film: Film; when?: string }) {
  const meta = [
    film.country,
    film.year || null,
    film.genre,
    formatRuntime(film.runtimeMinutes, film.runtimeSeconds) || null,
  ].filter(Boolean);

  return (
    <article id={film.id} className="scroll-mt-[140px]">
      <Link
        href={filmHref(film.id)}
        className="group flex h-full gap-5 border-b border-fest-ink/20 py-6 transition-colors duration-300 hover:bg-fest-ink/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fest-ink sm:gap-7"
      >
        <PosterFrame
          title={film.title}
          country={film.country}
          year={film.year}
          posterUrl={film.posterUrl}
          sizes="(max-width: 640px) 110px, 150px"
          className="w-[110px] shrink-0 sm:w-[150px]"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <h4 className="font-fest-display text-[clamp(1.375rem,2.4vw,1.875rem)] font-bold uppercase leading-[1.02] tracking-[-0.005em] text-fest-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-300 group-hover:decoration-fest-ink">
            {film.title}
          </h4>

          {meta.length > 0 && (
            <p className="mt-2 font-fest-text text-[0.9375rem] italic text-fest-ink/65">
              {meta.join(", ")}
            </p>
          )}

          {/* Only when this film has a slot of its own. The session prints its
              own date and door time once in its header, and repeating them
              down a lineup of twenty is the redundancy the restructure
              removed — but "plays 7:45 PM" is not that, it is the one fact
              that differs between two shorts in the same block. */}
          {when && (
            <p className="mt-1 font-fest-text text-[0.9375rem] text-fest-ink/70">
              {when}
            </p>
          )}

          {film.synopsis && (
            <p className="mt-3 line-clamp-3 max-w-[52ch] font-fest-text text-base leading-[1.65] text-fest-ink/75">
              {film.synopsis}
            </p>
          )}

          <span className="mt-auto pt-4 font-fest-text text-sm italic text-fest-ink/50 transition-colors duration-300 group-hover:text-fest-ink">
            Read more
          </span>
        </div>
      </Link>
    </article>
  );
}
