"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Screening } from "../../lib/types";
import { formatScreeningDatesShort } from "../../lib/festival-utils";

/**
 * The programme's contents strip: every session at once, and where you are.
 *
 * A programme is read by someone deciding which night to come to, and until
 * now the only way from Thursday to Saturday was to scroll through Thursday's
 * whole lineup. Shortening the lineups helped; it did not fix the shape of the
 * problem, because a festival with eight sessions is long even when every
 * session is short. So the sessions get an index that stays on screen.
 *
 * It sticks under the site header — which is 121px tall, not the 88px the root
 * layout pads `main` by — and releases when the programme ends, because that
 * is exactly as long as it is any use.
 *
 * The current session is marked with a solid ink underline. That rule is
 * already the programme's own device: it is the line that sits under every
 * session heading, so the index says "you are in this one" in the section's
 * existing vocabulary rather than by introducing a highlighted pill.
 *
 * Plain `#id` anchors, so the index works before hydration and a session is
 * still a shareable link. The scroll listener only decides what is marked.
 */

/** Header (121px) + this strip + a little air. Anchors match it in `scroll-mt`. */
const ACTIVE_OFFSET = 200;

export function ProgrammeIndex({ screenings }: { screenings: Screening[] }) {
  const [activeId, setActiveId] = useState(screenings[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const ids = screenings.map((screening) => screening.id).join("|");

  // The last session whose top has passed the offset is the one being read.
  // Reading positions on scroll rather than observing intersections keeps the
  // answer right for a session taller than the viewport and for one shorter
  // than it, which is the range a lineup of one film to twenty covers.
  const syncActive = useCallback(() => {
    const sessionIds = ids ? ids.split("|") : [];
    let current = sessionIds[0] ?? "";

    for (const id of sessionIds) {
      const node = document.getElementById(id);
      if (node && node.getBoundingClientRect().top <= ACTIVE_OFFSET) current = id;
    }
    setActiveId(current);
  }, [ids]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        syncActive();
      });
    };

    // Through the same frame as a real scroll rather than straight away: the
    // page can load already scrolled — a shared link to one session — so the
    // index has to place itself on mount, but doing it in the effect body is a
    // setState during render's commit.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [syncActive]);

  // On a phone the strip scrolls sideways, so marking the active session is
  // no help if it is off the right-hand edge. Only the strip is scrolled —
  // `scrollIntoView` would drag the page with it and fight the reader.
  useEffect(() => {
    const list = listRef.current;
    const item = itemRefs.current[activeId];
    if (!list || !item) return;

    const target = item.offsetLeft - list.clientWidth / 2 + item.clientWidth / 2;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: Math.max(0, target), behavior: reduced ? "auto" : "smooth" });
  }, [activeId]);

  return (
    <nav
      aria-label="Sessions in this programme"
      className="sticky top-[121px] z-30 mt-10 border-y border-fest-ink/25 bg-fest-stock md:mt-14"
    >
      <ul
        ref={listRef}
        className="relative flex gap-7 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-10 [&::-webkit-scrollbar]:hidden"
      >
        {screenings.map((screening) => {
          const isActive = screening.id === activeId;

          return (
            <li
              key={screening.id}
              ref={(node) => {
                itemRefs.current[screening.id] = node;
              }}
            >
              <a
                href={`#${screening.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`block max-w-[22ch] border-b-2 pb-1 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fest-ink ${
                  isActive
                    ? "border-fest-ink text-fest-ink"
                    : "border-transparent text-fest-ink/50 hover:text-fest-ink"
                }`}
              >
                <span className="block truncate font-fest-text text-xs italic leading-tight">
                  {formatScreeningDatesShort(screening)}
                  {screening.time ? `, ${screening.time}` : ""}
                </span>

                <span className="block truncate font-fest-display text-base font-bold uppercase leading-tight tracking-[-0.005em]">
                  {screening.title}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
