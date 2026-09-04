import Link from "next/link";

import type { Festival } from "../../lib/types";
import { countFestivalDays, formatFestivalDatesShort } from "../../lib/festival-utils";

/**
 * Previous editions.
 *
 * A festival that has run is a record, not a promotion, so this is set as an
 * index: year, name, size, and a link. It deliberately gets none of the page's
 * display type or motion — that weight belongs to the festival that is
 * actually coming.
 */
export function ArchiveBand({ festivals }: { festivals: Festival[] }) {
  if (festivals.length === 0) return null;

  return (
    <section className="relative bg-fest-deep py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <h2 className="font-fest-text text-base italic text-fest-beam/50">
          Previous editions
        </h2>

        <ul className="mt-6 flex flex-col border-t border-fest-beam/12">
          {festivals.map((festival) => (
            <li key={festival.slug}>
              <Link
                href={`/festivals/${festival.slug}`}
                className="group grid gap-x-8 gap-y-1 border-b border-fest-beam/12 py-5 transition-colors duration-300 hover:bg-fest-beam/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fest-lamp md:grid-cols-[6rem_minmax(0,1fr)_auto] md:items-baseline"
              >
                <span className="font-fest-display text-2xl font-bold tabular-nums leading-none text-fest-lamp">
                  {festival.year}
                </span>

                <span className="font-fest-display text-xl font-semibold uppercase leading-tight tracking-[-0.005em] text-fest-beam transition-colors duration-300 group-hover:text-fest-lamp md:text-2xl">
                  {festival.name}
                </span>

                <span className="font-fest-text text-sm italic text-fest-beam/45">
                  {formatFestivalDatesShort(festival)}
                  {festival.screenings.length > 0 && (
                    <>
                      {" — "}
                      {festival.screenings.length}{" "}
                      {festival.screenings.length === 1 ? "film" : "films"} over{" "}
                      {countFestivalDays(festival)}{" "}
                      {countFestivalDays(festival) === 1 ? "night" : "nights"}
                    </>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
