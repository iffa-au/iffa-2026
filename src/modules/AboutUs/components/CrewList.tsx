"use client";

import { Plus, Trash2, ChevronDown, ChevronUp, User } from "lucide-react";
import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FilmValues, PersonEntry } from "@/utils/FilmSubmission.utils";

const L = "text-[10px] uppercase tracking-[0.15em] text-[#7a7258] font-mono";
const I = "bg-[#0a0908] border-[#2a2418] text-white placeholder-[#3d3828] focus:border-[#e6ba35]/50 focus-visible:ring-[#e6ba35]/20 focus-visible:ring-1 rounded-lg h-10";

type CrewField = "actors" | "directors" | "producers" | "writers";

interface CrewListProps {
  form: UseFormReturn<FilmValues>;
  fieldName: CrewField;
  title: string;
  label: string;
  defaultEntry: PersonEntry;
  roleInput: { type: "select"; options: string[] } | { type: "text"; placeholder: string };
  error?: string;
}

export function CrewList({ form, fieldName, title, label, defaultEntry, roleInput, error }: CrewListProps) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: fieldName });
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-semibold">{title}</p>
          {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => append({ ...defaultEntry })}
          className="text-[#e6ba35] hover:bg-[#e6ba35]/10 text-xs gap-1.5 h-8 rounded-lg px-3">
          <Plus size={12} /> Add {label}
        </Button>
      </div>

      {fields.map((field, i) => {
        const name = form.watch(`${fieldName}.${i}.fullName` as any);
        const open = !collapsed[i];
        return (
          <div key={field.id} className="rounded-xl border border-[#1e1c14] bg-[#080706] overflow-hidden">
            {/* Header */}
            <div className="flex items-center px-4 py-2.5 gap-3 border-b border-[#12110e]">
              <button type="button" onClick={() => setCollapsed(p => ({ ...p, [i]: !p[i] }))}
                className="flex items-center gap-2.5 flex-1 text-left min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#1a1810] border border-[#2a2418] flex items-center justify-center flex-shrink-0">
                  <User size={11} className="text-[#5a5240]" />
                </div>
                <span className="text-[#9a9278] text-sm truncate">{name?.trim() || `${label} ${i + 1}`}</span>
                {open
                  ? <ChevronUp size={12} className="text-[#4a4232] ml-auto flex-shrink-0" />
                  : <ChevronDown size={12} className="text-[#4a4232] ml-auto flex-shrink-0" />}
              </button>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(i)}
                  className="text-[#3a3420] hover:text-red-400 transition-colors p-1 flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            {/* Body */}
            {open && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <FormField control={form.control} name={`${fieldName}.${i}.fullName` as any}
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Full Name <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl><Input {...field} placeholder="Full name" className={I} /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name={`${fieldName}.${i}.role` as any}
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Role <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl>
                        {roleInput.type === "select" ? (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={cn(I, "w-full")}><SelectValue placeholder="Select role" /></SelectTrigger>
                            <SelectContent className="bg-[#0e0d0a] border-[#2a2418] text-white">
                              {roleInput.options.map(o => (
                                <SelectItem key={o} value={o} className="focus:bg-[#e6ba35]/10 focus:text-[#e6ba35]">{o}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input {...field} placeholder={roleInput.placeholder} className={I} />
                        )}
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name={`${fieldName}.${i}.imageUrl` as any}
                  render={({ field }: { field: any }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={L}>Photo URL <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl><Input {...field} placeholder="https://example.com/photo.jpg" className={I} /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name={`${fieldName}.${i}.biography` as any}
                  render={({ field }: { field: any }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={L}>Biography <span className="text-[#e6ba35]">*</span></FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Short biography…" rows={3}
                          className={cn(I, "h-auto resize-none leading-relaxed")} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                <FormField control={form.control} name={`${fieldName}.${i}.instagram` as any}
                  render={({ field }: { field: any }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={L}>Instagram <span className="text-[#4a4232]">(optional)</span></FormLabel>
                      <FormControl><Input {...field} placeholder="@handle or profile URL" className={I} /></FormControl>
                    </FormItem>
                  )} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}