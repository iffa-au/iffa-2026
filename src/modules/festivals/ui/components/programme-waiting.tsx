"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { Festival } from "../../lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Shown while there is no programme to show.
 *
 * A normal state for most of the year, not an error — so it is built as a
 * title card rather than as an empty panel. The two halves of the line arrive
 * from opposite sides and meet in the middle, which is the one moment on the
 * page that earns a countdown-leader treatment: a leader is literally what a
 * projectionist threads while everyone waits.
 *
 * Deliberately does not print the settings' booking line. That copy reads
 * "every screening time and venue below is confirmed programming", which
 * contradicts itself on the one screen where there is nothing below.
 *
 * Everything here is CSS and one GSAP timeline. The rotating leader and the
 * sweeping wipe both stop under `prefers-reduced-motion`, leaving the finished
 * card — which still says what it needs to say.
 */
export function ProgrammeWaiting({ festival }: { festival: Festival | null }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: root.current, start: "top 78%" },
          })
          .from(".waiting-leader", { opacity: 0, scale: 0.7, duration: 0.9 }, 0)
          .from(".waiting-left", { opacity: 0, xPercent: -55, duration: 1.1 }, 0.15)
          .from(".waiting-right", { opacity: 0, xPercent: 55, duration: 1.1 }, 0.15)
          .from(".waiting-body", { opacity: 0, y: 18, duration: 0.8 }, 0.75);

        // The leader keeps turning while the card is on screen, and stops when
        // it is not — an infinite tween behind three viewports of scroll is
        // wasted work on a laptop battery.
        const spin = gsap.to(".waiting-leader-sweep", {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration: 4,
          ease: "none",
          repeat: -1,
          paused: true,
        });

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => (isActive ? spin.play() : spin.pause()),
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="programme"
      className="relative scroll-mt-[121px] overflow-hidden bg-fest-stock py-24 text-fest-ink md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22p%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22/></filter><rect width=%22160%22 height=%22160%22 filter=%22url(%23p)%22/></svg>')] [background-size:160px_160px]"
      />

      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-5 text-center md:px-10">
        {/* Academy leader: crosshair, rings, and a sweeping arm. */}
        <div className="waiting-leader relative h-32 w-32 md:h-44 md:w-44">
          <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
            <g className="waiting-leader-sweep">
              <path d="M50 50 L50 2 A48 48 0 0 1 94 34 Z" fill="currentColor" fillOpacity="0.12" />
            </g>
          </svg>
        </div>

        <h2 className="mt-10 font-fest-display text-[clamp(2.25rem,7vw,5.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.015em]">
          {/* Two blocks, not one heading with a line break: each arrives from
              its own side, and they have to be separate elements to do that. */}
          <span className="waiting-left block">The next festival is</span>
          <span className="waiting-right block text-fest-ink/55">being programmed</span>
        </h2>

        <p className="waiting-body mt-8 max-w-[54ch] font-fest-text text-lg leading-[1.65] text-fest-ink/70">
          {festival
            ? `${festival.name} is confirmed and its films are being finalised now. Every screening, time and venue will be published here as soon as the programme is locked.`
            : "Screening schedules are published here as soon as they are announced. Register your interest and we will let you know the moment the programme goes live."}
        </p>

      </div>
    </section>
  );
}
