import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";

import type { Screening } from "../../lib/types";
import { formatRuntime, formatShortDate } from "../../lib/festival-utils";
import { PosterFrame } from "./poster-frame";

/**
 * The compact form of a screening, used in a festival's rail on the index.
 * It answers when / where / what country at a glance and links straight to the
 * film's own entry in that festival's schedule.
 */
export function ScreeningPreviewCard({
  screening,
  festivalSlug,
}: {
  screening: Screening;
  festivalSlug: string;
}) {
  return (
    <li className="w-[188px] shrink-0 snap-start sm:w-[220px]">
      <Link
        href={`/festivals/${festivalSlug}#${screening.id}`}
        className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        <PosterFrame
          title={screening.title}
          country={screening.country}
          year={screening.year}
          posterUrl={screening.posterUrl}
          sizes="(max-width: 640px) 188px, 220px"
        />

        <p className="mt-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-400">
          {formatShortDate(screening.date)}
          <span aria-hidden className="px-1.5 text-yellow-400/40">
            ·
          </span>
          {screening.time}
        </p>

        <h4 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-yellow-400">
          {screening.title}
        </h4>

        <p className="mt-1 text-xs text-white/55">
          {screening.country}
          <span aria-hidden className="px-1.5 text-white/25">
            ·
          </span>
          {screening.year}
        </p>

        <p className="mt-0.5 text-[11px] text-white/35">
          {screening.genre}
          <span aria-hidden className="px-1.5 text-white/20">
            ·
          </span>
          {formatRuntime(screening.runtimeMinutes)}
        </p>

        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-white/45">
          <HugeiconsIcon icon={Location01Icon} size={12} color="currentColor" aria-hidden />
          {screening.venue}
        </p>
      </Link>
    </li>
  );
}
