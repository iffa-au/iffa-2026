"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2, Loader2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  buildFilmSchema,
  useSubmissionOptions,
  BLANK_PERSON,
  WATCH_FORMAT_OPTIONS,
  contentTypeHidesActors,
  filterFilledCrew,
  type FilmValues,
  type PersonEntry,
} from "@/utils/FilmSubmission.utils";
import { sendConfirmationEmails } from "@/lib/email/send-confirmation-emails";
import { FIELD_KEYS } from "@/lib/email/field-keys";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { CrewList } from "./components/CrewList";
import { WebpImageUpload, uploadWebpImage, createSubmissionRef } from "./components/WebpImageUpload";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_SUBMIT_FILM_URL ||
  "https://guh4nzpet5.ap-southeast-2.awsapprunner.com/api/v1";

const ACTOR_ROLES = ["Actor in a leading role", "Actress in a leading role", "Actor in a supporting role", "Actress in a supporting role"];
const DIRECTOR_ROLES = ["Director", "Co-Director"];
const PRODUCER_ROLES = ["Producer", "Executive Producer"];

// ─── Shared style tokens ──────────────────────────────────────────────────────
// Sizes here are deliberately well above the 10–11px the form used to run on:
// this is a long, dense form filled in once, under pressure, often on a
// laptop — legibility matters more than fitting another field above the fold.
const L = "text-[13px] font-semibold tracking-[0.01em] text-[#cbc0a0]";
const I =
  "bg-[#0a0908] border-[#2a2418] text-white text-[15px] placeholder-[#4a4436] focus:border-[#e6ba35]/50 focus-visible:ring-[#e6ba35]/20 focus-visible:ring-2 rounded-lg h-12 px-4";
const HELP = "text-[13px] text-[#8a8268] leading-relaxed mt-2";
const ERR = "text-red-400 text-[13px] mt-1.5";

// The gold asterisk is decorative — the label text already carries the
// requirement for assistive tech via the input's own `required` semantics.
function Req() {
  return (
    <span aria-hidden="true" className="text-[#e6ba35] ml-0.5">
      *
    </span>
  );
}

function Optional() {
  return (
    <span className="ml-2 align-middle rounded-full border border-[#2a2418] px-2 py-[1px] text-[10px] font-medium uppercase tracking-wider text-[#6b6347]">
      Optional
    </span>
  );
}

// Keeps duration inputs digit-only and within range as the user types,
// rather than relying on <input type="number"> alone (which still lets
// browsers accept "e", "-", "+", or out-of-range values).
//
// Clearing the box yields "" rather than "0": a pre-filled zero reads as an
// answered question, which is exactly why runtimes were arriving as 0h 0m.
function sanitizeDurationInput(raw: string, max: number, onChange: (value: string) => void) {
  const digitsOnly = raw.replace(/[^0-9]/g, "");
  if (digitsOnly === "") {
    onChange("");
    return;
  }
  const num = Number(digitsOnly);
  if (num > max) return;
  onChange(String(num));
}

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { id: "section-basics", step: 1, title: "Basic Information", short: "Basics" },
  { id: "section-crew", step: 2, title: "Crew Information", short: "Crew" },
  { id: "section-media", step: 3, title: "Media, Links & Declaration", short: "Media" },
] as const;

const CREW_FIELDS = new Set(["actors", "directors", "producers", "writers"]);
const MEDIA_FIELDS = new Set([
  "potraitImageUrl", "landscapeImageUrl", "imdbUrl", "trailerUrl",
  "trailerHasPassword", "trailerPassword", "notes", "contactEmail", "agreeRights",
]);

