// ─── Schema ──────────────────────────────────────────────────────────────────
import { z } from "zod";
import { useEffect, useState } from "react";

const personSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  biography: z.string().min(10, "Biography must be at least 10 characters"),
  instagram: z.string().optional(),
});

/** Content type names (CMS metadata) that do not require an actors panel. */
export const CONTENT_TYPES_WITHOUT_ACTORS = [
  "Documentary",
  "Animated Film",
  "Animation",
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
      durationHours: z
        .string()
        .regex(/^\d+$/, "Must be a whole number")
        .refine((v) => Number(v) <= 10, "Please enter a realistic runtime"),
      durationMinutes: z
        .string()
        .regex(/^\d+$/, "Must be a whole number")
        .refine((v) => Number(v) <= 59, "Must be between 0 and 59"),
      contentTypeId: z.string().min(1, "Content type is required"),
      countryId: z.string().min(1, "Country is required"),
      releaseCountryIds: z
        .array(z.string())
        .min(1, "Select at least one country of release"),
      watchFormats: z
        .array(z.string())
        .min(1, "Select at least one watch format"),
      languageId: z.string().min(1, "Language is required"),
      productionHouse: z.string().min(1, "Production house is required"),
      distributor: z.string().optional(),
      genreIds: z.array(z.string()).min(1, "Select at least one genre"),
      potraitImageUrl: z.string().url("Must be a valid URL"),
      landscapeImageUrl: z.string().url("Must be a valid URL"),
      imdbUrl: z.string().url("Must be a valid IMDb URL"),
      trailerUrl: z.string().url("Must be a valid download URL"),
      actors: z.array(personSchema),
      directors: z.array(personSchema).min(1, "At least one director required"),
      producers: z.array(personSchema).min(1, "At least one producer required"),
      writers: z.array(
        z.object({
          fullName: z.string(),
          role: z.string(),
          imageUrl: z.string(),
          biography: z.string(),
          instagram: z.string().optional(),
        }),
      ),
      notes: z.string().max(1000, "Notes must be 1000 characters or less").optional(),
      contactEmail: z.string().email("Must be a valid email"),
      agreeRights: z.literal(true, {
        message: "You must confirm this declaration",
      }),
    })
    .superRefine((data, ctx) => {
      if (Number(data.durationHours) === 0 && Number(data.durationMinutes) === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["durationMinutes"],
          message: "Duration is required",
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
  imageUrl: "",
  biography: "",
  instagram: "",
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
