"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import MoviesCard from "./MoviesCard";
import {
  mapSubmissionFilmListItem,
  type FilmCardItem,
  type SubmissionApiItem,
} from "@/modules/events/submissions/lib/submissions";

type CarouselProps = {
  year: number | string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_SUBMIT_FILM_URL ?? "";

/**
 * How many films the marquee shows. The endpoint returns the year's whole
 * approved list newest-first (sorted server-side), so taking the head gives
 * the most recent submissions.
 */
const MAX_FILMS = 10;

// Cache to prevent repeated requests across component mounts
const fetchCache: Record<string, FilmCardItem[]> = {};

const getCardWidth = (): number => {
  if (window.innerWidth < 640) return 280;
  if (window.innerWidth < 768) return 300;
  if (window.innerWidth < 1024) return 320;
  return 340;
};

const getGap = (): number => {
  if (window.innerWidth < 640) return 12;
  if (window.innerWidth < 768) return 16;
  return 24;
};

const Carousel = ({ year }: CarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [films, setFilms] = useState<FilmCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // One-shot reveal: once intersected we never flip back to hidden, and we
    // stop observing so a trailing `isIntersecting: false` can't undo it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.1, rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const controller = new AbortController();

    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);

        // Serve from cache if already fetched for this year
        const cacheKey = `featured_${year}`;
        if (fetchCache[cacheKey]) {
          setFilms(fetchCache[cacheKey]);
          return;
        }

        if (!API_BASE_URL) {
          setFilms([]);
          return;
        }

        // Deliberately not `&isFeatured=true`: that flag is the CMS's
        // hand-picked set of 5 for the submissions-page hero, isn't
        // year-scoped, and leaves this row empty for any year the admin
        // hasn't curated.
        const url = `${API_BASE_URL}/submissions?year=${year}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Failed to fetch featured films (${res.status})`);
        }

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          setFilms([]);
          return;
        }

        const data: unknown = await res.json();
        const items = Array.isArray(data) ? (data as SubmissionApiItem[]) : [];

        // The shared mapper, not a local one: MoviesCard also renders genre,
        // duration, cast, synopsis and the trailer, and a mapper that picks
        // only the poster fields leaves every one of those on its "TBA"
        // placeholder even though the API returns them.
        const mapped = items
          .slice(0, MAX_FILMS)
          .map((item) => mapSubmissionFilmListItem(item, String(year)));

        const duplicatedForScroll = [...mapped, ...mapped, ...mapped];
        // Only cache a real result — caching an empty/misshaped response would
        // stick for the whole page session and permanently blank the row.
        if (mapped.length > 0) {
          fetchCache[cacheKey] = duplicatedForScroll;
        }
        setFilms(duplicatedForScroll);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.warn("Failed to load featured films:", err);
          setError("Failed to load films.");
          setFilms([]);
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchFeatured();
    return () => controller.abort();
  }, [year, isVisible]);

  useEffect(() => {
    // The track only exists once revealed with films, so gate on both: this
    // effect must never attach a timeline to a stale/absent container.
    const container = containerRef.current;
    if (!isVisible || films.length === 0 || !container) return;

    const createAnimation = () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const cardWidth = getCardWidth();
      const gap = getGap();
      const originalSetWidth = (films.length / 3) * (cardWidth + gap);

      timelineRef.current = gsap.timeline({
        repeat: -1,
        onRepeat: () => gsap.set(container, { x: 0 }),
      });
      timelineRef.current.to(container, {
        x: -originalSetWidth,
        duration: originalSetWidth / 50,
        ease: "none",
      });
    };

    createAnimation();

    const handleMouseEnter = () => timelineRef.current?.pause();
    const handleMouseLeave = () => timelineRef.current?.resume();
    const handleResize = () => createAnimation();

    const wrapper = container.parentElement;
    wrapper?.addEventListener("mouseenter", handleMouseEnter);
    wrapper?.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      timelineRef.current?.kill();
      wrapper?.removeEventListener("mouseenter", handleMouseEnter);
      wrapper?.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [films, isVisible]);

  const renderBody = () => {
    if (!isVisible) return null;

    if (loading) {
      return (
        <div className="w-full p-6 md:p-10 lg:p-14 flex justify-center items-center">
          <div className="h-8 w-8 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full p-6 md:p-10 lg:p-14 text-center">
          <div className="text-red-400 text-sm md:text-base">{error}</div>
        </div>
      );
    }

    // Genuinely empty list renders nothing (and was never cached, so a later
    // mount will retry the fetch).
    if (films.length === 0) return null;

    return (
      <div className="w-full overflow-hidden p-6 md:p-10 lg:p-14 lg:h-[622px]">
        <div className="relative">
          <div className="overflow-hidden">
            <div
              ref={containerRef}
              className="flex gap-3 sm:gap-4 md:gap-6"
              style={{ width: "fit-content", willChange: "transform" }}
            >
              {films.map((film, idx) => (
                <div
                  key={`${film.movieId}-${idx}`}
                  className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px]"
                >
                  <MoviesCard film={film} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Single stable node for the observer: it mounts once and never unmounts,
  // so every state swap happens in its children. The min-height only applies
  // while collapsed, giving it size to intersect without adding a gap later.
  return (
    <div ref={sectionRef} className={isVisible ? "w-full" : "w-full min-h-[200px]"}>
      {renderBody()}
    </div>
  );
};

export default Carousel;
