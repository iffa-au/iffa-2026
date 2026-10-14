"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import TrailerSection from "@/modules/home/ui/TrailerVideo";
import { fetchHomepageTrailers } from "@/modules/home/lib/homepage-trailers-api";
import type { HomepageTrailer } from "@/modules/home/data/homepage-trailers";

type TrailersState = { status: "loading" } | { status: "ready"; trailers: HomepageTrailer[] };

const TrailersContext = createContext<TrailersState>({ status: "loading" });

/**
 * Fetches the trailer list once for all five slots. Renders no element of its
 * own, so the page's server-rendered sections pass through untouched.
 */
export function HomepageTrailersProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TrailersState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetchHomepageTrailers(controller.signal)
      .then((trailers) => setState({ status: "ready", trailers }))
      .catch(() => {
        // Only an abort reaches here (unmount) — nothing to show.
      });
    return () => controller.abort();
  }, []);

  return <TrailersContext.Provider value={state}>{children}</TrailersContext.Provider>;
}

/**
 * One of the homepage's five trailer positions. While the list loads it shows
 * the same empty player box and spinner TrailerSection always shows, so the
 * page doesn't jump; an unfilled slot renders nothing.
 *
 * `className` goes on a wrapper that exists only while the slot shows
 * something — the place for the negative margins that tuck a trailer under its
 * neighbours, so an empty slot can't pull those neighbours together.
 *
 * Keyed on the video so a changed URL remounts the player — TrailerSection
 * reads `videoUrl` into state once, at mount.
 */
export function TrailerSlot({ index, className }: { index: number; className?: string }) {
  const state = useContext(TrailersContext);
  const trailer = state.status === "ready" ? state.trailers[index] : undefined;
  if (state.status === "ready" && !trailer) return null;

  const section = trailer ? (
    <TrailerSection
      key={trailer.videoUrl}
      videoUrl={trailer.videoUrl}
      title={trailer.title || undefined}
      youtubeUrl={trailer.youtubeUrl}
      learnMoreUrl={trailer.learnMoreUrl}
    />
  ) : (
    <TrailerSection />
  );

  return className ? <div className={className}>{section}</div> : section;
}
