"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { FestivalPageSettings } from "../../lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Closing call to action.
 *
 * The sweep behind it is tied to scroll rather than run on a loop: it finishes
 * as the section settles into the viewport, so it reads as the page arriving
 * somewhere instead of as an animation waiting to be noticed.
 */
export function FestivalCta({ settings }: { settings: FestivalPageSettings }) {
  const root = useRef<HTMLElement>(null);
  const { cta } = settings;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cta-reveal", {
          opacity: 0,
          y: 30,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        });

        gsap.fromTo(
          ".cta-sweep",
          { xPercent: -120 },
          {
            xPercent: 120,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-black px-5 pb-24 pt-6 md:px-8 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-yellow-300/25 bg-gradient-to-br from-[#3d3211] via-[#191509] to-black px-6 py-16 text-center md:px-16 md:py-24">
          <div
            aria-hidden
            className="cta-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-3xl">
            <p className="cta-reveal text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              {cta.eyebrow}
            </p>

            <h2 className="cta-reveal mt-5 text-3xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl">
              {cta.heading}
            </h2>

            <p className="cta-reveal mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              {cta.body}
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              {cta.primaryCta.label && (
                <Link
                  href={cta.primaryCta.href || "/"}
                  className="cta-reveal group inline-flex items-center justify-center gap-2.5 rounded-md bg-yellow-400 px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {cta.primaryCta.label}
                  <ArrowRight
                    aria-hidden
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  />
                </Link>
              )}
              {cta.secondaryCta.label && (
                <Link
                  href={cta.secondaryCta.href || "/"}
                  className="cta-reveal inline-flex items-center justify-center rounded-md border border-white/25 px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  {cta.secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
