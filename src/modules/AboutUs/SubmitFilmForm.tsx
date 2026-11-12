"use client";

import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2, Loader2, AlertCircle, ChevronDown,
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
  BLANK_PROMO_CLIP,
  BLANK_NOMINATION,
  BLANK_PODCAST_CONTACT,
  podcastOptions,
  CREW_API_GROUP,
  NOMINEE_FIELDS,
  newPerson,
  newPersonUid,
  WATCH_FORMAT_OPTIONS,
  contentTypeHidesActors,
  filterFilledCrew,
  type FilmValues,
  type PersonEntry,
} from "@/utils/FilmSubmission.utils";
import { sendConfirmationEmails } from "@/lib/email/send-confirmation-emails";
import { FIELD_KEYS } from "@/lib/email/field-keys";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { CrewList } from "./components/CrewList";
import { PromoClipsList } from "./components/PromoClipsList";
import { NominationList } from "./components/NominationList";
import { VideoPodcast } from "./components/VideoPodcast";
import { YesNoToggle } from "./components/YesNoToggle";
import { WebpImageUpload, uploadWebpImage, createSubmissionRef } from "./components/WebpImageUpload";
import {
  L, I, HELP, ERR, REQ, OPTIONAL_PILL, PICK,
  MULTI_BOX, SELECT_TRIGGER, SELECT_CHEVRON, SELECT_PANEL, SELECT_ITEM,
} from "./components/form-tokens";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_SUBMIT_FILM_URL ||
  "https://guh4nzpet5.ap-southeast-2.awsapprunner.com/api/v1";

const ACTOR_ROLES = ["Actor in a leading role", "Actress in a leading role", "Actor in a supporting role", "Actress in a supporting role"];
const DIRECTOR_ROLES = ["Director", "Co-Director"];
const PRODUCER_ROLES = ["Producer", "Executive Producer"];
const OTHER_ROLES = ["DOP", "Editor", "Writer", "Music", "Other"];

const NUM = "w-24 text-center";

// Style tokens are shared with the CrewList cards embedded below — see
// ./components/form-tokens.

// The asterisk is decorative — the schema carries the actual rule.
const Req = () => <span aria-hidden="true" className={REQ}>*</span>;
const Optional = () => <span className={OPTIONAL_PILL}>Optional</span>;

// Keeps duration inputs digit-only and within range as the user types.
// The boxes are type="text", not "number": a number input reports "" for a
// partial value like "6e", which used to wipe the field's value while "6e"
// stayed on screen, so the runtime silently went out as 0 minutes.
//
// Clearing the box yields "" rather than "0": a pre-filled zero reads as an
// answered question, which is exactly why runtimes were arriving as 0h 0m.
function sanitizeDurationInput(raw: string, max: number, onChange: (value: string) => void) {
  const digitsOnly = raw.replace(/[^0-9]/g, "");
  if (digitsOnly === "") {
    onChange("");
    return;
  }
  const num = Number(digitsOnly);
  if (num > max) return;
  onChange(String(num));
}

// ─── Step definitions ─────────────────────────────────────────────────────────
// `fields` are what Next validates before leaving a step (form.trigger), and
// how a failed submit finds the step holding an error.
const STEPS: {
  id: string; title: string; desc: string; side: string; fields: FieldPath<FilmValues>[];
}[] = [
  {
    id: "section-basics", title: "Film Information", desc: "Core details about your film", side: "Core details",
    fields: [
      "title", "synopsis", "releaseDate", "durationHours", "durationMinutes", "contentTypeId", "countryId",
      "releaseCountryIds", "watchFormats", "releaseLinkUrl", "languageId", "productionHouse", "distributor", "genreIds",
    ],
  },
  {
    id: "section-crew", title: "Crew", desc: "Add cast and key production crew", side: "Cast & key crew",
    fields: ["actors", "directors", "producers", "writers"],
  },
  {
    id: "section-nominations", title: "Category nominations",
    desc: "The awards you\u2019re entering and who you\u2019re nominating", side: "Awards & nominees",
    fields: ["nominations"],
  },
  {
    id: "section-media", title: "Media Links", desc: "URLs, contact email and rights confirmation",
    side: "Images, trailer & rights",
    fields: [
      "potraitImageUrl", "landscapeImageUrl", "imdbUrl", "trailerUrl", "trailerHasPassword", "trailerPassword",
      "promoClips", "notes", "podcastInterest", "podcastParticipants", "podcastSameContact", "podcastSharedContact",
      "contactEmail", "agreeRights",
    ],
  },
];
const LAST = STEPS.length - 1;

