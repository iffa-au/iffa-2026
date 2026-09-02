"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * The month indicator: which month you are looking at, and a jump to any other.
 *
 * Deliberately not a date picker and not a filter — every month stays on the
 * page, so nothing is hidden behind a tab. The bar highlights whichever month
 * section currently sits under the header, and clicking one scrolls to it.
 *
 * `top-[120px]` and `SPY_OFFSET` are both tied to the height of the fixed site
 * header in `shared/components/header.tsx` (logo 80px + 2 x 20px padding).
 * If that header's height changes, both numbers move with it.
 */

const SPY_OFFSET = 200;

export type MonthNavItem = {
  /** Matches the `id` on the month section it scrolls to. */
  id: string;
  label: string;
  meta: string;
};

export function MonthNav({ months }: { months: MonthNavItem[] }) {
  const [activeId, setActiveId] = useState(months[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      // The active month is the last one whose top edge has passed under the
      // header — which is what "the month you are currently reading" means.
      let current = months[0]?.id ?? "";
      for (const month of months) {
        const section = document.getElementById(month.id);
        if (section && section.getBoundingClientRect().top <= SPY_OFFSET) {
          current = month.id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [months]);

  const scrollToMonth = useCallback((id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setActiveId(id);
    section.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  return (
    <nav
      aria-label="Festival months"
      className="sticky top-[120px] z-30 border-y border-white/10 bg-black/85 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <ul className="flex gap-6 overflow-x-auto [scrollbar-width:none] md:gap-10 [&::-webkit-scrollbar]:hidden">
          {months.map((month) => {
            const isActive = month.id === activeId;

            return (
              <li key={month.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => scrollToMonth(month.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`group border-b-2 py-4 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                    isActive
                      ? "border-yellow-400"
                      : "border-transparent hover:border-white/25"
                  }`}
                >
                  <span
                    className={`block text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                      isActive ? "text-yellow-400" : "text-white/70 group-hover:text-white"
                    }`}
                  >
                    {month.label}
                  </span>
                  <span
                    className={`mt-1 block text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                      isActive ? "text-yellow-400/60" : "text-white/35"
                    }`}
                  >
                    {month.meta}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
