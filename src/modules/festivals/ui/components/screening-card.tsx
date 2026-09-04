import Link from "next/link";

import type { Screening, SeatStatus } from "../../lib/types";
import {
  SEAT_STATUS_LABEL,
  formatRuntime,
  screeningHref,
} from "../../lib/festival-utils";
import { PosterFrame } from "./poster-frame";

/**
 * One film on a night's programme.
 *
 * The date is on the day heading above, never on the card, so a row of films
 * from the same night does not repeat it six times. The whole card is one link
 * to the film's own page — synopsis, trailer, full credits — which is why
 * nothing here is interactive on its own: a play button inside a link is two
 * targets in one place, and the card would swallow the click either way.
 *
 * Set on paper with a hairline rule rather than as a rounded tile: this is a
 * printed programme, and eight identical bordered boxes would flatten a night
 * into eight equal blocks. The rule is on the bottom, not the top — the night
 * heading already draws a heavy rule above the first row, and a top border
 * here doubled it into two parallel lines.
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

export function ScreeningCard({ screening }: { screening: Screening }) {
  const meta = [
    screening.country,
    screening.year || null,
    screening.genre,
    screening.runtimeMinutes ? formatRuntime(screening.runtimeMinutes) : null,
  ].filter(Boolean);

  return (
    <article id={screening.id} className="scroll-mt-[140px]">
      <Link
        href={screeningHref(screening.id)}
        className="group flex h-full gap-5 border-b border-fest-ink/20 py-6 transition-colors duration-300 hover:bg-fest-ink/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fest-ink sm:gap-7"
      >
        <PosterFrame
          title={screening.title}
          country={screening.country}
          year={screening.year}
          posterUrl={screening.posterUrl}
          sizes="(max-width: 640px) 110px, 150px"
          className="w-[110px] shrink-0 sm:w-[150px]"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="font-fest-display text-2xl font-bold tabular-nums leading-none text-fest-ink md:text-[1.75rem]">
            {screening.time || "Time to be confirmed"}
          </p>

          <h4 className="mt-3 font-fest-display text-[clamp(1.375rem,2.4vw,1.875rem)] font-bold uppercase leading-[1.02] tracking-[-0.005em] text-fest-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-300 group-hover:decoration-fest-ink">
            {screening.title}
          </h4>

          {meta.length > 0 && (
            <p className="mt-2 font-fest-text text-[0.9375rem] italic text-fest-ink/65">
              {meta.join(", ")}
            </p>
          )}

          {screening.synopsis && (
            <p className="mt-3 line-clamp-2 max-w-[52ch] font-fest-text text-base leading-[1.65] text-fest-ink/75">
              {screening.synopsis}
            </p>
          )}

          <div className="mt-auto flex flex-wrap items-baseline gap-x-6 gap-y-1 pt-4 font-fest-text text-sm">
            {screening.venue && (
              <span className="text-fest-ink/70">{screening.venue}</span>
            )}
            <span className={SEAT_STATUS_CLASSES[screening.seatStatus]}>
              {SEAT_STATUS_LABEL[screening.seatStatus]}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
