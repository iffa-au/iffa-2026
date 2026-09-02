"use client";

import { useRef, useState } from "react";

type PodcastPosterProps = {
  /** Poster URLs, widest first. See `posterCandidates` in lib/podcasts.ts. */
  candidates: string[];
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
};

/** YouTube's "no thumbnail here" placeholder is always exactly 120x90. */
const PLACEHOLDER_WIDTH = 120;

/**
 * A poster frame that steps down its source list instead of breaking.
 *
 * YouTube only generates `maxresdefault` for videos uploaded in HD, so the
 * widest URL is a guess for every episode and wrong for some. Falling back
 * needs two different signals, because YouTube's miss is not a normal failure:
 *
 *   onError — the ordinary case. A dead host, a CMS URL that 404s with no
 *             body, anything the browser cannot decode.
 *   onLoad  — the YouTube case. A missing thumbnail comes back as 404 *with a
 *             renderable 120x90 grey placeholder in the body*, and Chrome
 *             paints that and fires `load`. `onError` never runs, so a ladder
 *             built on it alone silently settles on the grey card — which is
 *             precisely what it existed to avoid. Measuring the decoded image
 *             is the only signal that separates the two, and the smallest real
 *             size below (`mqdefault`, 320px) leaves plenty of daylight.
 *
 * `failedRef` guards one URL being rejected twice: without it a double-fired
 * event would advance two steps and skip a perfectly good size.
 *
 * Plain <img> rather than next/image: the sources are YouTube's CDN, which is
 * not in `images.remotePatterns`, and an already-optimised 1280x720 JPEG has
 * nothing to gain from a second pass through the optimiser.
 */
export function PodcastPoster({
  candidates,
  alt,
  className = "",
  loading = "lazy",
  fetchPriority = "auto",
  sizes,
}: PodcastPosterProps) {
  const [index, setIndex] = useState(0);
  const failedRef = useRef<string | null>(null);

  const src = candidates[index];

  const reject = () => {
    if (failedRef.current === src) return;
    failedRef.current = src ?? null;
    setIndex((current) => current + 1);
  };

  if (!src) {
    // Out of candidates, or none to begin with. A flat panel reads as
    // deliberate; a broken-image glyph reads as a bug.
    return <div className={`bg-white/[0.04] ${className}`} aria-hidden="true" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      sizes={sizes}
      decoding="async"
      onError={reject}
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth <= PLACEHOLDER_WIDTH) reject();
      }}
    />
  );
}
