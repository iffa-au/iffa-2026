"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import type { Screening } from "../../lib/types";
import { ProgrammeIndex } from "./programme-index";
import { ScreeningBlock } from "./screening-block";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The programme, one section per screening.
 *
 * This is where the page inverts: everything around it is a dark auditorium,
 * and the schedule is paper. The flip does the work an "Our Schedule" label
 * would otherwise do — you know you have arrived at the booklet because it
 * looks like the booklet.
 *
 * Sections used to be nights. They are now screenings, because a screening
 * gained a date range and stopped belonging to a single one: a strand running
 * Thursday to Saturday had to be either duplicated under three nights or filed
 * under one of them arbitrarily. Sessions are also what a reader is actually
 * choosing between — you book a session, not an evening.
 *
 * Each session's heading slides in as it arrives — one move, and it runs on
 * the heading only. The films themselves are a list, and a list that animates
 * in piece by piece is slower to read than one that is simply there.
 *
 * The rule under each heading used to wipe in from the left as a second move.
 * It went when the index arrived: the index marks the current session with
 * that same rule, and a device cannot be a live indicator in one place and
 * decoration in another without the reader learning to ignore it. It also
 * meant a rule that had already been wiped could be jumped back to and be
 * caught mid-animation, which a navigation control makes a routine event
 * rather than an unlikely one.
 */
export function ProgrammeSection({
  screenings,
  heading,
  intro,
}: {
  /** In programme order — `orderScreenings` has already sorted these. */
  screenings: Screening[];
  heading: string;
  intro: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".screening-heading").forEach((node) => {
          gsap.from(node, {
            opacity: 0,
            x: -28,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 88%" },
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
      className="relative scroll-mt-[121px] bg-fest-stock py-16 text-fest-ink md:py-24"
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
        <div className="grid gap-6 md:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] md:items-end md:gap-12">
          <h2 className="max-w-[18ch] font-fest-display text-[clamp(2.25rem,5vw,4rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.015em]">
            {heading}
          </h2>

          <p className="max-w-[52ch] font-fest-text text-lg leading-[1.65] text-fest-ink/75">
            {intro}
          </p>
        </div>

        {/* One session needs no index of sessions. */}
        {screenings.length > 1 && <ProgrammeIndex screenings={screenings} />}

        <div className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-24">
          {screenings.map((screening, index) => (
            <ScreeningBlock
              key={screening.id}
              screening={screening}
              index={String(index + 1).padStart(2, "0")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
