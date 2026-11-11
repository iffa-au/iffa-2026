"use client";

import { useRef } from "react";
import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  BLANK_PODCAST_CONTACT,
  podcastOptions,
  type FilmValues,
  type PodcastContact,
} from "@/utils/FilmSubmission.utils";
import { L, I, HELP, ERR, REQ, OPTIONAL_PILL, PICK, PICK_CHECK } from "./form-tokens";

type ContactPath = "podcastSharedContact" | `podcastParticipants.${number}.contact`;

const Q = "text-[15px] font-semibold text-white mb-3";
const HR = "border-t border-[#26241d] my-6";

const isComplete = (c: PodcastContact) => c.name.trim() !== "" && /^\S+@\S+\.\S+$/.test(c.email.trim());

function ContactFields({ form, path }: { form: UseFormReturn<FilmValues>; path: ContactPath }) {
  const field = (
    key: keyof PodcastContact,
    label: string,
    placeholder: string,
    { required = false, type = "text" }: { required?: boolean; type?: string } = {},
  ) => (
    <FormField
      control={form.control}
      name={`${path}.${key}` as const}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={L}>
            {label}{" "}
            {required ? (
              <span aria-hidden="true" className={REQ}>*</span>
            ) : (
              <span className={OPTIONAL_PILL}>Optional</span>
            )}
          </FormLabel>
          <FormControl>
            {key === "notes" ? (
              <Textarea {...field} rows={3} placeholder={placeholder} className={cn(I, "h-auto resize-none leading-relaxed")} />
            ) : (
              <Input {...field} type={type} placeholder={placeholder} className={cn(I, "[color-scheme:dark]")} />
            )}
          </FormControl>
          <FormMessage className={ERR} />
        </FormItem>
      )}
    />
  );

  return (
    <div className="space-y-5">
      {field("name", "Contact person's full name", "Full name", { required: true })}
      {field("email", "Contact email address", "name@example.com", { required: true, type: "email" })}
      {field("relationship", "Role / relationship to the participant", "e.g. Manager, Publicist, Producer")}
      {field("phone", "Phone / WhatsApp number", "Include country code", { type: "tel" })}
      {field("timezone", "Country / time zone", "e.g. India (IST)")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {field("preferredDate", "Preferred date for the podcast", "", { type: "date" })}
        {field("preferredTime", "Preferred time", "", { type: "time" })}
      </div>
      {field("notes", "Additional information", "Any preferences, other interested participants or scheduling information")}
    </div>
  );
}

/**
 * The optional video-podcast questions. Participants are crew uids (or, before
 * any crew has a name, generic roles), so renaming a crew member relabels the
 * choice and removing one drops it — see podcastOptions.
 */
