import type { Benefit, StatTileData, StepBlock } from "../lib/types";

/**
 * PLACEHOLDER CONTENT — pending real data.
 *
 * Identity copy for the Talent Lab section: tagline, intro, cycle model,
 * contact address and every section headline. Sourced verbatim from the
 * approved design.
 *
 * Headlines that contain a number ("Ten pathways, one network") live here, next
 * to the arrays they describe, so a content edit and the count it refers to are
 * changed in one place.
 */

export const talentLabEdition = {
  eyebrow: "IFFA Talent Lab",
  title: "IFFA Talent Lab",
  tagline: "Global Networks. Australian Screen Futures.",
  intro:
    "IFFA Talent Lab connects emerging Australian screen talent with experienced practitioners, organisations and international networks through mentoring, masterclasses, workshops, project development and professional industry opportunities.",

  /** The single source for this address — it appears in the FAQ intro. */
  contactEmail: "talentlab@iffaawards.com",

  /** Rendered as real text beneath the hero; there is no hero photograph. */
  heroImageCaption:
    "Writers’ room session — mentor and three participants at a table, low key lighting",

  cycleModel:
    "Expressions of interest are open year-round. Formal applications open twice a year, in January and July.",

  sections: {
    why: {
      eyebrow: "Why the Talent Lab exists",
      heading: "Talent is everywhere. Access is not.",
      body: [
        "Emerging practitioners across Australia finish study, short films and first credits with real skill — and no clear route into the rooms where careers are made. Introductions still travel through networks most people cannot reach.",
        "IFFA already convenes filmmakers, festivals and screen bodies across Australia, Asia and the Middle East. The Talent Lab turns that international reach into a structured, year-round pathway: mentoring, masterclasses and project development that bridge the gap between education and industry — delivered primarily online so regional and remote practitioners are included from the start.",
      ],
      imageCaption:
        "Two crew members reviewing a shot on a monitor, on set at night",
    },
    howItWorks: {
      eyebrow: "How it works",
      heading: "Four steps from interest to industry",
    },
    opportunities: {
      eyebrow: "Current opportunities",
      heading: "Open and upcoming programs",
    },
    streams: {
      eyebrow: "Talent Lab streams",
      /** Reads "Ten" — kept beside the 10-entry `streams` array it describes. */
      heading: "Ten pathways, one network",
      body: "Streams run across the two annual cycles. Not every stream runs in every cycle — check current opportunities for what is open now.",
    },
    benefits: {
      eyebrow: "What participants receive",
      heading: "Included in every Talent Lab program",
      footnote:
        "Opportunities and introductions are subject to program availability and do not guarantee employment or representation.",
    },
    eligibility: {
      eyebrow: "Who can apply",
      heading: "Eligibility",
      footnote:
        "Eligibility may vary between Talent Lab programs according to the objectives and requirements of individual program partners and funding bodies.",
      inclusionEyebrow: "Inclusion statement",
      inclusionStatement:
        "We strongly encourage applications from Aboriginal and Torres Strait Islander practitioners, people from culturally and linguistically diverse backgrounds, Deaf and disabled practitioners, LGBTQIA+ practitioners, and people living in regional and remote Australia.",
      adjustmentsNote:
        "Access adjustments are available at every stage. You can request them without disclosing medical information or a diagnosis.",
    },
    mentors: {
      eyebrow: "Mentors",
      heading: "Learn from working practitioners",
    },
    partners: {
      eyebrow: "Partners",
      heading: "Supported across the sector",
    },
    outcomes: {
      eyebrow: "Outcomes — pilot targets",
      heading: "What the first year is measured against",
    },
    alumni: {
      eyebrow: "Alumni",
      heading: "Where participants went next",
    },
    resources: {
      eyebrow: "Resources",
      heading: "Free to use, no application required",
    },
    faq: {
      eyebrow: "FAQ",
      heading: "Questions, answered",
    },
    finalCta: {
      eyebrow: "Next step",
      heading: "Take the Next Step in Your Screen Career",
      body: "Expressions of interest are open year-round. Formal applications open twice a year, in January and July.",
    },
  },
} as const;

/** Program snapshot — the four stat tiles under the hero. */
export const programSnapshot: StatTileData[] = [
  { value: "2", caption: "Talent Lab cycles each year" },
  { value: "10–12", caption: "Participants per cycle" },
  { value: "AU + INT", caption: "Australian & international mentors" },
  { value: "365", caption: "Days a year expressions of interest are open" },
];

/**
 * Pilot targets, not achieved results. The section heading frames them that way
 * and must keep doing so.
 */
export const pilotOutcomes: StatTileData[] = [
  { value: "20", caption: "Participants supported in the pilot year" },
  { value: "8–12", caption: "Mentors engaged across streams" },
  { value: "4", caption: "Public masterclasses delivered" },
  { value: "80%", caption: "Target program completion rate" },
];

export const howItWorksSteps: StepBlock[] = [
  {
    step: "Step 01",
    title: "Register your interest",
    body: "One short form, open year-round. You hear first when a program opens.",
  },
  {
    step: "Step 02",
    title: "Apply for an open program",
    body: "Pick the stream that fits your practice and submit a formal application in the cycle window.",
  },
  {
    step: "Step 03",
    title: "Join workshops & mentoring",
    body: "Six weeks of masterclasses, project development and one-to-one mentor sessions.",
  },
  {
    step: "Step 04",
    title: "Present your work",
    body: "Show your developed project at the showcase and meet the people who can back it.",
  },
];

export const participantBenefits: Benefit[] = [
  {
    num: "01",
    title: "Masterclasses",
    body: "Craft sessions across directing, writing, producing, acting and crew disciplines.",
  },
  {
    num: "02",
    title: "Mentoring",
    body: "One-to-one sessions with a mentor matched to your discipline and stage.",
  },
  {
    num: "03",
    title: "Project feedback",
    body: "Structured feedback rounds on your script, reel, pitch or project plan.",
  },
  {
    num: "04",
    title: "Career guidance",
    body: "Practical advice on the next three moves, not the next thirty years.",
  },
  {
    num: "05",
    title: "Industry introductions",
    body: "Warm introductions to practitioners and organisations relevant to your work.",
  },
  {
    num: "06",
    title: "Professional profile",
    body: "A published Talent Lab profile you control, with your credits and links.",
  },
  {
    num: "07",
    title: "Showcase opportunity",
    body: "Present your developed project to an invited industry audience.",
  },
  {
    num: "08",
    title: "Alumni network",
    body: "Ongoing access to the alumni network, events and peer group.",
  },
  {
    num: "09",
    title: "Completion certificate",
    body: "A certificate recording the program, stream and cycle you completed.",
  },
];

export const eligibilityCriteria: string[] = [
  "Emerging or early-career screen practitioners — including recent graduates and self-taught practitioners.",
  "Based in Australia, including regional and remote areas.",
  "Aged 18 or over at the start of the program.",
  "Working in directing, producing, writing, acting, documentary, crew or technical disciplines.",
  "Able to commit to approximately six weeks of scheduled sessions, mostly outside standard work hours.",
];
