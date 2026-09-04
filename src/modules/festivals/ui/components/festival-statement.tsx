"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { Festival, FestivalPageSettings } from "../../lib/types";
import {
  countFestivalDays,
  festivalCountries,
  formatFestivalDates,
} from "../../lib/festival-utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * What this year's festival is, and what IFFA is.
 *
 * Two different kinds of claim, so they are set as two different kinds of text:
 * this year's is a short statement in display type with the numbers that back
 * it up underneath, and the standing description of the festival is body copy
 * at a reading measure. The section carries no imagery — the hero above and the
 * posters below are already doing that, and a third picture here would just
 * compete.
 *
 * The stats count up rather than appearing: a number that arrives at its value
 * is the one piece of motion here, and it is motion that means something.
 */
export function FestivalStatement({
  festival,
  settings,
}: {
  festival: Festival | null;
  settings: FestivalPageSettings;
}) {
  const root = useRef<HTMLElement>(null);
  const { about } = settings;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".statement-rule", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        });

        // Counts to whatever the element already says, so the markup stays the
        // source of truth and a viewer with reduced motion — or with JS
        // disabled — reads the final number straight out of the HTML.
        gsap.from(".statement-banner", {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.3,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".statement-banner", start: "top 85%" },
        });

        gsap.utils.toArray<HTMLElement>(".statement-count").forEach((node) => {
          const target = Number(node.dataset.value);
          if (!Number.isFinite(target) || target <= 0) return;

          const counter = { value: 0 };
          gsap.to(counter, {
            value: target,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: node, start: "top 88%" },
            onUpdate: () => {
              node.textContent = String(Math.round(counter.value));
            },
          });
        });
      });
    },
    { scope: root },
  );

  const nights = festival ? countFestivalDays(festival) : 0;
  const countries = festival ? festivalCountries(festival) : [];

  /** Facts about this year, derived from the programme so they cannot go stale. */
  const facts = festival
    ? [
        { value: formatFestivalDates(festival), label: "Dates" },
        {
          value: String(festival.screenings.length),
          label: festival.screenings.length === 1 ? "Film" : "Films",
          countable: true,
        },
        {
          value: String(nights),
          label: nights === 1 ? "Night" : "Nights",
          countable: true,
        },
        {
          value: countries.length > 0 ? countries.join(", ") : "To be announced",
          label: countries.length === 1 ? "Country" : "Countries",
        },
      ]
    : [];

  return (
    <section ref={root} className="relative bg-fest-room pb-24 pt-4 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {festival && festival.description && (
          <div className="grid gap-8 border-t border-fest-beam/10 pt-12 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16 md:pt-16">
            <p className="max-w-[46ch] font-fest-text text-[clamp(1.3rem,2.7vw,2rem)] font-light leading-[1.42] text-fest-beam">
              {festival.description}
            </p>

            <dl className="grid grid-cols-2 gap-x-8 gap-y-7 self-end">
              {facts.map((fact) => (
                <div key={fact.label}>
                  {/* Field labels are set in the reading face, not the
                      condensed display one: at label size a condensed gothic
                      with letterspacing on it stops being readable, and a
                      tracked-out caps label above every value is the shape
                      this page is deliberately not. */}
                  <dt className="font-fest-text text-sm italic text-fest-lamp/75">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 font-fest-text text-base leading-snug text-fest-beam/85">
                    {fact.countable ? (
                      <span
                        className="statement-count font-fest-display text-3xl font-bold tabular-nums text-fest-beam"
                        data-value={fact.value}
                      >
                        {fact.value}
                      </span>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="statement-rule mt-16 h-px w-full origin-left bg-fest-beam/12 md:mt-24" />

        {/* Full width, not the two-column split this used to be. The left
            column held only the running head and left most of a 1400px row
            empty above the stats; the heading is the thing worth that width. */}
        <div className="mt-12 md:mt-16">
          <p className="font-fest-text text-base italic leading-relaxed text-fest-lamp/80">
            {about.eyebrow}
          </p>

          <h2 className="mt-4 max-w-[22ch] font-fest-display text-[clamp(2.5rem,7vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.015em] text-fest-beam">
            {about.heading}
          </h2>

          <div className="mt-9 grid gap-8 md:grid-cols-2 md:gap-14">
            {about.body.map((paragraph, index) => (
              <p
                key={index}
                className="max-w-[58ch] font-fest-text text-[1.0625rem] leading-[1.72] text-fest-beam/70 md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {about.imageUrl && (
          // Sits between the statement and the numbers, which is the one place
          // on this page a picture belongs: it closes the section rather than
          // competing with the hero above or the posters below.
          <div className="statement-banner relative mt-14 aspect-[21/9] overflow-hidden md:mt-20">
            <Image
              src={about.imageUrl}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-fest-room)_2%,transparent_45%)]"
            />
          </div>
        )}

        {about.stats.length > 0 && (
          <dl className="mt-16 flex flex-col border-t border-fest-beam/12 sm:flex-row md:mt-24">
            {about.stats.map((stat, index) => (
              <div
                key={index}
                className="flex-1 border-b border-fest-beam/12 py-7 sm:border-b-0 sm:border-r sm:px-8 sm:py-9 sm:first:pl-0 sm:last:border-r-0"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-fest-display text-[clamp(3rem,7vw,5rem)] font-extrabold leading-[0.85] text-fest-lamp">
                    {stat.value}
                  </span>
                  <span className="mt-4 block font-fest-text text-base text-fest-beam/60">
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
