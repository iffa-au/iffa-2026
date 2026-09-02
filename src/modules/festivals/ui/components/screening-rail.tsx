"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Screening } from "../../lib/types";
import { ScreeningPreviewCard } from "./screening-preview-card";

/**
 * A festival's screenings as a horizontal, snapping rail.
 *
 * A festival programmes five or so films; a grid of five poster cards under
 * every festival turns the page into a wall. The rail keeps each festival to a
 * single band, scales to any number of screenings, and on mobile becomes the
 * swipe most people already expect from a poster row.
 *
 * The rail is keyboard-reachable through the cards themselves — tabbing to an
 * off-screen card scrolls it into view — so the arrow buttons are a pointer
 * convenience and stay hidden from assistive tech.
 */

const GAP_PX = 20;

export function ScreeningRail({
  screenings,
  festivalSlug,
  festivalName,
}: {
  screenings: Screening[];
  festivalSlug: string;
  festivalName: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollOn, setCanScrollOn] = useState(false);

  const syncBounds = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const maxScroll = list.scrollWidth - list.clientWidth;
    setCanScrollBack(list.scrollLeft > 4);
    setCanScrollOn(list.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    syncBounds();
    window.addEventListener("resize", syncBounds);
    return () => window.removeEventListener("resize", syncBounds);
  }, [syncBounds]);

  const scrollByCard = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;

    // Step by one real card, measured rather than assumed, so the rail lands
    // on a snap point at every breakpoint.
    const card = list.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + GAP_PX : list.clientWidth * 0.8;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    list.scrollBy({
      left: step * direction,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
          Screenings
          <span aria-hidden className="px-2 text-white/20">
            ·
          </span>
          <span className="text-white/70">{screenings.length}</span>
        </h4>

        <div aria-hidden className="hidden gap-2 sm:flex">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollBack}
            aria-label={`Scroll ${festivalName} screenings back`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-yellow-400 hover:text-yellow-400 disabled:pointer-events-none disabled:opacity-25"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => scrollByCard(1)}
            disabled={!canScrollOn}
            aria-label={`Scroll ${festivalName} screenings forward`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-yellow-400 hover:text-yellow-400 disabled:pointer-events-none disabled:opacity-25"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <ul
          ref={listRef}
          onScroll={syncBounds}
          className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {screenings.map((screening) => (
            <ScreeningPreviewCard
              key={screening.id}
              screening={screening}
              festivalSlug={festivalSlug}
            />
          ))}
        </ul>

        {/* Edge fade: the only hint that the rail continues, once the
            scrollbar is hidden. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent transition-opacity duration-300 ${
            canScrollOn ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
