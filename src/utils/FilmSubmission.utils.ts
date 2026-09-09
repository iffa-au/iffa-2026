// ─── Schema ──────────────────────────────────────────────────────────────────
import { z } from "zod";
import { useEffect, useState } from "react";

// Image fields hold the staged File the user confirmed in the upload
// modal — nothing is written to S3 until the whole form is submitted, at
// which point SubmitFilmForm uploads each staged file and swaps it for the
// resulting CloudFront URL before POSTing.
// `abort: false` is load-bearing. A failing `z.custom` defaults to aborting
// the *whole object's* parse, which silently skips every `.superRefine`
// check below it — so while any image was missing (i.e. on every fresh
// form), the runtime, "at least one actor" and writer-completeness rules
// never ran at all, and only appeared once the posters were attached.
const requiredWebpFile = (message: string) =>
  z.custom<File | null>((v) => v instanceof File, { message, abort: false });

/**
 * URL fields that tolerate surrounding whitespace. Filmmakers routinely
 * paste a link with a trailing space or newline, and a bare
 * `z.string().url()` rejects that with a "must be a valid URL" message that
 * reads like a lie next to a link they can see is fine.
 */
const isUrl = (v: string) => z.string().url().safeParse(v).success;

const trimmedUrl = (message: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .refine(isUrl, { message });

const optionalTrimmedUrl = (message: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v === "" || isUrl(v), { message });

const personSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  imageUrl: requiredWebpFile("Photo is required"),
  biography: z.string().min(10, "Biography must be at least 10 characters"),
  instagram: z.string().optional(),
  email: z.string().email("A valid representative email is required"),
});

/**
 * Content type names (CMS metadata) that do not require an actors panel.
 * Includes both the CMS's current (typo'd) values and their corrected
 * spellings, so this keeps matching if the CMS entry is ever renamed.
 */
export const CONTENT_TYPES_WITHOUT_ACTORS = [
  "Documentary",
  "Documentry",
  "Animated Film",
  "Animation",
  "Web Series",
  "Web Series (OTT)",
  "TV Series",
  "Short Film",
] as const;

export const WATCH_FORMAT_OPTIONS = [
  { value: "theatrical", label: "Theatrical" },
  { value: "ott", label: "OTT / Streaming" },
  { value: "tv", label: "TV" },
  { value: "festival", label: "Festival only" },
  { value: "other", label: "Other" },
] as const;

export function contentTypeHidesActors(contentTypeName?: string): boolean {
  if (!contentTypeName) return false;
  const normalized = contentTypeName.trim().toLowerCase();
  return CONTENT_TYPES_WITHOUT_ACTORS.some(
    (name) => name.toLowerCase() === normalized,
  );
}

