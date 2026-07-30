"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { sendConfirmationEmails } from "@/lib/email/send-confirmation-emails";
import { FIELD_KEYS } from "@/lib/email/field-keys";
import { OmanSubNav } from "./components/oman-sub-nav";

const PROJECT_TYPES = [
  "Feature Film",
  "TV Series",
  "Documentary",
  "Commercial",
  "Music Video",
  "Other",
] as const;

const enquirySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  company: z.string().min(2, "Company / production house is required"),
  country: z.string().min(2, "Country is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  projectType: z.enum(PROJECT_TYPES, { message: "Please select a project type" }),
  description: z
    .string()
    .min(1, "Project description is required")
    .refine((val) => {
      const words = val.trim().split(/\s+/).filter(Boolean).length;
      return words >= 100 && words <= 300;
    }, { message: "Description must be between 100 and 300 words" }),
  filmingDates: z.string().min(2, "Proposed filming dates are required"),
  locations: z.string().min(5, "Please describe the locations you are looking for"),
  additionalComments: z.string().optional(),
  consent: z.literal(true, { message: "You must consent to being contacted" }),
});

type EnquiryValues = z.infer<typeof enquirySchema>;

const L = "text-[10px] uppercase tracking-[0.15em] text-[#9e9e9e] font-mono";
const I = "bg-[#0a0908] border-white/15 text-[#F5F0E8] placeholder-[#5a5a5a] focus:border-[#C9943A]/50 focus-visible:ring-[#C9943A]/20 focus-visible:ring-1 rounded-lg h-11";
const ACCENT = "text-[#C9943A]";

function SuccessScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <CheckCircle2 className="text-[#C9943A] w-12 h-12 mb-6" />
      <h2 className="text-[#F5F0E8] text-3xl font-bold mb-3">Enquiry Received</h2>
      <p className="text-[#9e9e9e] text-sm max-w-md leading-relaxed mb-8">
        Thank you. A confirmation email has been sent and the Oman Film Society team will contact you shortly.
      </p>
      <Button asChild className="bg-[#C9943A] hover:bg-[#b88432] text-black font-bold uppercase text-xs">
        <Link href="/oman">Back to Oman</Link>
      </Button>
    </div>
  );
}

export function OmanEnquiryForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const form = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: "", company: "", country: "", email: "", phone: "",
      projectType: undefined, description: "", filmingDates: "", locations: "",
      additionalComments: "", consent: undefined as unknown as true,
    },
  });

  const wordCount = form.watch("description").trim().split(/\s+/).filter(Boolean).length;
  if (status === "success") return <SuccessScreen />;

  const onSubmit = async (values: EnquiryValues) => {
    setStatus("submitting");
    try {
      await sendConfirmationEmails({
        formType: "oman-filming-enquiry",
        submitterEmail: values.email,
        submitterName: values.fullName,
        fields: {
          [FIELD_KEYS.FULL_NAME]: values.fullName,
          "Company / Production House": values.company,
          [FIELD_KEYS.COUNTRY]: values.country,
          [FIELD_KEYS.EMAIL]: values.email,
          [FIELD_KEYS.PHONE_NUMBER]: values.phone ?? "Not provided",
          "Project Type": values.projectType,
          "Brief Project Description": values.description,
          "Proposed Filming Dates": values.filmingDates,
          "Locations in Oman": values.locations,
          "Additional Comments": values.additionalComments ?? "None",
        },
      });

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-[#0d0d0d] min-h-screen pb-8">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-4">
        <Link href="/oman" className={`${ACCENT} text-xs tracking-widest uppercase mb-6 inline-block`}>
          ← Filming in Oman
        </Link>
        <h1 className="text-[#F5F0E8] text-4xl font-bold mb-2">Filming Enquiry</h1>
        <p className="text-[#9e9e9e] text-sm">
          Fields marked <span className={ACCENT}>*</span> are required.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <section className="rounded-2xl border border-white/10 bg-[#0c0b08] p-7 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={L}>Full Name <span className={ACCENT}>*</span></FormLabel>
                    <FormControl><Input {...field} className={I} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={L}>Company / Production House <span className={ACCENT}>*</span></FormLabel>
                    <FormControl><Input {...field} className={I} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={L}>Country <span className={ACCENT}>*</span></FormLabel>
                    <FormControl><Input {...field} className={I} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={L}>Email <span className={ACCENT}>*</span></FormLabel>
                    <FormControl><Input {...field} type="email" className={I} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={L}>Phone Number</FormLabel>
                    <FormControl><Input {...field} type="tel" className={I} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="projectType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={L}>Project Type <span className={ACCENT}>*</span></FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger className={cn(I, "w-full")}><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent className="bg-[#0e0d0a] border-white/15 text-white">
                        {PROJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className={L}>Brief Project Description (100–300 words) <span className={ACCENT}>*</span></FormLabel>
                  <FormControl><Textarea {...field} rows={6} className={cn(I, "h-auto resize-none")} /></FormControl>
                  <p className={cn("text-xs", wordCount < 100 || wordCount > 300 ? "text-red-400" : "text-[#9e9e9e]")}>{wordCount} / 100–300 words</p>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />

              <FormField control={form.control} name="filmingDates" render={({ field }) => (
                <FormItem>
                  <FormLabel className={L}>Proposed Filming Dates <span className={ACCENT}>*</span></FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. March–April 2026" className={I} /></FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />

              <FormField control={form.control} name="locations" render={({ field }) => (
                <FormItem>
                  <FormLabel className={L}>Locations in Oman <span className={ACCENT}>*</span></FormLabel>
                  <FormControl><Textarea {...field} rows={3} className={cn(I, "h-auto resize-none")} /></FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />

              <FormField control={form.control} name="additionalComments" render={({ field }) => (
                <FormItem>
                  <FormLabel className={L}>Additional Comments</FormLabel>
                  <FormControl><Textarea {...field} rows={3} className={cn(I, "h-auto resize-none")} /></FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="consent" render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-white/5">
                    <FormControl>
                      <Checkbox checked={field.value === true} onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#C9943A] data-[state=checked]:border-[#C9943A]" />
                    </FormControl>
                    <FormLabel className="text-[#9e9e9e] text-xs font-normal cursor-pointer">
                      I consent to being contacted by IFFA and the Oman Film Society. <span className={ACCENT}>*</span>
                    </FormLabel>
                  </div>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />
            </section>

            {status === "error" && (
              <Alert className="border-red-500/25 bg-red-950/25 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">Something went wrong. Please try again.</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={status === "submitting"}
              className="bg-[#C9943A] hover:bg-[#b88432] text-black font-bold uppercase text-xs px-10 h-12">
              {status === "submitting" ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Submitting…</> : "Submit Enquiry"}
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-8"><OmanSubNav /></div>
    </div>
  );
}

export default OmanEnquiryForm;
