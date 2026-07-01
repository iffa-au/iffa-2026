"use client";

import Link from "next/link";
import Hls from "hls.js";
import { memo, useEffect, useRef, useState } from "react";
import { fetchJsonCached } from "@/lib/media-cache";

type TrailerSectionProps = {
  videoslug?: string;
  videoUrl?: string;
  title?: string;
  youtubeUrl?: string;
  learnMoreUrl?: string;
};

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

    const isHls = src.endsWith(".m3u8");

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: false });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.once(Hls.Events.MANIFEST_PARSED, () => {
        hls.startLoad();
        onLoaded();
      });
      return () => hls.destroy();
    }

    video.src = src;
    video.load();
    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
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
            preload="none"
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
