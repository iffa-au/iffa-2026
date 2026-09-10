import Link from "next/link";

import type { Film } from "../../lib/types";
import { filmHref, formatRuntime } from "../../lib/festival-utils";
import { PosterFrame } from "./poster-frame";

/**
 * One film on the programme: a poster, and the three facts you choose by.
 *
 * The programme runs these five across at the widest breakpoint and two across
 * on a phone, so a session of twenty films is four rows rather than twenty
 * cards stacked down the page. That is the whole reason the tile exists — the
 * lineup used to be `FilmCard`, which is a wide row of poster, meta and
 * synopsis, and twenty of those put two and a half screens between one day of
 * the festival and the next.
 *
 * Title, when it plays, how long it runs. Nothing else. Country, genre,
 * synopsis and trailer are all a click away on the film's own page, and none
 * of them is what a reader is weighing while deciding what to book — at this
 * size the poster is doing that work, which is why it gets the whole tile and
 * the words get three lines under it.
 *
 * Runtime sits on its own at the foot, above a hairline. Tiles in a row are
 * stretched to a common height, so every runtime in a row lands on the same
 * baseline and the row can be read across as a strip of durations — which is
 * how you tell a programme of shorts from a programme of features at a glance.
 */
export function FilmTile({
  film,
  when,
}: {
  film: Film;
  /**
   * "Wed 16 Oct, 7:45 PM" — the film's own date and time where it has them and
   * the session's where it does not, resolved by `filmScreeningWhen`. Passed in
   * rather than derived here so the tile never needs the session it sits in.
   */
  when: string;
}) {
  const runtime = formatRuntime(film.runtimeMinutes, film.runtimeSeconds);

  return (
    <article id={film.id} className="h-full">
      <Link
        href={filmHref(film.id)}
        className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-ink"
      >
        {/* The hairline matters on artwork: a poster with a white or cream
            border would otherwise bleed into the paper and lose its edge. */}
        <PosterFrame
          title={film.title}
          country={film.country}
          year={film.year}
          posterUrl={film.posterUrl}
          sizes="(max-width: 767px) 45vw, (max-width: 1023px) 30vw, (max-width: 1279px) 23vw, 260px"
          className="w-full border border-fest-ink/15 transition-colors duration-300 group-hover:border-fest-ink"
        />

        <h4 className="mt-3 font-fest-display text-[0.9375rem] font-bold uppercase leading-[1.15] tracking-[-0.005em] text-fest-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-300 group-hover:decoration-fest-ink md:text-base">
          {film.title}
        </h4>

        {when && (
          <p className="mt-1.5 font-fest-text text-[0.8125rem] italic leading-snug text-fest-ink/65">
            {when}
          </p>
        )}

        {runtime && (
          <p className="mt-auto border-t border-fest-ink/15 pt-2 font-fest-text text-[0.8125rem] tabular-nums text-fest-ink/55">
            {runtime}
          </p>
        )}
      </Link>
    </article>
  );
}
