"use client";

import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useSubmissionOptions } from "@/utils/FilmSubmission.utils";

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

function GenreSelect({ options, value, onChange, placeholder = "Select genres", error }: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (v: string) => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  const selected = options.filter(o => value.includes(o.value));

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={cn(
          "w-full min-h-[44px] bg-[#0a0908] border rounded-lg px-4 py-2 text-left flex items-center justify-between gap-2 transition-all focus:outline-none",
          open ? "border-[#e6ba35]/50" : "border-[#2a2418] hover:border-[#3d3520]",
          error && "border-red-500/50"
        )}>
        <div className="flex flex-wrap gap-1.5 flex-1">
          {selected.length === 0
            ? <span className="text-[#3d3828] text-sm">{placeholder}</span>
            : selected.map(o => (
              <Badge key={o.value}
                className="bg-[#e6ba35]/12 text-[#e6ba35] border border-[#e6ba35]/25 px-2 py-0 text-xs rounded-md gap-1 font-normal">
                {o.label}
                <span role="button" onClick={e => { e.stopPropagation(); toggle(o.value); }}
                  className="opacity-50 hover:opacity-100 cursor-pointer">
                  <X size={9} />
                </span>
              </Badge>
            ))}
        </div>
        <ChevronDown size={13} className={cn("flex-shrink-0 text-[#4a4232] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1.5 rounded-xl border border-[#2a2418] bg-[#0e0d0a] shadow-2xl shadow-black/80 overflow-hidden">
          <div className="max-h-52 overflow-y-auto">
            {options.length === 0
              ? <p className="text-[#4a4232] text-xs text-center py-4">Loading…</p>
              : options.map(o => (
                <button type="button" key={o.value} onClick={() => toggle(o.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left",
                    value.includes(o.value) ? "bg-[#e6ba35]/8 text-[#e6ba35]" : "text-[#9a9278] hover:bg-[#141210] hover:text-white"
                  )}>
                  {o.label}
                  {value.includes(o.value) && <CheckCircle2 size={12} className="text-[#e6ba35]" />}
                </button>
              ))}
          </div>
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
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
        Thanks — we've received your enquiry and will contact you by email.
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
        contentType: values.contentTypeId,
        genreIds: values.genreIds,
        country: values.countryId,
        language: values.languageId,
      } as any;

      const res = await fetch(`${API_BASE}/film-enquiries/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Failed");
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
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Trailer URL <span className="text-[#e6ba35]">*</span></FormLabel>
                    <FormControl><Input {...field} placeholder="https://youtube.com/watch?v=..." className="bg-[#0a0908] border-[#2a2418] text-white rounded-lg h-11" /></FormControl>
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
                        <GenreSelect options={genres.map(g => ({ value: g._id, label: g.name }))} value={field.value} onChange={field.onChange} placeholder={loading ? "Loading genres…" : "Select one or more genres"} error={form.formState.errors.genreIds?.message} />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="countryId" render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono">Country <span className="text-[#e6ba35]">*</span></FormLabel>
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
