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

/**
 * Copy for the nine content routes.
 *
 * Kept here rather than inside each view for the same reason as `sections`
 * above: a content editor should never have to open a `.tsx` file to change a
 * sentence, and the "where to edit" table in `talent_lab_progress.md` has to be
 * able to point at one place per content area.
 *
 * The three commitment sentences below are load-bearing and are not decoration:
 *
 * - `partners.intro` — no organisation is listed as a partner until an
 *   agreement is in place. That is a promise made in the source program plan.
 * - `alumni.intro` — stories are published with consent, and outcomes are not
 *   guaranteed.
 * - `mentors.intro` — profiles are published with each person's approval.
 *
 * Do not soften, shorten or drop any of the three.
 */
export const pageCopy = {
  opportunities: {
    title: "Current Opportunities",
    intro:
      "Everything open, opening or recently run across the two annual cycles. Expressions of interest stay open all year — you do not need an open program to register.",
    searchPlaceholder: "Search programs, disciplines…",
    emptyMessage: "No programs match those filters right now.",
    emptyHint:
      "Clear the filters to see everything, or register your interest and we will email you when a matching program opens.",
    calloutEyebrow: "Open all year",
    calloutHeading: "Nothing open in your discipline yet?",
    calloutBody:
      "Register an expression of interest and you will be contacted first when a matching program opens.",
  },
  programs: {
    title: "Programs & Streams",
    /** Reads "Ten" — kept beside the 10-entry `streams` array it describes. */
    intro:
      "Ten streams run across the two annual cycles. Each stream has its own eligibility, delivery mode and mentor group — open one to see the full program detail, curriculum and dates.",
  },
  programDetail: {
    aboutHeading: "About this program",
    eligibilityHeading: "Eligibility & disciplines",
    curriculumHeading: "Curriculum outline",
    mentorsHeading: "Mentors on this program",
    resourcesHeading: "Related resources",
    resourcesNote:
      "Library items relevant to this stream. Every one is free and needs no application.",
    partnerRailEyebrow: "Partner organisations",
    partnerRailNote:
      "Categories of organisation the Talent Lab works with. No organisation is named until an agreement is in place.",
    noOpportunityNote:
      "This stream has no scheduled intake right now. Register your interest and you will be contacted when dates are confirmed.",
  },
  mentors: {
    title: "Mentors",
    intro:
      "Profiles are published with each person's approval. Confirmed mentors are engaged for the current cycle; past guests appeared in previous masterclasses; partner contacts represent supporting organisations.",
    emptyMessage: "No mentors match those filters.",
    emptyHint: "Try clearing the type or discipline filter to see everyone.",
  },
  events: {
    title: "Events & Masterclasses",
    intro:
      "Public masterclasses are open to anyone — no application required. Cohort sessions are listed for reference and are limited to current participants.",
    upcomingHeading: "Upcoming",
    pastHeading: "Past sessions",
    noUpcoming:
      "No public sessions are scheduled at the moment. New masterclasses are announced each cycle.",
  },
  eventDetail: {
    aboutHeading: "About this session",
    aboutNote:
      "The session runs 90 minutes including a 30-minute open Q&A. Live captioning is provided and a recording is added to the resource library within a week.",
    speakerHeading: "Speaker",
    speakerNote:
      "Sessions are delivered live and are not recorded for public release without the speaker's consent.",
    detailsEyebrow: "Session details",
    costLabel: "Cost",
    costValue: "Free",
    accessEyebrow: "Access",
    accessNote:
      "Live captioning is provided. Auslan interpretation can be arranged with five business days' notice — email",
  },
  alumni: {
    title: "Alumni Stories",
    intro:
      "Stories are published with each participant's consent and verified before they go up. Outcomes vary — the Talent Lab does not guarantee employment or representation.",
    emptyMessage: "No alumni stories match those filters yet.",
    emptyHint: "Clear the filters to see every story we have published.",
  },
  resources: {
    title: "Resource Library",
    intro:
      "Guides, templates, recorded masterclasses and funding information — free to use, no application required.",
    searchPlaceholder: "Search guides, templates, recordings…",
    inertNote:
      "The library is being assembled. Every item below is listed with the metadata it will carry; the download and watch actions turn on as each file is published.",
    emptyMessage: "Nothing matches that search.",
    emptyHint: "Try a different keyword, or clear the topic filter.",
  },
  partners: {
    title: "Partners",
    intro:
      "Only confirmed partners appear here. Placeholders below stand in for organisations still in discussion — no organisation is listed as a partner until an agreement is in place.",
    placeholderNote: "Placeholder · not confirmed",
    calloutEyebrow: "Partner with us",
    calloutHeading: "Support a place, host a session, or fund a stream.",
    calloutBody:
      "We work with screen agencies, industry bodies, education providers and businesses to widen access to the Talent Lab.",
  },
} as const;

