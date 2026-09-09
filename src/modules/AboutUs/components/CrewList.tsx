"use client";

import { AlertCircle, Plus, Trash2, ChevronDown, ChevronUp, User, Copy } from "lucide-react";
import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FilmValues, PersonEntry } from "@/utils/FilmSubmission.utils";
import { WebpImageUpload } from "./WebpImageUpload";

// Kept in step with the tokens in SubmitFilmForm.tsx so a crew card doesn't
// read as a denser, secondary form embedded in the main one.
const L = "text-[13px] font-semibold tracking-[0.01em] text-[#cbc0a0]";
const I =
  "bg-[#0a0908] border-[#2a2418] text-white text-[15px] placeholder-[#4a4436] focus:border-[#e6ba35]/50 focus-visible:ring-[#e6ba35]/20 focus-visible:ring-2 rounded-lg h-12 px-4";
const HELP = "text-[13px] text-[#8a8268] leading-relaxed mt-2";
const ERR = "text-red-400 text-[13px] mt-1.5";

type CrewField = "actors" | "directors" | "producers" | "writers";

interface CrewListProps {
  form: UseFormReturn<FilmValues>;
  fieldName: CrewField;
  title: string;
  label: string;
  defaultEntry: PersonEntry;
  roleInput: { type: "select"; options: string[] } | { type: "text"; placeholder: string };
  error?: string;
  minEntries?: number;
  onDuplicateEntry?: (entry: PersonEntry) => void;
  duplicateLabel?: string;
}

export function CrewList({
  form,
  fieldName,
  title,
  label,
  defaultEntry,
  roleInput,
  error,
  minEntries = 1,
  onDuplicateEntry,
  duplicateLabel,
}: CrewListProps) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: fieldName });
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const canRemove = fields.length > minEntries;

  const { errors, submitCount } = form.formState;
  // Indices whose card holds at least one invalid field.
  const entryErrors = (errors[fieldName] ?? undefined) as Record<string, unknown> | undefined;
  const erroredIndexes = entryErrors
    ? Object.keys(entryErrors).filter((k) => /^\d+$/.test(k)).map(Number)
    : [];

  // A collapsed card hides its own error messages *and* unmounts its inputs,
  // so react-hook-form can't focus the offending one either — a rejected
  // submit would look like nothing happened. Rather than syncing that into
  // `collapsed` from an effect (which costs a second render pass), the open
  // state is derived: a card with an error forces itself open unless the
  // user has since chosen to collapse it, which `collapsedAt` records by
  // submit attempt.
  const [collapsedAt, setCollapsedAt] = useState<Record<number, number>>({});

  const toggle = (i: number) => {
    setCollapsed((p) => ({ ...p, [i]: !p[i] }));
    setCollapsedAt((p) => ({ ...p, [i]: submitCount }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-white text-base font-semibold">{title}</h3>
          {error && <p className={ERR}>{error}</p>}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ ...defaultEntry })}
          className="text-[#e6ba35] hover:bg-[#e6ba35]/10 text-sm gap-2 h-10 rounded-lg px-4"
        >
          <Plus size={16} /> Add {label}
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-[#7a7258] text-sm">No entries added yet.</p>
      )}

      {fields.map((field, i) => {
        const name = form.watch(`${fieldName}.${i}.fullName` as const);
        const role = form.watch(`${fieldName}.${i}.role` as const);
        const hasError = erroredIndexes.includes(i);
        const collapseIsStale = (collapsedAt[i] ?? -1) < submitCount;
        const open = !collapsed[i] || (hasError && collapseIsStale);
        return (
          <div
            key={field.id}
            className={cn(
              "rounded-xl border bg-[#080706] overflow-hidden transition-colors",
              hasError ? "border-red-500/40" : "border-[#1e1c14]"
            )}
          >
            <div className="flex items-center px-5 py-3.5 gap-3 border-b border-[#12110e]">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => toggle(i)}
                className="flex items-center gap-3 flex-1 text-left min-w-0"
              >
                <div className="w-9 h-9 rounded-full bg-[#1a1810] border border-[#2a2418] flex items-center justify-center shrink-0">
                  <User size={15} className="text-[#6b6347]" />
                </div>
                {/* Name and role in the collapsed summary, so a long crew
                    list can be scanned without opening every card. */}
                <span className="min-w-0">
                  <span className="block text-[#cbc0a0] text-[15px] font-medium truncate">
                    {name?.trim() || `${label} ${i + 1}`}
                  </span>
                  {role?.trim() && (
                    <span className="block text-[#7a7258] text-[13px] truncate">{role}</span>
                  )}
                </span>
                {hasError && (
                  <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-[12px] text-red-300 shrink-0">
                    <AlertCircle size={12} /> Incomplete
                  </span>
                )}
                {open ? (
                  <ChevronUp size={16} className="text-[#5a5240] ml-auto shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-[#5a5240] ml-auto shrink-0" />
                )}
              </button>
              {canRemove && (
                <button
                  type="button"
                  aria-label={`Remove ${name?.trim() || `${label} ${i + 1}`}`}
                  onClick={() => remove(i)}
                  className="text-[#4a4232] hover:text-red-400 transition-colors p-2 shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {open && (
              <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.fullName` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Full Name <span aria-hidden="true" className="text-[#e6ba35]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full name" className={I} />
                      </FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.role` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Role <span aria-hidden="true" className="text-[#e6ba35]">*</span>
                      </FormLabel>
                      <FormControl>
                        {roleInput.type === "select" ? (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={cn(I, "w-full")}>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0e0d0a] border-[#2a2418] text-white">
                              {roleInput.options.map((o) => (
                                <SelectItem
                                  key={o}
                                  value={o}
                                  className="focus:bg-[#e6ba35]/10 focus:text-[#e6ba35]"
                                >
                                  {o}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input {...field} placeholder={roleInput.placeholder} className={I} />
                        )}
                      </FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.imageUrl` as const}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={L}>
                        Photo <span aria-hidden="true" className="text-[#e6ba35]">*</span>
                      </FormLabel>
                      <FormControl>
                        <WebpImageUpload value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <p className={HELP}>WEBP only, up to 5MB.</p>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.biography` as const}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={L}>
                        Biography <span aria-hidden="true" className="text-[#e6ba35]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Short biography…"
                          rows={3}
                          className={cn(I, "h-auto resize-none leading-relaxed")}
                        />
                      </FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.email` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Representative Email Address <span aria-hidden="true" className="text-[#e6ba35]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="name@example.com" className={I} />
                      </FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.instagram` as const}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={L}>
                        Instagram <span className="ml-2 align-middle rounded-full border border-[#2a2418] px-2 py-[1px] text-[10px] font-medium uppercase tracking-wider text-[#6b6347]">Optional</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="@handle or profile URL" className={I} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {onDuplicateEntry && duplicateLabel && (
                  <div className="md:col-span-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const entry = form.getValues(`${fieldName}.${i}` as const);
                        onDuplicateEntry(entry);
                      }}
                      className="text-[#9a9278] hover:text-[#e6ba35] hover:bg-[#e6ba35]/10 text-sm gap-2 h-10 px-4"
                    >
                      <Copy size={15} />
                      {duplicateLabel}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
