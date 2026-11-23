"use client";

import Link from "next/link";
import type Hls from "hls.js";
import { memo, useEffect, useId, useRef, useState, useCallback, type CSSProperties } from "react";
import { fetchJsonCached } from "@/lib/media-cache";
import { Pause, Play, Volume2, VolumeX, Maximize } from "lucide-react";
import TrailerModal from "./views/carousel/TrailerModal";
import { getTrailerEmbedUrl } from "@/modules/events/submissions/lib/submissions";

type TrailerSectionProps = {
  videoslug?: string;
  videoUrl?: string;
  title?: string;
  youtubeUrl?: string;
  learnMoreUrl?: string;
  /** Play on a curved cinema screen instead of the plain box. */
  curved?: boolean;
};

/*
  A cinema screen that wraps around the viewer: the top and bottom edges bow
  in 3.5% at the centre (Netflix's curve depth on their title pages), with
  small rounded corners. In 0–1 box units so one path serves the clip
  (clipPathUnits="objectBoundingBox") and the border (viewBox 0 0 1 1,
  stretched). Corners are ~20px at desktop width, smaller on phones, since box
  units scale with the screen. `control` is twice the centre depth; the
  corner points sit on the curve just inside the corners (≈ 0.03 × control).
*/
const screenPath = (control: number) => {
  const a = +(control * 0.03).toFixed(4);
  const b = +(1 - a).toFixed(4);
  return `M0,0.027 Q0,0 0.015,${a} Q0.5,${control} 0.985,${a} Q1,0 1,0.027 L1,0.973 Q1,1 0.985,${b} Q0.5,${+(1 - control).toFixed(4)} 0.015,${b} Q0,1 0,0.973 Z`;
};
const SCREEN_PATH = screenPath(0.07);
// On a phone the screen is ~200px tall, where a 3.5% bow reads as a warped
// box rather than a wide screen, so below `md` it bows 1.5%.
const SCREEN_PATH_SM = screenPath(0.03);

// Drop-shadows follow the curved shape (a box-shadow would be clipped away).
const SCREEN_SHADOW =
  "drop-shadow(0 12px 16px rgba(20, 20, 20, 0.9)) drop-shadow(0 40px 50px rgba(10, 10, 10, 0.95))";

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
  curved = false,
}: TrailerSectionProps) => {
  const [loading, setLoading] = useState(Boolean(videoslug && !videoUrl));
  const [src, setSrc] = useState<string | null>(videoUrl ?? null);
  const [posterSrc, setPosterSrc] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const userPausedRef = useRef(false);
  const modalOpenRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLCanvasElement | null>(null);
  const clipId = `screen-${useId().replace(/[^\w-]/g, "")}`;
  // Phone and desktop curves, switched by the `screen-clip` class below.
  const clip = {
    "--clip-sm": `url(#${clipId}-sm)`,
    "--clip-md": `url(#${clipId})`,
  } as CSSProperties;
  const clipClass = "[clip-path:var(--clip-sm)] md:[clip-path:var(--clip-md)]";
  useEffect(() => {
  const muteOtherTrailers = (event: Event) => {
    const video = videoRef.current;

    if (
      video &&
      (event as CustomEvent<HTMLVideoElement>).detail !== video
    ) {
      video.muted = true;
      setIsMuted(true);
    }
  };

  window.addEventListener("iffa:trailer-audio", muteOtherTrailers);

  return () => {
    window.removeEventListener(
      "iffa:trailer-audio",
      muteOtherTrailers
    );
  };
}, []);

  // Ambient light: the current frame, drawn into a tiny canvas a few times a
  // second and blown up behind the screen with a heavy blur, so the screen
  // lights the black around it like a cinema. drawImage works on cross-origin
  // video too (only reading pixels back is blocked). Paused off-screen.
  useEffect(() => {
    if (!curved || !isVisible || !isReady) return;
    const video = videoRef.current;
    const ctx = glowRef.current?.getContext("2d");
    if (!video || !ctx) return;

    const draw = () => {
      if (video.readyState >= 2) ctx.drawImage(video, 0, 0, 32, 18);
    };
    draw();
    const timer = window.setInterval(draw, 250);
    return () => window.clearInterval(timer);
  }, [curved, isVisible, isReady]);

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

    // Ready = the first frame is decoded, not just the manifest/metadata
    // (which arrive seconds earlier and left a blank black screen). It fires
    // even when autoplay is blocked, so the video never stays hidden.
    const onFrame = () => setIsReady(true);
    video.addEventListener("loadeddata", onFrame);

    const onLoaded = () => {
      if (!userPausedRef.current && !modalOpenRef.current) {
        video.play().catch(() => {});
      }
    };

    const playNative = () => {
      video.src = src;
      video.load();
      video.addEventListener("loadedmetadata", onLoaded);
    };
    const stopNative = () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("loadeddata", onFrame);
    };

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

    if (isVisible && !userPausedRef.current && !modalOpenRef.current) {
      video.play().catch(() => {});
    } else {
      video.pause();

      if (!isVisible) {
        video.muted = true;
        setIsMuted(true);
      }
    }
  }, [isVisible]);

  const togglePlayback = () => {
  const video = videoRef.current;
  if (!video || modalOpenRef.current) return;

  if (video.paused) {
    userPausedRef.current = false;
    video.play().catch(() => {});
  } else {
    userPausedRef.current = true;
    video.pause();
  }
};

