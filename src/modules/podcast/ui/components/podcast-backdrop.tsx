"use client";

import { posterCandidates, type Podcast } from "../../lib/podcasts";
import { PodcastPoster } from "./podcast-poster";

/**
 * The episode's own artwork, blurred out behind its hero.
 *
 * Every episode brings a different image, so the hero takes its colour from
 * whatever is playing rather than from a fixed background — the page reads as
 * being about this conversation, not as a template with a video dropped in.
 *
 * Layered dark: the blur alone leaves too much contrast for white type, so a
 * vertical gradient sinks the edges into the page background and a vignette
 * closes the corners. The result is a lit centre, which is where the player is.
 */
export function PodcastBackdrop({ podcast }: { podcast: Podcast }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <PodcastPoster
        candidates={posterCandidates(podcast)}
        alt=""
        loading="eager"
        className="h-full w-full scale-125 object-cover opacity-55 blur-3xl saturate-150"
      />
      {/* Sinks the top and bottom edges into the page so the section has no
          seam, while leaving the middle band lit. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 95% at 50% 45%, transparent 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      {/* A scrim over the lower half, where the title and metadata sit. The
          blur alone does not make the artwork a reliable background for small
          text — an episode with a pale poster would put white type on
          near-white. Weighted to the bottom so the band behind the player
          stays lit and only the type is protected. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/85" />
    </div>
  );
}
