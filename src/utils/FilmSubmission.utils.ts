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

export const filmSchema = z.object({
  title: z.string().min(1, "Film title is required"),
  synopsis: z.string().min(20, "Synopsis must be at least 20 characters"),
  releaseDate: z.string().min(1, "Release date is required"),
  contentTypeId: z.string().min(1, "Content type is required"),
  countryId: z.string().min(1, "Country is required"),
  languageId: z.string().min(1, "Language is required"),
  productionHouse: z.string().min(1, "Production house is required"),
  distributor: z.string().optional(),
  genreIds: z.array(z.string()).min(1, "Select at least one genre"),
  potraitImageUrl: z.string().url("Must be a valid URL"),
  landscapeImageUrl: z.string().url("Must be a valid URL"),
  imdbUrl: z.string().url("Must be a valid IMDb URL"),
  trailerUrl: z.string().url("Must be a valid URL"),
  actors: z.array(personSchema).min(1, "At least one actor required"),
  directors: z.array(personSchema).min(1, "At least one director required"),
  producers: z.array(personSchema).min(1, "At least one producer required"),
  writers: z.array(personSchema).min(1, "At least one other crew required"),
  contactEmail: z.string().email("Must be a valid email"),
  agreeRights: z.literal(true, {
  message: "You must confirm this declaration",
}),
});

export type FilmValues = z.infer<typeof filmSchema>;
export type PersonEntry = z.infer<typeof personSchema>;

export const BLANK_PERSON: PersonEntry = {
  fullName: "", role: "", imageUrl: "", biography: "", instagram: "",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
interface Option { _id: string; name: string }
interface SubmissionOptions {
  genres: Option[]; contentTypes: Option[]; countries: Option[]; languages: Option[];
  loading: boolean; error: Error | null;
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
      const arr = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      return arr.map((x: any) => ({ _id: x._id, name: x.name }));
    };
    (async () => {
      try {
        setLoading(true);
        const [g, ct, lang, ctry] = await Promise.all([
          fetchList("genres"), fetchList("content-types"),
          fetchList("languages"), fetchList("countries"),
        ]);
        if (cancelled) return;
        setGenres(g); setContentTypes(ct); setLanguages(lang); setCountries(ctry);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [baseUrl]);

  return { genres, contentTypes, countries, languages, loading, error };
}