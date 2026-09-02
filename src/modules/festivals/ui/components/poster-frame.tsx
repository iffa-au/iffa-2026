"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * A film poster, or a typographic stand-in when there is no artwork.
 *
 * Almost nothing in the current programme has a real poster yet. A single
 * shared "poster unavailable" plate would repeat down a page whose whole point
 * is artwork, so when `posterUrl` is null — or the URL fails to load — the
 * frame draws a poster from the film's own title instead. Swap `posterUrl` in
 * the data and real artwork takes over with no UI change.
 *
 * Type inside the stand-in is sized in `cqw`, so one component covers the
 * 150px card thumbnail and the 260px rail poster without a size prop.
 */

const POSTER_TINTS = [
  "from-[#241f12] via-[#12100b] to-[#0a0908]",
  "from-[#121d24] via-[#0b1014] to-[#08090a]",
  "from-[#221420] via-[#130c12] to-[#0a080a]",
  "from-[#14231b] via-[#0b120e] to-[#080a09]",
  "from-[#231616] via-[#140c0c] to-[#0a0808]",
] as const;

/** Stable per title, so a film keeps the same stand-in across every page. */
const tintFor = (seed: string): string => {
  let total = 0;
  for (let index = 0; index < seed.length; index += 1) {
    total += seed.charCodeAt(index);
  }
  return POSTER_TINTS[total % POSTER_TINTS.length];
};

type PosterFrameProps = {
  title: string;
  country: string;
  year: number;
  posterUrl: string | null;
  /** Passed straight to next/image; required so the optimiser picks a width. */
  sizes: string;
  priority?: boolean;
  /** Extra classes on the frame itself — sizing, not aspect ratio. */
  className?: string;
};

export function PosterFrame({
  title,
  country,
  year,
  posterUrl,
  sizes,
  priority = false,
  className = "",
}: PosterFrameProps) {
  const [failed, setFailed] = useState(false);
  const showArtwork = Boolean(posterUrl) && !failed;

  return (
    <div
      className={`@container relative aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-zinc-950 ${className}`}
    >
      {showArtwork ? (
        <Image
          src={posterUrl as string}
          alt={`${title} poster`}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : (
        <div
          role="img"
          aria-label={`${title} — poster artwork to be announced`}
          className={`flex h-full w-full flex-col justify-between bg-gradient-to-br p-[7cqw] ${tintFor(title)}`}
        >
          <span
            aria-hidden
            className="text-[4cqw] font-semibold uppercase tracking-[0.3em] text-yellow-400/70"
          >
            IFFA
          </span>

          <span
            aria-hidden
            className="text-[10.5cqw] font-bold uppercase leading-[1.1] tracking-[-0.01em] text-white/85"
          >
            {title}
          </span>

          <span aria-hidden className="text-[4.2cqw] uppercase tracking-[0.16em] text-white/40">
            {country} · {year}
          </span>

          {/* Ambient wash, so the plates read as artwork rather than as an error. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[20cqw] -top-[20cqw] h-[60cqw] w-[60cqw] rounded-full bg-yellow-400/[0.07] blur-2xl"
          />
        </div>
      )}
    </div>
  );
}
