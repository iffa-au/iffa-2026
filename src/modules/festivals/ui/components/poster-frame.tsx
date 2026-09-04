"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * A film poster, or a typographic stand-in when there is no artwork.
 *
 * Almost nothing in a programme has a real poster while it is being
 * announced. A single shared "poster unavailable" plate would repeat down a
 * page whose whole point is artwork, so when `posterUrl` is null — or the URL
 * fails to load — the frame sets a poster from the film's own title instead.
 * Swap `posterUrl` in the CMS and real artwork takes over with no UI change.
 *
 * Type inside the stand-in is sized in `cqw`, so one component covers the
 * small programme thumbnail and the full-height reel poster without a size
 * prop.
 */

/**
 * Ink tints for the stand-in plates. All five are the same warm dark as the
 * room, pushed a little in different directions, so a row of them reads as a
 * set of posters rather than as five different error states.
 */
const POSTER_TINTS = [
  "from-[#1d1610] via-[#0d0a07] to-[#06080f]",
  "from-[#101a20] via-[#080d11] to-[#06080f]",
  "from-[#1c1119] via-[#0d080c] to-[#06080f]",
  "from-[#111d17] via-[#080f0c] to-[#06080f]",
  "from-[#1e1412] via-[#0e0908] to-[#06080f]",
] as const;

/** Stable per title, so a film keeps the same stand-in everywhere it appears. */
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
      className={`@container relative aspect-[2/3] overflow-hidden bg-fest-deep ${className}`}
    >
      {showArtwork ? (
        <Image
          src={posterUrl as string}
          alt={`${title} poster`}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={`${title} — poster artwork to be announced`}
          className={`flex h-full w-full flex-col justify-between bg-gradient-to-br p-[8cqw] ${tintFor(title)}`}
        >
          <span
            aria-hidden
            className="font-fest-display text-[4cqw] font-medium tracking-[0.32em] text-fest-lamp/70"
          >
            IFFA
          </span>

          <span
            aria-hidden
            className="font-fest-display text-[13cqw] font-bold uppercase leading-[0.92] tracking-[-0.005em] text-fest-beam/90"
          >
            {title}
          </span>

          <span
            aria-hidden
            className="font-fest-text text-[4.2cqw] italic text-fest-beam/45"
          >
            {country}
            {country && year ? ", " : ""}
            {year || ""}
          </span>

          {/* A shaft of lamplight across the plate, so an artwork-less film
              still looks lit rather than looking like a gap. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[25cqw] -top-[30cqw] h-[80cqw] w-[80cqw] rounded-full bg-fest-lamp/[0.09] blur-2xl"
          />
        </div>
      )}
    </div>
  );
}
