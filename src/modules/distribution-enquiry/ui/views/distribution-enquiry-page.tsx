"use client";

import { useState, type BaseSyntheticEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type Control } from "react-hook-form";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sendConfirmationEmails } from "@/lib/email/send-confirmation-emails";
import { cn } from "@/lib/utils";
import { useSubmissionOptions } from "@/utils/FilmSubmission.utils";

import {
  DELIVERABLES,
  PRODUCTION_STATUSES,
  RIGHTS,
  SUBMITTER_ROLES,
  SYNOPSIS_MAX,
  TERRITORIES,
  type Choice,
} from "../../data/form-options";
import {
  distributionEnquirySchema,
  EMPTY_ENQUIRY,
  toPayload,
  type DistributionEnquiryValues,
} from "../../lib/schema";
import { toConfirmationEmail } from "../../lib/notify";
import { FormSection } from "../components/form-section";
import {
  HELP,
  INPUT,
  LABEL,
  MESSAGE,
  MULTI_SELECT_WRAP,
  SELECT_CONTENT,
  SELECT_TRIGGER,
  TEXTAREA,
} from "../components/form-styles";
import { OptionChips } from "../components/option-chips";
import { SuccessScreen } from "../components/success-screen";

// Same base the film forms read their metadata lists from.
const API_BASE =
  process.env.NEXT_PUBLIC_SUBMIT_FILM_URL ||
  "https://guh4nzpet5.ap-southeast-2.awsapprunner.com/api/v1";

const SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";

type Values = DistributionEnquiryValues;

/** The field names whose value is a plain string — the ones a text box can hold. */
type TextName = {
  [K in keyof Values]: Values[K] extends string ? K : never;
}[keyof Values];

type ListName = "rights" | "territories" | "deliverables";

/** The hidden honeypot's value, read from the submitted form element. */
function honeypotValue(event?: BaseSyntheticEvent): string {
  const formEl = event?.target;
  if (!(formEl instanceof HTMLFormElement)) return "";
  return String(new FormData(formEl).get("homepage") ?? "");
}

function Required() {
  return <span className="text-[#e6ba35]"> *</span>;
}

function Optional() {
  return <span className="normal-case tracking-normal text-[#5a5240]"> (optional)</span>;
}

/*
  Errors are read from each Controller's own `fieldState`, never from the
  shadcn `FormMessage` / `FormControl`. Those go through `useFormField`, which
  calls `getFieldState(name, formState)`; under the React Compiler that call is
  memoised on a `formState` object react-hook-form mutates in place, so it keeps
  returning "no error" and the message never renders. `fieldState` is fresh on
  every Controller render.
*/
const errorId = (name: string) => `distribution-enquiry-${name}-error`;

function invalidProps(name: string, error?: { message?: string }) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId(name) : undefined,
  } as const;
}

function FieldError({ name, error }: { name: string; error?: { message?: string } }) {
  if (!error?.message) return null;
  return (
    <p id={errorId(name)} className={MESSAGE}>
      {error.message}
    </p>
  );
}

function TextField({
  control,
  name,
  label,
  required = false,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  wide = false,
}: {
  control: Control<Values>;
  name: TextName;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "url" | "email" | "tel";
  wide?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn(wide && "md:col-span-2")}>
          <FormLabel className={LABEL}>
            {label}
            {required ? <Required /> : <Optional />}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={inputMode}
              className={INPUT}
              {...invalidProps(name, fieldState.error)}
            />
          </FormControl>
          <FieldError name={name} error={fieldState.error} />
        </FormItem>
      )}
    />
  );
}

function TextAreaField({
  control,
  name,
  label,
  required = false,
  placeholder,
  rows = 3,
  help,
}: {
  control: Control<Values>;
  name: TextName;
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  help?: React.ReactNode;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="md:col-span-2">
          <FormLabel className={LABEL}>
            {label}
            {required ? <Required /> : <Optional />}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              className={TEXTAREA}
              {...invalidProps(name, fieldState.error)}
            />
          </FormControl>
          {help}
          <FieldError name={name} error={fieldState.error} />
        </FormItem>
      )}
    />
  );
}

function SelectField({
  control,
  name,
  label,
  options,
  placeholder,
  disabled = false,
}: {
  control: Control<Values>;
  name: TextName;
  label: string;
  options: Choice[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className={LABEL}>
            {label}
            <Required />
          </FormLabel>
          <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
            <FormControl>
              <SelectTrigger
                ref={field.ref}
                onBlur={field.onBlur}
                className={SELECT_TRIGGER}
                {...invalidProps(name, fieldState.error)}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={SELECT_CONTENT}>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError name={name} error={fieldState.error} />
        </FormItem>
      )}
    />
  );
}

