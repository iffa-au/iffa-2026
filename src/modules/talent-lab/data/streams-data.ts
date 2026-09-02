import type { CurriculumWeek, LabelledFact, Stream } from "../lib/types";

/**
 * PLACEHOLDER CONTENT — pending real data.
 *
 * The ten streams from the approved design.
 *
 * Card-level copy (`code`, `name`, `description`) is verbatim from the design.
 * Detail-level copy is NOT: the design only unpacks one program detail page
 * (Emerging Filmmakers Lab), so that stream carries its real text and the other
 * nine are scaffolded onto the same shape. Their `about`, `facts`, `places` and
 * `assessmentNote` are structurally correct but editorially provisional — they
 * are the first thing to replace when real program copy arrives. See the
 * "where to edit" table in `talent_lab_progress.md`.
 *
 * `mentorSlugs` and `resourceIds` are references, resolved at render time
 * against `mentors-data.ts` and `resources-data.ts`. Never inline a mentor or
 * a resource object here — one mentor, one record.
 *
 * `status` mirrors the matching entry in `opportunities-data.ts` for the eight
 * streams that currently have an open or past opportunity. When you change a
 * status, change both — the opportunity is authoritative.
 */

/**
 * Every stream runs the same six-week-plus-showcase structure; only the week
 * two craft intensive differs by discipline. Defining it once means a change to
 * the program shape is one edit rather than ten, and it is why the ten detail
 * pages can be generated from data rather than hand-built.
 */
const standardCurriculum = (craftIntensive: string): CurriculumWeek[] => [
  {
    week: "Week 1",
    title: "Orientation & goal setting",
    body: "Meet the cohort, set out what you want from six weeks, and agree the code of conduct.",
  },
  {
    week: "Week 2",
    title: "Craft masterclass",
    body: craftIntensive,
  },
  {
    week: "Week 3",
    title: "Project development",
    body: "Structured development of your project with written feedback from two assessors.",
  },
  {
    week: "Week 4",
    title: "Industry context",
    body: "Financing, festivals and distribution — how a first film actually reaches an audience.",
  },
  {
    week: "Week 5",
    title: "Pitch practice",
    body: "Build and rehearse your pitch. Two rounds of feedback before the showcase.",
  },
  {
    week: "Week 6",
    title: "Mentor tables",
    body: "One-to-one mentor sessions and small-group tables matched to your discipline.",
  },
  {
    week: "Showcase",
    title: "Present your project",
    body: "Present to an invited audience of mentors, partners and industry guests.",
  },
];

/** The access row is identical across streams — the commitment is section-wide. */
const ACCESS_FACT: LabelledFact = {
  label: "Access",
  value: "Captioning and Auslan on request; recordings provided",
};

const DEFAULT_ASSESSMENT_NOTE =
  "Applications are assessed by an independent panel and all applicants are notified before the program begins.";

