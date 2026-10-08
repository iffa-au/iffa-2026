"use client";

import { Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { useFieldArray, useWatch, type ControllerRenderProps, type UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BLANK_PROMO_CLIP, type FilmValues } from "@/utils/FilmSubmission.utils";
import { YesNoToggle } from "./YesNoToggle";
import { L, I, HELP, ERR } from "./form-tokens";

const DESCRIPTION =
  "Share links to very short clips from your film that can be shared on social media to build hype, promote the film, and capture audience attention. Choose your best dialogue, a standout scene, or a memorable moment with the potential to go viral. Please provide downloadable video links and include English subtitles for dialogue in other languages.";

/**
 * The URL box with an (i) badge sat inside its right edge. The description is
 * long enough that printing it under every clip row would bury the inputs, so
 * it opens on demand, directly beneath the box it explains.
 */
function ClipUrlInput({
  field,
}: {
  field: ControllerRenderProps<FilmValues, `promoClips.${number}.url`>;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <div className="relative">
        <FormControl>
          <Input
            {...field}
            placeholder="https://drive.google.com/... or direct .mp4 link"
            className={cn(I, "pr-14")}
          />
        </FormControl>
        <button
          type="button"
          aria-label="About short promotional clips"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
            open
              ? "border-[#e6ba35] bg-[#e6ba35]/12 text-[#e6ba35]"
              : "border-[#2a2418] text-[#8a8268] hover:border-[#e6ba35]/40 hover:text-[#e6ba35]"
          )}
        >
          {/* A bare glyph, not lucide's Info icon: that draws its own circle,
              which sat as a second ring inside the button's border. */}
          <span aria-hidden="true" className="font-serif text-[18px] font-bold italic leading-none">
            i
          </span>
        </button>
      </div>
      {open && (
        <p
          id={panelId}
          className="mt-2 rounded-lg border border-[#e6ba35]/25 bg-[#e6ba35]/5 px-4 py-3 text-[14px] leading-relaxed text-[#cbc0a0]"
        >
          {DESCRIPTION}
        </p>
      )}
    </>
  );
}

export function PromoClipsList({ form }: { form: UseFormReturn<FilmValues> }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "promoClips" });
  // useWatch, not form.watch: the React Compiler memoizes this component on
  // its unchanging `form` prop, so a form.watch read here never re-ran and
  // choosing "Yes" didn't reveal the password box. useWatch subscribes this
  // component itself.
  const clips = useWatch({ control: form.control, name: "promoClips" });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={L}>
          Short Promotional Clips{" "}
          <span className="ml-2 align-middle rounded-full border border-[#2a2418] px-2 py-[1px] text-[11px] font-medium uppercase tracking-wider text-[#6b6347]">
            Optional
          </span>
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ ...BLANK_PROMO_CLIP })}
          className="text-[#e6ba35] hover:bg-[#e6ba35]/10 text-sm gap-2 h-10 rounded-lg px-4"
        >
          <Plus size={16} /> Add Clip
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-[#7a7258] text-sm">No clips added yet.</p>
      )}

      {fields.map((item, i) => {
        const hasPassword = clips?.[i]?.hasPassword ?? false;
        return (
          <div key={item.id} className="rounded-xl border border-[#1a1810] bg-[#080706] p-6 space-y-5">
            <FormField
              control={form.control}
              name={`promoClips.${i}.url` as const}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-3">
                    <FormLabel className={L}>Short Promotional Clip {i + 1}</FormLabel>
                    <button
                      type="button"
                      aria-label={`Remove clip ${i + 1}`}
                      onClick={() => remove(i)}
                      className="text-[#4a4232] hover:text-red-400 transition-colors p-2 -m-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <ClipUrlInput field={field} />
                  <FormMessage className={ERR} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`promoClips.${i}.hasPassword` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={L}>Is this link password-protected?</FormLabel>
                  <YesNoToggle
                    ariaLabel={`Is clip ${i + 1}'s link password-protected?`}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // Same rule as the trailer: a password typed before
                      // switching back to "No" must not be submitted invisibly.
                      if (!value) form.setValue(`promoClips.${i}.password`, "");
                    }}
                  />
                </FormItem>
              )}
            />

            {hasPassword && (
              <FormField
                control={form.control}
                name={`promoClips.${i}.password` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={L}>
                      Clip link password <span aria-hidden="true" className="text-[#e6ba35]">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="off" spellCheck={false}
                        placeholder="Password for the folder or file" className={cn(I, "font-mono")} />
                    </FormControl>
                    <p className={HELP}>
                      Visible so you can check it. Stored against your submission and seen only by our review team.
                    </p>
                    <FormMessage className={ERR} />
                  </FormItem>
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
