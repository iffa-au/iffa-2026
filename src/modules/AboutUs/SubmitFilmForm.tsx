"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo, useEffect } from "react";
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
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { CrewList } from "./components/CrewList";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_SUBMIT_FILM_URL ||
  "https://guh4nzpet5.ap-southeast-2.awsapprunner.com/api/v1";

const ACTOR_ROLES = ["Actor in a leading role", "Actress in a leading role", "Actor in a supporting role", "Actress in a supporting role"];
const DIRECTOR_ROLES = ["Director", "Co-Director"];
const PRODUCER_ROLES = ["Producer", "Executive Producer"];

// ─── Shared style tokens ──────────────────────────────────────────────────────
const L = "text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono";
const I = "bg-[#0a0908] border-[#2a2418] text-white placeholder-[#3d3828] focus:border-[#e6ba35]/50 focus-visible:ring-[#e6ba35]/20 focus-visible:ring-1 rounded-lg h-11";

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ step, title, desc, children }: { step: number; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="relative rounded-2xl border border-[#1e1c14] bg-[#0c0b08] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#e6ba35]/25 to-transparent" />
      <div className="px-7 py-5 border-b border-[#161410] flex items-center gap-4">
        <div className="w-7 h-7 rounded-full border border-[#e6ba35]/35 bg-[#e6ba35]/8 flex items-center justify-center flex-shrink-0">
          <span className="text-[#e6ba35] text-[10px] font-bold font-mono">{step}</span>
        </div>
        <div>
          <h3 className="text-white text-xs font-semibold tracking-[0.15em] uppercase font-mono">{title}</h3>
          {desc && <p className="text-[#5a5240] text-[11px] mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="p-7">{children}</div>
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
  const { genres, contentTypes, countries, languages, loading } = useSubmissionOptions(API_BASE);
  const filmSchema = useMemo(() => buildFilmSchema(contentTypes), [contentTypes]);

  const form = useForm<FilmValues>({
    resolver: zodResolver(filmSchema),
    defaultValues: {
      title: "", synopsis: "", releaseDate: "", contentTypeId: "", countryId: "",
      releaseCountryIds: [], watchFormats: [],
      languageId: "", productionHouse: "", distributor: "", genreIds: [],
      potraitImageUrl: "", landscapeImageUrl: "", imdbUrl: "", trailerUrl: "",
      actors: [{ ...BLANK_PERSON, role: "Actor in a leading role" }],
      directors: [{ ...BLANK_PERSON, role: "Director" }],
      producers: [{ ...BLANK_PERSON, role: "Producer" }],
      writers: [],
      notes: "",
      contactEmail: "",
      agreeRights: false as any,
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

  const onSubmit = async (values: FilmValues) => {
    setStatus("submitting");
    const norm = (p: PersonEntry) => ({
      fullName: p.fullName.trim(),
      role: p.role.trim(),
      imageUrl: p.imageUrl.trim(),
      biography: p.biography.trim(),
      instagramUrl: p.instagram?.trim() || "",
    });
    const payload = {
      ...values,
      synopsis: values.synopsis.replace(/\r?\n+/g, " ").replace(/\s{2,}/g, " ").trim(),
      notes: values.notes?.trim() || "",
      submissionYear: new Date().getFullYear(),
      isFeatured: false,
      genreId: values.genreIds[0],
      crew: {
        actors: filterFilledCrew(values.actors).map(norm),
        directors: values.directors.map(norm),
        producers: values.producers.map(norm),
        other: filterFilledCrew(values.writers).map(norm),
      },
    };
    try {
      const res = await fetch(`${API_BASE}/submissions/public`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
          "Contact Email": values.contactEmail,
          "IMDb URL": values.imdbUrl,
          "Trailer Download URL": values.trailerUrl,
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
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <p className="text-[#e6ba35]/50 text-[10px] font-mono tracking-[0.2em] uppercase mb-4">
          IFFA Awards / Film Submission
        </p>
        <h1 className="text-white text-4xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Submit Your Film
        </h1>
        <p className="text-[#5a5240] text-sm">
          Fields marked <span className="text-[#e6ba35]">*</span> are required.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* ── 1 · Basic Information ── */}
            <Section step={1} title="Basic Information" desc="Core details about your film">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2">
                  <FormField control={form.control} name="title"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Film Title <span className="text-[#e6ba35]">*</span></FormLabel>
                        <FormControl><Input {...field} placeholder="Enter the full film title" className={cn(I, "text-base")} /></FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )} />
                </div>

                <div className="md:col-span-2">
                  <FormField control={form.control} name="synopsis"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Synopsis <span className="text-[#e6ba35]">*</span></FormLabel>
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
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="releaseDate"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Release Date <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl><Input {...field} type="date" className={I} /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="contentTypeId"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Screen Format <span className="text-[#e6ba35]">*</span></FormLabel>
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
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="countryId"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Country of Origin <span className="text-[#e6ba35]">*</span></FormLabel>
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
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <div className="md:col-span-2">
                  <FormField control={form.control} name="releaseCountryIds"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Country of Release <span className="text-[#e6ba35]">*</span></FormLabel>
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
                        <FormLabel className={L}>How can it be watched? <span className="text-[#e6ba35]">*</span></FormLabel>
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

                <FormField control={form.control} name="languageId"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Primary Language <span className="text-[#e6ba35]">*</span></FormLabel>
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
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="productionHouse"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Production House <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. A24, Warner Bros." className={I} /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="distributor"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Distributor <span className="text-[#3a3420]">(optional)</span></FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. Netflix, Amazon" className={I} /></FormControl>
                    </FormItem>
                  )} />

                <div className="md:col-span-2">
                  <FormField control={form.control} name="genreIds"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Genres <span className="text-[#e6ba35]">*</span></FormLabel>
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
            <Section step={2} title="Crew Information" desc="Add cast and key production crew">
              <div className="space-y-8">
                {!hideActors && (
                  <>
                    <CrewList form={form} fieldName="actors" title="Actors — Lead & Supporting" label="Actor"
                      defaultEntry={{ fullName: "", role: "Actor in a leading role", imageUrl: "", biography: "", instagram: "" }}
                      roleInput={{ type: "select", options: ACTOR_ROLES }}
                      error={form.formState.errors.actors?.message} />

                    <div className="border-t border-[#141210]" />
                  </>
                )}

                <CrewList form={form} fieldName="directors" title="Director(s)" label="Director"
                  defaultEntry={{ fullName: "", role: "Director", imageUrl: "", biography: "", instagram: "" }}
                  roleInput={{ type: "select", options: DIRECTOR_ROLES }}
                  error={form.formState.errors.directors?.message}
                  onDuplicateEntry={duplicateDirectorAsProducer}
                  duplicateLabel="Also add as producer" />

                <div className="border-t border-[#141210]" />

                <CrewList form={form} fieldName="producers" title="Producer(s)" label="Producer"
                  defaultEntry={{ fullName: "", role: "Producer", imageUrl: "", biography: "", instagram: "" }}
                  roleInput={{ type: "select", options: PRODUCER_ROLES }}
                  error={form.formState.errors.producers?.message} />

                <div className="border-t border-[#141210]" />

                <CrewList form={form} fieldName="writers" title="Other — DOP, Editor, Writer, Music…" label="Credit"
                  defaultEntry={{ fullName: "", role: "", imageUrl: "", biography: "", instagram: "" }}
                  roleInput={{ type: "text", placeholder: "e.g. Writer, DOP, Composer" }}
                  minEntries={0}
                  error={form.formState.errors.writers?.message} />
              </div>
            </Section>

            {/* ── 3 · Media & Contact ── */}
            <Section step={3} title="Media, Links & Declaration" desc="URLs, contact email and rights confirmation">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="potraitImageUrl"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Portrait Poster URL <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl><Input {...field} placeholder="https://example.com/poster.jpg" className={I} /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="landscapeImageUrl"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Landscape Banner URL <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl><Input {...field} placeholder="https://example.com/banner.jpg" className={I} /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="imdbUrl"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>IMDb URL <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl><Input {...field} placeholder="https://imdb.com/title/..." className={I} /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="trailerUrl"
                  render={({ field }: { field: any }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={L}>Downloadable Trailer Link <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://drive.google.com/... or direct .mp4 link" className={I} />
                      </FormControl>
                      <p className="text-[#5a5240] text-[11px] mt-1.5 leading-relaxed">
                        Provide a direct download link (Google Drive, Dropbox, WeTransfer, etc.). If the trailer is not in English, please include English subtitles.
                      </p>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <div className="md:col-span-2">
                  <FormField control={form.control} name="notes"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Additional Notes <span className="text-[#3a3420]">(optional)</span></FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Anything else you would like us to know…"
                            rows={4}
                            maxLength={1000}
                            className={cn(I, "h-auto resize-none leading-relaxed")}
                          />
                        </FormControl>
                        <p className="text-[#4a4232] text-[10px] mt-1">{field.value?.length || 0}/1000</p>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )} />
                </div>

                <div className="md:col-span-2 border-t border-[#141210] my-1" />

                <FormField control={form.control} name="contactEmail"
                  render={({ field }: { field: any }) => (
                    <FormItem className="md:col-span-2 max-w-sm">
                      <FormLabel className={L}>Contact Email <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="you@example.com" className={I} /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
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
                          <FormLabel className="text-[#8a8268] text-xs leading-relaxed font-normal cursor-pointer">
                            I confirm I have the right to submit this film to the IFFA Awards and allow IFFA Awards
                            to promote it as part of this submission. <span className="text-[#e6ba35]">*</span>
                          </FormLabel>
                        </div>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )} />
                </div>
              </div>
            </Section>

            {/* Error */}
            {status === "error" && (
              <Alert className="border-red-500/25 bg-red-950/25 text-red-300 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Something went wrong. Please check your details and try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" disabled={status === "submitting"}
                className={cn(
                  "bg-[#e6ba35] hover:bg-[#d4a82e] text-black font-bold uppercase tracking-[0.2em] text-xs",
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