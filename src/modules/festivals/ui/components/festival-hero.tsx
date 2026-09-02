"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { FestivalPageSettings } from "../../lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Full-bleed opening frame for the Festivals page.
 *
 * Pulled up behind the fixed site header with a negative margin (the shared
 * layout pads `main` by 88px), so the banner runs edge to edge and the header
 * floats over it — then padded back so the text never sits under the nav.
 *
 * Two animations, both optional: the words rise into place on load, and the
 * background drifts slower than the page on scroll. Both are declared inside a
 * `gsap.matchMedia` block keyed to `prefers-reduced-motion: no-preference`, so
 * a viewer who has asked for less motion gets the finished frame immediately
 * rather than a degraded version of the animation.
 */
export function FestivalHero({ settings }: { settings: FestivalPageSettings }) {
  const root = useRef<HTMLElement>(null);
  const image = useRef<HTMLDivElement>(null);

  const { hero } = settings;
  // Word-by-word so the title can rise in a stagger behind its own mask.
  const words = hero.title.split(" ").filter(Boolean);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-eyebrow", { opacity: 0, y: 16, duration: 0.7 }, 0.15)
          .from(
            ".hero-word",
            { yPercent: 115, duration: 1, stagger: 0.07 },
            0.25
          )
          .from(".hero-sub", { opacity: 0, y: 20, duration: 0.8 }, 0.7)
          .from(".hero-cta", { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 }, 0.85)
          .from(".hero-cue", { opacity: 0, duration: 0.8 }, 1.1);

        // The image is rendered 120% tall, so drifting it never exposes an edge.
        gsap.to(image.current, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Copy leaves a little faster than the picture, which is what reads as
        // depth rather than as two layers moving together.
        gsap.to(".hero-copy", {
          y: -60,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom center",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative -mt-[88px] flex min-h-[100svh] items-end overflow-hidden bg-black"
    >
      <div ref={image} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <Image
          src={hero.backgroundImageUrl}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Legibility stack: a floor for the copy, a ceiling for the header, and
          a warm tint that ties the photo to the site's gold accent. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/90 to-transparent"
      />
      {/* The banner is busy behind the headline, so the copy gets its own
          scrim rather than relying on the bottom gradient alone. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(250,204,21,0.16),transparent_60%)]"
      />

      <div className="hero-copy relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-[160px] md:px-8 md:pb-32">
        <p className="hero-eyebrow flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
          <span aria-hidden className="h-px w-10 bg-yellow-400/70 md:w-16" />
          {hero.eyebrow}
        </p>

        <h1 className="mt-6 max-w-5xl text-[clamp(2.25rem,7vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-tight text-white">
          {words.map((word, index) => (
            // The mask is the point: each word slides up from behind its own
            // clipped box rather than fading in place.
            <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.08em]">
              <span className="hero-word inline-block">
                {word}
                {index < words.length - 1 && " "}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-sub mt-7 max-w-2xl text-sm leading-relaxed text-white/75 md:text-lg">
          {hero.subtitle}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          {hero.primaryCta.label && (
            <Link
              href={hero.primaryCta.href || "#schedule"}
              className="hero-cta inline-flex items-center justify-center rounded-md bg-yellow-400 px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {hero.primaryCta.label}
            </Link>
          )}
          {hero.secondaryCta.label && (
            <Link
              href={hero.secondaryCta.href || "/"}
              className="hero-cta inline-flex items-center justify-center rounded-md border border-white/30 px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              {hero.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>

      <div
        aria-hidden
        className="hero-cue absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.28em] text-white/40">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          {/* CSS, not GSAP: a decorative loop this small should not hold a
              ScrollTrigger open for the life of the page. */}
          <span className="absolute inset-x-0 top-0 h-4 animate-[scrollCue_2s_ease-in-out_infinite] bg-yellow-400 motion-reduce:animate-none" />
        </span>
      </div>

      <style>{`
        @keyframes scrollCue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  );
}
