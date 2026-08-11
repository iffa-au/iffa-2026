import type { ProgramCard } from "../lib/types";

/**
 * The six festival program streams.
 *
 * Only Masterclasses & Sessions has a page today. The other five carry
 * `href: null` / `status: "coming-soon"` and render non-interactive, so the
 * section never ships a dead link. To make one live: build its page, set `href`
 * to the new route and flip `status` to "live" — no component change required.
 *
 * `iconName` is a key into the Hugeicons map in `ui/components/program-card.tsx`.
 */
export const programCards: ProgramCard[] = [
  {
    slug: "masterclass",
    title: "Masterclasses & Sessions",
    description:
      "Practical sessions led by working directors, writers and producers, covering craft decisions from first draft through to final cut.",
    iconName: "TeachingIcon",
    href: "/festivals/programs/masterclass",
    status: "live",
  },
  {
    slug: "industry-exchange",
    title: "Industry Exchange",
    description:
      "Structured meetings between visiting delegations, distributors and Australian production companies looking for co-production partners.",
    iconName: "Exchange01Icon",
    href: null,
    status: "coming-soon",
  },
  {
    slug: "mentorship-programme",
    title: "Mentorship Programme",
    description:
      "Long-form pairing of emerging filmmakers with established mentors, running across the festival week and continuing afterwards.",
    iconName: "MentorIcon",
    href: null,
    status: "coming-soon",
  },
  {
    slug: "marketing-and-pitching",
    title: "Marketing & Pitching",
    description:
      "How to position a film for festivals, buyers and audiences — pitch construction, materials, and the meetings that follow.",
    iconName: "Megaphone01Icon",
    href: null,
    status: "coming-soon",
  },
  {
    slug: "film-showcase-and-screenings",
    title: "Film Showcase & Screenings",
    description:
      "Curated showcase slots for selected works, with moderated audience discussion and filmmaker introductions.",
    iconName: "Film01Icon",
    href: null,
    status: "coming-soon",
  },
  {
    slug: "pathways-to-iffa-melbourne",
    title: "Pathways to IFFA Melbourne",
    description:
      "The route from a regional selection into the Melbourne programme — eligibility, timelines and what selectors look for.",
    iconName: "Route01Icon",
    href: null,
    status: "coming-soon",
  },
];