export function VideoPodcast({ form }: { form: UseFormReturn<FilmValues> }) {
  // useWatch / useFormState rather than form.watch / form.formState: this
  // component is memoized on a `form` prop that never changes identity.
  const [interest, picked, same, actors, directors, producers, writers] = useWatch({
    control: form.control,
    name: [
      "podcastInterest", "podcastParticipants", "podcastSameContact",
      "actors", "directors", "producers", "writers",
    ],
  });
  const options = podcastOptions({ actors, directors, producers, writers });
  const labelOf = new Map(options.map((o) => [o.id, o.label]));
  const shown = picked
    .map((p, index) => ({ ...p, index, label: labelOf.get(p.id) }))
    .filter((p): p is typeof p & { label: string } => Boolean(p.label));
  const justAdded = useRef<string | null>(null);
  const { errors, isSubmitted } = useFormState({ control: form.control });

  const setParticipants = (next: FilmValues["podcastParticipants"]) =>
    form.setValue("podcastParticipants", next, { shouldValidate: isSubmitted });

  return (
    <div>
      <h3 className="text-[18px] font-semibold text-white mb-2">Video Podcast Participation</h3>
      <p className={cn(HELP, "mt-0 mb-5")}>
        IFFA may invite cast and crew members to participate in a video podcast interview discussing their film,
        creative journey, experiences and behind-the-scenes stories. Interviews will be arranged at a mutually
        convenient time.
      </p>

      <p id="podcast-q1" className={Q}>
        1. Would any cast or crew members be interested in participating in a video podcast interview about this
        film? <span className={OPTIONAL_PILL}>Optional</span>
      </p>
      <div role="radiogroup" aria-labelledby="podcast-q1" className="flex flex-wrap gap-7">
        {(["yes", "no"] as const).map((v) => (
          <label key={v} className={PICK}>
            <input
              type="radio"
              name="podcastInterest"
              value={v}
              checked={interest === v}
              onChange={() => {
                form.setValue("podcastInterest", v);
                if (v === "no") setParticipants([]);
              }}
              className="sr-only"
            />
            {v === "yes" ? "Yes" : "No"}
          </label>
        ))}
      </div>

      {interest === "yes" && (
        <>
          <div className={HR} />
          <p id="podcast-q2" className={Q}>
            2. Which cast or crew members would be interested in participating? <span aria-hidden="true" className={REQ}>*</span>
          </p>
          <p className={cn(HELP, "mt-0 mb-3")}>Select all that apply.</p>
          <div role="group" aria-labelledby="podcast-q2" className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
            {options.map((o) => (
              <label key={o.id} className={cn(PICK, PICK_CHECK)}>
                <input
                  type="checkbox"
                  checked={picked.some((p) => p.id === o.id)}
                  onChange={(e) => {
                    const cur = form.getValues("podcastParticipants");
                    // Only per-person cards open the newcomer; otherwise
                    // switching to them later should open the first.
                    if (e.target.checked && !same) justAdded.current = o.id;
                    setParticipants(
                      e.target.checked
                        ? [...cur, { id: o.id, contact: { ...BLANK_PODCAST_CONTACT } }]
                        : cur.filter((p) => p.id !== o.id),
                    );
                  }}
                  className="sr-only"
                />
                {o.label}
              </label>
            ))}
          </div>
          {errors.podcastParticipants?.message && <p className={ERR}>{errors.podcastParticipants.message}</p>}

          {shown.length > 0 && (
            <>
              <div className={HR} />
              <p className={Q}>
                3. Who should IFFA contact to coordinate the podcast recording? <span aria-hidden="true" className={REQ}>*</span>
              </p>
              <label className={cn(PICK, PICK_CHECK)}>
                <input
                  type="checkbox"
                  checked={same}
                  onChange={(e) => form.setValue("podcastSameContact", e.target.checked, { shouldValidate: isSubmitted })}
                  className="sr-only"
                />
                Use the same contact for everyone
              </label>

              <div className="mt-5">
                {same ? (
                  <ContactFields form={form} path="podcastSharedContact" />
                ) : (
                  shown.map((p, i) => {
                    const ok = isComplete(p.contact);
                    return (
                      // Native exclusive accordion (`name`): one card open at
                      // a time, and a closed card keeps its inputs mounted, so
                      // the form can still open it to show an error.
                      <details
                        key={p.id}
                        name="podcast-contacts"
                        ref={(el) => {
                          if (!el || el.dataset.init) return;
                          el.dataset.init = "1";
                          if (justAdded.current === p.id || (i === 0 && !justAdded.current)) el.open = true;
                          if (justAdded.current === p.id) justAdded.current = null;
                        }}
                        className="group mb-2.5 rounded-[10px] border border-[#26241d] open:border-[#9a7a1e] overflow-hidden"
                      >
                        <summary className="flex items-center gap-2.5 p-3.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-[#161613] text-[14px] font-semibold">
                          <span aria-hidden="true" className="w-3.5 text-[#e8b830] group-open:rotate-90 transition-transform">▸</span>
                          <span className="text-white">{p.label}</span>
                          <span className="flex-1 min-w-0 truncate text-[13px] font-medium text-[#8a8470]">
                            {ok && `${p.contact.name.trim()} · ${p.contact.email.trim()}`}
                          </span>
                          <span
                            className={cn(
                              "ml-auto whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                              ok ? "text-[#e8b830] border-[#9a7a1e]" : "text-[#e86a3a] border-[#5a2e1c]",
                            )}
                          >
                            {ok ? "✓ Complete" : "⚠ Needs details"}
                          </span>
                        </summary>
                        <div className="border-t border-[#26241d] px-3.5 pt-[18px] pb-4">
                          <ContactFields form={form} path={`podcastParticipants.${p.index}.contact`} />
                        </div>
                      </details>
                    );
                  })
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
