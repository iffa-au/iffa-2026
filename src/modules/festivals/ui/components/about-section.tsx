"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { FestivalPageSettings } from "../../lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The quiet section after the hero: what the festival actually is.
 *
 * Deliberately typographic — no imagery competing with the banner above or the
 * posters below. The stats are read from the CMS rather than derived from the
 * schedule, because they describe the festival in general ("two a month"), not
 * whatever happens to be published this season.
 */
export function AboutSection({ settings }: { settings: FestivalPageSettings }) {
  const root = useRef<HTMLElement>(null);
  const { about } = settings;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".about-reveal", {
          opacity: 0,
          y: 34,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        });

        gsap.from(".about-rule", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        });

        gsap.from(".about-stat", {
          opacity: 0,
          y: 26,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-stats", start: "top 88%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative border-t border-white/10 bg-black py-20 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-yellow-400/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="about-reveal text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              {about.eyebrow}
            </p>
            <div className="about-rule mt-5 h-px w-24 bg-gradient-to-r from-yellow-400 to-transparent" />
          </div>

          <div>
            <h2 className="about-reveal text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              {about.heading}
            </h2>

            <div className="mt-8 flex flex-col gap-5">
              {about.body.map((paragraph, index) => (
                <p
                  key={index}
                  className="about-reveal max-w-prose text-sm leading-relaxed text-white/65 md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {about.stats.length > 0 && (
          <dl className="about-stats mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 md:mt-24">
            {about.stats.map((stat, index) => (
              <div key={index} className="about-stat bg-black px-6 py-8 md:px-8 md:py-10">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-4xl font-bold leading-none text-yellow-400 md:text-5xl">
                    {stat.value}
                  </span>
                  <span className="mt-3 block text-[11px] uppercase tracking-[0.2em] text-white/50">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
