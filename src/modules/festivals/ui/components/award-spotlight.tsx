"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { FestivalPageSettings } from "../../lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The award, given the weight of an object rather than a bullet point.
 *
 * The trophy floats on an endless yoyo and its glow breathes against it, on a
 * deliberately different period so the two never sync into a single pulse. The
 * loop is paused until the section is on screen — an infinite tween running
 * behind three viewports of scroll is wasted work on a laptop battery.
 */
export function AwardSpotlight({ settings }: { settings: FestivalPageSettings }) {
  const root = useRef<HTMLElement>(null);
  const { award } = settings;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const float = gsap.to(".award-trophy", {
          y: -22,
          duration: 3.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        });

        const glow = gsap.to(".award-glow", {
          opacity: 0.85,
          scale: 1.12,
          duration: 4.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        });

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) => {
            if (isActive) {
              float.play();
              glow.play();
            } else {
              float.pause();
              glow.pause();
            }
          },
        });

        gsap.from(".award-trophy-wrap", {
          opacity: 0,
          scale: 0.86,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });

        gsap.from(".award-reveal", {
          opacity: 0,
          y: 30,
          duration: 0.9,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0b0a07] via-black to-black py-20 md:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Sized by height, not width: the trophy is 218x482, so a
              width-based box makes it taller than the viewport. */}
          <div className="award-trophy-wrap relative flex items-center justify-center py-6">
            <div
              aria-hidden
              className="award-glow absolute h-64 w-64 rounded-full bg-yellow-400/25 opacity-50 blur-[70px] md:h-80 md:w-80"
            />
            <div
              aria-hidden
              className="absolute h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.10),transparent_65%)] md:h-[26rem] md:w-[26rem]"
            />
            <Image
              src={award.imageUrl}
              alt=""
              aria-hidden
              width={218}
              height={482}
              sizes="(max-width: 1024px) 160px, 240px"
              className="award-trophy relative h-[320px] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.85)] md:h-[420px] lg:h-[480px]"
            />
          </div>

          <div>
            <p className="award-reveal text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
              {award.eyebrow}
            </p>

            <h2 className="award-reveal mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              {award.heading}
            </h2>

            <p className="award-reveal mt-7 max-w-prose text-sm leading-relaxed text-white/65 md:text-base">
              {award.body}
            </p>

            {award.points.length > 0 && (
              <ul className="mt-9 flex flex-col gap-4">
                {award.points.map((point, index) => (
                  <li
                    key={index}
                    className="award-reveal flex items-start gap-4 border-t border-white/10 pt-4 text-sm text-white/75"
                  >
                    <span
                      aria-hidden
                      className="mt-1 text-[11px] font-semibold tracking-[0.12em] text-yellow-400"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
