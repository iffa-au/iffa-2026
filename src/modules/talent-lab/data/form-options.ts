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
