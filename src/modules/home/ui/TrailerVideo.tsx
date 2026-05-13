"use client";

// External libraries and React hooks
import Link from "next/link";
import Hls from "hls.js";
import { memo, useEffect, useRef, useState } from "react";

type TrailerSectionProps = {
  videoslug?: string;
  videoUrl?: string;
  title?: string;
  youtubeUrl?: string;
  learnMoreUrl?: string;
};

// Expected shape of media data returned by backend
type MediaApiResponse = {
  s3Key?: string;
  videoS3Key?: string;
  imageS3Key?: string;
  photoS3Key?: string;
  posterS3Key?: string;
};

// Public environment values for backend API and CloudFront media domain
const API_URL = process.env.NEXT_PUBLIC_SUBMIT_FILM_URL;
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL ?? "";

// Builds a valid CloudFront URL by safely joining base URL and media key
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
}: TrailerSectionProps) => {
  // Local UI state for loading, media sources, and playback state
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState<string | null>(null);
  const [posterSrc, setPosterSrc] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // Fetches media details for the given slug from backend
  const fetchMedia = async (videoSlug: string): Promise<MediaApiResponse | null> => {
    if (!API_URL) {
      console.error("Missing NEXT_PUBLIC_SUBMIT_FILM_URL environment variable.");
      return null;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/media-assets/title/${videoSlug}`, {
        cache: "no-store",
      });
      const data = res.ok ? ((await res.json()) as MediaApiResponse) : null;
      setLoading(false);
      return data;
    } catch (err) {
      console.error(err);
      setLoading(false);
      return null;
    }
  };

  // Loads video and poster keys, then converts them to CloudFront URLs.
  useEffect(() => {
    if (videoUrl) {
      setSrc(videoUrl);
      setLoading(false);
      return;
    }
    if (!videoslug) return;

    const loadMedia = async () => {
      const media = await fetchMedia(videoslug);
      if (!media) return;

      const videoKey = media.videoS3Key ?? media.s3Key;
      if (videoKey) {
        setSrc(buildCloudFrontUrl(videoKey));
      }

      const photoKey = media.photoS3Key ?? media.imageS3Key ?? media.posterS3Key;
      if (photoKey) {
        setPosterSrc(buildCloudFrontUrl(photoKey));
      }
    };

    loadMedia();
  }, [videoslug, videoUrl]);

  // Detects when section is on screen to lazy-start playback logic.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.4 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Initializes and manages playback when video is visible and source exists.
  useEffect(() => {
    if (!isVisible || !src) return;

    const video = videoRef.current;
    if (!video) return;

    setIsReady(false);

    const onLoaded = () => {
      setIsReady(true);
      video.play().catch(() => {});
    };

    const isHls = src.endsWith(".m3u8");

    if (isHls && Hls.isSupported()) {
      // Chrome / Firefox: use hls.js
      const hls = new Hls({ autoStartLoad: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.once(Hls.Events.MANIFEST_PARSED, onLoaded);
      return () => hls.destroy();
    } else {
      // Safari (native HLS) or plain mp4/etc.
      video.src = src;
      video.load();
      video.addEventListener("loadedmetadata", onLoaded);
      return () => video.removeEventListener("loadedmetadata", onLoaded);
    }
  }, [isVisible, src]);

  // Keeps playback in sync with viewport visibility.
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

        <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-zinc-900 shadow-2xl border border-white/5">
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
            preload="metadata"
            poster={posterSrc ?? undefined}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              isReady ? "opacity-100" : "opacity-0"
            }`}
          />
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