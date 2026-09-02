"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Entrance and scroll motion for the podcast pages.
 *
 * Two markers, applied in the JSX:
 *
 *   data-enter          — part of the page-load sequence, staggered in source
 *                         order. Reserved for the hero; everything below the
 *                         fold has no business animating before it is seen.
 *   data-reveal-group   — reveals as it scrolls into view, staggering its own
 *                         direct children. Used on a section, not on each card,
 *                         so a grid arrives as one wave rather than as a dozen
 *                         independent triggers.
 *
 * `ready` gates the whole thing on the CMS fetch: the markup does not exist
 * while the skeletons are up, so running earlier would find nothing and leave
 * the real content unanimated when it arrives.
 *
 * A visitor who has asked their system for reduced motion gets no tweens at
 * all — not shortened ones. Every element is already in its final state in the
 * DOM, so skipping the animation is simply the page as it is meant to end up.
 */
export function usePodcastMotion(
  scope: RefObject<HTMLElement | null>,
  ready: boolean,
) {
  useGSAP(
    () => {
      if (!ready) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const entering = gsap.utils.toArray<HTMLElement>("[data-enter]");
      if (entering.length) {
        gsap.from(entering, {
          opacity: 0,
          y: 26,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          // Handed back to CSS once the tween is done, so a hover transform
          // on a revealed element is not fighting an inline one left behind.
          clearProps: "opacity,transform",
        });
      }

      const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");
      for (const group of groups) {
        const children = Array.from(group.children) as HTMLElement[];
        if (!children.length) continue;

        gsap.from(children, {
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: group,
            start: "top 88%",
            once: true,
          },
        });
      }
    },
    { scope, dependencies: [ready], revertOnUpdate: true },
  );
}
