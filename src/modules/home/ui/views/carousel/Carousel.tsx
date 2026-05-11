"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import MoviesCard from "./MoviesCard";

type CarouselProps = {
  year: number | string;
};

type FilmItem = {
  movieId: string;
  title: string;
  posterUrl: string;
  directors: string[];
};

type ApiFilmResponse = {
  _id?: string;
  id?: string;
  title?: string;
  portraitImageUrl?: string;
  landscapeImageUrl?: string;
  directors?: string[];
};

// Hardcoded for now. Will be moved to env variable later.
const API_BASE_URL = "http://localhost:8000/api/v1";

// Cache to prevent repeated requests across component mounts
const fetchCache: Record<string, FilmItem[]> = {};

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
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [films, setFilms] = useState<FilmItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);

        // Serve from cache if already fetched for this year
        const cacheKey = `featured_${year}`;
        if (fetchCache[cacheKey]) {
          setFilms(fetchCache[cacheKey]);
          setLoading(false);
          return;
        }

        if (!API_BASE_URL) {
          setFilms([]);
          return;
        }

        const url = `${API_BASE_URL}/submissions?year=${year}&featured=true`;
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
        const items = Array.isArray(data) ? (data as ApiFilmResponse[]) : [];

        const mapped: FilmItem[] = items.map((item) => ({
          movieId: item.id ?? item._id ?? "",
          title: item.title ?? "",
          posterUrl:
            item.portraitImageUrl ??
            item.landscapeImageUrl ??
            "/fallbacks/no-poster.svg",
          directors: Array.isArray(item.directors) ? item.directors : [],
        }));

        const duplicatedForScroll = [...mapped, ...mapped, ...mapped];
        fetchCache[cacheKey] = duplicatedForScroll; // Cache the processed result
        setFilms(duplicatedForScroll);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.warn("Failed to load featured films:", err);
          setFilms([]);
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchFeatured();
    return () => controller.abort();
  }, [year]);

  useEffect(() => {
    if (films.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const createAnimation = () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const cardWidth = getCardWidth();
      const gap = getGap();
      const originalSetWidth = (films.length / 3) * (cardWidth + gap);

      timelineRef.current = gsap.timeline({ repeat: -1, ease: "none" });
      timelineRef.current.to(container, {
        x: -originalSetWidth,
        duration: originalSetWidth / 50,
        ease: "none",
        onComplete: () => {
          gsap.set(container, { x: 0 });
        },
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
  }, [films]);

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

export default Carousel;
