"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { FestivalPageSettings } from "../../lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The award, lit like an object on a stand rather than listed as a feature.
 *
 * The room has gone dark again after the programme, and the only light in it
 * is on the trophy. The pool of light breathes on a longer period than the
 * trophy's float, so the two never lock into a single pulse and start reading
 * as one mechanical loop.
 *
 * Both loops are paused until the section is on screen. An infinite tween
 * running behind three viewports of scroll is wasted work on a laptop battery.
 */
export function AwardPanel({ settings }: { settings: FestivalPageSettings }) {
  const root = useRef<HTMLElement>(null);
  const { award } = settings;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const float = gsap.to(".award-trophy", {
          y: -20,
          duration: 3.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        });

        const pool = gsap.to(".award-pool", {
          opacity: 0.9,
          scale: 1.1,
          duration: 4.3,
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
              pool.play();
            } else {
              float.pause();
              pool.pause();
            }
          },
        });

        // The spotlight comes up on it, which is the arrival — not a fade-up of
        // the whole block.
        gsap.from(".award-light", {
          opacity: 0,
          scaleY: 0.3,
          transformOrigin: "top center",
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        });

        gsap.from(".award-trophy-wrap", {
          opacity: 0,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-fest-room py-20 md:py-32"
    >
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* Sized by height, not width: the trophy is 218x482, so a
              width-based box makes it taller than the viewport. */}
          <div className="award-trophy-wrap relative flex items-center justify-center py-6">
            {/* The beam itself, thrown from above and stopping at the plinth. */}
            <div
              aria-hidden
              className="award-light absolute top-0 h-full w-[70%] [clip-path:polygon(38%_0%,62%_0%,100%_100%,0%_100%)] bg-[linear-gradient(to_bottom,rgba(255,176,46,0.16),transparent_78%)]"
            />
            <div
              aria-hidden
              className="award-pool absolute h-64 w-64 rounded-full bg-fest-lamp/20 opacity-55 blur-[70px] md:h-80 md:w-80"
            />
            <Image
              src={award.imageUrl}
              alt=""
              aria-hidden
              width={218}
              height={482}
              sizes="(max-width: 1024px) 160px, 240px"
              className="award-trophy relative h-[300px] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.85)] md:h-[400px] lg:h-[460px]"
            />
          </div>

          <div>
            <p className="font-fest-text text-base italic text-fest-lamp/80">
              {award.eyebrow}
            </p>

            <h2 className="mt-5 max-w-[16ch] font-fest-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.01em] text-fest-beam">
              {award.heading}
            </h2>

            <p className="mt-8 max-w-[62ch] font-fest-text text-[1.0625rem] leading-[1.72] text-fest-beam/70 md:text-lg">
              {award.body}
            </p>

            {award.points.length > 0 && (
              // Not numbered: these are three separate conditions of the award,
              // not three steps in an order.
              <ul className="mt-10 flex flex-col border-t border-fest-beam/12">
                {award.points.map((point, index) => (
                  <li
                    key={index}
                    className="border-b border-fest-beam/12 py-4 font-fest-text text-base leading-relaxed text-fest-beam/80"
                  >
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
