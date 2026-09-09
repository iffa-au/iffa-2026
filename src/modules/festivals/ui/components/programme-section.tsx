"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { ScreeningDay } from "../../lib/types";
import { formatDayHeading } from "../../lib/festival-utils";
import { ScreeningCard } from "./screening-card";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The programme, one section per night.
 *
 * This is where the page inverts: everything around it is a dark auditorium,
 * and the schedule is paper. The flip does the work an "Our Schedule" label
 * would otherwise do — you know you have arrived at the booklet because it
 * looks like the booklet.
 *
 * A horizontal reel of the same films used to sit above this. It was cut: it
 * showed exactly the programme shown here, so a visitor scrolled past every
 * film twice. Nights are the organising unit, they come straight from the
 * screening dates, and a festival can add or drop one with no change here.
 *
 * Each night's heading slides in as the section arrives — one move, and it
 * runs on the heading only. The films themselves are a list, and a list that
 * animates in piece by piece is slower to read than one that is simply there.
 */
export function ProgrammeSection({
  days,
  heading,
  intro,
  note,
}: {
  days: ScreeningDay[];
  heading: string;
  intro: string;
  /** Booking status, said once for the whole programme rather than per film. */
  note: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".night-heading").forEach((node) => {
          gsap.from(node, {
            opacity: 0,
            x: -28,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 88%" },
          });
        });

        gsap.utils.toArray<HTMLElement>(".night-rule").forEach((node) => {
          gsap.from(node, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 92%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="programme"
      className="relative scroll-mt-[121px] bg-fest-stock py-20 text-fest-ink md:py-28"
    >
      {/* The hero's primary button was authored in the CMS as "#schedule" when
          this section was the month-by-month schedule. Keeping the old anchor
          alive costs one empty span and means a link staff already saved does
          not quietly stop working. */}
      <span id="schedule" aria-hidden className="absolute -top-[121px]" />

      {/* Paper tooth. Low enough to be felt on a large flat area of cream and
          not seen anywhere else. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22p%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22/></filter><rect width=%22160%22 height=%22160%22 filter=%22url(%23p)%22/></svg>')] [background-size:160px_160px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end md:gap-16">
          <h2 className="max-w-[14ch] font-fest-display text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.015em]">
            {heading}
          </h2>

          <div>
            <p className="max-w-[52ch] font-fest-text text-lg leading-[1.65] text-fest-ink/75">
              {intro}
            </p>
            <p className="mt-4 font-fest-text text-base italic text-fest-ink/50">{note}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-16 md:mt-24 md:gap-24">
          {days.map((day) => (
            <section key={day.date} id={`night-${day.index}`} className="scroll-mt-[140px]">
              <header className="night-heading flex flex-wrap items-baseline gap-x-6 gap-y-2 pb-4">
                {/* Nights genuinely are a sequence, so they are numbered. */}
                <span className="font-fest-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[0.8] tracking-[-0.01em]">
                  {day.index}
                </span>
                <h3 className="font-fest-text text-[clamp(1.15rem,2.4vw,1.6rem)] italic leading-tight">
                  {formatDayHeading(day.date)}
                </h3>
                <span className="ml-auto font-fest-text text-base italic text-fest-ink/55">
                  {day.screenings.length}{" "}
                  {day.screenings.length === 1 ? "film" : "films"}
                </span>
              </header>

              <div className="night-rule h-0.5 w-full origin-left bg-fest-ink" />

              <div className="grid gap-x-12 lg:grid-cols-2">
                {day.screenings.map((screening) => (
                  <ScreeningCard key={screening.id} screening={screening} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
