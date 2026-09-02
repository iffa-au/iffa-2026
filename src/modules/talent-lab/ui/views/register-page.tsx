"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import {
  australianStates,
  formCareerStages,
  formDisciplines,
} from "../../data/form-options";
import { streams } from "../../data/streams-data";
import { formCopy } from "../../data/talent-lab-edition";
import {
  CheckboxRow,
  FormErrorSummary,
  PrimaryFormButton,
  SelectControl,
  TextAreaControl,
  TextControl,
} from "../components/form-controls";
import { FormField } from "../components/form-field";
import { FormSuccess } from "../components/form-success";
import { PageHeader } from "../components/page-header";

const copy = formCopy.register;

/** Built from `streams-data`, so a new stream appears here with no edit. */
const PROGRAM_OPTIONS = streams.map((stream) => ({
  value: stream.slug,
  label: stream.name,
}));

/**
 * An optional URL field. Left empty it is valid; filled in it must be a URL.
 *
 * `z.url()` alone rejects `""`, which would make an optional field fail the
 * moment someone clicked into it and back out again.
 */
const optionalUrl = z.union([
  z.literal(""),
  z.url("Enter a full link, starting with https://"),
]);

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address."),
  state: z
    .string()
    .min(1, "Select the state or territory you are based in."),
  discipline: z.string().min(1, "Select your primary screen discipline."),
  careerStage: z.string().min(1, "Select the career stage that fits you best."),
  portfolioLink: optionalUrl,
  programs: z.array(z.string()),
  accessRequirements: z.string(),
  mailingList: z.boolean(),
  privacyConsent: z.literal(true, {
    message: "Privacy consent is required before you can submit this form.",
  }),
});

type RegisterValues = z.infer<typeof registerSchema>;

const EMPTY_VALUES: RegisterValues = {
  fullName: "",
  email: "",
  state: "",
  discipline: "",
  careerStage: "",
  portfolioLink: "",
  programs: [],
  accessRequirements: "",
  mailingList: false,
  privacyConsent: true,
};

/**
 * The Expression of Interest form.
 *
 * **Frontend only, by decision D4.** It validates with Zod and swaps to the
 * success screen. There is no `fetch`, no server action, and nothing from
 * `src/lib/email/` is imported — see the note on `FormSuccess`, which states
 * that plainly to the person who just filled it in.
 */
export function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const consentId = useId();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted: hasTriedSubmit },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    // The consent box starts unticked; the schema demands `true`, so an
    // untouched form fails on it exactly as it should.
    defaultValues: { ...EMPTY_VALUES, privacyConsent: false as unknown as true },
  });

  const errorCount = Object.keys(errors).length;

  const onValid = () => {
    // Deliberately empty of side effects. Nothing leaves the browser (D4).
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-black text-white">
        <FormSuccess
          heading={copy.successHeading}
          body={copy.successBody}
          panelTitle={copy.successPanelTitle}
          panelLines={copy.successPanelLines}
          notConnectedNote={copy.notConnectedNote}
          primary={{
            label: "View current opportunities",
            href: "/talent-lab/opportunities",
          }}
          onReset={() => {
            reset({ ...EMPTY_VALUES, privacyConsent: false as unknown as true });
            setIsSubmitted(false);
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
          { label: "Register your interest" },
        ]}
        title={copy.title}
        intro={copy.intro}
      />

      <section className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <form
          onSubmit={handleSubmit(onValid)}
          noValidate
          className="flex flex-col gap-7"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            Fields marked <span className="text-yellow-400">*</span> are required.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Full name" required error={errors.fullName?.message}>
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

            <FormField
              label="State or territory"
              required
              error={errors.state?.message}
            >
              {(props) => (
                <SelectControl
                  {...props}
                  {...register("state")}
                  options={australianStates}
                />
              )}
            </FormField>

            <FormField
              label="Primary screen discipline"
              required
              error={errors.discipline?.message}
            >
              {(props) => (
                <SelectControl
                  {...props}
                  {...register("discipline")}
                  options={formDisciplines}
                />
              )}
            </FormField>

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
              label="Portfolio or profile link"
              helper={copy.portfolioHelper}
              error={errors.portfolioLink?.message}
            >
              {(props) => (
                <TextControl
                  {...props}
                  {...register("portfolioLink")}
                  type="url"
                  inputMode="url"
                  placeholder="https://"
                  autoComplete="url"
                />
              )}
            </FormField>
          </div>

          {/*
            `multi-select-dropdown` owns its own trigger button and takes no id
            from us, so this field is labelled as a group rather than with a
            `<label htmlFor>` pointing at nothing. See `form-field.tsx`.
          */}
          <FormField
            label={copy.programsLegend}
            labelling="group"
            helper={copy.programsHelper}
          >
            {() => (
              <Controller
                control={control}
                name="programs"
                render={({ field }) => (
                  <MultiSelectDropdown
                    options={PROGRAM_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select any programs you are interested in"
                  />
                )}
              />
            )}
          </FormField>

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

          <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <Controller
              control={control}
              name="mailingList"
              render={({ field }) => (
                <CheckboxRow
                  id={`${consentId}-mailing`}
                  label={copy.mailingListLabel}
                  flag="optional"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="privacyConsent"
              render={({ field }) => (
                <CheckboxRow
                  id={`${consentId}-privacy`}
                  label={copy.consentLabel}
                  flag="required"
                  checked={field.value === true}
                  onChange={(checked) => field.onChange(checked)}
                  error={errors.privacyConsent?.message}
                />
              )}
            />
          </div>

          {hasTriedSubmit && <FormErrorSummary count={errorCount} />}

          <p className="text-xs font-light leading-relaxed text-white/50">
            {copy.privacyNote}
          </p>

          <div>
            <PrimaryFormButton>{copy.submitLabel}</PrimaryFormButton>
          </div>
        </form>
      </section>
    </div>
  );
}
