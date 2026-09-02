import type { TalentLabEvent } from "../lib/types";

/**
 * PLACEHOLDER CONTENT — pending real data.
 *
 * The six sessions from the approved design, verbatim. Speaker names match
 * entries in `mentors-data.ts`.
 *
 * `state` is the single source for the upcoming / past split — the events page
 * partitions on it rather than keeping two hand-maintained lists, so moving a
 * session to "past" is a one-word edit.
 *
 * `registerHref` is `null` on every entry: no ticketing destination exists yet,
 * so `event-card` renders an inert, `aria-disabled` register action. Populate
 * the field to activate it.
 */

export const events: TalentLabEvent[] = [
  {
    slug: "pitching-to-screen-agencies",
    title: "Pitching to Screen Agencies",
    when: "Thu 20 Aug 2026 · 6:00–7:30pm AEST",
    format: "Online masterclass",
    speakerName: "Marcus Whitely",
    speakerRole: "Producer",
    mode: "Online (Zoom)",
    state: "upcoming",
    description:
      "A working producer walks through what a screen agency assessor actually reads first, how much detail a development application needs, and the three most common reasons strong projects are knocked back.",
    registerHref: null,
  },
  {
    slug: "self-tape-clinic-for-screen-actors",
    title: "Self-Tape Clinic for Screen Actors",
    when: "Wed 2 Sep 2026 · 6:30–8:00pm AEST",
    format: "Online workshop",
    speakerName: "Elena Vasquez",
    speakerRole: "Casting Director",
    mode: "Online (Zoom)",
    state: "upcoming",
    description:
      "Live feedback on submitted self-tapes, covering framing, sound, choices and the etiquette of a casting submission.",
    registerHref: null,
  },
  {
    slug: "low-budget-lighting-design",
    title: "Low-Budget Lighting Design",
    when: "Tue 15 Sep 2026 · 6:00–7:30pm AEST",
    format: "In-person masterclass",
    speakerName: "Jun-Ho Park",
    speakerRole: "Cinematographer",
    mode: "Melbourne — venue TBC",
    state: "upcoming",
    description:
      "Practical lighting demonstration using a two-fixture kit, from interior night to daylight interiors.",
    registerHref: null,
  },
  {
    slug: "festival-strategy-for-first-films",
    title: "Festival Strategy for First Films",
    when: "Thu 4 Jun 2026",
    format: "Online masterclass",
    speakerName: "Tomas Lindqvist",
    speakerRole: "Programmer",
    mode: "Online",
    state: "past",
    description:
      "How festival programmers build a slate, and what a realistic submission strategy looks like for a first short.",
    registerHref: null,
  },
  {
    slug: "the-edit-structure-and-second-drafts",
    title: "The Edit: Structure and Second Drafts",
    when: "Wed 13 May 2026",
    format: "Online workshop",
    speakerName: "Sofia Almeida",
    speakerRole: "Editor",
    mode: "Online",
    state: "past",
    description:
      "Working through an assembly to a second cut, and how to give and take notes in the edit.",
    registerHref: null,
  },
  {
    slug: "talent-lab-cycle-one-showcase-2026",
    title: "Talent Lab Cycle One Showcase 2026",
    when: "Fri 26 Jun 2026",
    format: "Showcase",
    speakerName: "Cycle One participants",
    speakerRole: "Talent Lab cohort",
    mode: "Melbourne + livestream",
    state: "past",
    description:
      "Participants presented their developed projects to an invited audience of mentors, partners and industry guests.",
    registerHref: null,
  },
];
