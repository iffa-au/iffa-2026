"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  availabilityOptions,
  consentItems,
  demographicOptions,
  formCareerStages,
  formDisciplines,
} from "../../data/form-options";
import { streams } from "../../data/streams-data";
import { formCopy } from "../../data/talent-lab-edition";
import {
  CheckboxRow,
  FormErrorSummary,
  PrimaryFormButton,
  SecondaryFormButton,
  SelectControl,
  TextAreaControl,
  TextControl,
} from "../components/form-controls";
import { FormField } from "../components/form-field";
import { FormSuccess } from "../components/form-success";
import { PageHeader } from "../components/page-header";
import { StepIndicator } from "../components/step-indicator";

const copy = formCopy.apply;

const PROGRAM_NAMES = streams.map((stream) => stream.name);

const countWords = (value: string): number =>
  value.trim().split(/\s+/).filter(Boolean).length;

const applySchema = z.object({
  // 1 — contact
  program: z.string().min(1, "Choose the program you are applying for."),
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().min(6, "Enter a phone number we can reach you on."),
  location: z
    .string()
    .trim()
    .min(4, "Enter your suburb, state and postcode."),

  // 2 — profile
  primaryDiscipline: z.string().min(1, "Select your primary discipline."),
  secondaryDiscipline: z.string(),
  careerStage: z.string().min(1, "Select the career stage that fits you best."),
  biography: z
    .string()
    .trim()
    .min(1, "A short biography is required.")
    .refine((value) => countWords(value) <= 200, {
      message: "Keep the biography to 200 words or fewer.",
    }),
  careerObjective: z
    .string()
    .trim()
    .min(1, "Tell us what you are working towards."),

  // 3 — project & motivation
  projectDescription: z
    .string()
    .trim()
    .min(1, "Describe the project or portfolio you are bringing."),
  whyThisProgram: z
    .string()
    .trim()
    .min(1, "Tell us why this program would benefit you."),
  portfolioLink: z.url("Enter a full link, starting with https://"),
  availability: z.string().min(1, "Select your availability."),
  previousPrograms: z.string(),

  // 4 — optional & private. Every field here is genuinely optional.
  accessRequirements: z.string(),
  firstNationsIdentification: z.string(),
  regionalRemote: z.string(),

  // 5 — consents
  termsConsent: z.literal(true, { message: copy.consentError }),
  conductConsent: z.literal(true, { message: copy.consentError }),
  privacyConsent: z.literal(true, { message: copy.consentError }),
  mediaConsent: z.boolean(),
});

type ApplyValues = z.infer<typeof applySchema>;
type ApplyField = keyof ApplyValues;

const EMPTY_VALUES: ApplyValues = {
  program: "",
  fullName: "",
  email: "",
  phone: "",
  location: "",
  primaryDiscipline: "",
  secondaryDiscipline: "",
  careerStage: "",
  biography: "",
  careerObjective: "",
  projectDescription: "",
  whyThisProgram: "",
  portfolioLink: "",
  availability: "",
  previousPrograms: "",
  accessRequirements: "",
  firstNationsIdentification: demographicOptions[0],
  regionalRemote: demographicOptions[0],
  termsConsent: true,
  conductConsent: true,
  privacyConsent: true,
  mediaConsent: false,
};

/** Consents start unticked, so an untouched step 5 fails as it should. */
const startingValues = (): ApplyValues => ({
  ...EMPTY_VALUES,
  termsConsent: false as unknown as true,
  conductConsent: false as unknown as true,
  privacyConsent: false as unknown as true,
});

/**
 * What each step owns.
 *
 * `fields` is what gets validated before the step is allowed to advance, and
 * `required` is what the review summary counts. Both are derived from this one
 * table rather than being listed twice — the review panel cannot drift out of
 * step with what the form actually enforces.
 */
const STEPS: {
  label: string;
  heading: string;
  fields: ApplyField[];
  required: ApplyField[];
}[] = [
  {
    label: copy.stepLabels[0],
    heading: copy.stepHeadings[0],
    fields: ["program", "fullName", "email", "phone", "location"],
    required: ["program", "fullName", "email", "phone", "location"],
  },
  {
    label: copy.stepLabels[1],
    heading: copy.stepHeadings[1],
    fields: [
      "primaryDiscipline",
      "secondaryDiscipline",
      "careerStage",
      "biography",
      "careerObjective",
    ],
    required: ["primaryDiscipline", "careerStage", "biography", "careerObjective"],
  },
  {
    label: copy.stepLabels[2],
    heading: copy.stepHeadings[2],
    fields: [
      "projectDescription",
      "whyThisProgram",
      "portfolioLink",
      "availability",
      "previousPrograms",
    ],
    required: [
      "projectDescription",
      "whyThisProgram",
      "portfolioLink",
      "availability",
    ],
  },
  {
    label: copy.stepLabels[3],
    heading: copy.stepHeadings[3],
    fields: ["accessRequirements", "firstNationsIdentification", "regionalRemote"],
    required: [],
  },
  {
    label: copy.stepLabels[4],
    heading: copy.stepHeadings[4],
    fields: ["termsConsent", "conductConsent", "privacyConsent", "mediaConsent"],
    required: ["termsConsent", "conductConsent", "privacyConsent"],
  },
];

