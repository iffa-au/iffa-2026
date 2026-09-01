import type { Opportunity } from "../lib/types";

/**
 * PLACEHOLDER CONTENT — pending real data.
 *
 * The eight opportunities from the approved design.
 *
 * All eight are deliberately set to `status: "open"` with a matching
 * "Apply now" CTA — Cohort 1 is presented as fully open for applications. The
 * design's original mix exercised all seven status pills between them; that is
 * no longer true here, so the seven pill styles in `lib/status.ts` are now
 * proved only by their own definitions, not by this data. If you restore a
 * mixed set, change `ctaLabel` in step with `status` — the card renders the two
 * together and a mismatched pair contradicts itself on screen.
 *
 * `deliveryMode` is an explicit field rather than something parsed out of
 * `modeLabel`: the filter has to read a real value, and "Online + Melbourne
 * intensive" is a sentence, not a key.
 */

export const opportunities: Opportunity[] = [
  {
    id: "o1",
    streamSlug: "emerging-filmmakers-lab",
    title: "Emerging Filmmakers Lab",
    summary:
      "Six weeks of directing craft, project development and mentor tables, closing with a showcase to Australian and international guests.",
    status: "open",
    tags: ["Directing", "Writing"],
    discipline: "Directing",
    stage: "Emerging",
    deliveryMode: "Hybrid",
    modeLabel: "Online + Melbourne intensive",
    opensOn: "1 Jul 2026",
    closesOn: "29 Aug 2026",
    programDates: "5 Oct – 13 Nov 2026",
    cycle: "Cycle Two 2026",
    ctaLabel: "Apply now",
  },
  {
    id: "o2",
    streamSlug: "producers-project-development-lab",
    title: "Producers & Project Development Lab",
    summary:
      "Package a project properly: budgets, finance plans, market strategy and one-to-one sessions with working producers.",
    status: "open",
    tags: ["Producing", "Development"],
    discipline: "Producing",
    stage: "Early career",
    deliveryMode: "Online",
    modeLabel: "Online",
    opensOn: "1 Jul 2026",
    closesOn: "12 Aug 2026",
    programDates: "5 Oct – 13 Nov 2026",
    cycle: "Cycle Two 2026",
    ctaLabel: "Apply now",
  },
  {
    id: "o3",
    streamSlug: "actors-for-screen-lab",
    title: "Actors for Screen Lab",
    summary:
      "Self-tape technique, screen presence and casting-room practice with casting directors and screen acting coaches.",
    status: "open",
    tags: ["Acting", "Casting"],
    discipline: "Acting",
    stage: "Emerging",
    deliveryMode: "Hybrid",
    modeLabel: "Sydney + online",
    opensOn: "12 Sep 2026",
    closesOn: "17 Oct 2026",
    programDates: "Feb – Mar 2027",
    cycle: "Cycle One 2027",
    ctaLabel: "Apply now",
  },
  {
    id: "o4",
    streamSlug: "screenwriters-lab",
    title: "Screenwriters Lab",
    summary:
      "Feature and series development with structured table reads, script editors and a closing pitch to commissioners.",
    status: "open",
    tags: ["Writing", "Development"],
    discipline: "Writing",
    stage: "Emerging",
    deliveryMode: "Online",
    modeLabel: "Online",
    opensOn: "Jan 2027",
    closesOn: "Feb 2027",
    programDates: "Apr – Jun 2027",
    cycle: "Cycle One 2027",
    ctaLabel: "Apply now",
  },
  {
    id: "o5",
    streamSlug: "documentary-lab",
    title: "Documentary Lab",
    summary:
      "Ethics, access, story structure and impact strategy for first and second documentary projects.",
    status: "open",
    tags: ["Documentary"],
    discipline: "Documentary",
    stage: "Early career",
    deliveryMode: "Online",
    modeLabel: "Online",
    opensOn: "8 Jan 2026",
    closesOn: "20 Feb 2026",
    programDates: "13 Apr – 22 May 2026",
    cycle: "Cycle One 2026",
    ctaLabel: "Apply now",
  },
  {
    id: "o6",
    streamSlug: "international-screen-exchange",
    title: "International Screen Exchange",
    summary:
      "A cross-border cohort pairing Australian participants with mentors and peers across IFFA's festival network.",
    status: "open",
    tags: ["Directing", "Producing"],
    discipline: "Producing",
    stage: "Early career",
    deliveryMode: "Online",
    modeLabel: "Online",
    opensOn: "8 Jan 2026",
    closesOn: "20 Feb 2026",
    programDates: "13 Apr – 22 May 2026",
    cycle: "Cycle One 2026",
    ctaLabel: "Apply now",
  },
  {
    id: "o7",
    streamSlug: "regional-online-talent-lab",
    title: "Regional & Online Talent Lab",
    summary:
      "Built for practitioners outside capital cities — fully online, low bandwidth friendly, with data-cost support available.",
    status: "open",
    tags: ["All disciplines"],
    discipline: "Directing",
    stage: "Emerging",
    deliveryMode: "Online",
    modeLabel: "Online",
    opensOn: "Rolling",
    closesOn: "Rolling",
    programDates: "Both cycles",
    cycle: "Year-round",
    ctaLabel: "Apply now",
  },
  {
    id: "o8",
    streamSlug: "women-in-screen-leadership",
    title: "Women in Screen Leadership",
    summary:
      "Leadership, negotiation and department-head pathways for women and non-binary practitioners moving into senior roles.",
    status: "open",
    tags: ["Leadership", "Crew"],
    discipline: "Crew",
    stage: "Early career",
    deliveryMode: "Online",
    modeLabel: "Online",
    opensOn: "9 Jul 2025",
    closesOn: "22 Aug 2025",
    programDates: "6 Oct – 14 Nov 2025",
    cycle: "Cycle Two 2025",
    ctaLabel: "Apply now",
  },
];
