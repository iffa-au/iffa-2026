import type { Resource } from "../lib/types";

/**
 * PLACEHOLDER CONTENT — pending real data.
 *
 * The nine library resources from the approved design, verbatim.
 *
 * Every `href` is `null` because none of these files exist yet. `resource-row`
 * renders an inert, `aria-disabled` action for a null href and a real link for
 * a populated one — so activating the library later is a data edit here, with
 * no change to any component. Do not invent paths to make the buttons look
 * live; a fabricated href ships a 404 to a user.
 */

export const resources: Resource[] = [
  {
    id: "r1",
    kind: "Guide",
    badge: "GUIDE",
    title: "Getting Your First Screen Credit",
    meta: "Guide · Career start · 14 min read",
    tags: ["Career", "Getting started"],
    stage: "Emerging",
    actionLabel: "Open",
    href: null,
  },
  {
    id: "r2",
    kind: "Template",
    badge: "TMPL",
    title: "Feature Film Pitch Deck Template",
    meta: "Template · Pitching · PDF + Keynote",
    tags: ["Pitching", "Development"],
    stage: "Early career",
    actionLabel: "Download",
    href: null,
  },
  {
    id: "r3",
    kind: "Video",
    badge: "VIDEO",
    title: "Masterclass: Directing the Camera on a Micro Budget",
    meta: "Recorded masterclass · 58 min",
    tags: ["Directing", "Craft"],
    stage: "Emerging",
    actionLabel: "Watch",
    href: null,
  },
  {
    id: "r4",
    kind: "Funding",
    badge: "FUND",
    title: "Australian Screen Funding Map 2026",
    meta: "Funding · Federal, state and philanthropic",
    tags: ["Funding"],
    stage: "All stages",
    actionLabel: "Open",
    href: null,
  },
  {
    id: "r5",
    kind: "Template",
    badge: "TMPL",
    title: "Project Development Plan Worksheet",
    meta: "Template · Development · DOCX",
    tags: ["Development"],
    stage: "Emerging",
    actionLabel: "Download",
    href: null,
  },
  {
    id: "r6",
    kind: "Directory",
    badge: "DIR",
    title: "Industry Directory: Guilds and Screen Bodies",
    meta: "Directory · National",
    tags: ["Career", "Networks"],
    stage: "All stages",
    actionLabel: "Open",
    href: null,
  },
  {
    id: "r7",
    kind: "Access",
    badge: "ACCS",
    title: "Accessible Production Practice: A Starting Point",
    meta: "Guide · Accessibility",
    tags: ["Accessibility"],
    stage: "All stages",
    actionLabel: "Open",
    href: null,
  },
  {
    id: "r8",
    kind: "Guide",
    badge: "GUIDE",
    title: "Working With an Agent: What to Expect",
    meta: "Guide · Representation · 9 min read",
    tags: ["Career", "Acting"],
    stage: "Early career",
    actionLabel: "Open",
    href: null,
  },
  {
    id: "r9",
    kind: "Conduct",
    badge: "COND",
    title: "Professional Conduct and Safety on Set",
    meta: "Guide · Conduct · Required reading",
    tags: ["Conduct", "Safety"],
    stage: "All stages",
    actionLabel: "Open",
    href: null,
  },
];
