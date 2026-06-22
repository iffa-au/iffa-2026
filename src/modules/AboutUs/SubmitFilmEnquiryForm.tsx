"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useSubmissionOptions, WATCH_FORMAT_OPTIONS } from "@/utils/FilmSubmission.utils";
import { sendConfirmationEmails } from "@/lib/email/send-confirmation-emails";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";

type EnquiryValues = {
  name: string;
  email: string;
  role: string;
  title: string;
  synopsis: string;
  productionHouse: string;
  distributor?: string;
  releaseDate: string;
  trailerUrl: string;
  releaseCountryIds: string[];
  watchFormats: string[];
  contentTypeId: string;
  genreIds: string[];
  countryId: string;
  languageId: string;
};

const API_BASE = process.env.NEXT_PUBLIC_SUBMIT_FILM_URL ||
  "https://guh4nzpet5.ap-southeast-2.awsapprunner.com/api/v1";

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="relative rounded-2xl border border-[#1e1c14] bg-[#0c0b08] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
      <div className="px-7 py-5 border-b border-[#161410]">
        <h3 className="text-white text-sm font-semibold">{title}</h3>
        {desc && <p className="text-[#5a5240] text-[11px] mt-1">{desc}</p>}
      </div>
      <div className="p-7">{children}</div>
    </section>
  );
}

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
        Enquiry Received
      </h2>
      <p className="text-[#6b6347] text-sm max-w-sm leading-relaxed mb-8">
        Thanks — we've received your enquiry. A confirmation email has been sent and we will contact you shortly.
      </p>
      <div className="flex gap-3">
        <Button asChild className="bg-[#e6ba35] hover:bg-[#d4a82e] text-black font-bold uppercase tracking-widest text-xs rounded-lg px-6 h-10">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

export function SubmitFilmEnquiryForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const { genres, contentTypes, countries, languages, loading } = useSubmissionOptions(API_BASE);

  const form = useForm<EnquiryValues>({
    defaultValues: {
      name: "", email: "", role: "", title: "", synopsis: "",
      productionHouse: "", distributor: "", releaseDate: "", trailerUrl: "",
      releaseCountryIds: [], watchFormats: [],
      contentTypeId: "", genreIds: [], countryId: "", languageId: "",
    },
  });

  if (status === "success") return <SuccessScreen />;

  const onSubmit = async (values: EnquiryValues) => {
    setStatus("submitting");
    try {
      // Basic client-side validation to match backend expectations
      if (!values.name.trim() || !values.email.trim() || !values.role.trim() || !values.title.trim() || !values.synopsis.trim() || !values.productionHouse.trim() || !values.trailerUrl.trim()) {
        throw new Error("Missing required fields");
      }
      if (!values.releaseDate) throw new Error("Missing release date");
      if (!values.genreIds || values.genreIds.length === 0) throw new Error("At least one genre required");
      if (!values.releaseCountryIds?.length) throw new Error("At least one release country required");
      if (!values.watchFormats?.length) throw new Error("At least one watch format required");
      if (!values.contentTypeId) throw new Error("Screen format is required");
      if (!values.countryId) throw new Error("Country is required");
      if (!values.languageId) throw new Error("Language is required");

      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        role: values.role.trim(),
        title: values.title.trim(),
        synopsis: values.synopsis.replace(/\r?\n+/g, " ").replace(/\s{2,}/g, " ").trim(),
        productionHouse: values.productionHouse.trim(),
        distributor: values.distributor?.trim() || "",
        releaseDate: values.releaseDate,
        trailerUrl: values.trailerUrl.trim(),
        releaseCountryIds: values.releaseCountryIds,
        watchFormats: values.watchFormats,
        contentType: values.contentTypeId,
        genreIds: values.genreIds,
        country: values.countryId,
        language: values.languageId,
      };

      const res = await fetch(`${API_BASE}/film-enquiries/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Failed");

      await sendConfirmationEmails({
        formType: "film-enquiry",
        submitterEmail: values.email,
        submitterName: values.name,
        fields: {
          "Full Name": values.name,
          Email: values.email,
          Role: values.role,
          "Film Title": values.title,
          Synopsis: values.synopsis,
          "Production House": values.productionHouse,
          Distributor: values.distributor || "Not provided",
          "Release Date": values.releaseDate,
          "Trailer Download URL": values.trailerUrl,
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
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <p className="text-[#e6ba35]/50 text-[10px] font-mono tracking-[0.2em] uppercase mb-4">IFFA Awards / Film Enquiry</p>
        <h1 className="text-white text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Submit a Film Enquiry</h1>
        <p className="text-[#5a5240] text-sm">Fields marked <span className="text-[#e6ba35]">*</span> are required.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Section title="Enquiry Details" desc="Provide information about the film enquiry">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Full Name <span className="text-[#e6ba35]">*</span></FormLabel>
                    <FormControl><Input {...field} placeholder="Your full name" className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11" /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Email <span className="text-[#e6ba35]">*</span></FormLabel>
                    <FormControl><Input {...field} type="email" placeholder="you@example.com" className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11" /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="role" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Your Role <span className="text-[#e6ba35]">*</span></FormLabel>
                    <FormControl><Input {...field} placeholder="Producer / Filmmaker / Sales" className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11" /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="title" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Film Title <span className="text-[#e6ba35]">*</span></FormLabel>
                    <FormControl><Input {...field} placeholder="Full film title" className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11" /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <div className="md:col-span-2">
                  <FormField control={form.control} name="synopsis" render={({ field }: any) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Synopsis <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl><Textarea {...field} rows={5} placeholder="Brief synopsis" className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg" /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="productionHouse" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Production House <span className="text-[#e6ba35]">*</span></FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. A24" className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11" /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="distributor" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Distributor <span className="text-[#3a3420]">(optional)</span></FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. Netflix" className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11" /></FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="releaseDate" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Release Date <span className="text-[#e6ba35]">*</span></FormLabel>
                    <FormControl><Input {...field} type="date" className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11" /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="trailerUrl" render={({ field }: any) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Downloadable Trailer Link <span className="text-[#e6ba35]">*</span></FormLabel>
                    <FormControl><Input {...field} placeholder="https://drive.google.com/... or direct .mp4 link" className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11" /></FormControl>
                    <p className="text-[#5a5240] text-[11px] mt-1.5 leading-relaxed">
                      Provide a direct download link. If the trailer is not in English, please include English subtitles.
                    </p>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="contentTypeId" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Screen Format <span className="text-[#e6ba35]">*</span></FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11 w-full">
                          <SelectValue placeholder={loading ? "Loading…" : "Select format"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0e0d0a] border-[#2a2418] text-white">
                        {contentTypes.map(ct => <SelectItem key={ct._id} value={ct._id}>{ct.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                <div className="md:col-span-2">
                  <FormField control={form.control} name="genreIds" render={({ field }: any) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Genres <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl>
                        <MultiSelectDropdown
                          options={genres.map(g => ({ value: g._id, label: g.name }))}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={loading ? "Loading genres…" : "Select one or more genres"}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="countryId" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Country of Origin <span className="text-[#e6ba35]">*</span></FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11 w-full">
                          <SelectValue placeholder={loading ? "Loading…" : "Select country"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0e0d0a] border-[#2a2418] text-white max-h-60">
                        {countries.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                <FormField control={form.control} name="languageId" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Language <span className="text-[#e6ba35]">*</span></FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11 w-full">
                          <SelectValue placeholder={loading ? "Loading…" : "Select language"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0e0d0a] border-[#2a2418] text-white max-h-60">
                        {languages.map(l => <SelectItem key={l._id} value={l._id}>{l.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />

                <div className="md:col-span-2">
                  <FormField control={form.control} name="releaseCountryIds" render={({ field }: any) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Country of Release <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl>
                        <MultiSelectDropdown
                          options={countries.map(c => ({ value: c._id, label: c.name }))}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={loading ? "Loading countries…" : "Select one or more release countries"}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <div className="md:col-span-2">
                  <FormField control={form.control} name="watchFormats" render={({ field }: any) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">How can it be watched? <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl>
                        <MultiSelectDropdown
                          options={WATCH_FORMAT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select theatrical, OTT, etc."
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

              </div>
            </Section>

            {status === "error" && (
              <Alert className="border-red-500/25 bg-red-950/25 text-red-300 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">Something went wrong. Please try again.</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={status === "submitting"} className="bg-[#e6ba35] hover:bg-[#d4a82e] text-black font-bold uppercase tracking-[0.2em] text-xs rounded-lg px-10 h-12">
                {status === "submitting" ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Sending…</> : "Send Enquiry"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

export default SubmitFilmEnquiryForm;