export const streams: Stream[] = [
  {
    slug: "emerging-filmmakers-lab",
    code: "01",
    name: "Emerging Filmmakers Lab",
    description:
      "Directing craft, project development and mentor tables for first and second projects.",
    about: [
      "The Emerging Filmmakers Lab is built for directors and writer-directors with one or more shorts behind them who are ready to develop a longer project. Over six weeks you work on one project of your own, in a cohort of twelve, with weekly craft masterclasses, two structured feedback rounds and one-to-one mentoring.",
      "Sessions run online in the evenings, with an optional two-day intensive in Melbourne in week four. Travel bursaries are available for regional participants and no participant is excluded for cost reasons.",
    ],
    facts: [
      {
        label: "Career stage",
        value: "Emerging — at least one completed short or equivalent",
      },
      {
        label: "Disciplines",
        value: "Directing, writer-director, hybrid practice",
      },
      { label: "Cost", value: "$180 program fee · fee-relief places available" },
      ACCESS_FACT,
    ],
    curriculum: standardCurriculum(
      "Directing craft intensive with a working director, using participant material."
    ),
    places: "Twelve places",
    assessmentNote:
      "Twelve places. Applications are assessed by an independent panel and all applicants are notified by 19 Sep.",
    deliveryMode: "Hybrid",
    location: "Online + Melbourne intensive",
    status: "open",
    mentorSlugs: [
      "danielle-okafor",
      "marcus-whitely",
      "priya-raghunathan",
      "elena-vasquez",
    ],
    resourceIds: ["r1", "r2", "r3"],
  },
  {
    slug: "producers-project-development-lab",
    code: "02",
    name: "Producers & Project Development Lab",
    description:
      "Packaging, budgets, finance plans and market strategy with working producers.",
    about: [
      "The Producers & Project Development Lab is for producers packaging a project properly for the first time: budgets, finance plans, market strategy and the paperwork a screen agency actually reads.",
      "Delivered online across six weeks, with one-to-one sessions with working producers and two structured feedback rounds on your finance plan.",
    ],
    facts: [
      {
        label: "Career stage",
        value: "Early career — at least one produced credit or equivalent",
      },
      {
        label: "Disciplines",
        value: "Producing, production management, development",
      },
      { label: "Cost", value: "Program fee confirmed before applications open · fee-relief places available" },
      ACCESS_FACT,
    ],
    curriculum: standardCurriculum(
      "Packaging and finance intensive with a working producer, using participant projects."
    ),
    places: "Twelve places",
    assessmentNote: DEFAULT_ASSESSMENT_NOTE,
    deliveryMode: "Online",
    location: "Online",
    status: "closing-soon",
    mentorSlugs: ["marcus-whitely", "tomas-lindqvist", "nadia-farouk"],
    resourceIds: ["r2", "r4", "r5"],
  },
  {
    slug: "actors-for-screen-lab",
    code: "03",
    name: "Actors for Screen Lab",
    description: "Self-tape technique, screen presence and casting-room practice.",
    about: [
      "The Actors for Screen Lab covers self-tape technique, screen presence and casting-room practice with casting directors and screen acting coaches.",
      "Sessions combine online workshops with in-person practice in Sydney, including live feedback on submitted tapes.",
    ],
    facts: [
      { label: "Career stage", value: "Emerging — screen or stage training, or equivalent experience" },
      { label: "Disciplines", value: "Acting, screen performance" },
      { label: "Cost", value: "Program fee confirmed before applications open · fee-relief places available" },
      ACCESS_FACT,
    ],
    curriculum: standardCurriculum(
      "Screen performance intensive with a casting director, working with participant tapes."
    ),
    places: "Twelve places",
    assessmentNote: DEFAULT_ASSESSMENT_NOTE,
    deliveryMode: "Hybrid",
    location: "Sydney + online",
    status: "opening-soon",
    mentorSlugs: ["elena-vasquez", "danielle-okafor"],
    resourceIds: ["r8", "r1", "r9"],
  },
  {
    slug: "screenwriters-lab",
    code: "04",
    name: "Screenwriters Lab",
    description:
      "Feature and series development with script editors and structured table reads.",
    about: [
      "The Screenwriters Lab develops one feature or series project across six weeks, with structured table reads, script editors and a closing pitch to commissioners.",
      "Delivered online in the evenings. You bring one project and leave with a redrafted document and a rehearsed pitch.",
    ],
    facts: [
      { label: "Career stage", value: "Emerging — at least one completed script or produced short" },
      { label: "Disciplines", value: "Writing, writer-director, series development" },
      { label: "Cost", value: "Program fee confirmed before applications open · fee-relief places available" },
      ACCESS_FACT,
    ],
    curriculum: standardCurriculum(
      "Structural craft intensive with a script editor, using participant drafts."
    ),
    places: "Twelve places",
    assessmentNote: DEFAULT_ASSESSMENT_NOTE,
    deliveryMode: "Online",
    location: "Online",
    status: "eoi",
    mentorSlugs: ["priya-raghunathan", "danielle-okafor"],
    resourceIds: ["r5", "r2", "r1"],
  },
  {
    slug: "documentary-lab",
    code: "05",
    name: "Documentary Lab",
    description:
      "Ethics, access, structure and impact strategy for documentary makers.",
    about: [
      "The Documentary Lab works through ethics, access, story structure and impact strategy for first and second documentary projects.",
      "Delivered online across six weeks, with particular attention to duty of care towards contributors and to the practicalities of long-form observational work.",
    ],
    facts: [
      { label: "Career stage", value: "Early career — at least one completed documentary or equivalent" },
      { label: "Disciplines", value: "Documentary directing, producing, hybrid practice" },
      { label: "Cost", value: "Program fee confirmed before applications open · fee-relief places available" },
      ACCESS_FACT,
    ],
    curriculum: standardCurriculum(
      "Ethics and access intensive with a documentary director, using participant projects."
    ),
    places: "Twelve places",
    assessmentNote: DEFAULT_ASSESSMENT_NOTE,
    deliveryMode: "Online",
    location: "Online",
    status: "closed",
    mentorSlugs: ["aisha-rahman", "sofia-almeida"],
    resourceIds: ["r7", "r9", "r4"],
  },
  {
    slug: "international-screen-exchange",
    code: "06",
    name: "International Screen Exchange",
    description:
      "Cross-border cohorts and mentors from IFFA's international festival network.",
    about: [
      "The International Screen Exchange pairs Australian participants with mentors and peers from across IFFA's festival network in Asia, the Middle East and Europe.",
      "Delivered online to accommodate time zones, with selected exchange places supported by partner organisations.",
    ],
    facts: [
      { label: "Career stage", value: "Early career — a completed project and a project in development" },
      { label: "Disciplines", value: "Directing, producing, cross-border co-production" },
      { label: "Cost", value: "Exchange places supported by partner organisations · fee-relief places available" },
      ACCESS_FACT,
    ],
    curriculum: standardCurriculum(
      "International market intensive with a festival programmer and a co-production advisor."
    ),
    places: "Twelve places",
    assessmentNote: DEFAULT_ASSESSMENT_NOTE,
    deliveryMode: "Online",
    location: "Online",
    status: "in-progress",
    mentorSlugs: ["tomas-lindqvist", "nadia-farouk", "marcus-whitely"],
    resourceIds: ["r4", "r6", "r2"],
  },
  {
    slug: "industry-masterclass-series",
    code: "07",
    name: "Industry Masterclass Series",
    description:
      "Public and cohort-only sessions with practitioners across every department.",
    about: [
      "The Industry Masterclass Series runs year-round: public sessions open to anyone, and cohort-only sessions for current Talent Lab participants.",
      "Public masterclasses are free and need no application — see the events page for what is scheduled next.",
    ],
    facts: [
      { label: "Career stage", value: "Open to all — no application required for public sessions" },
      { label: "Disciplines", value: "All screen disciplines" },
      { label: "Cost", value: "Public masterclasses are free" },
      ACCESS_FACT,
    ],
    curriculum: standardCurriculum(
      "Rotating craft intensives with practitioners across every department."
    ),
    places: "Open capacity for public sessions",
    assessmentNote:
      "Public masterclasses are open to anyone and are not assessed. Cohort-only sessions are included with a program place.",
    deliveryMode: "Online",
    location: "Online, with selected in-person sessions",
    status: "eoi",
    mentorSlugs: ["jun-ho-park", "sofia-almeida", "elena-vasquez", "robert-mahoney"],
    resourceIds: ["r3", "r1", "r6"],
  },
  {
    slug: "regional-online-talent-lab",
    code: "08",
    name: "Regional & Online Talent Lab",
    description: "Fully online delivery for practitioners outside capital cities.",
    about: [
      "The Regional & Online Talent Lab is built for practitioners outside capital cities: fully online, low bandwidth friendly, with data-cost support available.",
      "Expressions of interest are open year-round and the stream runs across both annual cycles.",
    ],
    facts: [
      { label: "Career stage", value: "Emerging — based in regional or remote Australia" },
      { label: "Disciplines", value: "All screen disciplines" },
      { label: "Cost", value: "Fee-relief places and data-cost support available" },
      ACCESS_FACT,
    ],
    curriculum: standardCurriculum(
      "Craft intensive delivered low-bandwidth, with recordings provided for every session."
    ),
    places: "Twelve places per cycle",
    assessmentNote: DEFAULT_ASSESSMENT_NOTE,
    deliveryMode: "Online",
    location: "Online",
    status: "eoi",
    mentorSlugs: ["danielle-okafor", "aisha-rahman", "robert-mahoney"],
    resourceIds: ["r1", "r7", "r6"],
  },
  {
    slug: "crew-technical-pathways",
    code: "09",
    name: "Crew & Technical Pathways",
    description:
      "Camera, sound, art department, post and on-set protocol for technical crew.",
    about: [
      "Crew & Technical Pathways covers camera, sound, art department and post workflow, alongside the on-set protocol that decides whether someone gets called back.",
      "Delivered online with practical exercises, and with sessions led by working heads of department.",
    ],
    facts: [
      { label: "Career stage", value: "Emerging — some paid or unpaid department experience" },
      { label: "Disciplines", value: "Camera, sound, art department, post-production" },
      { label: "Cost", value: "Program fee confirmed before applications open · fee-relief places available" },
      ACCESS_FACT,
    ],
    curriculum: standardCurriculum(
      "Department craft intensive with a working head of department, covering on-set protocol."
    ),
    places: "Twelve places",
    assessmentNote: DEFAULT_ASSESSMENT_NOTE,
    deliveryMode: "Online",
    location: "Online",
    status: "opening-soon",
    mentorSlugs: ["jun-ho-park", "robert-mahoney", "sofia-almeida"],
    resourceIds: ["r9", "r6", "r1"],
  },
  {
    slug: "women-in-screen-leadership",
    code: "10",
    name: "Women in Screen Leadership",
    description:
      "Leadership and department-head pathways for women and non-binary practitioners.",
    about: [
      "Women in Screen Leadership covers leadership, negotiation and department-head pathways for women and non-binary practitioners moving into senior roles.",
      "Delivered online across six weeks, with mentoring matched to the department the participant is moving into.",
    ],
    facts: [
      { label: "Career stage", value: "Early career — moving towards a senior or department-head role" },
      { label: "Disciplines", value: "All screen disciplines, with a crew and production focus" },
      { label: "Cost", value: "Program fee confirmed before applications open · fee-relief places available" },
      ACCESS_FACT,
    ],
    curriculum: standardCurriculum(
      "Leadership and negotiation intensive with senior practitioners, using participant scenarios."
    ),
    places: "Twelve places",
    assessmentNote: DEFAULT_ASSESSMENT_NOTE,
    deliveryMode: "Online",
    location: "Online",
    status: "completed",
    mentorSlugs: ["danielle-okafor", "priya-raghunathan", "aisha-rahman"],
    resourceIds: ["r1", "r8", "r9"],
  },
];