const INDICATOR_STEPS = STEPS.map((step, index) => ({
  label: step.label,
  number: index + 1,
}));

/**
 * A locally generated reference number.
 *
 * It identifies nothing — no application record exists anywhere, because
 * nothing is transmitted (D4). The success screen says so in as many words.
 */
const makeReference = (): string =>
  `${copy.referencePrefix}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

/**
 * The five-step application form.
 *
 * **Frontend only, by decision D4.** It validates each step before letting you
 * past it, validates everything again on submit, and swaps to the success
 * screen. There is no `fetch`, no server action, and nothing from
 * `src/lib/email/` is imported.
 *
 * That matters most for step 4. It collects optional demographic data under a
 * printed promise about how that data is handled, and today the promise is kept
 * trivially because the data never leaves the browser. See the blocking
 * prerequisite in `talent_lab_progress.md` before wiring a destination.
 */
export function ApplyPage() {
  const [step, setStep] = useState(1);
  const [furthest, setFurthest] = useState(1);
  const [stepBlocked, setStepBlocked] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const fieldId = useId();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitted: hasTriedSubmit },
  } = useForm<ApplyValues>({
    resolver: zodResolver(applySchema),
    defaultValues: startingValues(),
  });

  /**
   * `useWatch` rather than `watch()`.
   *
   * `watch()` returns a fresh function on every render, which the React
   * Compiler cannot memoize — it bails out of optimising the whole component
   * and says so. `useWatch` is the subscription API built for exactly this and
   * re-renders only on the values it is watching.
   */
  const values = useWatch({ control }) as ApplyValues;
  const current = STEPS[step - 1];
  const biographyWords = countWords(values.biography ?? "");

  /** How many of a step's fields carry an answer — drives the review panel. */
  const answeredIn = (fields: ApplyField[]): number =>
    fields.filter((field) => {
      const value = values[field];
      if (typeof value === "boolean") return value;
      return String(value ?? "").trim() !== "";
    }).length;

  const goToStep = async (target: number) => {
    setStepBlocked(false);

    // Backwards is always allowed — nothing is lost by re-reading an answer.
    if (target <= step) {
      setStep(target);
      return;
    }

    // Forwards has to pass this step's validation first. This is the gate the
    // whole multi-step shape exists for.
    const isValid = await trigger(current.fields);
    if (!isValid) {
      setStepBlocked(true);
      return;
    }

    const next = Math.min(target, furthest + 1, STEPS.length);
    setStep(next);
    setFurthest((reached) => Math.max(reached, next));
  };

  const onValid = () => {
    // Deliberately empty of side effects. Nothing leaves the browser (D4).
    setReference(makeReference());
  };

  const onInvalid = () => {
    // A failure on submit can only come from step 5's consents, since every
    // earlier step was validated on the way through. Stay put and show them.
    setStepBlocked(true);
  };

  if (reference) {
    return (
      <div className="bg-black text-white">
        <FormSuccess
          eyebrow={`Reference ${reference}`}
          heading={copy.successHeading}
          body={copy.successBody}
          panelTitle={copy.successPanelTitle}
          panelLines={copy.successPanelLines}
          notConnectedNote={copy.notConnectedNote}
          primary={{ label: "Public masterclasses", href: "/talent-lab/events" }}
          onReset={() => {
            reset(startingValues());
            setStep(1);
            setFurthest(1);
            setStepBlocked(false);
            setReference(null);
          }}
          resetLabel={copy.resetLabel}
        />
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <PageHeader
        crumbs={[
          { label: "Talent Lab", href: "/talent-lab" },
          { label: "Apply" },
        ]}
        title={copy.title}
        intro={copy.intro}
      />

      <section className="border-b border-white/8 bg-white/[0.02] py-6">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <StepIndicator
            steps={INDICATOR_STEPS}
            current={step}
            furthest={furthest}
            onSelect={(target) => void goToStep(target)}
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          noValidate
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-white">{current.heading}</h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
              Step {step} of {STEPS.length} — fields marked{" "}
              <span className="text-yellow-400">*</span> are required.
            </p>
          </div>

          {/* ------------------------------------------------ 1 · Contact */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <FormField
                label="Program you are applying for"
                required
                helper={copy.programHelper}
                error={errors.program?.message}
              >
                {(props) => (
                  <SelectControl
                    {...props}
                    {...register("program")}
                    options={PROGRAM_NAMES}
                    placeholder="Select a program…"
                  />
                )}
              </FormField>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  label="Full name"
                  required
                  error={errors.fullName?.message}
                >
                  {(props) => (
                    <TextControl
                      {...props}
                      {...register("fullName")}
                      type="text"
                      autoComplete="name"
                    />
                  )}
                </FormField>

                <FormField label="Email" required error={errors.email?.message}>
                  {(props) => (
                    <TextControl
                      {...props}
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                    />
                  )}
                </FormField>

                <FormField label="Phone" required error={errors.phone?.message}>
                  {(props) => (
                    <TextControl
                      {...props}
                      {...register("phone")}
                      type="tel"
                      autoComplete="tel"
                    />
                  )}
                </FormField>

                <FormField
                  label="Suburb, state & postcode"
                  required
                  error={errors.location?.message}
                >
                  {(props) => (
                    <TextControl
                      {...props}
                      {...register("location")}
                      type="text"
                      placeholder={copy.locationPlaceholder}
                      autoComplete="address-level2"
                    />
                  )}
                </FormField>
              </div>
            </div>
          )}

          {/* ------------------------------------------------ 2 · Profile */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  label="Primary discipline"
                  required
                  error={errors.primaryDiscipline?.message}
                >
                  {(props) => (
                    <SelectControl
                      {...props}
                      {...register("primaryDiscipline")}
                      options={formDisciplines}
                    />
                  )}
                </FormField>

                <FormField
                  label="Secondary discipline"
                  error={errors.secondaryDiscipline?.message}
                >
                  {(props) => (
                    <SelectControl
                      {...props}
                      {...register("secondaryDiscipline")}
                      options={formDisciplines}
                      placeholder="None"
                    />
                  )}
                </FormField>
              </div>

              <FormField
                label="Career stage"
                required
                error={errors.careerStage?.message}
              >
                {(props) => (
                  <SelectControl
                    {...props}
                    {...register("careerStage")}
                    options={formCareerStages}
                  />
                )}
              </FormField>

              <FormField
                label="Short professional biography"
                required
                helper={copy.biographyHelper}
                error={errors.biography?.message}
              >
                {(props) => (
                  <>
                    <TextAreaControl
                      {...props}
                      {...register("biography")}
                      rows={5}
                    />
                    <p
                      className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                        biographyWords > 200 ? "text-[#F5A25A]" : "text-white/40"
                      }`}
                    >
                      {biographyWords} / 200 words
                    </p>
                  </>
                )}
              </FormField>

              <FormField
                label="Career objective"
                required
                helper={copy.objectiveHelper}
                error={errors.careerObjective?.message}
              >
                {(props) => (
                  <TextAreaControl
                    {...props}
                    {...register("careerObjective")}
                    rows={4}
                  />
                )}
              </FormField>
            </div>
          )}

          {/* ------------------------------- 3 · Project & motivation */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <FormField
                label="Project or portfolio description"
                required
                error={errors.projectDescription?.message}
              >
                {(props) => (
                  <TextAreaControl
                    {...props}
                    {...register("projectDescription")}
                    rows={5}
                  />
                )}
              </FormField>

              <FormField
                label="Why would this program benefit you?"
                required
                error={errors.whyThisProgram?.message}
              >
                {(props) => (
                  <TextAreaControl
                    {...props}
                    {...register("whyThisProgram")}
                    rows={5}
                  />
                )}
              </FormField>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  label="Portfolio, showreel or project link"
                  required
                  error={errors.portfolioLink?.message}
                >
                  {(props) => (
                    <TextControl
                      {...props}
                      {...register("portfolioLink")}
                      type="url"
                      inputMode="url"
                      placeholder="https://"
                    />
                  )}
                </FormField>

                <FormField
                  label="Availability"
                  required
                  error={errors.availability?.message}
                >
                  {(props) => (
                    <SelectControl
                      {...props}
                      {...register("availability")}
                      options={availabilityOptions}
                    />
                  )}
                </FormField>
              </div>

              <FormField
                label="Previous professional development programs"
                helper={copy.previousProgramsHelper}
                error={errors.previousPrograms?.message}
              >
                {(props) => (
                  <TextAreaControl
                    {...props}
                    {...register("previousPrograms")}
                    rows={3}
                  />
                )}
              </FormField>
            </div>
          )}

          {/* --------------------------------- 4 · Optional & private */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              {/*
                The notice is reproduced verbatim from the approved design and
                lives in `talent-lab-edition.ts` so it is edited in one place.
                It is a promise about how this data is handled — see the
                blocking prerequisite in the progress log before any of it is
                ever transmitted.
              */}
              <p className="flex items-start gap-3 rounded-xl border border-[#7FB2F0]/35 bg-[#7FB2F0]/[0.07] p-5 text-sm font-light leading-relaxed text-white/85">
                <span aria-hidden="true" className="text-[#7FB2F0]">
                  ⓘ
                </span>
                {copy.privateNotice}
              </p>

              <FormField
                label="Access requirements"
                helper={copy.accessHelper}
                error={errors.accessRequirements?.message}
              >
                {(props) => (
                  <TextAreaControl
                    {...props}
                    {...register("accessRequirements")}
                    rows={3}
                  />
                )}
              </FormField>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  label="Do you identify as Aboriginal and/or Torres Strait Islander?"
                  error={errors.firstNationsIdentification?.message}
                >
                  {(props) => (
                    <SelectControl
                      {...props}
                      {...register("firstNationsIdentification")}
                      options={demographicOptions}
                      placeholder={demographicOptions[0]}
                    />
                  )}
                </FormField>

                <FormField
                  label="Do you live in a regional or remote area?"
                  error={errors.regionalRemote?.message}
                >
                  {(props) => (
                    <SelectControl
                      {...props}
                      {...register("regionalRemote")}
                      options={demographicOptions}
                      placeholder={demographicOptions[0]}
                    />
                  )}
                </FormField>
              </div>
            </div>
          )}

          {/* --------------------------------- 5 · Consents & review */}
          {step === 5 && (
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-yellow-400">
                  {copy.reviewTitle}
                </h3>

                {/* Every line is counted from the live form values. */}
                <ul className="flex flex-col gap-2">
                  {STEPS.slice(0, 4).map((reviewStep, index) => {
                    const total = reviewStep.required.length;
                    const answered = answeredIn(
                      total > 0 ? reviewStep.required : reviewStep.fields
                    );
                    const optionalTotal = reviewStep.fields.length;

                    return (
                      <li
                        key={reviewStep.label}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-white/8 pb-2 text-sm font-light text-white/70 last:border-b-0"
                      >
                        <span>{reviewStep.heading}</span>
                        <span
                          className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                            total > 0 && answered === total
                              ? "text-yellow-400"
                              : "text-white/45"
                          }`}
                        >
                          {total > 0
                            ? answered === total
                              ? "Complete"
                              : `${answered} of ${total} answered`
                            : `${answered} of ${optionalTotal} answered · all optional`}
                        </span>
                        <span className="sr-only">
                          {" "}
                          Select step {index + 1} in the progress bar above to
                          edit this section.
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <SecondaryFormButton onClick={() => void goToStep(1)}>
                  {copy.reviewEditLabel}
                </SecondaryFormButton>
              </div>

              <div className="flex flex-col gap-4">
                {consentItems.map((item) => (
                  <Controller
                    key={item.name}
                    control={control}
                    name={item.name}
                    render={({ field }) => (
                      <CheckboxRow
                        id={`${fieldId}-${item.name}`}
                        label={item.label}
                        flag={item.required ? "required" : "optional"}
                        checked={field.value === true}
                        onChange={(checked) => field.onChange(checked)}
                        error={
                          item.required ? errors[item.name]?.message : undefined
                        }
                      />
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {stepBlocked && (
            <FormErrorSummary
              count={
                Object.keys(errors).filter((key) =>
                  current.fields.includes(key as ApplyField)
                ).length
              }
            />
          )}

          {hasTriedSubmit && !stepBlocked && (
            <FormErrorSummary count={Object.keys(errors).length} />
          )}

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-7">
            {step > 1 && (
              <SecondaryFormButton onClick={() => void goToStep(step - 1)}>
                {copy.backLabel}
              </SecondaryFormButton>
            )}

            {step < STEPS.length ? (
              <PrimaryFormButton
                type="button"
                onClick={() => void goToStep(step + 1)}
              >
                {copy.continueLabel}
              </PrimaryFormButton>
            ) : (
              <PrimaryFormButton>{copy.submitLabel}</PrimaryFormButton>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
