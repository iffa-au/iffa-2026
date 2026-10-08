"use client";

import { Plus, Trash2, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { cn } from "@/lib/utils";
import {
  BLANK_NOMINATION,
  NOMINEE_FIELDS,
  categoryOpenTo,
  type AwardCategoryOption,
  type CrewField,
  type FilmValues,
  type PersonEntry,
} from "@/utils/FilmSubmission.utils";
import { L, I, HELP, ERR } from "./form-tokens";

const CREW_LABEL: Record<CrewField, string> = {
  actors: "Cast",
  directors: "Director",
  producers: "Producer",
  writers: "Other crew",
};

interface NominationListProps {
  form: UseFormReturn<FilmValues>;
  categories: AwardCategoryOption[];
  hideActors: boolean;
  loading: boolean;
}

/**
 * One card per award category the film is entered for. A category can be
 * chosen on only one card — every nominee for it is picked there — while the
 * same person may appear on several cards. Nominees are drawn live from the
 * crew lists above, so the dropdowns track additions, renames and removals.
 */
export function NominationList({ form, categories, hideActors, loading }: NominationListProps) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "nominations" });

  // A new card lands at the bottom of a list that can run past the screen,
  // so adding one looked like nothing happened. After the add renders, the
  // new card is scrolled into view, its category dropdown focused, and the
  // card briefly highlighted.
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const revealNewCard = useRef(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!revealNewCard.current) return;
    revealNewCard.current = false;
    const card = cardRefs.current.get(fields[fields.length - 1]?.id ?? "");
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.querySelector<HTMLElement>('[role="combobox"]')?.focus({ preventScroll: true });
  }, [fields]);

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  const addNomination = () => {
    revealNewCard.current = true;
    setHighlighted(fields.length);
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlighted(null), 1600);
    append({ ...BLANK_NOMINATION }, { shouldFocus: false });
  };

  const [contentTypeId, nominations, actors, directors, producers, writers] = useWatch({
    control: form.control,
    name: ["contentTypeId", "nominations", "actors", "directors", "producers", "writers"],
  });
  const crew: Record<CrewField, PersonEntry[]> = { actors, directors, producers, writers };

  const open = contentTypeId
    ? categories.filter((c) => categoryOpenTo(c, contentTypeId, hideActors))
    : [];
  // Group headings in the order the categories arrive in (the API sorts them).
  const groups = [...new Set(open.map((c) => c.group))];
  const chosenIds = new Set(nominations.map((n) => n.categoryId).filter(Boolean));
  const allChosen = open.length > 0 && open.every((c) => chosenIds.has(c._id));

  const rootError = (form.formState.errors.nominations as { message?: string } | undefined)?.message;

  const nomineeOptions = (category: AwardCategoryOption) =>
    NOMINEE_FIELDS[category.nomineeType].flatMap((field) =>
      crew[field]
        .filter((p) => p.fullName.trim())
        .map((p) => ({
          value: p.uid,
          label: `${p.fullName.trim()} — ${p.role.trim() || CREW_LABEL[field]}`,
        })),
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={cn(HELP, "mt-0 max-w-2xl")}>
            Choose each award you&apos;re entering, then who you&apos;re nominating for it.
            Nominees come from the crew you added above, and one person can be entered in
            several categories. Team awards go to the whole crew.
          </p>
          {rootError && <p className={ERR}>{rootError}</p>}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!contentTypeId || allChosen}
          onClick={addNomination}
          className="text-[#e6ba35] hover:bg-[#e6ba35]/10 text-sm gap-2 h-10 rounded-lg px-4"
        >
          <Plus size={16} /> Add nomination
        </Button>
      </div>

      {!contentTypeId && (
        <p className="text-[#8a8268] text-[14px]">
          Choose the <a href="#section-basics" className="underline underline-offset-2 hover:text-[#e6ba35]">Screen Format</a> first —
          the categories open to your film depend on it.
        </p>
      )}

      {fields.map((field, i) => {
        const categoryId = nominations[i]?.categoryId ?? "";
        const category = categories.find((c) => c._id === categoryId);
        const wholeTeam = category?.nomineeType === "whole-team";
        const options = category && !wholeTeam ? nomineeOptions(category) : [];

        return (
          <div
            key={field.id}
            ref={(el) => {
              if (el) cardRefs.current.set(field.id, el);
              else cardRefs.current.delete(field.id);
            }}
            className={cn(
              "rounded-xl border bg-[#080706] overflow-hidden transition-[border-color,box-shadow] duration-700",
              highlighted === i
                ? "border-[#e6ba35]/60 shadow-[0_0_0_3px_rgba(230,186,53,0.15)]"
                : "border-[#1e1c14]"
            )}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#12110e]">
              <span className="text-[#cbc0a0] text-[16px] font-medium truncate">
                {category?.name || `Nomination ${i + 1}`}
              </span>
              {fields.length > 1 && (
                <button
                  type="button"
                  aria-label={`Remove ${category?.name || `nomination ${i + 1}`}`}
                  onClick={() => remove(i)}
                  className="text-[#4a4232] hover:text-red-400 transition-colors p-2 shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <FormField
                control={form.control}
                name={`nominations.${i}.categoryId` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={L}>
                      Award Category <span aria-hidden="true" className="text-[#e6ba35]">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        // Nominees belong to the old category's crew pool.
                        form.setValue(`nominations.${i}.nomineeUids`, []);
                      }}
                      disabled={loading || !contentTypeId}
                    >
                      <FormControl>
                        <SelectTrigger className={cn(I, "w-full")}>
                          <SelectValue placeholder={loading ? "Loading…" : "Select category"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0e0d0a] border-[#2a2418] text-white max-h-72">
                        {groups.map((group) => (
                          <SelectGroup key={group}>
                            <SelectLabel className="text-[#6b6347] text-[12px] uppercase tracking-wider">
                              {group}
                            </SelectLabel>
                            {open
                              .filter((c) => c.group === group)
                              .map((c) => {
                                const takenElsewhere = chosenIds.has(c._id) && c._id !== field.value;
                                return (
                                  <SelectItem
                                    key={c._id}
                                    value={c._id}
                                    disabled={takenElsewhere}
                                    className="focus:bg-[#e6ba35]/10 focus:text-[#e6ba35]"
                                  >
                                    {c.name}
                                    {takenElsewhere && (
                                      <span className="ml-2 text-[#6b6347] text-[12px]">Already chosen</span>
                                    )}
                                  </SelectItem>
                                );
                              })}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className={ERR} />
                  </FormItem>
                )}
              />

              {wholeTeam ? (
                <div>
                  <p className={L}>Nominee</p>
                  <div className="mt-2 flex h-12 items-center gap-2.5 rounded-lg border border-[#2a2418] bg-[#0a0908] px-4 text-[#cbc0a0]">
                    <Users size={16} className="text-[#e6ba35]" /> Whole team
                  </div>
                  <p className={HELP}>This award goes to the whole crew — no one to pick.</p>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name={`nominations.${i}.nomineeUids` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={L}>
                        Nominee(s) <span aria-hidden="true" className="text-[#e6ba35]">*</span>
                      </FormLabel>
                      <FormControl>
                        <MultiSelectDropdown
                          options={options}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!category || options.length === 0}
                          placeholder={
                            !category
                              ? "Choose a category first"
                              : options.length === 0
                                ? "Add them in the Crew section first"
                                : "Select one or more crew members"
                          }
                          error={form.formState.errors.nominations?.[i]?.nomineeUids?.message}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