function ChipsField({
  control,
  name,
  legend,
  options,
  required = false,
}: {
  control: Control<Values>;
  name: ListName;
  legend: string;
  options: Choice[];
  required?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="md:col-span-2">
          <fieldset
            className="space-y-3"
            aria-describedby={fieldState.error ? errorId(name) : undefined}
          >
            <legend className={cn(LABEL, "mb-3")}>
              {legend}
              {required ? <Required /> : <Optional />}
            </legend>
            <OptionChips
              name={name}
              options={options}
              value={field.value}
              onChange={field.onChange}
              invalid={Boolean(fieldState.error)}
            />
          </fieldset>
          <FieldError name={name} error={fieldState.error} />
        </FormItem>
      )}
    />
  );
}

export function DistributionEnquiryPage() {
  const [submittedTitle, setSubmittedTitle] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { genres, contentTypes, countries, languages, loading, error } =
    useSubmissionOptions(API_BASE);

  const form = useForm<Values>({
    resolver: zodResolver(distributionEnquirySchema),
    defaultValues: EMPTY_ENQUIRY,
    // Errors appear on submit, then clear as each field is fixed.
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { control } = form;
  const synopsis = useWatch({ control, name: "synopsis" });

  const toChoices = (list: { _id: string; name: string }[]): Choice[] =>
    list.map((item) => ({ value: item._id, label: item.name }));
  const listsPending = loading || Boolean(error);
  const pendingLabel = (what: string) => (loading ? "Loading…" : `Select ${what}`);

  const onSubmit = async (values: Values, event?: BaseSyntheticEvent) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${API_BASE}/distribution-enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...toPayload(values),
          homepage: honeypotValue(event),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || `Request failed (${res.status})`);
      }
    } catch (err) {
      console.error("[distribution-enquiry] submit failed:", err);
      setSubmitError(
        "We couldn't send your enquiry. Please check your connection and try again — your answers are still here.",
      );
      setSubmitting(false);
      return;
    }

    // The enquiry is stored in cms-hub at this point, so it counts as received
    // whatever happens to the emails. Failing here would invite a resubmit and a
    // duplicate record.
    try {
      await sendConfirmationEmails(
        toConfirmationEmail(values, { contentTypes, genres, countries, languages }),
      );
    } catch (err) {
      console.error("[distribution-enquiry] confirmation emails failed:", err);
    }

    setSubmitting(false);
    setSubmittedTitle(values.title);
    window.scrollTo({ top: 0 });
  };

  const onInvalid = () => {
    // Land the keyboard and the eye on the first problem, not the submit button.
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>("[aria-invalid='true']")
        ?.focus({ preventScroll: false });
    });
  };

  if (submittedTitle) {
    return (
      <SuccessScreen
        title={submittedTitle}
        onReset={() => {
          form.reset(EMPTY_ENQUIRY);
          setSubmittedTitle(null);
        }}
      />
    );
  }

  return (
    <div className="w-full">
      <header className="mx-auto max-w-5xl px-6 pb-8 pt-12">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#e6ba35]/60">
          IFFA Awards / Distribution Enquiry
        </p>
        <h1
          className="mb-3 text-4xl font-bold tracking-tight text-white md:text-5xl"
          style={{ fontFamily: SERIF }}
        >
          Distribution Enquiry
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#a9a086]">
          Looking for distribution for your film? Tell us about it and the rights you can
          offer. Our team reviews every enquiry and will contact you about next steps.
        </p>
        <p className="mt-3 text-sm text-[#8a8168]">
          Fields marked <span className="text-[#e6ba35]">*</span> are required.
        </p>
      </header>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-5"
            noValidate
          >

            <FormSection title="About you" desc="Who we should get back to about this film.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <TextField control={control} name="name" label="Full name" required autoComplete="name" />
                <TextField control={control} name="email" label="Email" required type="email" autoComplete="email" inputMode="email" />
                <TextField control={control} name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+61 400 000 000" />
                <TextField control={control} name="company" label="Company / production house" required autoComplete="organization" />
                <SelectField control={control} name="role" label="Your role" options={SUBMITTER_ROLES} placeholder="Select your role" />
                <TextField control={control} name="website" label="Website" type="url" inputMode="url" placeholder="https://" />
              </div>
            </FormSection>

            <FormSection title="The film" desc="The essentials a distributor looks at first.">
              {error && (
                <Alert className="mb-5 rounded-xl border-red-500/25 bg-red-950/25 text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    The content type, genre, country and language lists didn&apos;t load. Refresh the
                    page to try again.
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <TextField control={control} name="title" label="Film title" required wide />
                <SelectField control={control} name="contentTypeId" label="Content type" options={toChoices(contentTypes)} placeholder={pendingLabel("content type")} disabled={listsPending} />
                <SelectField control={control} name="productionStatus" label="Production status" options={PRODUCTION_STATUSES} placeholder="Select status" />

                <div className={cn("md:col-span-2", MULTI_SELECT_WRAP)}>
                  <FormField
                    control={control}
                    name="genreIds"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className={LABEL}>
                          Genres
                          <Required />
                        </FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            options={toChoices(genres)}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={loading ? "Loading genres…" : "Select one or more genres"}
                            disabled={listsPending}
                            error={fieldState.error?.message}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <SelectField control={control} name="countryId" label="Country of origin" options={toChoices(countries)} placeholder={pendingLabel("country")} disabled={listsPending} />
                <SelectField control={control} name="languageId" label="Original language" options={toChoices(languages)} placeholder={pendingLabel("language")} disabled={listsPending} />
                <TextField control={control} name="runtime" label="Runtime (minutes)" required inputMode="numeric" placeholder="e.g. 98" />
                <TextField control={control} name="year" label="Year of completion" required inputMode="numeric" placeholder="e.g. 2026" />

                <TextAreaField
                  control={control}
                  name="synopsis"
                  label="Synopsis"
                  required
                  rows={5}
                  placeholder="What the film is about, in a paragraph or two."
                  help={
                    <p
                      className={cn(HELP, "text-right", synopsis.length > SYNOPSIS_MAX && "text-red-400")}
                      aria-live="polite"
                    >
                      {synopsis.length} / {SYNOPSIS_MAX}
                    </p>
                  }
                />
                <TextAreaField
                  control={control}
                  name="festivals"
                  label="Festivals & awards"
                  placeholder="Selections, premieres and awards so far."
                />
              </div>
            </FormSection>

            <FormSection title="Distribution" desc="What you can offer, and where.">
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                <ChipsField control={control} name="rights" legend="Rights available" options={RIGHTS} required />
                <ChipsField control={control} name="territories" legend="Territories sought" options={TERRITORIES} required />
                <TextAreaField
                  control={control}
                  name="territoriesSold"
                  label="Territories already sold"
                  rows={2}
                  placeholder="Any existing deals, by territory and rights."
                />
                <ChipsField control={control} name="deliverables" legend="Deliverables ready" options={DELIVERABLES} />
              </div>
            </FormSection>

            <FormSection title="Screening material" desc="A private link we can watch the film on.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <TextField control={control} name="screenerUrl" label="Screener link" required type="url" inputMode="url" placeholder="https://vimeo.com/…" />
                <TextField control={control} name="screenerPassword" label="Screener password" autoComplete="off" />
                <TextField control={control} name="trailerUrl" label="Trailer link" type="url" inputMode="url" placeholder="https://" wide />
                <TextAreaField control={control} name="notes" label="Anything else" placeholder="Anything else we should know." />
              </div>
            </FormSection>

            <FormField
              control={control}
              name="rightsConfirmed"
              render={({ field, fieldState }) => (
                <FormItem className="rounded-2xl border border-[#2a2417] bg-[#17140d] p-5 md:px-7">
                  <div className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        {...invalidProps(field.name, fieldState.error)}
                        className="mt-0.5 border-[#5a5240] data-checked:border-[#e6ba35] data-checked:bg-[#e6ba35] data-checked:text-black"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal leading-relaxed text-white/85">
                      I hold, or am authorised to represent, the distribution rights to this film.
                      <Required />
                    </FormLabel>
                  </div>
                  <div className="pl-7">
                    <FieldError name={field.name} error={fieldState.error} />
                  </div>
                </FormItem>
              )}
            />

            {submitError && (
              <Alert
                role="alert"
                className="rounded-xl border-red-500/25 bg-red-950/25 text-red-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-lg bg-[#e6ba35] px-10 text-xs font-bold uppercase tracking-[0.2em] text-black hover:bg-[#d4a82e] disabled:opacity-60 sm:w-auto"
              >
                {submitting ? "Sending…" : "Send enquiry"}
              </Button>
            </div>
            {/* Honeypot: hidden from people and assistive tech, so only a bot
                fills it in. cms-hub quietly drops any enquiry that has it set. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Homepage
                <input type="text" name="homepage" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default DistributionEnquiryPage;
