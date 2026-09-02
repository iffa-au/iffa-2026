/**
 * Talent Lab data model.
 *
 * Shaped like an API response on purpose: no CMS model exists yet, so every
 * collection ships as a static typed array. When a `cms-hub` endpoint lands it
 * can be dropped in behind these types without touching a single view.
 *
 * Dates are display strings throughout, never ISO or `Date`. The design's own
 * values include "Rolling" and "Jan 2027", and keeping them as strings also
 * avoids the timezone hydration mismatch the Festivals module had to hand-roll
 * around in `screening-utils.ts`.
 */

export type OpportunityStatus =
  | "eoi"
  | "opening-soon"
  | "open"
  | "closing-soon"
  | "closed"
  | "in-progress"
  | "completed";

export type Discipline =
  | "Directing"
  | "Producing"
  | "Writing"
  | "Acting"
  | "Documentary"
  | "Crew";

export type CareerStage = "Emerging" | "Early career";
export type DeliveryMode = "Online" | "Hybrid" | "In person";

export type Opportunity = {
  id: string;
  /** Links to `Stream.slug` — powers the "Program details" button. */
  streamSlug: string;
  title: string;
  summary: string;
  status: OpportunityStatus;
  /** Small mono chips, e.g. ["Directing", "Writing"]. */
  tags: string[];
  discipline: Discipline;
  stage: CareerStage;
  /**
   * Filter key. An explicit field, never sniffed from `modeLabel` — a filter
   * has to read a real value, not parse a sentence.
   */
  deliveryMode: DeliveryMode;
  /** Display string, e.g. "Online + Melbourne intensive". */
  modeLabel: string;
  /** Display string, e.g. "1 Jul 2026" or "Rolling". */
  opensOn: string;
  closesOn: string;
  /** Display string, e.g. "5 Oct – 13 Nov 2026". */
  programDates: string;
  /** "Cycle Two 2026" | "Year-round". */
  cycle: string;
  /** "Apply now" | "Notify me" | "Register interest" | … */
  ctaLabel: string;
};

export type CurriculumWeek = { week: string; title: string; body: string };
export type LabelledFact = { label: string; value: string };

export type Stream = {
  /** e.g. "emerging-filmmakers-lab". */
  slug: string;
  /** "01" — the mono badge on the card. */
  code: string;
  name: string;
  /** One line, used on cards. */
  description: string;

  // --- detail page ---
  about: string[];
  /** Eligibility / disciplines / fee / access rows. */
  facts: LabelledFact[];
  curriculum: CurriculumWeek[];
  /** e.g. "Twelve places". */
  places: string;
  assessmentNote: string;
  deliveryMode: DeliveryMode;
  /** e.g. "Online + Melbourne intensive". */
  location: string;
  status: OpportunityStatus;
  /** Resolved against `mentors-data` — never duplicate mentor objects. */
  mentorSlugs: string[];
  /** Resolved against `resources-data`. */
  resourceIds: string[];
};

export type MentorType = "Confirmed Mentor" | "Past Guest" | "Partner";

export type Mentor = {
  slug: string;
  name: string;
  /** e.g. "Director". */
  role: string;
  /** e.g. "Sable Lane Pictures" | "Freelance". */
  organisation: string;
  country: string;
  /** Filter key + badge. */
  type: MentorType;
  discipline: Discipline;
  /** Participation year. */
  year: string;
  bio: string;
};

export type Alumnus = {
  slug: string;
  name: string;
  /** e.g. "Writer / Director". */
  role: string;
  /** e.g. "Cycle One 2025". */
  cycle: string;
  /** Filter key. */
  year: string;
  discipline: Discipline;
  outcome: string;
};

export type ResourceKind =
  | "Guide"
  | "Template"
  | "Video"
  | "Funding"
  | "Directory"
  | "Access"
  | "Conduct";

export type Resource = {
  id: string;
  kind: ResourceKind;
  /** "GUIDE" | "TMPL" | "VIDEO" | … the mono tile label. */
  badge: string;
  title: string;
  /** e.g. "Guide · Career start · 14 min read". */
  meta: string;
  /** Filter keys. */
  tags: string[];
  /** "Emerging" | "Early career" | "All stages". */
  stage: string;
  /** "Open" | "Download" | "Watch". */
  actionLabel: string;
  /** `null` => the action renders inert. No real files exist yet. */
  href: string | null;
};

export type TalentLabEvent = {
  slug: string;
  title: string;
  /** Display string, e.g. "Thu 20 Aug 2026 · 6:00–7:30pm AEST". */
  when: string;
  /** e.g. "Online masterclass". */
  format: string;
  speakerName: string;
  speakerRole: string;
  /** e.g. "Online (Zoom)" | "Melbourne — venue TBC". */
  mode: string;
  state: "upcoming" | "past";
  description: string;
  /** `null` => the register button renders inert. */
  registerHref: string | null;
};

export type PartnerGroup = { category: string; organisations: string[] };
export type Faq = { question: string; answer: string };
export type StatTileData = { value: string; caption: string };
export type StepBlock = { step: string; title: string; body: string };
export type Benefit = { num: string; title: string; body: string };
