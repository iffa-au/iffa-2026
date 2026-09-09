"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { Festival, FestivalPageSettings, FestivalPhase } from "../../lib/types";
import { formatFestivalDatesShort } from "../../lib/festival-utils";
import { OpeningCountdown } from "./opening-countdown";
import { FilmGrain } from "./film-grain";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Dust caught in the throw.
 *
 * Hardcoded rather than randomised: this renders on the server too, and a
 * random position would differ between the two passes and trip hydration. Each
 * sits inside the beam's cone and drifts on its own period so they never move
 * as a block.
 */
const MOTES = [
  { left: "68%", top: "18%", size: "5px", duration: "13s", delay: "0s" },
  { left: "54%", top: "38%", size: "4px", duration: "17s", delay: "-3s" },
  { left: "76%", top: "52%", size: "6px", duration: "15s", delay: "-7s" },
  { left: "42%", top: "62%", size: "3px", duration: "19s", delay: "-11s" },
  { left: "62%", top: "74%", size: "5px", duration: "21s", delay: "-5s" },
  { left: "84%", top: "30%", size: "3px", duration: "16s", delay: "-14s" },
] as const;

/**
 * The opening frame: a projector striking its arc in a dark room.
 *
 * The premise the whole hero is built on is that the artwork is *projected*
 * rather than placed. The image is masked to a cone of light thrown from the
 * top right, so it exists only where the beam falls and dies away into the
 * room at the edges — which is why there is no full-bleed photo with a scrim
 * over it here, the usual way this section gets built.
 *
 * One orchestrated load sequence, in the order a projector actually starts:
 * the lamp strikes, the beam widens, the image appears in it, and the year is
 * wiped in by the light passing across it. Nothing fades up from below.
 *
 * All of it sits inside a `prefers-reduced-motion: no-preference` matchMedia
 * block, so a viewer who asked for less motion gets the finished frame on the
 * first paint rather than a degraded version of the animation.
 */
