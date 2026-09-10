"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { Festival, FestivalPageSettings } from "../../lib/types";
import { formatFestivalDates } from "../../lib/festival-utils";
import { FestivalButton } from "./festival-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The invitation to come.
 *
 * A venue band used to sit above the call to action — a "plan your festival"
 * heading, a line naming the city, and the festival's venues listed in two
 * columns. It was cut: a venue is a property of a screening, not of the
 * festival, and the screening already carries it on the programme, on the
 * screening page and on each film page. Listing every venue again at the foot
 * of the page told a visitor where the festival happens without telling them
 * which night is where, which is the only version of that question anyone
 * asks. It is gone along with the `venues`, `planTitle`, `planBody`, `city`
 * and `country` settings it read — schema, CMS inputs and stored fields.
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
              <FestivalButton href={cta.primaryCta.href || "/contact"} withArrow>
                {cta.primaryCta.label}
              </FestivalButton>
            )}
            {cta.secondaryCta.label && (
              <FestivalButton
                variant="secondary"
                href={cta.secondaryCta.href || "/contact"}
              >
                {cta.secondaryCta.label}
              </FestivalButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