/**
 * Copy for the two forms.
 *
 * Two sentences here are load-bearing and must not be softened, shortened or
 * dropped:
 *
 * - `apply.privateNotice` — the promise printed above the optional demographic
 *   questions. It is reproduced verbatim from the approved design, and it is a
 *   commitment about how that data is handled, not reassurance copy.
 * - `notConnectedNote` on both success screens — the forms validate locally and
 *   transmit nothing (plan D4). The design's own success copy says "we have
 *   sent a confirmation to your email" and "a copy has been emailed to you";
 *   both are false today, so both were replaced. Do not restore that wording
 *   until a submission destination actually exists — and read the blocking note
 *   in `talent_lab_progress.md` before building one.
 */
export const formCopy = {
  register: {
    title: "Register Your Interest",
    intro:
      "Open all year. Takes about two minutes — we will contact you when a program matching your discipline opens. This is not an application.",
    portfolioHelper: "Showreel, IMDb, website or social profile.",
    programsLegend: "Programs of interest",
    programsHelper:
      "Pick as many as you like, or none. This does not commit you to applying.",
    accessHelper:
      "Tell us what you need. You do not need to disclose a diagnosis or provide medical information.",
    mailingListLabel:
      "Add me to the Talent Lab mailing list for opportunity announcements.",
    consentLabel:
      "I have read the privacy policy and consent to IFFA storing my information.",
    privacyNote:
      "We never share your details with third parties without your consent.",
    submitLabel: "Submit expression of interest",
    successHeading: "Thanks — you're registered",
    successBody:
      "You will hear from us when a Talent Lab program matching your discipline opens, and before public announcements.",
    successPanelTitle: "What happens next",
    successPanelLines: [
      "1. Confirmation — as soon as registrations are being received.",
      "2. Opportunity alerts — when a matching program opens.",
      "3. Formal application — you apply in the cycle window; registering does not guarantee a place.",
    ],
    notConnectedNote:
      "Nothing was sent. This form is not yet connected to a submission destination, so your answers stayed in this browser and were not transmitted, stored or emailed to anyone. Registration opens properly once a destination is wired up.",
    resetLabel: "Back to the form",
  },
  apply: {
    title: "Talent Lab Application",
    intro:
      "Five short sections. Each one is checked before you move on, so nothing is missed at the end. Your answers stay in this browser as you move between sections.",
    stepLabels: ["Contact", "Profile", "Project", "Optional", "Consents"],
    stepHeadings: [
      "1 · Contact details",
      "2 · Your profile",
      "3 · Project & motivation",
      "4 · Optional & private",
      "5 · Consents & review",
    ],
    programHelper:
      "Every open and upcoming stream is listed. Check the opportunities page for which are accepting applications right now.",
    locationPlaceholder: "Bendigo, VIC 3550",
    biographyHelper:
      "Up to 200 words. Plain language is fine — we are not assessing your writing style here.",
    objectiveHelper: "What do you want to be doing in two years?",
    previousProgramsHelper:
      "Having done other programs neither helps nor hurts your application.",
    /**
     * VERBATIM from the design. This is a promise to the applicant about how
     * this data is handled. Do not reword it.
     */
    privateNotice:
      "Everything in this section is optional. It is stored securely, seen only by program staff, never used in assessment, and never shown on a public profile.",
    accessHelper: "No diagnosis or medical information required.",
    reviewTitle: "Review before submitting",
    reviewEditLabel: "Go back and edit",
    consentError:
      "You need to accept the application terms, the code of conduct and the privacy declaration before submitting. Media consent stays optional.",
    stepBlockedError:
      "This section is not finished yet. The fields marked below need an answer before you can continue.",
    submitLabel: "Submit application",
    continueLabel: "Save & continue",
    backLabel: "Back",
    /**
     * Prefix for the locally generated reference number on the success screen.
     * It identifies nothing — no application record exists — and the success
     * screen says so. Change it when a real numbering scheme arrives.
     */
    referencePrefix: "TL-26C2",
    successHeading: "Application submitted",
    successBody:
      "Applications are assessed by an independent panel and every applicant is notified of the outcome — including those who are not selected.",
    successPanelTitle: "Assessment timeline",
    successPanelLines: [
      "Panel assessment — after applications close.",
      "Shortlist conversations — with applicants taken through to interview.",
      "All applicants notified — selected or not.",
      "Program begins — on the dates listed for the stream.",
    ],
    notConnectedNote:
      "Nothing was sent. This form is not yet connected to a submission destination, so your answers — including anything you entered in the optional and private section — stayed in this browser and were not transmitted, stored or emailed to anyone. The reference number above is generated locally and does not identify a real application.",
    resetLabel: "Back to the form",
  },
} as const;