const toggleSound = () => {
  const video = videoRef.current;
  if (!video || modalOpenRef.current) return;

  if (video.muted) {
    window.dispatchEvent(
      new CustomEvent("iffa:trailer-audio", {
        detail: video,
      })
    );
  }

  video.muted = !video.muted;
  setIsMuted(video.muted);
};

const openTrailer = () => {
  modalOpenRef.current = true;

  const video = videoRef.current;

  if (video) {
    video.pause();
    video.muted = true;
    setIsMuted(true);
  }

  window.dispatchEvent(
    new CustomEvent("iffa:trailer-audio")
  );

  setIsTrailerOpen(true);
};

const closeTrailer = useCallback(() => {
  modalOpenRef.current = false;
  setIsTrailerOpen(false);

  const video = videoRef.current;

  if (video && isVisible && !userPausedRef.current) {
    video.play().catch(() => {});
  }
}, [isVisible]);
const controlClass =
  "flex h-10 w-10 md:h-12 md:w-12 items-center justify-center " +
  "rounded-full border border-white/40 bg-black/60 text-white " +
  "backdrop-blur-sm cursor-pointer transition-all duration-200 " +
  "hover:bg-yellow-500 hover:text-black hover:border-yellow-500 " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-yellow-400";

const playbackControls = src && (
  <div className="absolute bottom-[8%] right-[5%] z-20 flex items-center gap-2 md:gap-3">

    <button
      type="button"
      onClick={togglePlayback}
      className={controlClass}
      aria-label={isPlaying ? "Pause trailer" : "Play trailer"}
      title={isPlaying ? "Pause trailer" : "Play trailer"}
    >
      {isPlaying ? (
        <Pause className="h-5 w-5" />
      ) : (
        <Play className="h-5 w-5" />
      )}
    </button>

    <button
      type="button"
      onClick={toggleSound}
      className={controlClass}
      aria-label={isMuted ? "Unmute trailer" : "Mute trailer"}
      title={isMuted ? "Unmute trailer" : "Mute trailer"}
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </button>

    <button
      type="button"
      onClick={openTrailer}
      className={controlClass}
      aria-label="Open pop-out trailer"
      aria-haspopup="dialog"
      title="Open pop-out trailer"
    >
      <Maximize className="h-5 w-5" />
    </button>

  </div>
);

  const player = (
    <>
      {(!isReady || loading) && (
        <div
          className={`absolute inset-0 flex items-center justify-center z-10 ${
            curved ? "" : "bg-zinc-900"
          }`}
        >
          <div className="w-8 h-8 animate-spin rounded-full" />
        </div>
      )}

      <video
        ref={videoRef}
        muted={isMuted}
        loop
        playsInline
        preload="none"
        poster={posterSrc ?? undefined}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        onVolumeChange={(e) => {
          setIsMuted(e.currentTarget.muted);
        }}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
      />
      {playbackControls}
    </>
  );

  // The curved (first) trailer gets a big white title with no dash, like the
  // title on Netflix's screen. `onVideo`: drawn over the screen, so it gets a
  // shadow to hold up on bright frames.
  const titleRow = (onVideo: boolean) => (
    <div className="flex items-center gap-4">
      {!curved && <div className="h-[1px] w-8 bg-yellow-600" />}
      <p
        className={`uppercase font-bold ${
          curved
            ? "text-white text-2xl md:text-4xl lg:text-5xl leading-tight tracking-[0.06em]"
            : "text-gray-500 text-[11px] tracking-[0.3em]"
        } ${onVideo ? "drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]" : ""}`}
      >
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
  );

  const watchButton = youtubeUrl && (
    <a
      href={youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-fit inline-block px-3 py-1.5 md:px-10 md:py-4 border font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] transition-all duration-300 rounded-sm text-center ${
        curved
          ? // Solid gold, like Netflix's filled Join now button.
            "border-yellow-500 bg-yellow-500 text-black hover:border-yellow-400 hover:bg-yellow-400"
          : "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
      }`}
    >
      Watch Trailer
    </a>
  );

  return (
    // overflow-x-clip: the ambient glow spills past the screen, and must not
    // widen the page on phones (clip, unlike hidden, adds no scroll box).
    <section ref={containerRef} className={`w-full bg-black py-12 ${curved ? "isolate overflow-x-clip" : ""}`}>
      <div className="max-w-[1400px] mx-auto px-6">
        {/* On the curved screen the title moves onto the video from `md` up. */}
        {title && <div className={`mb-6 ${curved ? "md:hidden" : ""}`}>{titleRow(false)}</div>}

        {curved ? (
          <div className="relative aspect-video w-full">
            <svg aria-hidden="true" className="absolute h-0 w-0">
              <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                <path d={SCREEN_PATH} />
              </clipPath>
              <clipPath id={`${clipId}-sm`} clipPathUnits="objectBoundingBox">
                <path d={SCREEN_PATH_SM} />
              </clipPath>
            </svg>

            {/* Ambient glow (see the effect above). Blank until the first
                frame, then fades in with the video. */}
            <canvas
              ref={glowRef}
              width={32}
              height={18}
              aria-hidden="true"
              className={`pointer-events-none absolute -z-10 -inset-[8%] h-[116%] w-[116%] blur-[60px] transition-opacity duration-1000 ${
                isReady ? "opacity-20" : "opacity-0"
              }`}
            />

            {/* The shadow sits on a static black copy of the shape behind the
                screen, so the filter isn't re-run on every video frame. */}
            <div aria-hidden="true" className="absolute inset-0" style={{ filter: SCREEN_SHADOW }}>
              <div className={`h-full w-full bg-black ${clipClass}`} style={clip} />
            </div>

            {/* Translucent glass fill: shows while loading. */}
            <div className={`absolute inset-0 bg-white/5 backdrop-blur-md ${clipClass}`} style={clip}>
              {player}
              {/* Eases the video into the curved bottom edge; short and light
                  enough to leave burned-in subtitles readable. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-black/50 to-transparent"
              />
              {/* Shades the bottom-left corner behind the title and button so
                  they stay readable on bright frames. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden md:block bg-[radial-gradient(ellipse_55%_60%_at_0%_100%,rgba(0,0,0,0.65),transparent)]"
              />
            </div>

            {/* Netflix-style: the title and Watch Trailer sit on the screen,
                bottom-left, clear of the curved edge. Phones keep them above
                and below the screen, where there's no room on the video. */}
            {(title || watchButton) && (
              <div className="absolute bottom-[12%] left-[30px] hidden md:flex flex-col items-center gap-5">
                {title && titleRow(true)}
                {watchButton}
              </div>
            )}

            {/* A CSS border can't follow a clip-path, so it is drawn as an SVG
                stroke along the same path, kept at 2.5px however it stretches.
                One per curve, swapped at `md` like the clip. */}
            {[
              [SCREEN_PATH_SM, "md:hidden"],
              [SCREEN_PATH, "hidden md:block"],
            ].map(([d, visibility]) => (
              <svg
                key={visibility}
                aria-hidden="true"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${visibility}`}
              >
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(234, 234, 234, 0.1)"
                  strokeWidth={2.5}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            ))}
          </div>
        ) : (
          <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-zinc-900 shadow-2xl border border-white/5">
            {player}
          </div>
        )}

        {watchButton && (
          // `relative` puts it in the same paint layer as the curved screen's
          // positioned shadow, and later in the DOM, so the shadow can't paint
          // over (and dim) the button.
          <div
            className={`relative flex justify-end px-2 md:px-0 pt-3 md:pt-4 ${
              curved ? "md:hidden" : ""
            }`}
          >
            {watchButton}
          </div>
        )}
      </div>
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={closeTrailer}
        embedUrl={getTrailerEmbedUrl(youtubeUrl)}
        videoUrl={src}
        sourceUrl={youtubeUrl}
        title={title || "Trailer"}
        showFooter={false}
        squareCorners={true}
      />
    </section>
  );
};

export default memo(TrailerSection);