/** Which step a (possibly nested, e.g. `directors.0.email`) field lives in. */
const stepForField = (name: string) =>
  Math.max(0, STEPS.findIndex((s) => s.fields.includes(name.split(".")[0] as FieldPath<FilmValues>)));

/**
 * Scrolls to a step's section or, with `toError`, focuses its first invalid
 * control (opening a closed podcast-contact <details> on the way). Called
 * from an effect, after the step and any re-opened crew cards have rendered.
 */
function reveal(sectionId: string, toError: boolean) {
  const section = document.getElementById(sectionId);
  const el = toError ? section?.querySelector<HTMLElement>('[aria-invalid="true"]') : null;
  el?.closest("details")?.setAttribute("open", "");
  // Focus before scrolling: Chrome cancels a smooth scroll that a focus()
  // lands in the middle of, even with preventScroll.
  el?.focus({ preventScroll: true });
  (el ?? section)?.scrollIntoView({ behavior: "smooth", block: el ? "center" : "start" });
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
// Every section stays mounted (only `hidden`), so values, staged uploads and
// collapsed cards survive moving between steps.
function Section({ index, hidden, children }: { index: number; hidden: boolean; children: React.ReactNode }) {
  const { id, title, desc } = STEPS[index];
  return (
    <section
      id={id}
      hidden={hidden}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-[200px] rounded-[14px] border border-[#26241d] bg-[#0e0e0c]"
    >
      <div className="relative flex flex-col items-center text-center px-[60px] md:px-24 pt-7 pb-6 md:pt-[34px] md:pb-7 border-b border-[#26241d]">
        <span className="absolute left-3 md:left-7 top-1/2 -translate-y-1/2 grid place-items-center size-[38px] md:size-[52px] rounded-full bg-[#2a2410] border-[1.5px] border-[#9a7a1e] text-[#e8b830] font-bold text-base md:text-[22px]">
          {index + 1}
        </span>
        <h2
          id={`${id}-title`}
          className="text-white text-[30px] md:text-[46px] leading-[1.15] font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h2>
        <p className="text-[16px] text-[#8a8470]">{desc}</p>
      </div>
      <div className="px-5 py-6 md:px-8 md:py-8">{children}</div>
    </section>
  );
}

const NAV_BTN =
  "bg-[#e8b830] hover:bg-[#e8b830] hover:brightness-110 text-[#16120a] font-bold uppercase tracking-[0.12em] text-[13px] rounded px-[26px] h-12 shadow-[0_4px_18px_#e8b83033] disabled:opacity-50 disabled:cursor-not-allowed";

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
  // One ref per form session, shared by every upload so a submission's images
  // all land in the same S3 folder. A ref rather than state: it must survive
  // re-renders without causing one, and a retried submit should reuse the
  // same folder rather than orphan the first attempt's files in another.
  const submissionRefRef = useRef(createSubmissionRef());
  // Which sections a failed submit left errors in. The form is long enough
  // that an invalid field is routinely off-screen — without this, pressing
  // Submit looks like it did nothing at all.
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  // Bumped on every failed Next or submit, so crew cards collapsed earlier
  // re-open to show their errors (see CrewList).
  const [attempt, setAttempt] = useState(0);
  const { awardCategories, genres, contentTypes, countries, languages, loading, error: optionsError } =
    useSubmissionOptions(API_BASE);
  const filmSchema = useMemo(
    () => buildFilmSchema(contentTypes, awardCategories),
    [contentTypes, awardCategories],
  );

  const form = useForm<FilmValues>({
    resolver: zodResolver(filmSchema),
    defaultValues: {
      title: "", synopsis: "", releaseDate: "", durationHours: "", durationMinutes: "", contentTypeId: "", countryId: "",
      releaseCountryIds: [], watchFormats: [], releaseLinkUrl: "",
      languageId: "", productionHouse: "", distributor: "", genreIds: [],
      potraitImageUrl: null, landscapeImageUrl: null, imdbUrl: "", trailerUrl: "",
      trailerHasPassword: false, trailerPassword: "",
      promoClips: [{ ...BLANK_PROMO_CLIP }],
      actors: [newPerson({ role: "Actor in a leading role" })],
      directors: [newPerson({ role: "Director" })],
      producers: [newPerson({ role: "Producer" })],
      writers: [],
      nominations: [{ ...BLANK_NOMINATION }],
      notes: "",
      podcastInterest: "",
      podcastParticipants: [],
      podcastSameContact: true,
      podcastSharedContact: { ...BLANK_PODCAST_CONTACT },
      contactEmail: "",
      agreeRights: false,
    },
  });

  const contentTypeId = form.watch("contentTypeId");
  const selectedContentTypeName = contentTypes.find((ct) => ct._id === contentTypeId)?.name;
  const hideActors = contentTypeHidesActors(selectedContentTypeName);

  useEffect(() => {
    if (hideActors) {
      form.setValue("actors", []);
    } else if (form.getValues("actors").length === 0) {
      form.setValue("actors", [newPerson({ role: "Actor in a leading role" })]);
    }
  }, [hideActors, form]);

  // Next shows a step's errors before any submit, when react-hook-form
  // doesn't re-validate on change yet, so a fixed field would keep its
  // message until the next press. Re-check whatever is showing an error on
  // every change (after a submit, reValidateMode already does this).
  useEffect(() => {
    const { unsubscribe } = form.watch(() => {
      if (form.formState.isSubmitted) return;
      const names = Object.keys(form.formState.errors) as FieldPath<FilmValues>[];
      if (names.length) void form.trigger(names);
    });
    return unsubscribe;
  }, [form]);

  // Scrolling waits for the render that shows the step: after an `await`
  // React commits in a later task, so scrolling straight away (or in the
  // next frame) can hit a section that is still hidden. A new object each
  // time, so asking for the same step twice still scrolls.
  const [scrollReq, setScrollReq] = useState<{ step: number; toError: boolean } | null>(null);
  useEffect(() => {
    if (scrollReq) reveal(STEPS[scrollReq.step].id, scrollReq.toError);
  }, [scrollReq]);

  const duplicateDirectorAsProducer = (entry: PersonEntry) => {
    const producers = form.getValues("producers");
    const exists = producers.some(
      (p) => p.fullName.trim().toLowerCase() === entry.fullName.trim().toLowerCase(),
    );
    if (!exists && entry.fullName.trim()) {
      form.setValue("producers", [
        ...producers,
        // A new uid: this is a second credit, and sharing the director's
        // would let a nomination of one match both.
        { ...entry, role: "Producer", uid: newPersonUid() },
      ]);
    }
  };

  if (status === "success") return <SuccessScreen />;

  const show = (i: number, toError = false) => {
    setStep(i);
    setScrollReq({ step: i, toError });
  };

  /** Moving forward validates every step on the way; going back never does. */
  const goTo = async (target: number) => {
    for (let i = step; i < target; i++) {
      if (!(await form.trigger(STEPS[i].fields))) {
        setAttempt((a) => a + 1);
        show(i, true);
        return;
      }
      setInvalidSteps((prev) => prev.filter((s) => s !== i));
    }
    show(target);
  };

  /** Zod rejected the whole form: jump to the first step holding an error. */
  const onInvalid = (errors: Record<string, unknown>) => {
    const steps = [...new Set(Object.keys(errors).map(stepForField))].sort();
    setInvalidSteps(steps);
    setAttempt((a) => a + 1);
    show(steps[0] ?? LAST, true);
  };

  const onSubmit = async (values: FilmValues) => {
    setInvalidSteps([]);
    setStatus("submitting");

    // Every image field holds a confirmed File at this point (Zod already
    // required it) — nothing has touched S3 yet. Upload them all now, right
    // before the submission is created, so an abandoned form never leaves
    // orphaned files in the bucket.
    const submissionRef = submissionRefRef.current;
    const title = values.title.trim();

    // Crew filenames carry the person's role and name so the folder reads
    // back sensibly. The index disambiguates two credits that slugify the
    // same — two directors sharing a name, or names with no Latin
    // characters, which both collapse to the same fragment server-side.
    const norm = async (p: PersonEntry, index: number) => ({
      fullName: p.fullName.trim(),
      role: p.role.trim(),
      imageUrl: await uploadWebpImage(p.imageUrl as File, {
        submissionRef,
        title,
        group: "crews",
        name: `${p.role.trim()}-${p.fullName.trim()}-${index + 1}`,
      }),
      biography: p.biography.trim(),
      instagramUrl: p.instagram?.trim() || "",
      representativeName: p.representativeName.trim(),
      representativeRelationship: p.representativeRelationship.trim(),
      email: p.email.trim().toLowerCase(),
      contactPhone: p.contactPhone?.trim() || "",
      notes: p.notes?.trim() || "",
    });

    const {
      potraitImageUrl: _rawPotrait,
      landscapeImageUrl: _rawLandscape,
      actors: _rawActors,
      directors: _rawDirectors,
      producers: _rawProducers,
      writers: _rawWriters,
      // UI-only toggle — the API infers "protected" from a non-empty
      // trailerPassword, so sending the boolean too would be a second source
      // of truth that could disagree with it.
      trailerHasPassword: _rawTrailerHasPassword,
      promoClips: _rawPromoClips,
      nominations: _rawNominations,
      podcastInterest: _rawPodcastInterest,
      podcastParticipants: _rawPodcastParticipants,
      podcastSameContact: _rawPodcastSameContact,
      podcastSharedContact: _rawPodcastSharedContact,
      ...restValues
    } = values;

    // Nominees go to the API as crew group + name, which it matches against
    // the crew in this same payload — the form's uids mean nothing there.
    const crewByUid = new Map(
      (["actors", "directors", "producers", "writers"] as const).flatMap((field) =>
        values[field].map((p) => [p.uid, { group: CREW_API_GROUP[field], fullName: p.fullName.trim() }] as const),
      ),
    );
    const nominations = values.nominations
      .filter((n) => n.categoryId)
      .map((n) => {
        const category = awardCategories.find((c) => c._id === n.categoryId);
        const individual = category && NOMINEE_FIELDS[category.nomineeType].length > 0;
        return {
          awardCategoryId: n.categoryId,
          categoryName: category?.name ?? "",
          nominees: individual
            ? n.nomineeUids.flatMap((uid) => crewByUid.get(uid) ?? [])
            : [],
        };
      });

    // Blank rows are dropped, and — as with the trailer — the per-clip
    // hasPassword toggle stays UI-only: a non-empty password is the signal.
    const promoClips = values.promoClips
      .map((clip) => ({
        url: clip.url.trim(),
        password: clip.hasPassword ? clip.password.trim() : "",
      }))
      .filter((clip) => clip.url);

    // The shape normalizeVideoPodcast reads in cms-hub. Skipped → not sent; a
    // contact with participant "" is the one contact for everyone. Matching
    // against the current options drops anyone since removed from the crew.
    const labelOf = new Map(podcastOptions(values).map((o) => [o.id, o.label]));
    const podcastPicked = values.podcastParticipants.filter((p) => labelOf.has(p.id));
    const videoPodcast =
      values.podcastInterest === ""
        ? undefined
        : values.podcastInterest === "no"
          ? { interested: false, participants: [], contacts: [] }
          : {
              interested: true,
              participants: podcastPicked.map((p) => labelOf.get(p.id)!),
              contacts: values.podcastSameContact
                ? [{ participant: "", ...values.podcastSharedContact }]
                : podcastPicked.map((p) => ({ participant: labelOf.get(p.id)!, ...p.contact })),
            };

    try {
      const [potraitImageUrl, landscapeImageUrl, actors, directors, producers, writers] =
        await Promise.all([
          uploadWebpImage(values.potraitImageUrl as File, {
            submissionRef,
            title,
            group: "banners",
            name: "portrait",
          }),
          uploadWebpImage(values.landscapeImageUrl as File, {
            submissionRef,
            title,
            group: "banners",
            name: "landscape",
          }),
          Promise.all(filterFilledCrew(values.actors).map(norm)),
          Promise.all(values.directors.map(norm)),
          Promise.all(values.producers.map(norm)),
          Promise.all(filterFilledCrew(values.writers).map(norm)),
        ]);

      const payload = {
        ...restValues,
        // A blank box means "no hours"/"no minutes"; the API reads "" as
        // "field omitted", so send an explicit 0 for the empty half. The
        // schema has already rejected the case where both are empty.
        durationHours: values.durationHours || "0",
        durationMinutes: values.durationMinutes || "0",
        trailerPassword: values.trailerHasPassword ? values.trailerPassword.trim() : "",
        promoClips,
        potraitImageUrl,
        landscapeImageUrl,
        // The server rebuilds the asset folder path from this plus the title —
        // it deliberately doesn't accept the path itself.
        submissionRef,
        synopsis: values.synopsis.replace(/\r?\n+/g, " ").replace(/\s{2,}/g, " ").trim(),
        notes: values.notes?.trim() || "",
        submissionYear: new Date().getFullYear(),
        isFeatured: false,
        genreId: values.genreIds[0],
        crew: { actors, directors, producers, other: writers },
        nominations: nominations.map(({ awardCategoryId, nominees }) => ({ awardCategoryId, nominees })),
        videoPodcast,
      };

      const res = await fetch(`${API_BASE}/submissions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
          [FIELD_KEYS.EMAIL]: values.contactEmail,
          "IMDb URL": values.imdbUrl,
          "Trailer Download URL": values.trailerUrl,
          // The password itself deliberately stays out of email — this goes
          // to the submitter's inbox and a shared admin inbox. Reviewers read
          // it from the CMS, behind auth.
          "Trailer Link Password Protected": values.trailerHasPassword
            ? "Yes — password is on the submission in the CMS"
            : "No",
          // URLs only, for the same reason the trailer password is left out.
          "Short Promotional Clips": promoClips.length
            ? promoClips
                .map((clip) => (clip.password ? `${clip.url} (password protected)` : clip.url))
                .join(", ")
            : "Not provided",
          "Award Nominations": nominations
            .map((n) =>
              n.nominees.length
                ? `${n.categoryName}: ${n.nominees.map((p) => p.fullName).join(", ")}`
                : `${n.categoryName}: Whole team`,
            )
            .join("; "),
          "Release, Broadcast or Exhibition Link": values.releaseLinkUrl?.trim() || "Not provided",
          Notes: values.notes?.trim() || "Not provided",
          // Participants only; the contacts' details stay in the CMS.
          "Video Podcast": !videoPodcast
            ? "Not answered"
            : videoPodcast.interested
              ? `Yes — ${videoPodcast.participants.join(", ")}`
              : "No",
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
      {/* Header. The shared layout pads `main` by less than the fixed header's
          real height, so the extra top padding lives here rather than in the
          layout, which every other page also uses. */}
      <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-10">
        <p className="text-[#e6ba35]/60 text-xs font-mono tracking-[0.2em] uppercase mb-5">
          IFFA Awards / Film Submission
        </p>
        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Submit Your Film
        </h1>
        <p className="text-[#9a9278] text-base leading-relaxed max-w-2xl">
          Four sections: your film&apos;s details, the people who made it, the awards you&apos;re
          entering, and your media links.
          Fields marked <span className="text-[#e6ba35] font-semibold">*</span> are required.
        </p>
      </div>

      {/* Step tabs. The fixed site header measures 121px, while the shared
          layout pads `main` by only 88px -- so this offset is deliberately
          not 88. A finished step's tab goes back to it; a later one walks
          forward through Next's validation. */}
      <div className="sticky top-[121px] z-30 bg-[#0a0a09]">
        <nav aria-label="Form steps" className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-6 pt-[18px] pb-3.5 flex gap-2.5">
          {STEPS.map((s, i) => {
            const hasError = invalidSteps.includes(i);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => void goTo(i)}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "flex-1 flex flex-col gap-[9px] text-left text-[11px] sm:text-[13px] font-semibold",
                  "before:content-[''] before:h-1 before:rounded-full before:transition-colors",
                  hasError
                    ? "text-red-300 before:bg-red-500/60"
                    : i === step
                      ? "text-[#e9e6dc] before:bg-[#e8b830]"
                      : i < step
                        ? "text-[#e8b830] before:bg-[#e8b830]"
                        : "text-[#8a8470] before:bg-[#26241d]",
                )}
              >
                <span className="flex items-center gap-[7px]">
                  <b className="hidden sm:inline-grid place-items-center size-[19px] rounded-full bg-[#2a2410] text-[#e8b830] text-[10px]">
                    {i + 1}
                  </b>
                  {s.title}
                  {hasError && <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-6 pb-28 grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] gap-7 items-start">
        <aside aria-label="Form sections" className="hidden lg:flex sticky top-[200px] mt-9 flex-col gap-1 rounded-[14px] border border-[#26241d] bg-[#0e0e0c] p-2.5">
          <p className="mx-2.5 mt-2 mb-2.5 text-[12px] font-bold tracking-[0.14em] text-[#9a7a1e]">SECTIONS</p>
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => void goTo(i)}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "group flex items-center gap-3 w-full text-left rounded-lg border-l-[3px] p-3 text-[14px] font-semibold transition-colors",
                i === step
                  ? "bg-[#1c1707] border-[#e8b830] text-[#e9e6dc]"
                  : "border-transparent text-[#8a8470] hover:bg-[#161613] hover:text-[#e9e6dc]",
              )}
            >
              <span
                className={cn(
                  "grid place-items-center flex-none size-7 rounded-full bg-[#2a2410] text-[#e8b830] text-[12px] border",
                  i === step ? "border-[#9a7a1e]" : invalidSteps.includes(i) ? "border-red-500/60" : "border-[#26241d]",
                )}
              >
                {i + 1}
              </span>
              <span>
                {s.title}
                <small className={cn("block text-[12px] font-medium", i === step ? "text-[#8a8470]" : "text-[#6b6544]")}>
                  {s.side}
                </small>
              </span>
            </button>
          ))}
        </aside>

        <Form {...form}>
          {/* Enter in a field on steps 1–3 means Next, not submit. */}
          <form
            onSubmit={(e) => {
              if (step < LAST) {
                e.preventDefault();
                void goTo(step + 1);
              } else {
                void form.handleSubmit(onSubmit, onInvalid)(e);
              }
            }}
            className="min-w-0 pt-9 space-y-7"
            noValidate
          >
            {/* Every list below (formats, countries, genres…) comes from this
                one load; without it the form can't be completed, so say so. */}
            {optionsError && (
              <Alert className="border-red-500/30 bg-red-950/25 text-red-300 rounded-xl">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-sm">
                  We couldn&apos;t load the form options. Please refresh the page and try again.
                </AlertDescription>
              </Alert>
            )}

            {/* ── 1 · Film Information ── */}
            <Section index={0} hidden={step !== 0}>
              <div className="grid grid-cols-1 gap-y-6">

                <div>
                  <FormField control={form.control} name="title"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Film Title <Req /></FormLabel>
                        <FormControl><Input {...field} placeholder="Enter the full film title" className={cn(I, "text-base")} /></FormControl>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />
                </div>

                <div>
                  <FormField control={form.control} name="synopsis"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Synopsis <Req /></FormLabel>
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
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="releaseDate"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Release Date <Req /></FormLabel>
                      <FormControl><Input {...field} type="date" className={I} /></FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                {/* Duration. Both boxes start empty with a greyed "0"
                    placeholder rather than a literal 0, and share one error
                    line below — a message tucked under just the minutes box
                    was easy to miss, and a pre-filled 0 read as answered. */}
                <div>
                  <FormLabel className={L}>Total Runtime <Req /></FormLabel>
                  <div className="mt-2 flex items-center gap-4">
                    <FormField control={form.control} name="durationHours"
                      render={({ field }: { field: any }) => (
                        <FormItem className="flex-none">
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                aria-label="Runtime hours"
                                className={cn(I, NUM)}
                                value={field.value}
                                onChange={(e) => sanitizeDurationInput(e.target.value, 10, field.onChange)}
                              />
                            </FormControl>
                            <span className="text-[#8a8268] text-sm">hr</span>
                          </div>
                        </FormItem>
                      )} />
                    <FormField control={form.control} name="durationMinutes"
                      render={({ field }: { field: any }) => (
                        <FormItem className="flex-none">
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="0"
                                aria-label="Runtime minutes"
                                className={cn(I, NUM)}
                                value={field.value}
                                onChange={(e) => sanitizeDurationInput(e.target.value, 59, field.onChange)}
                              />
                            </FormControl>
                            <span className="text-[#8a8268] text-sm">min</span>
                          </div>
                        </FormItem>
                      )} />
                  </div>
                  {(form.formState.errors.durationHours || form.formState.errors.durationMinutes) && (
                    <p className={ERR}>
                      {form.formState.errors.durationHours?.message ||
                        form.formState.errors.durationMinutes?.message}
                    </p>
                  )}
                  <p className={HELP}>e.g. 1 hr 42 min. A runtime of 0 hr 0 min isn&apos;t accepted.</p>
                </div>

                {/* Radios rather than a select: there are only a handful of
                    formats, and the choice reshapes the crew and nomination
                    steps, so it should be visible at a glance. */}
                <FormField control={form.control} name="contentTypeId"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <p id="screen-format-label" className={L}>Screen Format <Req /></p>
                      <FormControl>
                        <div
                          role="radiogroup"
                          aria-labelledby="screen-format-label"
                          className="grid grid-rows-4 sm:grid-rows-2 grid-flow-col auto-cols-fr gap-x-6 gap-y-[18px]"
                        >
                          {loading && <p className={HELP}>Loading…</p>}
                          {contentTypes.map((ct) => (
                            <label key={ct._id} className={PICK}>
                              <input
                                type="radio"
                                name={field.name}
                                value={ct._id}
                                checked={field.value === ct._id}
                                onChange={() => field.onChange(ct._id)}
                                onBlur={field.onBlur}
                                className="sr-only"
                              />
                              {ct.name}
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="countryId"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Country of Origin <Req /></FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                        <FormControl>
                          <SelectTrigger className={SELECT_TRIGGER} icon={<ChevronDown size={13} className={SELECT_CHEVRON} />}>
                            <SelectValue placeholder={loading ? "Loading…" : "Select country"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={2} className={SELECT_PANEL}>
                          {countries.map(c => <SelectItem key={c._id} value={c._id} className={SELECT_ITEM}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <div>
                  <FormField control={form.control} name="releaseCountryIds"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Country of Release <Req /></FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            className={MULTI_BOX}
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

                <div>
                  <FormField control={form.control} name="watchFormats"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Viewing Platform <Req /></FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            className={MULTI_BOX}
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

                <div>
                  <FormField control={form.control} name="releaseLinkUrl"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Release, Broadcast or Exhibition Link <Optional /></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link to official streaming, cinema, TV, festival, press or private screener" className={I} />
                        </FormControl>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="languageId"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Primary Language <Req /></FormLabel>
                      <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                        <FormControl>
                          <SelectTrigger className={SELECT_TRIGGER} icon={<ChevronDown size={13} className={SELECT_CHEVRON} />}>
                            <SelectValue placeholder={loading ? "Loading…" : "Select language"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" sideOffset={2} className={SELECT_PANEL}>
                          {languages.map(l => <SelectItem key={l._id} value={l._id} className={SELECT_ITEM}>{l.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="productionHouse"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Production House <Req /></FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. A24, Warner Bros." className={I} /></FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="distributor"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Distributor <Optional /></FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. Netflix, Amazon" className={I} /></FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <div>
                  <FormField control={form.control} name="genreIds"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Genres <Req /></FormLabel>
                        <FormControl>
                          <MultiSelectDropdown
                            className={MULTI_BOX}
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
            <Section index={1} hidden={step !== 1}>
              <div className="space-y-8">
                {!hideActors && (
                  <>
                    <CrewList form={form} fieldName="actors" title="Actors — Lead & Supporting" label="Actor"
                      relationshipTo="Actor/Actress"
                      defaultEntry={{ ...BLANK_PERSON, role: "Actor in a leading role" }}
                      roleOptions={ACTOR_ROLES} attempt={attempt}
                      error={form.formState.errors.actors?.message} />

                    <div className="border-t border-[#141210]" />
                  </>
                )}

                <CrewList form={form} fieldName="directors" title="Director(s)" label="Director"
                  defaultEntry={{ ...BLANK_PERSON, role: "Director" }}
                  roleOptions={DIRECTOR_ROLES} attempt={attempt}
                  error={form.formState.errors.directors?.message}
                  onDuplicateEntry={duplicateDirectorAsProducer}
                  duplicateLabel="Also add as producer" />

                <div className="border-t border-[#141210]" />

                <CrewList form={form} fieldName="producers" title="Producer(s)" label="Producer"
                  defaultEntry={{ ...BLANK_PERSON, role: "Producer" }}
                  roleOptions={PRODUCER_ROLES} attempt={attempt}
                  error={form.formState.errors.producers?.message} />

                <div className="border-t border-[#141210]" />

                <CrewList form={form} fieldName="writers" title="Other — DOP, Editor, Writer, Music…" label="Credit"
                  relationshipTo="Credit"
                  defaultEntry={{ ...BLANK_PERSON }}
                  roleOptions={OTHER_ROLES} attempt={attempt}
                  minEntries={0}
                  error={form.formState.errors.writers?.message} />
              </div>
            </Section>

            {/* ── 3 · Award Nominations ── */}
            <Section index={2} hidden={step !== 2}>
              <NominationList form={form} categories={awardCategories} hideActors={hideActors} loading={loading} />
            </Section>

            {/* ── 4 · Media & Contact ── */}
            <Section index={3} hidden={step !== 3}>
              <div className="grid grid-cols-1 gap-y-6">
                <FormField control={form.control} name="potraitImageUrl"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Portrait Poster <Req /></FormLabel>
                      <FormControl>
                        <WebpImageUpload value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <p className={HELP}>WEBP only, up to 5MB.</p>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="landscapeImageUrl"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>Landscape Banner <Req /></FormLabel>
                      <FormControl>
                        <WebpImageUpload value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <p className={HELP}>WEBP only, up to 5MB.</p>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <FormField control={form.control} name="imdbUrl"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className={L}>IMDb URL <Req /></FormLabel>
                      <FormControl><Input {...field} placeholder="https://imdb.com/title/..." className={I} /></FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                {/* Trailer link + the password that so often guards it. */}
                <div className="space-y-6">
                  <FormField control={form.control} name="trailerUrl"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Downloadable trailer link with English subtitles <Req /></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://drive.google.com/... or direct .mp4 link" className={I} />
                        </FormControl>
                        <p className={HELP}>
                          Provide a direct download link (Google Drive, Dropbox, WeTransfer, etc.). If the trailer is not in English, please include English subtitles.
                        </p>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />

                  <FormField control={form.control} name="trailerHasPassword"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Is this link password-protected? <Req /></FormLabel>
                        <YesNoToggle
                          ariaLabel="Is the trailer link password-protected?"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            // Drop a password typed before switching back
                            // to "No" so it can't be submitted invisibly.
                            if (!value) form.setValue("trailerPassword", "");
                          }}
                        />
                        <p className={HELP}>
                          Many filmmakers share trailers from a protected folder. Telling us now saves a round of emails before your film can be reviewed.
                        </p>
                      </FormItem>
                    )} />

                  {form.watch("trailerHasPassword") && (
                    <FormField control={form.control} name="trailerPassword"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel className={L}>Trailer link password <Req /></FormLabel>
                          <FormControl>
                            {/* Deliberately plain text, not a password input:
                                this is a shared folder key the submitter needs
                                to check for typos, not their own credential. */}
                            <Input {...field} autoComplete="off" spellCheck={false}
                              placeholder="Password for the folder or file" className={cn(I, "font-mono")} />
                          </FormControl>
                          <p className={HELP}>
                            Visible so you can check it. Stored against your submission and seen only by our review team.
                          </p>
                          <FormMessage className={ERR} />
                        </FormItem>
                      )} />
                  )}
                </div>

                <div>
                  <PromoClipsList form={form} />
                </div>

                <div>
                  <FormField control={form.control} name="notes"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel className={L}>Additional Notes <Optional /></FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Anything else you would like us to know…"
                            rows={4}
                            maxLength={1000}
                            className={cn(I, "h-auto resize-none leading-relaxed")}
                          />
                        </FormControl>
                        <p className="text-[#6b6347] text-[12px] mt-2">{field.value?.length || 0}/1000</p>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />
                </div>

                <div className="border-t border-[#26241d] pt-6">
                  <VideoPodcast form={form} />
                </div>

                <div className="border-t border-[#26241d]" />

                <FormField control={form.control} name="contactEmail"
                  render={({ field }: { field: any }) => (
                    <FormItem className="max-w-sm">
                      <FormLabel className={L}>Contact Email <Req /></FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="you@example.com" className={I} /></FormControl>
                      <FormMessage className={ERR} />
                    </FormItem>
                  )} />

                <div>
                  <FormField control={form.control} name="agreeRights"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <div className="flex items-start gap-3 p-4 rounded-lg border border-[#26241d]">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange}
                              className="mt-0.5 border-[#3a3420] data-[state=checked]:bg-[#e6ba35] data-[state=checked]:border-[#e6ba35]" />
                          </FormControl>
                          <FormLabel className="text-[#a89f85] text-[14px] leading-relaxed font-normal cursor-pointer">
                            I confirm I have the right to submit this film to the IFFA Awards and allow IFFA Awards
                            to promote it as part of this submission. <Req />
                          </FormLabel>
                        </div>
                        <FormMessage className={ERR} />
                      </FormItem>
                    )} />
                </div>
              </div>
            </Section>

            {/* Validation summary. The tabs and sidebar mark the same steps. */}
            {invalidSteps.length > 0 && (
              <Alert className="border-red-500/30 bg-red-950/25 text-red-300 rounded-xl">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-sm">
                  <span className="font-semibold">Some required details are still missing</span> in{" "}
                  {invalidSteps.map((i) => STEPS[i].title).join(", ")}. Fields with a problem are outlined in red.
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert className="border-red-500/25 bg-red-950/25 text-red-300 rounded-xl">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-sm">
                  Something went wrong. Please check your details and try again.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center">
              {step > 0 && (
                <Button type="button" onClick={() => show(step - 1)} className={NAV_BTN}>
                  Back
                </Button>
              )}
              {step < LAST ? (
                <Button type="button" onClick={() => void goTo(step + 1)} className={cn(NAV_BTN, "ml-auto")}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={status === "submitting"} className={cn(NAV_BTN, "ml-auto")}>
                  {status === "submitting"
                    ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Submitting…</>
                    : "Submit Film"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}