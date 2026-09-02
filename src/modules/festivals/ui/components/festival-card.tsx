import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GlobalIcon } from "@hugeicons/core-free-icons";

import type { Festival } from "../../lib/types";
import {
  countFestivalDays,
  festivalCountries,
  formatFestivalDates,
} from "../../lib/festival-utils";
import { ScreeningRail } from "./screening-rail";

/**
 * A festival on the index: identity above, its own screenings in a rail below.
 *
 * The two are deliberately different weights — the festival owns the artwork,
 * the display type and the border; the screenings sit inside it as a smaller,
 * repeating unit. That is what makes "this is a festival, these are its films"
 * read without a label saying so.
 */
export function FestivalCard({ festival }: { festival: Festival }) {
  const days = countFestivalDays(festival);
  const countries = festivalCountries(festival);
  const href = `/festivals/${festival.slug}`;

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors duration-500 hover:border-white/20 md:p-7 lg:p-8">
      <div className="grid gap-7 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden
          className="group relative block aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-zinc-950"
        >
          {/* Published-without-artwork is a normal state while a festival is
              being programmed; next/image throws on an empty src. */}
          {festival.heroImage ? (
            <Image
              src={festival.heroImage}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 620px"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-[#241f12] via-[#12100b] to-black"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"
          />
          <span className="absolute left-4 top-4 rounded-full border border-yellow-400/40 bg-black/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-400 backdrop-blur-sm">
            Festival {festival.edition}
          </span>
        </Link>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-yellow-400">
            {formatFestivalDates(festival)}
          </p>

          <h3 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-4xl">
            <Link
              href={href}
              className="rounded-sm transition-colors duration-300 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
            >
              {festival.name}
            </Link>
          </h3>

          <p className="mt-2.5 text-xs uppercase tracking-[0.16em] text-white/45">
            {festival.tagline}
          </p>

          <p className="mt-5 max-w-prose text-sm leading-relaxed text-white/65">
            {festival.description}
          </p>

          <p className="mt-6 flex flex-wrap items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
            <span>
              {festival.screenings.length}{" "}
              {festival.screenings.length === 1 ? "Screening" : "Screenings"}
            </span>
            <span aria-hidden className="px-2.5 text-white/20">
              ·
            </span>
            <span>
              {days} {days === 1 ? "Night" : "Nights"}
            </span>
            <span aria-hidden className="px-2.5 text-white/20">
              ·
            </span>
            <span>{festival.city}</span>
          </p>

          {/* Block-level, not inline-flex: the CTA below is inline and would
              otherwise share this line box and overlap the country list. */}
          <p className="mt-3 flex w-fit items-center gap-2 text-xs text-white/50">
            <HugeiconsIcon icon={GlobalIcon} size={13} color="currentColor" aria-hidden />
            {countries.join(" · ")}
          </p>

          <Link
            href={href}
            className="group mt-7 inline-flex items-center gap-2.5 rounded-md border border-yellow-400/70 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 transition-colors duration-300 hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Explore Screenings
            <ArrowRight
              aria-hidden
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </Link>
        </div>
      </div>

      <div className="mt-9">
        <ScreeningRail
          screenings={festival.screenings}
          festivalSlug={festival.slug}
          festivalName={festival.name}
        />
      </div>
    </article>
  );
}
