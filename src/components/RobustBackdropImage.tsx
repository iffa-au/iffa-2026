"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { canOptimizeImage } from "@/modules/events/submissions/lib/submissions";

type RobustBackdropImageProps = {
  src: string;
  fallbackSrc?: string;
  className?: string;
  /** Rendered width of the frame, as for next/image. Defaults to full width. */
  sizes?: string;
  /** The page's LCP image (the first carousel slide). */
  priority?: boolean;
};

/**
 * A full-bleed backdrop image that never crops (blurred fill layer +
 * object-contain sharp layer on top) and never goes blank if the primary
 * URL is a broken/unloadable link (falls back once to `fallbackSrc`, then
 * gives up cleanly rather than leaving an empty frame).
 *
 * Both layers go through next/image. They used to be raw <img>s, so every
 * slide and spotlight card downloaded the CMS original (up to ~2.5 MB); the
 * blurred layer now asks for a 64px copy, which looks the same under blur-2xl.
 *
 * Both layers share one `src`, so a single broken image fires onError
 * twice (once per <img>) — `failedSrcRef` guards against that double-firing
 * advancing the fallback stage twice and skipping the fallback entirely.
 *
 * Pass `key={someIdThatChangesPerImage}` at the call site so React resets
 * this component's internal state when the image being shown changes.
 */
export function RobustBackdropImage({
  src,
  fallbackSrc,
  className,
  sizes = "100vw",
  priority = false,
}: RobustBackdropImageProps) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const failedSrcRef = useRef<string | null>(null);

  const currentSrc = stage === 0 ? src : stage === 1 ? fallbackSrc : null;

  const handleError = () => {
    if (failedSrcRef.current === currentSrc) return;
    failedSrcRef.current = currentSrc ?? null;
    setStage((s) => {
      if (s === 0 && fallbackSrc && fallbackSrc !== src) return 1;
      return 2;
    });
  };

  if (!currentSrc) return null;

  const unoptimized = !canOptimizeImage(currentSrc);

  return (
    <div className={className}>
      <Image
        src={currentSrc}
        alt=""
        aria-hidden="true"
        fill
        sizes="64px"
        unoptimized={unoptimized}
        className="scale-110 object-cover opacity-70 blur-2xl"
        onError={handleError}
      />
      <Image
        src={currentSrc}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        unoptimized={unoptimized}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="object-contain"
        onError={handleError}
      />
    </div>
  );
}
