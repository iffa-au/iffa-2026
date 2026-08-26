"use client";

import { useRef, useState } from "react";

type RobustBackdropImageProps = {
  src: string;
  fallbackSrc?: string;
  className?: string;
};

/**
 * A full-bleed backdrop image that never crops (blurred fill layer +
 * object-contain sharp layer on top) and never goes blank if the primary
 * URL is a broken/unloadable link (falls back once to `fallbackSrc`, then
 * gives up cleanly rather than leaving an empty frame).
 *
 * Both layers share one `src`, so a single broken image fires onError
 * twice (once per <img>) — `failedSrcRef` guards against that double-firing
 * advancing the fallback stage twice and skipping the fallback entirely.
 *
 * Pass `key={someIdThatChangesPerImage}` at the call site so React resets
 * this component's internal state when the image being shown changes.
 */
export function RobustBackdropImage({ src, fallbackSrc, className }: RobustBackdropImageProps) {
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

  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSrc}
        alt=""
        aria-hidden="true"
        className="h-full w-full scale-110 object-cover opacity-70 blur-2xl"
        onError={handleError}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain"
        onError={handleError}
      />
    </div>
  );
}
