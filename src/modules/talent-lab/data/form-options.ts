import type { CareerStage, DeliveryMode, Discipline, MentorType } from "../lib/types";
import { STATUS_ORDER, STATUS_PILL } from "../lib/status";

/**
 * PLACEHOLDER CONTENT — pending real data.
 *
 * Select options and filter vocabularies, shared by the forms (Phase 3) and the
 * filter chip rows (Phase 2). Sourced from the approved design.
 *
 * The form select lists are deliberately wider than the `Discipline` union:
 * "Crew & technical" and "Other" are how an applicant describes themselves,
 * while `Discipline` is how the catalogue is indexed. Do not collapse them into
 * one list — narrowing the applicant's options to fit a filter key is the wrong
 * trade.
 */

/** Australian states and territories, for the EOI and application forms. */
export const australianStates: string[] = [
  "Australian Capital Territory",
  "New South Wales",
  "Northern Territory",
  "Queensland",
  "South Australia",
  "Tasmania",
  "Victoria",
  "Western Australia",
];

/** Self-described discipline, as offered on the forms. */
export const formDisciplines: string[] = [
  "Directing",
  "Producing",
  "Writing",
  "Acting",
  "Documentary",
  "Crew & technical",
  "Other",
];

/** Self-described career stage, as offered on the forms. */
export const formCareerStages: string[] = [
  "Student / recent graduate",
  "Emerging (0–2 credits)",
  "Early career (3+ credits)",
];

// ------------------------------------------------------------ filter vocabularies

/** The catalogue's discipline index — the `Discipline` union, in display order. */
export const disciplineOptions: Discipline[] = [
  "Directing",
  "Producing",
  "Writing",
  "Acting",
  "Documentary",
  "Crew",
];

export const careerStageOptions: CareerStage[] = ["Emerging", "Early career"];

export const deliveryModeOptions: DeliveryMode[] = ["Online", "Hybrid", "In person"];

export const mentorTypeOptions: MentorType[] = [
  "Confirmed Mentor",
  "Past Guest",
  "Partner",
];

/**
 * Status filter chips, derived from the status map so a new state cannot be
 * added to `status.ts` and then quietly missing from the filter row.
 */
export const statusFilterOptions: { value: string; label: string }[] =
  STATUS_ORDER.map((status) => ({
    value: status,
    label: STATUS_PILL[status].label,
  }));

/**
 * Mentor type badges. Colour-coded and labelled — the label is what carries the
 * meaning, exactly as with the status pills.
 */
export const MENTOR_TYPE_CLASSES: Record<MentorType, string> = {
  "Confirmed Mentor": "border-[#E6BA35]/45 bg-[#E6BA35]/12 text-[#E6BA35]",
  "Past Guest": "border-white/20 bg-white/6 text-[#B3B3B3]",
  Partner: "border-[#7FB2F0]/45 bg-[#7FB2F0]/12 text-[#7FB2F0]",
};

/**
 * The resource library's topic filter vocabulary.
 *
 * A curated list, not `distinctTags(resources, …)`. Resources carry more tags
 * than this ("Craft", "Getting started", "Safety" and the discipline names),
 * which read well on a row but make an unusable filter row at thirteen chips
 * wide. These seven are the topics the design filters on.
 *
 * A tag that is not listed here is still shown on its row and still matched by
 * the search box — it simply has no chip. If you add a topic that deserves one,
 * add it here too.
 */
export const resourceTopicOptions: string[] = [
  "Career",
  "Pitching",
  "Development",
  "Funding",
  "Accessibility",
  "Conduct",
  "Networks",
];

// ------------------------------------------------ application form vocabularies

/** Step 3 — how much of the schedule an applicant can attend. */
export const availabilityOptions: string[] = [
  "Available for all scheduled sessions",
  "Available for most sessions",
  "Some conflicts — will explain",
];

/**
 * Step 4 — the two optional demographic questions.
 *
 * "Prefer not to say" is listed first and is the default, so the form never
 * pressures an answer. Both questions are optional and are marked so on the
 * field itself, not only in the section notice.
 */
export const demographicOptions: string[] = ["Prefer not to say", "Yes", "No"];

export type ConsentItem = {
  /** Key into the application form's consent values. */
  name: "termsConsent" | "conductConsent" | "privacyConsent" | "mediaConsent";
  label: string;
  required: boolean;
};

/**
 * Step 5 — three required consents and one optional media consent.
 *
 * Media consent is deliberately last, deliberately optional, and deliberately
 * says so in its own label: bundling it with the required three would make
 * "you may use my photograph" a condition of applying.
 */
export const consentItems: ConsentItem[] = [
  {
    name: "termsConsent",
    label: "I have read and agree to the application terms and conditions.",
    required: true,
  },
  {
    name: "conductConsent",
    label: "I agree to the Talent Lab code of conduct.",
    required: true,
  },
  {
    name: "privacyConsent",
    label:
      "I consent to IFFA collecting and storing my information under the privacy policy.",
    required: true,
  },
  {
    name: "mediaConsent",
    label:
      "Media consent — I consent to IFFA using photography, recordings and quotes from the program in its communications. (Optional, and separate from my application.)",
    required: false,
  },
];
