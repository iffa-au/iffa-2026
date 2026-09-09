"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { Festival, FestivalPageSettings } from "../../lib/types";
import { formatFestivalDates } from "../../lib/festival-utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Where it happens, and the invitation to come.
 *
 * Venues and the closing call to action are one band rather than two sections:
 * they answer the same question — "so, can I go?" — and splitting them put a
 * section break between an address and the button you press after reading it.
 *
 * The house lights come up behind the invitation as it settles into view. It is
 * the last piece of motion on the page and it runs once, on scroll, so it reads
 * as the page arriving somewhere rather than as an effect waiting to be noticed.
 */
export function ClosingBand({
  festival,
  settings,
}: {
  festival: Festival | null;
  settings: FestivalPageSettings;
}) {
  const root = useRef<HTMLElement>(null);
  const { cta } = settings;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".closing-houselights",
          { opacity: 0, scaleY: 0.4 },
          {
            opacity: 1,
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 90%",
              end: "center center",
              scrub: 1,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-fest-room">
      {settings.venues.length > 0 && (
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-10 border-t border-fest-beam/12 pt-12 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-16">
            <div>
              <h2 className="font-fest-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold uppercase leading-[0.95] tracking-[-0.01em] text-fest-beam">
                {settings.planTitle}
              </h2>
              <p className="mt-5 max-w-[46ch] font-fest-text text-base leading-[1.7] text-fest-beam/65">
                {festival
                  ? `${festival.name} screens across ${festival.city || settings.city}, ${settings.country}. `
                  : `Every screening is in ${settings.city}, ${settings.country}. `}
                {settings.planBody}
              </p>
            </div>

            <ul className="grid gap-x-10 gap-y-0 self-start sm:grid-cols-2">
              {settings.venues.map((venue) => (
                <li
                  key={venue.name}
                  className="border-b border-fest-beam/12 py-4 font-fest-text text-fest-beam"
                >
                  {venue.name}
                  {venue.suburb && (
                    <span className="block text-sm italic text-fest-beam/50">
                      {venue.suburb}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* House lights: a warm wash rising from the floor of the section. */}
      <div
        aria-hidden
        className="closing-houselights pointer-events-none absolute inset-x-0 bottom-0 h-[80%] origin-bottom bg-[radial-gradient(ellipse_150%_105%_at_50%_118%,rgba(255,176,46,0.30),rgba(255,176,46,0.08)_38%,transparent_72%)]"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-24 pt-8 md:px-10 md:pb-36">
        <div className="border-t border-fest-beam/12 pt-14 md:pt-20">
          <p className="font-fest-text text-base italic text-fest-lamp/80">
            {cta.eyebrow}
          </p>

          <h2 className="mt-5 max-w-[15ch] font-fest-display text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.015em] text-fest-beam">
            {cta.heading}
          </h2>

          <p className="mt-8 max-w-[58ch] font-fest-text text-[1.0625rem] leading-[1.72] text-fest-beam/70 md:text-lg">
            {cta.body}
          </p>

          {festival && (
            <p className="mt-6 font-fest-display text-sm font-semibold uppercase tracking-[0.18em] text-fest-beam/50">
              {formatFestivalDates(festival)}
            </p>
          )}

          <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
            {cta.primaryCta.label && (
              <Link
                href={cta.primaryCta.href || "/contact"}
                className="inline-flex items-center justify-center bg-fest-lamp px-9 py-4 font-fest-display text-sm font-bold uppercase tracking-[0.16em] text-fest-ink transition-colors duration-300 hover:bg-fest-beam focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-lamp"
              >
                {cta.primaryCta.label}
              </Link>
            )}
            {cta.secondaryCta.label && (
              <Link
                href={cta.secondaryCta.href || "/contact"}
                className="inline-flex items-center justify-center border border-fest-beam/25 px-9 py-4 font-fest-display text-sm font-bold uppercase tracking-[0.16em] text-fest-beam transition-colors duration-300 hover:border-fest-lamp hover:text-fest-lamp focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fest-lamp"
              >
                {cta.secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
