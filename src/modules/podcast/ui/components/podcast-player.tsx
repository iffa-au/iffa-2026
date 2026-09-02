"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import { posterCandidates, youtubeEmbedUrl, type Podcast } from "../../lib/podcasts";
import { PodcastPoster } from "./podcast-poster";

type PodcastPlayerProps = {
  podcast: Podcast;
  /**
   * "facade" holds the poster frame until the visitor presses play, then swaps
   * in the real player in place. "embed" mounts the iframe immediately.
   */
  mode?: "facade" | "embed";
  /** Raise the poster's loading priority. For an above-the-fold player only. */
  priority?: boolean;
  className?: string;
};

/**
 * The embedded episode. The video plays here, on IFFA — there is no path out
 * of this component to youtube.com.
 *
 * Two modes, for two different jobs:
 *
 * "facade" is the landing hero. A YouTube iframe pulls roughly a megabyte of
 * player before anyone has decided to watch anything, which is a poor trade
 * for the first thing on a page. So the poster frame stands in, the browser is
 * told to warm the connections it will need, and the press of the play button
 * mounts the real player — already playing, because a click is the user
 * gesture autoplay policies ask for. Nothing starts on its own, and nothing
 * navigates away.
 *
 * "embed" is the detail page, where watching is the entire reason the visitor
 * arrived. The player is mounted with the page.
 *
 * Both sit in a fixed 16:9 box, so neither the swap nor the iframe's arrival
 * moves anything on the page.
 */
export function PodcastPlayer({
  podcast,
  mode = "facade",
  priority = false,
  className = "",
}: PodcastPlayerProps) {
  const [activated, setActivated] = useState(false);
  const showIframe = mode === "embed" || activated;

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}
    >
      {showIframe ? (
        <iframe
          src={youtubeEmbedUrl(podcast.youtubeVideoId, { autoplay: activated })}
          title={`${podcast.title} — IFFA Podcast`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <>
          {/* Warmed only while the facade is showing — once the iframe is up
              the connections are real and these hints have nothing to do. */}
          <link rel="preconnect" href="https://www.youtube-nocookie.com" />
          <link rel="preconnect" href="https://i.ytimg.com" />

          <button
            type="button"
            onClick={() => setActivated(true)}
            aria-label={`Play ${podcast.title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <PodcastPoster
              candidates={posterCandidates(podcast)}
              alt=""
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />

            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20 transition-colors duration-500 group-hover:from-black/60" />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-yellow-400 group-hover:bg-yellow-400 sm:h-20 sm:w-20 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                <Play className="ml-1 h-6 w-6 fill-white text-white transition-colors duration-300 group-hover:fill-black group-hover:text-black sm:h-7 sm:w-7" />
              </span>
            </span>

            <span className="absolute bottom-0 left-0 right-0 p-4 text-left sm:p-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-500">
                Play episode
              </span>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
