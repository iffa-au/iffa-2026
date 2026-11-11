"use client";

import Link from "next/link";
import type Hls from "hls.js";
import { memo, useEffect, useRef, useState } from "react";
import { fetchJsonCached } from "@/lib/media-cache";

type TrailerSectionProps = {
  videoslug?: string;
  videoUrl?: string;
  title?: string;
  youtubeUrl?: string;
  learnMoreUrl?: string;
  /** From `md` up, play the video on the screen of a cinema photo. Phones keep the plain player. */
  theater?: boolean;
};

/*
  The screen in theater.webp (1672×941) is curved: straight sides at x 276.8
  and 1392.8, a top edge from y 140.0 at the corners to 158.4 at the centre,
  and a bottom edge from 792.6 at the corners to 779.7 at the centre (both
  parabolas, measured from the pixels to within ~0.3px). The box is the
  bounding rectangle and the clip-path traces the two curves, everything 1px
  outside the white so no edge of the printed screen shows.
  Replace the image → re-measure the box, the curve and the aspect ratio.
*/
const THEATER_SCREEN =
  "md:absolute md:left-[16.495%] md:top-[14.770%] md:w-[66.866%] md:h-[69.561%] md:aspect-auto md:rounded-none md:border-0 md:shadow-none md:[clip-path:polygon(0%_0%,8.333%_0.851%,16.667%_1.556%,25%_2.105%,33.333%_2.497%,41.667%_2.734%,50%_2.814%,58.333%_2.738%,66.667%_2.505%,75%_2.117%,83.333%_1.572%,91.667%_0.871%,100%_0.024%,100%_99.983%,91.667%_99.392%,83.333%_98.903%,75%_98.523%,66.667%_98.252%,58.333%_98.09%,50%_98.037%,41.667%_98.092%,33.333%_98.257%,25%_98.531%,16.667%_98.914%,8.333%_99.406%,0%_100%)]";

type MediaApiResponse = {
  s3Key?: string;
  videoS3Key?: string;
  imageS3Key?: string;
  photoS3Key?: string;
  posterS3Key?: string;
};

const API_URL = process.env.NEXT_PUBLIC_SUBMIT_FILM_URL;
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL ?? "";

const buildCloudFrontUrl = (key: string) => {
  const normalizedBase = CLOUDFRONT_URL.endsWith("/")
    ? CLOUDFRONT_URL.slice(0, -1)
    : CLOUDFRONT_URL;
  const normalizedKey = key.startsWith("/") ? key : `/${key}`;
  return `${normalizedBase}${normalizedKey}`;
};

const TrailerSection = ({
  videoslug,
  videoUrl,
  title,
  youtubeUrl,
  learnMoreUrl,
  theater = false,
}: TrailerSectionProps) => {
  const [loading, setLoading] = useState(Boolean(videoslug && !videoUrl));
  const [src, setSrc] = useState<string | null>(videoUrl ?? null);
  const [posterSrc, setPosterSrc] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25, rootMargin: "150px" },
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || videoUrl || !videoslug || !API_URL) return;

    let cancelled = false;

    const loadMedia = async () => {
      setLoading(true);
      const media = await fetchJsonCached<MediaApiResponse>(
        `${API_URL}/media-assets/title/${videoslug}`,
      );

      if (cancelled) return;

      if (media) {
        const videoKey = media.videoS3Key ?? media.s3Key;
        if (videoKey) {
          setSrc(buildCloudFrontUrl(videoKey));
        }

        const photoKey =
          media.photoS3Key ?? media.imageS3Key ?? media.posterS3Key;
        if (photoKey) {
          setPosterSrc(buildCloudFrontUrl(photoKey));
        }
      }

      setLoading(false);
    };

    void loadMedia();
    return () => {
      cancelled = true;
    };
  }, [isVisible, videoslug, videoUrl]);

  useEffect(() => {
    if (!isVisible || !src) return;

    const video = videoRef.current;
    if (!video) return;

    setIsReady(false);

    const onLoaded = () => {
      setIsReady(true);
      video.play().catch(() => {});
    };

    const playNative = () => {
      video.src = src;
      video.load();
      video.addEventListener("loadedmetadata", onLoaded);
    };
    const stopNative = () => video.removeEventListener("loadedmetadata", onLoaded);

    if (!src.endsWith(".m3u8")) {
      playNative();
      return stopNative;
    }

    // hls.js is ~160 KB gzipped, so it is fetched when the first HLS trailer
    // comes into view rather than with the page; MP4 trailers never load it.
    // Same engine choice as before: hls.js wherever it is supported, the
    // browser's own HLS (Safari/iOS) otherwise.
    let cancelled = false;
    let hls: Hls | null = null;
    import("hls.js")
      .then(({ default: HlsPlayer }) => {
        if (cancelled) return;
        if (!HlsPlayer.isSupported()) {
          playNative();
          return;
        }
        const player = new HlsPlayer({ autoStartLoad: false });
        hls = player;
        player.loadSource(src);
        player.attachMedia(video);
        player.once(HlsPlayer.Events.MANIFEST_PARSED, () => {
          player.startLoad();
          onLoaded();
        });
      })
      .catch(() => {
        // The chunk failed to load (offline, deploy mid-visit): try native.
        if (!cancelled) playNative();
      });

    return () => {
      cancelled = true;
      hls?.destroy();
      stopNative();
    };
  }, [isVisible, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) video.play().catch(() => {});
    else video.pause();
  }, [isVisible]);

  return (
    <section ref={containerRef} className="w-full bg-black py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        {title && (
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-yellow-600" />
            <p className="text-gray-500 uppercase tracking-[0.3em] text-[11px] font-bold">
              {title}
            </p>
            {learnMoreUrl && (
              <Link
                href={learnMoreUrl}
                className="shrink-0 px-4 py-1.5 border border-yellow-600 text-yellow-600 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-yellow-600 hover:text-black transition-all duration-300 rounded-sm"
              >
                Learn More
              </Link>
            )}
          </div>
        )}

        {/* A CSS background rather than next/image: it only exists from `md`
            up, so phones never download it (a hidden <img> still loads). */}
        <div
          className={
            theater
              ? "relative md:aspect-[1672/941] md:bg-[url('/assets/mockups/theater.webp')] md:bg-cover"
              : undefined
          }
        >
          {/* Fades the photo's edges into the section's black, like the hero
              banner's bottom fade. It sits under the screen box (which comes
              later in the DOM), and every stop ends before the screen's edges,
              so the trailer itself is never dimmed. */}
          {theater && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden md:block bg-[linear-gradient(to_right,#000,transparent_12%,transparent_88%,#000),linear-gradient(to_bottom,#000,transparent_10%,transparent_86%,#000)]"
            />
          )}
          <div
            className={`relative aspect-video w-full overflow-hidden rounded-sm bg-zinc-900 shadow-2xl border border-white/5 ${
              theater ? THEATER_SCREEN : ""
            }`}
          >
            {(!isReady || loading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
                <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent animate-spin rounded-full" />
              </div>
            )}

            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              poster={posterSrc ?? undefined}
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                isReady ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>

        {youtubeUrl && (
          <div className="flex justify-end px-2 md:px-0 pt-3 md:pt-4">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit inline-block px-3 py-1.5 md:px-10 md:py-4 border border-yellow-500 text-yellow-500 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-yellow-500 hover:text-black transition-all duration-300 rounded-sm text-center"
            >
              Watch Trailer
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(TrailerSection);