/** Which section a (possibly nested, e.g. `directors.0.email`) field lives in. */
function stepForField(name: string) {
  const root = name.split(".")[0];
  if (CREW_FIELDS.has(root)) return STEPS[1];
  if (MEDIA_FIELDS.has(root)) return STEPS[2];
  return STEPS[0];
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
// `id` doubles as the scroll target for the step rail and the error summary.
function Section({ id, step, title, desc, children }: { id: string; step: number; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className="relative scroll-mt-[190px] rounded-2xl border border-[#1e1c14] bg-[#0c0b08] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#e6ba35]/25 to-transparent" />
      <div className="px-8 md:px-10 py-6 border-b border-[#161410] flex items-center gap-4">
        <div className="w-10 h-10 rounded-full border border-[#e6ba35]/35 bg-[#e6ba35]/8 flex items-center justify-center shrink-0">
          <span className="text-[#e6ba35] text-sm font-bold">{step}</span>
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold tracking-tight">{title}</h2>
          {desc && <p className="text-[#7a7258] text-[13px] mt-1">{desc}</p>}
        </div>
      </div>
      <div className="p-8 md:p-10">{children}</div>
    </section>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-[#e6ba35]/15 blur-2xl scale-150" />
        <div className="relative w-20 h-20 rounded-full border border-[#e6ba35]/30 bg-[#e6ba35]/8 flex items-center justify-center">
          <CheckCircle2 className="text-[#e6ba35] w-10 h-10" />
        </div>
      </div>
      <h2 className="text-white text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
        Submission Received
      </h2>
      <p className="text-[#6b6347] text-sm max-w-sm leading-relaxed mb-8">
        Thank you. A confirmation email has been sent. Our team will review your film and reach out via your provided email.
      </p>
      <div className="flex gap-3">
        <Button asChild className="bg-[#e6ba35] hover:bg-[#d4a82e] text-black font-bold uppercase tracking-widest text-xs rounded-lg px-6 h-10">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline" onClick={() => window.location.reload()}
          className="border-[#2a2418] text-[#7a7258] hover:bg-[#e6ba35]/8 hover:text-[#e6ba35] hover:border-[#e6ba35]/30 rounded-lg px-6 h-10 text-xs">
          <span className="cursor-pointer">Submit Another</span>
        </Button>
      </div>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export function SubmitFilmForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  // One ref per form session, shared by every upload so a submission's images
  // all land in the same S3 folder. A ref rather than state: it must survive
  // re-renders without causing one, and a retried submit should reuse the
  // same folder rather than orphan the first attempt's files in another.
  const submissionRefRef = useRef(createSubmissionRef());
  // Which sections a failed submit left errors in. The form is long enough
  // that an invalid field is routinely off-screen — without this, pressing
  // Submit looks like it did nothing at all.
  const [invalidSteps, setInvalidSteps] = useState<string[]>([]);
  const { genres, contentTypes, countries, languages, loading } = useSubmissionOptions(API_BASE);
  const filmSchema = useMemo(() => buildFilmSchema(contentTypes), [contentTypes]);

  const form = useForm<FilmValues>({
    resolver: zodResolver(filmSchema),
    defaultValues: {
      title: "", synopsis: "", releaseDate: "", durationHours: "", durationMinutes: "", contentTypeId: "", countryId: "",
      releaseCountryIds: [], watchFormats: [], releaseLinkUrl: "",
      languageId: "", productionHouse: "", distributor: "", genreIds: [],
      potraitImageUrl: null, landscapeImageUrl: null, imdbUrl: "", trailerUrl: "",
      trailerHasPassword: false, trailerPassword: "",
      actors: [{ ...BLANK_PERSON, role: "Actor in a leading role" }],
      directors: [{ ...BLANK_PERSON, role: "Director" }],
      producers: [{ ...BLANK_PERSON, role: "Producer" }],
      writers: [],
      notes: "",
      contactEmail: "",
      agreeRights: false,
    },
  });

  const contentTypeId = form.watch("contentTypeId");
  const selectedContentTypeName = contentTypes.find((ct) => ct._id === contentTypeId)?.name;
  const hideActors = contentTypeHidesActors(selectedContentTypeName);

  useEffect(() => {
    if (hideActors) {
      form.setValue("actors", []);
    } else if (form.getValues("actors").length === 0) {
      form.setValue("actors", [{ ...BLANK_PERSON, role: "Actor in a leading role" }]);
    }
  }, [hideActors, form]);

  const duplicateDirectorAsProducer = (entry: PersonEntry) => {
    const producers = form.getValues("producers");
    const exists = producers.some(
      (p) => p.fullName.trim().toLowerCase() === entry.fullName.trim().toLowerCase(),
    );
    if (!exists && entry.fullName.trim()) {
      form.setValue("producers", [
        ...producers,
        { ...entry, role: "Producer" },
      ]);
    }
  };

  if (status === "success") return <SuccessScreen />;

  /**
   * Runs when Zod rejects the form. Collapsed crew cards re-open themselves
   * (CrewList watches submitCount), so this waits a frame before hunting for
   * the first invalid control — otherwise the field it wants to scroll to
   * may not be in the DOM yet.
   */
  const onInvalid = (errors: Record<string, unknown>) => {
    const names = Object.keys(errors);
    const stepIds = STEPS.filter((s) => names.some((n) => stepForField(n).id === s.id)).map((s) => s.id);
    setInvalidSteps(stepIds);

    requestAnimationFrame(() => {
      const firstInvalid = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      const target = firstInvalid ?? (stepIds[0] ? document.getElementById(stepIds[0]) : null);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      // Only pull focus for real inputs — scrolling a section heading into
      // view and stealing focus to it would be noise for a screen reader.
      if (firstInvalid && "focus" in firstInvalid) firstInvalid.focus({ preventScroll: true });
    });
  };

  const onSubmit = async (values: FilmValues) => {
    setInvalidSteps([]);
    setStatus("submitting");

    // Every image field holds a confirmed File at this point (Zod already
    // required it) — nothing has touched S3 yet. Upload them all now, right
    // before the submission is created, so an abandoned form never leaves
    // orphaned files in the bucket.
    const submissionRef = submissionRefRef.current;
    const title = values.title.trim();

    // Crew filenames carry the person's role and name so the folder reads
    // back sensibly. The index disambiguates two credits that slugify the
    // same — two directors sharing a name, or names with no Latin
    // characters, which both collapse to the same fragment server-side.
    const norm = async (p: PersonEntry, index: number) => ({
      fullName: p.fullName.trim(),
      role: p.role.trim(),
      imageUrl: await uploadWebpImage(p.imageUrl as File, {
        submissionRef,
        title,
        group: "crews",
        name: `${p.role.trim()}-${p.fullName.trim()}-${index + 1}`,
      }),
      biography: p.biography.trim(),
      instagramUrl: p.instagram?.trim() || "",
      email: p.email.trim().toLowerCase(),
    });

    const {
      potraitImageUrl: _rawPotrait,
      landscapeImageUrl: _rawLandscape,
      actors: _rawActors,
      directors: _rawDirectors,
      producers: _rawProducers,
      writers: _rawWriters,
      // UI-only toggle — the API infers "protected" from a non-empty
      // trailerPassword, so sending the boolean too would be a second source
      // of truth that could disagree with it.
      trailerHasPassword: _rawTrailerHasPassword,
      ...restValues
    } = values;

    try {
      const [potraitImageUrl, landscapeImageUrl, actors, directors, producers, writers] =
        await Promise.all([
          uploadWebpImage(values.potraitImageUrl as File, {
            submissionRef,
            title,
            group: "banners",
            name: "portrait",
          }),
          uploadWebpImage(values.landscapeImageUrl as File, {
            submissionRef,
            title,
            group: "banners",
            name: "landscape",
          }),
          Promise.all(filterFilledCrew(values.actors).map(norm)),
          Promise.all(values.directors.map(norm)),
          Promise.all(values.producers.map(norm)),
          Promise.all(filterFilledCrew(values.writers).map(norm)),
        ]);

      const payload = {
        ...restValues,
        // A blank box means "no hours"/"no minutes"; the API reads "" as
        // "field omitted", so send an explicit 0 for the empty half. The
        // schema has already rejected the case where both are empty.
        durationHours: values.durationHours || "0",
        durationMinutes: values.durationMinutes || "0",
        trailerPassword: values.trailerHasPassword ? values.trailerPassword.trim() : "",
        potraitImageUrl,
        landscapeImageUrl,
        // The server rebuilds the asset folder path from this plus the title —
        // it deliberately doesn't accept the path itself.
        submissionRef,
        synopsis: values.synopsis.replace(/\r?\n+/g, " ").replace(/\s{2,}/g, " ").trim(),
        notes: values.notes?.trim() || "",
        submissionYear: new Date().getFullYear(),
        isFeatured: false,
        genreId: values.genreIds[0],
        crew: { actors, directors, producers, other: writers },
      };

      const res = await fetch(`${API_BASE}/submissions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Failed");

      const submitterName =
        values.directors[0]?.fullName?.trim() ||
        values.producers[0]?.fullName?.trim() ||
        "Filmmaker";

      await sendConfirmationEmails({
        formType: "film-submission",
        submitterEmail: values.contactEmail,
        submitterName,
        fields: {
          "Film Title": values.title,
          Synopsis: values.synopsis,
          "Release Date": values.releaseDate,
          "Production House": values.productionHouse,
          Distributor: values.distributor || "Not provided",
          [FIELD_KEYS.EMAIL]: values.contactEmail,
          "IMDb URL": values.imdbUrl,
          "Trailer Download URL": values.trailerUrl,
          // The password itself deliberately stays out of email — this goes
          // to the submitter's inbox and a shared admin inbox. Reviewers read
          // it from the CMS, behind auth.
          "Trailer Link Password Protected": values.trailerHasPassword
            ? "Yes — password is on the submission in the CMS"
            : "No",
          "Release, Broadcast or Exhibition Link": values.releaseLinkUrl?.trim() || "Not provided",
          Notes: values.notes?.trim() || "Not provided",
        },
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="w-full">
      {/* Header. The shared layout pads `main` by less than the fixed header's
          real height, so the extra top padding lives here rather than in the
          layout, which every other page also uses. */}
      <div className="max-w-5xl mx-auto px-6 pt-16 md:pt-20 pb-10">
        <p className="text-[#e6ba35]/60 text-xs font-mono tracking-[0.2em] uppercase mb-5">
          IFFA Awards / Film Submission
        </p>
        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Submit Your Film
        </h1>
        <p className="text-[#9a9278] text-base leading-relaxed max-w-2xl">
          Three sections: your film&apos;s details, the people who made it, and your media links.
          Fields marked <span className="text-[#e6ba35] font-semibold">*</span> are required.
        </p>
      </div>

      {/* Step rail — orientation only; every section stays open and editable. */}
      {/* The fixed site header measures 121px, while the shared layout pads
          `main` by only 88px -- so this offset is deliberately not 88. */}
      <div className="sticky top-[121px] z-30 border-y border-[#1a1810] bg-[#0d0c09]/95 backdrop-blur-sm">
        <nav aria-label="Form sections" className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
          {STEPS.map((s) => {
            const hasError = invalidSteps.includes(s.id);
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  "flex items-center gap-2.5 rounded-full border px-4 py-2 text-[13px] whitespace-nowrap transition-colors",
                  hasError
                    ? "border-red-500/40 bg-red-500/10 text-red-300"
                    : "border-[#242017] text-[#8a8268] hover:border-[#e6ba35]/40 hover:text-[#e6ba35]"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold",
                    hasError ? "bg-red-500/20 text-red-300" : "bg-[#e6ba35]/10 text-[#e6ba35]"
                  )}
                >
                  {s.step}
                </span>
                {s.short}
                {hasError && <AlertCircle className="h-3.5 w-3.5" />}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-28">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8" noValidate>

            {/* ── 1 · Basic Information ── */}
            <Section id="section-basics" step={1} title="Basic Information" desc="Core details about your film">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">

                <div className="md:col-span-2">
                  <FormField control={form.control} name="title"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Film Title <Req /></FormLabel>
                        <FormControl><Input {...field} placeholder="Enter the full film title" className={cn(I, "text-base")} /></FormControl>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />
                </div>

                <div className="md:col-span-2">
                  <FormField control={form.control} name="synopsis"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Synopsis <Req /></FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Provide a compelling synopsis…" rows={5}
                            className={cn(I, "h-auto resize-none leading-relaxed")}
                            onPaste={(e) => {
                              const pasted = e.clipboardData?.getData("text") ?? "";
                              if (!pasted) return;
                              e.preventDefault();
                              const cleaned = pasted.replace(/\r?\n+/g, " ").replace(/\s{2,}/g, " ").trim();
                              const el = e.currentTarget;
                              const next = el.value.slice(0, el.selectionStart ?? 0) + cleaned + el.value.slice(el.selectionEnd ?? 0);
                              field.onChange(next);
                            }} />
                        </FormControl>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="releaseDate"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Release Date <Req /></FormLabel>
                      <FormControl><Input {...field} type="date" className={I} /></FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                {/* Duration. Both boxes start empty with a greyed "0"
                    placeholder rather than a literal 0, and share one error
                    line below — a message tucked under just the minutes box
                    was easy to miss, and a pre-filled 0 read as answered. */}
                <div>
                  <FormLabel className={L}>Total Runtime <Req /></FormLabel>
                  <div className="mt-2 flex items-center gap-4">
                    <FormField control={form.control} name="durationHours"
                      render={({ field }: { field: any }) => (
                        <FormItem className="flex-none">
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={10}
                                placeholder="0"
                                aria-label="Runtime hours"
                                className={cn(I, "w-24 text-center")}
                                value={field.value}
                                onChange={(e) => sanitizeDurationInput(e.target.value, 10, field.onChange)}
                              />
                            </FormControl>
                            <span className="text-[#8a8268] text-sm">hr</span>
                          </div>
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="durationMinutes"
                      render={({ field }: { field: any }) => (
                        <FormItem className="flex-none">
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="number"
                                inputMode="numeric"
                                min={0}
                                max={59}
                                placeholder="0"
                                aria-label="Runtime minutes"
                                className={cn(I, "w-24 text-center")}
                                value={field.value}
                                onChange={(e) => sanitizeDurationInput(e.target.value, 59, field.onChange)}
                              />
                            </FormControl>
                            <span className="text-[#8a8268] text-sm">min</span>
                          </div>
                        </FormItem>
                      )} />
                  </div>
                  {(form.formState.errors.durationHours || form.formState.errors.durationMinutes) && (
                    <p className={ERR}>
                      {form.formState.errors.durationHours?.message ||
                        form.formState.errors.durationMinutes?.message}
                    </p>
                  )}
                  <p className={HELP}>e.g. 1 hr 42 min. A runtime of 0 hr 0 min isn&apos;t accepted.</p>
                </div>

                <FormField control={form.control} name="contentTypeId"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Screen Format <Req /></FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                        <FormControl>
                          <SelectTrigger className={cn(I, "w-full")}>
                            <SelectValue placeholder={loading ? "Loading…" : "Select format"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#0e0d0a] border-[#2a2418] text-white">
                          {contentTypes.map(ct => <SelectItem key={ct._id} value={ct._id} className="focus:bg-[#e6ba35]/10 focus:text-[#e6ba35]">{ct.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="countryId"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Country of Origin <Req /></FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                        <FormControl>
                          <SelectTrigger className={cn(I, "w-full")}>
                            <SelectValue placeholder={loading ? "Loading…" : "Select country"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#0e0d0a] border-[#2a2418] text-white max-h-60">
                          {countries.map(c => <SelectItem key={c._id} value={c._id} className="focus:bg-[#e6ba35]/10 focus:text-[#e6ba35]">{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <div className="md:col-span-2">
                  <FormField control={form.control} name="releaseCountryIds"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Country of Release <Req /></FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            options={countries.map(c => ({ value: c._id, label: c.name }))}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={loading ? "Loading countries…" : "Select one or more release countries"}
                            error={form.formState.errors.releaseCountryIds?.message}
                            disabled={loading}
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                </div>

                <div className="md:col-span-2">
                  <FormField control={form.control} name="watchFormats"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>How can it be watched? <Req /></FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            options={WATCH_FORMAT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select theatrical, OTT, etc."
                            error={form.formState.errors.watchFormats?.message}
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                </div>

                <div className="md:col-span-2">
                  <FormField control={form.control} name="releaseLinkUrl"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Release, Broadcast or Exhibition Link <Optional /></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link to official streaming, cinema, TV, festival, press or private screener" className={I} />
                        </FormControl>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="languageId"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Primary Language <Req /></FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                        <FormControl>
                          <SelectTrigger className={cn(I, "w-full")}>
                            <SelectValue placeholder={loading ? "Loading…" : "Select language"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#0e0d0a] border-[#2a2418] text-white max-h-60">
                          {languages.map(l => <SelectItem key={l._id} value={l._id} className="focus:bg-[#e6ba35]/10 focus:text-[#e6ba35]">{l.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="productionHouse"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Production House <Req /></FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. A24, Warner Bros." className={I} /></FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="distributor"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Distributor <Optional /></FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. Netflix, Amazon" className={I} /></FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <div className="md:col-span-2">
                  <FormField control={form.control} name="genreIds"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Genres <Req /></FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            options={genres.map(g => ({ value: g._id, label: g.name }))}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={loading ? "Loading genres…" : "Select one or more genres"}
                            error={form.formState.errors.genreIds?.message}
                            disabled={loading}
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                </div>
              </div>
            </Section>

            {/* ── 2 · Crew ── */}
            <Section id="section-crew" step={2} title="Crew Information" desc="Add cast and key production crew">
              <div className="space-y-8">
                {!hideActors && (
                  <>
                    <CrewList form={form} fieldName="actors" title="Actors — Lead & Supporting" label="Actor"
                      defaultEntry={{ fullName: "", role: "Actor in a leading role", imageUrl: null, biography: "", instagram: "", email: "" }}
                      roleInput={{ type: "select", options: ACTOR_ROLES }}
                      error={form.formState.errors.actors?.message} />

                    <div className="border-t border-[#141210]" />
                  </>
                )}

                <CrewList form={form} fieldName="directors" title="Director(s)" label="Director"
                  defaultEntry={{ fullName: "", role: "Director", imageUrl: null, biography: "", instagram: "", email: "" }}
                  roleInput={{ type: "select", options: DIRECTOR_ROLES }}
                  error={form.formState.errors.directors?.message}
                  onDuplicateEntry={duplicateDirectorAsProducer}
                  duplicateLabel="Also add as producer" />

                <div className="border-t border-[#141210]" />

                <CrewList form={form} fieldName="producers" title="Producer(s)" label="Producer"
                  defaultEntry={{ fullName: "", role: "Producer", imageUrl: null, biography: "", instagram: "", email: "" }}
                  roleInput={{ type: "select", options: PRODUCER_ROLES }}
                  error={form.formState.errors.producers?.message} />

                <div className="border-t border-[#141210]" />

                <CrewList form={form} fieldName="writers" title="Other — DOP, Editor, Writer, Music…" label="Credit"
                  defaultEntry={{ fullName: "", role: "", imageUrl: null, biography: "", instagram: "", email: "" }}
                  roleInput={{ type: "text", placeholder: "e.g. Writer, DOP, Composer" }}
                  minEntries={0}
                  error={form.formState.errors.writers?.message} />
              </div>
            </Section>

            {/* ── 3 · Media & Contact ── */}
            <Section id="section-media" step={3} title="Media, Links & Declaration" desc="URLs, contact email and rights confirmation">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                <FormField control={form.control} name="potraitImageUrl"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Portrait Poster <Req /></FormLabel>
                      <FormControl>
                        <WebpImageUpload value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <p className={HELP}>WEBP only, up to 5MB.</p>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="landscapeImageUrl"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Landscape Banner <Req /></FormLabel>
                      <FormControl>
                        <WebpImageUpload value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <p className={HELP}>WEBP only, up to 5MB.</p>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="imdbUrl"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>IMDb URL <Req /></FormLabel>
                      <FormControl><Input {...field} placeholder="https://imdb.com/title/..." className={I} /></FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                {/* Trailer link + the password that so often guards it. */}
                <div className="md:col-span-2 rounded-xl border border-[#1a1810] bg-[#080706] p-6 space-y-5">
                  <FormField control={form.control} name="trailerUrl"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Downloadable trailer link with English subtitles <Req /></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://drive.google.com/... or direct .mp4 link" className={I} />
                        </FormControl>
                        <p className={HELP}>
                          Provide a direct download link (Google Drive, Dropbox, WeTransfer, etc.). If the trailer is not in English, please include English subtitles.
                        </p>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />

                  <FormField control={form.control} name="trailerHasPassword"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Is this link password-protected? <Req /></FormLabel>
                        <div className="mt-2 flex gap-3" role="radiogroup" aria-label="Is the trailer link password-protected?">
                          {[
                            { label: "No", value: false },
                            { label: "Yes", value: true },
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              role="radio"
                              aria-checked={field.value === opt.value}
                              onClick={() => {
                                field.onChange(opt.value);
                                // Drop a password typed before switching back
                                // to "No" so it can't be submitted invisibly.
                                if (!opt.value) form.setValue("trailerPassword", "");
                              }}
                              className={cn(
                                "min-w-24 rounded-lg border px-5 h-11 text-[15px] font-medium transition-colors",
                                field.value === opt.value
                                  ? "border-[#e6ba35] bg-[#e6ba35]/12 text-[#e6ba35]"
                                  : "border-[#2a2418] text-[#8a8268] hover:border-[#e6ba35]/40 hover:text-[#cbc0a0]"
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        <p className={HELP}>
                          Many filmmakers share trailers from a protected folder. Telling us now saves a round of emails before your film can be reviewed.
                        </p>
                      </FormItem>
                    )} />

                  {form.watch("trailerHasPassword") && (
                    <FormField control={form.control} name="trailerPassword"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel className={L}>Trailer link password <Req /></FormLabel>
                          <FormControl>
                            {/* Deliberately plain text, not a password input:
                                this is a shared folder key the submitter needs
                                to check for typos, not their own credential. */}
                            <Input {...field} autoComplete="off" spellCheck={false}
                              placeholder="Password for the folder or file" className={cn(I, "font-mono")} />
                          </FormControl>
                          <p className={HELP}>
                            Visible so you can check it. Stored against your submission and seen only by our review team.
                          </p>
                          <FormMessage className={ERR} />
                        </FormItem>
                      )} />
                  )}
                </div>

                <div className="md:col-span-2">
                  <FormField control={form.control} name="notes"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Additional Notes <Optional /></FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Anything else you would like us to know…"
                            rows={4}
                            maxLength={1000}
                            className={cn(I, "h-auto resize-none leading-relaxed")}
                          />
                        </FormControl>
                        <p className="text-[#6b6347] text-[12px] mt-2">{field.value?.length || 0}/1000</p>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />
                </div>

                <div className="md:col-span-2 border-t border-[#141210] my-1" />

                <FormField control={form.control} name="contactEmail"
                  render={({ field }: { field: any }) => (
                    <FormItem className="md:col-span-2 max-w-sm">
                      <FormLabel className={L}>Contact Email <Req /></FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="you@example.com" className={I} /></FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <div className="md:col-span-2">
                  <FormField control={form.control} name="agreeRights"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <div className="flex items-start gap-3 p-4 rounded-xl border border-[#1a1810] bg-[#080706]">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}
                              className="mt-0.5 border-[#3a3420] data-[state=checked]:bg-[#e6ba35] data-[state=checked]:border-[#e6ba35]" />
                          </FormControl>
                          <FormLabel className="text-[#a89f85] text-[14px] leading-relaxed font-normal cursor-pointer">
                            I confirm I have the right to submit this film to the IFFA Awards and allow IFFA Awards
                            to promote it as part of this submission. <Req />
                          </FormLabel>
                        </div>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />
                </div>
              </div>
            </Section>

            {/* Error */}
            {/* Validation summary. Without this, a submit blocked by a field
                three screens up looks like a dead button. */}
            {invalidSteps.length > 0 && (
              <Alert className="border-red-500/30 bg-red-950/25 text-red-300 rounded-xl">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-sm">
                  <span className="font-semibold">Some required details are still missing.</span>{" "}
                  Check{" "}
                  {STEPS.filter((s) => invalidSteps.includes(s.id)).map((s, i, arr) => (
                    <span key={s.id}>
                      <a href={`#${s.id}`} className="underline underline-offset-2 hover:text-red-200">
                        {s.title}
                      </a>
                      {i < arr.length - 2 ? ", " : i === arr.length - 2 ? " and " : ""}
                    </span>
                  ))}
                  . Fields with a problem are outlined in red.
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert className="border-red-500/25 bg-red-950/25 text-red-300 rounded-xl">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-sm">
                  Something went wrong. Please check your details and try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" disabled={status === "submitting"}
                className={cn(
                  "bg-[#e6ba35] hover:bg-[#d4a82e] text-black font-bold uppercase tracking-[0.15em] text-sm",
                  "rounded-lg px-10 h-12 shadow-lg shadow-[#e6ba35]/10 transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}>
                {status === "submitting"
                  ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Submitting…</>
                  : "Submit Film"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}