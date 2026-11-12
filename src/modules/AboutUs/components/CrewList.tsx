"use client";

import { AlertCircle, Plus, Trash2, ChevronDown, ChevronUp, User, Copy } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormState, useWatch, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { newPerson, type FilmValues, type PersonEntry } from "@/utils/FilmSubmission.utils";
import { WebpImageUpload } from "./WebpImageUpload";
import { L, I, HELP, ERR, REQ, OPTIONAL_PILL, SELECT_TRIGGER, SELECT_CHEVRON, SELECT_PANEL, SELECT_ITEM } from "./form-tokens";

type CrewField = "actors" | "directors" | "producers" | "writers";

interface CrewListProps {
  form: UseFormReturn<FilmValues>;
  fieldName: CrewField;
  title: string;
  label: string;
  defaultEntry: PersonEntry;
  roleOptions: string[];
  /** Bumped by the parent on every failed Next or submit; reopens collapsed cards with errors. */
  attempt: number;
  error?: string;
  minEntries?: number;
  onDuplicateEntry?: (entry: PersonEntry) => void;
  duplicateLabel?: string;
  /** Who the representative relates to, e.g. "Actor/Actress". Defaults to `label`. */
  relationshipTo?: string;
}

export function CrewList({
  form,
  fieldName,
  title,
  label,
  defaultEntry,
  roleOptions,
  attempt,
  error,
  minEntries = 1,
  onDuplicateEntry,
  duplicateLabel,
  relationshipTo = label,
}: CrewListProps) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: fieldName });
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const canRemove = fields.length > minEntries;

  // Subscribed here (useFormState/useWatch): the React Compiler memoizes this
  // component on a `form` prop that never changes, so form.formState and
  // form.watch() reads go stale — card headers kept saying "Actor 1".
  const { errors } = useFormState({ control: form.control, name: fieldName });
  const entries = useWatch({ control: form.control, name: fieldName });
  // Indices whose card holds at least one invalid field.
  const entryErrors = (errors[fieldName] ?? undefined) as Record<string, unknown> | undefined;
  const erroredIndexes = entryErrors
    ? Object.keys(entryErrors).filter((k) => /^\d+$/.test(k)).map(Number)
    : [];

  // A collapsed card hides its own error messages *and* unmounts its inputs,
  // so react-hook-form can't focus the offending one either — a rejected
  // Next or submit would look like nothing happened. Rather than syncing that into
  // `collapsed` from an effect (which costs a second render pass), the open
  // state is derived: a card with an error forces itself open unless the
  // user has since chosen to collapse it, which `collapsedAt` records by
  // attempt.
  const [collapsedAt, setCollapsedAt] = useState<Record<number, number>>({});

  const toggle = (i: number) => {
    setCollapsed((p) => ({ ...p, [i]: !p[i] }));
    setCollapsedAt((p) => ({ ...p, [i]: attempt }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          {error && <p className={ERR}>{error}</p>}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append(newPerson(defaultEntry))}
          className="text-[#e6ba35] hover:bg-[#e6ba35]/10 text-sm gap-2 h-10 rounded-lg px-4"
        >
          <Plus size={16} /> Add {label}
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-[#7a7258] text-sm">No entries added yet.</p>
      )}

      {fields.map((field, i) => {
        const name = entries?.[i]?.fullName;
        const role = entries?.[i]?.role;
        const hasError = erroredIndexes.includes(i);
        const collapseIsStale = (collapsedAt[i] ?? -1) < attempt;
        const open = !collapsed[i] || (hasError && collapseIsStale);
        return (
          <div
            key={field.id}
            className={cn(
              "rounded-xl border bg-transparent overflow-hidden transition-colors",
              hasError ? "border-red-500/40" : "border-[#26241d]"
            )}
          >
            <div className="flex items-center px-5 py-3.5 gap-3 border-b border-[#26241d]">
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
                  <span className="block text-[#cbc0a0] text-[16px] font-medium truncate">
                    {name?.trim() || `${label} ${i + 1}`}
                  </span>
                  {role?.trim() && (
                    <span className="block text-[#7a7258] text-[14px] truncate">{role}</span>
                  )}
                </span>
                {hasError && (
                  <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-[13px] text-red-300 shrink-0">
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
              <div className="p-5 md:p-6 grid grid-cols-1 gap-y-6">
                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.fullName` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Full Name <span aria-hidden="true" className={REQ}>*</span>
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
                        Role <span aria-hidden="true" className={REQ}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={SELECT_TRIGGER} icon={<ChevronDown size={13} className={SELECT_CHEVRON} />}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent position="popper" sideOffset={2} className={SELECT_PANEL}>
                            {roleOptions.map((o) => (
                              <SelectItem
                                key={o}
                                value={o}
                                className={SELECT_ITEM}
                              >
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.imageUrl` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Photo <span aria-hidden="true" className={REQ}>*</span>
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
                    <FormItem>
                      <FormLabel className={L}>
                        Biography <span aria-hidden="true" className={REQ}>*</span>
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

                {/* The four contact fields below all describe the
                    representative, not the credited person — the heading
                    keeps "Name" here from reading as a repeat of Full Name. */}
                <div className="border-t border-[#26241d] pt-5 -mb-1">
                  <h4 className="text-[#cbc0a0] text-[15px] font-semibold">Representative</h4>
                  <p className={HELP}>Who we should contact about this credit — the person themselves, or their agent, manager, etc.</p>
                </div>

                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.representativeName` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Representative Name <span aria-hidden="true" className={REQ}>*</span>
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
                  name={`${fieldName}.${i}.representativeRelationship` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Relationship to {relationshipTo} <span aria-hidden="true" className={REQ}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Self, Agent, Manager, Publicist, Family member" className={I} />
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
                        Representative Email Address <span aria-hidden="true" className={REQ}>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="name@example.com" className={I} />
                      </FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )}
                />

                {/* Sits beside the email field, which was half-width with an
                    empty cell next to it — so the phone number costs the card
                    no extra height. */}
                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.contactPhone` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Contact (Phone) <span className={OPTIONAL_PILL}>Optional</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="+61 400 000 000" className={I} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.instagram` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Instagram <span className={OPTIONAL_PILL}>Optional</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="@handle or profile URL" className={I} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${fieldName}.${i}.notes` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Notes <span className={OPTIONAL_PILL}>Optional</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Anything we should know about this credit…"
                          rows={2}
                          className={cn(I, "h-auto resize-none leading-relaxed")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {onDuplicateEntry && duplicateLabel && (
                  <div>
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