export function ProjectionHero({
  festival,
  settings,
  phase,
}: {
  festival: Festival | null;
  settings: FestivalPageSettings;
  phase: FestivalPhase;
}) {
  const root = useRef<HTMLElement>(null);
  const { hero } = settings;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".hero-year", { clipPath: "inset(0 100% 0 0)" });
        gsap.set(".hero-photo", { opacity: 0, scale: 1.06 });
        gsap.set(".hero-beam", { opacity: 0, scaleX: 0.1, scaleY: 0.75 });
        gsap.set(".hero-motes", { opacity: 0 });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          // The lamp: a hard flash at the projection port before anything else
          // is visible. Short and asymmetric, so it reads as ignition.
          .fromTo(
            ".hero-lamp",
            { opacity: 0, scale: 0.2 },
            { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
            0,
          )
          .to(".hero-lamp", { opacity: 0.55, duration: 0.8 }, 0.35)
          // The beam widens out of it.
          .to(
            ".hero-beam",
            { opacity: 1, scaleX: 1, scaleY: 1, duration: 1.3, ease: "power2.out" },
            0.2,
          )
          .to(".hero-motes", { opacity: 1, duration: 1.6 }, 0.9)
          // The frame the beam lands on.
          .to(".hero-photo", { opacity: 1, scale: 1, duration: 1.7 }, 0.3)
          .from(".hero-name", { opacity: 0, y: 14, duration: 0.7 }, 0.7)
          // The wipe is the light crossing the marquee — not a fade, not a rise.
          .to(
            ".hero-year",
            { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power2.inOut" },
            0.8,
          )
          .from(".hero-rule", { scaleX: 0, duration: 0.9 }, 1.1)
          .from(
            ".hero-line",
            { opacity: 0, y: 18, duration: 0.75, stagger: 0.09 },
            1.15,
          );

        // Scrolling away closes the beam down, so the section reads as the
        // shutter shutting rather than as a panel sliding off.
        gsap.to(".hero-beam", {
          opacity: 0.1,
          scaleX: 0.72,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".hero-copy", {
          y: -70,
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
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative -mt-[88px] flex min-h-[100svh] flex-col justify-end overflow-hidden bg-fest-room"
    >
      {/* Everything light-bearing shares one wrapper so the scroll scrub closes
          the beam and the picture together, as one shutter rather than two. */}
      {/* The banner, full frame. It was masked to the beam before, which
          hid most of it — the artwork is the first thing anyone sees and it
          has to be legible as a picture before it is legible as an idea. */}
      <div aria-hidden className="hero-projection absolute inset-0">
        <div className="hero-photo absolute inset-0">
          {hero.backgroundImageUrl && (
            <Image
              src={hero.backgroundImageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>

        {/* Legibility, not decoration: a floor under the copy on the left and
            a ceiling under the site header, leaving the top right — where the
            light comes from — the brightest part of the frame. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(4,6,12,0.94)_0%,rgba(4,6,12,0.78)_38%,rgba(4,6,12,0.28)_72%,rgba(4,6,12,0.12)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(to_bottom,rgba(4,6,12,0.85),transparent)]" />

        {/* The beam. Additive rather than painted on: mix-blend-screen means it
            can only ever add light to the frame, which is what a projector
            does and what stops it reading as a translucent grey wedge. The
            blur lives on this wrapper and the clip on the children — a
            clip-path applies after the element's own filter, so blurring and
            clipping the same element re-cuts the soft edge back to a hard
            diagonal. */}
        <div className="hero-beam absolute inset-0 origin-top-right mix-blend-screen blur-[40px]">
          <div className="absolute inset-0 [clip-path:polygon(83%_-5%,103%_-5%,56%_105%,-28%_105%)] bg-[linear-gradient(to_bottom_left,rgba(255,206,130,0.55),rgba(255,176,46,0.22)_35%,rgba(255,176,46,0.06)_65%,transparent_88%)]" />
          {/* Two brighter shafts inside the throw. A single even wedge reads as
              a shape; light picks out streaks. */}
          <div className="absolute inset-0 [clip-path:polygon(88%_-5%,92%_-5%,44%_105%,26%_105%)] bg-[linear-gradient(to_bottom_left,rgba(255,240,205,0.5),transparent_70%)]" />
          <div className="absolute inset-0 [clip-path:polygon(95%_-5%,98%_-5%,20%_105%,6%_105%)] bg-[linear-gradient(to_bottom_left,rgba(255,240,205,0.32),transparent_62%)]" />
        </div>

        {/* Dust in the beam. Six divs on one keyframe loop — the thing that
            makes a shaft of light read as air rather than as a gradient. */}
        <div className="hero-motes absolute inset-0 overflow-hidden mix-blend-screen">
          {MOTES.map((mote, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-fest-beam/70 blur-[1px] motion-reduce:animate-none"
              style={{
                left: mote.left,
                top: mote.top,
                width: mote.size,
                height: mote.size,
                animation: `festMote ${mote.duration} ease-in-out ${mote.delay} infinite`,
              }}
            />
          ))}
        </div>

        {/* The projection port. */}
        <div className="hero-lamp absolute right-[7%] top-0 h-44 w-44 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,247,228,0.95),rgba(255,176,46,0.45)_38%,transparent_72%)] blur-lg md:h-64 md:w-64" />
      </div>

      {/* Floor for the copy. Deliberately only at the bottom — the room's
          darkness elsewhere is the beam's falloff, not an overlay. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,var(--color-fest-room)_12%,rgba(6,8,15,0.82)_45%,transparent_100%)]"
      />

      <FilmGrain />

      <div className="hero-copy relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 pt-[150px] md:px-10 md:pb-20">
        <p className="hero-name font-fest-display text-[13px] font-medium uppercase tracking-[0.34em] text-fest-lamp md:text-sm">
          {hero.eyebrow}
        </p>

        {/* The year is the identity now that there is one festival a year, so
            it carries the display weight and the festival's own name sits
            under it as the line of text it actually is. */}
        {festival ? (
          <>
            <h1 className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1 md:mt-6">
              <span className="hero-year block font-fest-display text-[clamp(5.5rem,20vw,17rem)] font-extrabold leading-[0.78] tracking-[-0.02em] text-fest-beam">
                {festival.year}
              </span>
              <span className="hero-line font-fest-text text-[clamp(1.35rem,3.4vw,2.5rem)] font-normal italic leading-tight text-fest-beam/85">
                {festival.name}
              </span>
            </h1>

            <div className="hero-rule mt-7 h-px w-full origin-left bg-[linear-gradient(to_right,var(--color-fest-lamp),rgba(255,176,46,0.15)_45%,transparent)]" />

            <div className="mt-7 grid gap-x-14 gap-y-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <p className="hero-line font-fest-display text-[clamp(1.1rem,2.6vw,1.75rem)] font-semibold uppercase tracking-[0.06em] text-fest-beam">
                  {formatFestivalDatesShort(festival)}
                  <span className="px-3 font-light text-fest-lamp/60">/</span>
                  {festival.city || settings.city}
                </p>

                <p className="hero-line mt-4 max-w-[52ch] font-fest-text text-base leading-[1.65] text-fest-beam/65 md:text-lg">
                  {festival.tagline || hero.subtitle}
                </p>
              </div>

              <OpeningCountdown festival={festival} phase={phase} />
            </div>
          </>
        ) : (
          <>
            <h1 className="hero-year mt-4 max-w-[16ch] font-fest-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.01em] text-fest-beam md:mt-6">
              {hero.title}
            </h1>
            <div className="hero-rule mt-7 h-px w-full origin-left bg-[linear-gradient(to_right,var(--color-fest-lamp),transparent)]" />
            <p className="hero-line mt-7 max-w-[56ch] font-fest-text text-base leading-[1.65] text-fest-beam/65 md:text-lg">
              {hero.subtitle}
            </p>
          </>
        )}

        <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
          {hero.primaryCta.label && (
            <Link
              href={hero.primaryCta.href || "#programme"}
              className="hero-line inline-flex items-center justify-center bg-fest-lamp px-9 py-4 font-fest-display text-sm font-bold uppercase tracking-[0.16em] text-fest-ink transition-colors duration-300 hover:bg-fest-beam focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-lamp"
            >
              {hero.primaryCta.label}
            </Link>
          )}
          {hero.secondaryCta.label && (
            <Link
              href={hero.secondaryCta.href || "/"}
              className="hero-line inline-flex items-center justify-center border border-fest-beam/25 px-9 py-4 font-fest-display text-sm font-bold uppercase tracking-[0.16em] text-fest-beam transition-colors duration-300 hover:border-fest-lamp hover:text-fest-lamp focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-lamp"
            >
              {hero.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @keyframes festMote {
          0%   { transform: translate3d(0, 0, 0); opacity: 0; }
          15%  { opacity: 0.85; }
          85%  { opacity: 0.6; }
          100% { transform: translate3d(-90px, 130px, 0); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