export function buildFilmSchema(contentTypes: { _id: string; name: string }[]) {
  return z
    .object({
      title: z.string().min(1, "Film title is required"),
      synopsis: z.string().min(20, "Synopsis must be at least 20 characters"),
      releaseDate: z.string().min(1, "Release date is required"),
      // Digit-only strings (not numbers) so the field type matches what a
      // controlled <input> naturally holds — see sanitizeDurationInput in
      // SubmitFilmForm.tsx, which guarantees only digits ever land here.
      //
      // Empty is allowed by the field rules and rejected by the superRefine
      // below instead. The inputs start blank rather than pre-filled with
      // "0" so an untouched runtime reads as untouched: filmmakers were
      // leaving a pre-filled "0 h 0 min" alone because it looks answered.
      durationHours: z
        .string()
        .regex(/^\d*$/, "Numbers only")
        .refine((v) => v === "" || Number(v) <= 10, "Please enter a realistic runtime"),
      durationMinutes: z
        .string()
        .regex(/^\d*$/, "Numbers only")
        .refine((v) => v === "" || Number(v) <= 59, "Must be between 0 and 59"),
      contentTypeId: z.string().min(1, "Content type is required"),
      countryId: z.string().min(1, "Country is required"),
      releaseCountryIds: z
        .array(z.string())
        .min(1, "Select at least one country of release"),
      watchFormats: z
        .array(z.string())
        .min(1, "Select at least one watch format"),
      releaseLinkUrl: optionalTrimmedUrl("Must be a valid URL").optional(),
      languageId: z.string().min(1, "Language is required"),
      productionHouse: z.string().min(1, "Production house is required"),
      distributor: z.string().optional(),
      genreIds: z.array(z.string()).min(1, "Select at least one genre"),
      potraitImageUrl: requiredWebpFile("Portrait poster is required"),
      landscapeImageUrl: requiredWebpFile("Landscape banner is required"),
      imdbUrl: trimmedUrl("Must be a valid IMDb URL"),
      trailerUrl: trimmedUrl("Must be a valid download URL"),
      // Filmmakers often share a trailer from a password-protected folder.
      // Asking up front beats a reviewer hitting the wall and emailing back:
      // the password is required only when they say the link has one, and is
      // surfaced beside the URL in the CMS review screens.
      trailerHasPassword: z.boolean(),
      trailerPassword: z.string(),
      actors: z.array(personSchema),
      directors: z.array(personSchema).min(1, "At least one director required"),
      producers: z.array(personSchema).min(1, "At least one producer required"),
      writers: z.array(
        z.object({
          fullName: z.string(),
          role: z.string(),
          imageUrl: z.custom<File | null>(),
          biography: z.string(),
          instagram: z.string().optional(),
          email: z.string(),
        }),
      ),
      notes: z.string().max(1000, "Notes must be 1000 characters or less").optional(),
      contactEmail: z.string().email("Must be a valid email"),
      // `z.boolean().refine(...)`, not `z.literal(true)`: a failing literal
      // aborts the whole object parse and takes every `.superRefine` check
      // below down with it. Since this box starts unticked, that suppressed
      // the runtime and crew rules on every fresh form. A refine reports the
      // same message without aborting.
      agreeRights: z.boolean().refine((v) => v === true, {
        message: "You must confirm this declaration",
      }),
    })
    .superRefine((data, ctx) => {
      // A blank box and a "0" box both mean "no runtime given". The issue is
      // attached to the hours field because the form renders one shared
      // message under the whole hr/min row, reading that path first.
      const hours = data.durationHours === "" ? 0 : Number(data.durationHours);
      const minutes = data.durationMinutes === "" ? 0 : Number(data.durationMinutes);
      if (hours === 0 && minutes === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["durationHours"],
          message: "Enter the film's runtime — it can't be 0 h 0 min",
        });
      }

      if (data.trailerHasPassword && !data.trailerPassword.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["trailerPassword"],
          message: "Enter the password for the trailer link",
        });
      }

      const contentTypeName = contentTypes.find(
        (ct) => ct._id === data.contentTypeId,
      )?.name;
      if (!contentTypeHidesActors(contentTypeName) && data.actors.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["actors"],
          message: "At least one actor required",
        });
      }

      for (const [index, writer] of data.writers.entries()) {
        if (!writer.fullName.trim()) continue;
        const result = personSchema.safeParse(writer);
        if (!result.success) {
          for (const issue of result.error.issues) {
            ctx.addIssue({
              ...issue,
              path: ["writers", index, ...(issue.path ?? [])],
            });
          }
        }
      }
    });
}

export type FilmValues = z.infer<ReturnType<typeof buildFilmSchema>>;
export type PersonEntry = z.infer<typeof personSchema>;

export const BLANK_PERSON: PersonEntry = {
  fullName: "",
  role: "",
  imageUrl: null,
  biography: "",
  instagram: "",
  email: "",
};

export function filterFilledCrew(entries: PersonEntry[]): PersonEntry[] {
  return entries.filter((entry) => entry.fullName.trim().length > 0);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
interface Option {
  _id: string;
  name: string;
}
interface SubmissionOptions {
  genres: Option[];
  contentTypes: Option[];
  countries: Option[];
  languages: Option[];
  loading: boolean;
  error: Error | null;
}

export function useSubmissionOptions(baseUrl: string): SubmissionOptions {
  const [genres, setGenres] = useState<Option[]>([]);
  const [contentTypes, setContentTypes] = useState<Option[]>([]);
  const [countries, setCountries] = useState<Option[]>([]);
  const [languages, setLanguages] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchList = async (path: string): Promise<Option[]> => {
      const res = await fetch(`${baseUrl}/${path}`);
      if (!res.ok) throw new Error(`Failed to fetch ${path}`);
      const json = await res.json();
      const arr = Array.isArray(json?.data)
        ? json.data
        : Array.isArray(json)
          ? json
          : [];
      return arr.map((x: { _id: string; name: string }) => ({
        _id: x._id,
        name: x.name,
      }));
    };
    (async () => {
      try {
        setLoading(true);
        const [g, ct, lang, ctry] = await Promise.all([
          fetchList("genres"),
          fetchList("content-types"),
          fetchList("languages"),
          fetchList("countries"),
        ]);
        if (cancelled) return;
        setGenres(g);
        setContentTypes(ct);
        setLanguages(lang);
        setCountries(ctry);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  return { genres, contentTypes, countries, languages, loading, error };
}
