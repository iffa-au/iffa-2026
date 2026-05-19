"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Film, Users } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type SubmissionApiResponse = {
  _id?: string;
  id?: string;
  title?: string;
  synopsis?: string;
  description?: string;
  releaseDate?: string;
  portraitImageUrl?: string;
  potraitImageUrl?: string;
  portraitUrl?: string;
  landscapeImageUrl?: string;
  genreIds?: unknown[];
  genres?: unknown[];
  crew?: Record<string, unknown>;
};

export type SynopsisCrewMember = {
  castId: string;
  name: string;
  roles: string[];
  photo: string | null;
};

export type SynopsisFilm = {
  movieId: string;
  title: string;
  description: string;
  year?: number;
  genres: string[];
  posterUrl: string;
};

type SynopsisPageProps = {
  id: string;
};

const BUCKET_DEFAULT_ROLE: Record<string, string> = {
  directors: "Director",
  actors: "Actor",
  producers: "Producer",
  other: "Other",
};

const CREW_BUCKET_ORDER = ["directors", "producers", "actors", "other"] as const;

function normalizeGenres(data: SubmissionApiResponse): string[] {
  const out: string[] = [];
  const pushName = (g: unknown) => {
    if (g && typeof g === "object" && "name" in g && typeof (g as { name?: string }).name === "string") {
      const n = (g as { name: string }).name.trim();
      if (n) out.push(n);
    } else if (g != null && typeof g !== "object") {
      const n = String(g).trim();
      if (n) out.push(n);
    }
  };

  if (Array.isArray(data.genreIds)) {
    data.genreIds.forEach(pushName);
  } else if (Array.isArray(data.genres)) {
    data.genres.forEach(pushName);
  }
  return out;
}

function mapCrew(data: SubmissionApiResponse): SynopsisCrewMember[] {
  const mapped: SynopsisCrewMember[] = [];
  if (!data.crew || typeof data.crew !== "object") return mapped;

  for (const roleKey of CREW_BUCKET_ORDER) {
    const list = data.crew[roleKey];
    if (!Array.isArray(list)) continue;
    list.forEach((member: unknown, idx: number) => {
      if (!member || typeof member !== "object") return;
      const m = member as Record<string, unknown>;
      const name =
        (typeof m.name === "string" && m.name) ||
        (typeof m.fullName === "string" && m.fullName) ||
        "";
      const image =
        (typeof m.photoUrl === "string" && m.photoUrl) ||
        (typeof m.imageUrl === "string" && m.imageUrl) ||
        null;
      const roleFromMember = typeof m.role === "string" && m.role.trim() ? m.role.trim() : null;
      const roles = roleFromMember
        ? [roleFromMember]
        : [BUCKET_DEFAULT_ROLE[roleKey] ?? "Other"];
      const castId =
        (typeof m.id === "string" && m.id) ||
        (typeof m._id === "string" && m._id) ||
        `${roleKey}-${idx}`;
      mapped.push({
        castId,
        name,
        roles,
        photo: image,
      });
    });
  }
  return mapped;
}

export function mapSubmissionToSynopsis(data: SubmissionApiResponse): {
  film: SynopsisFilm;
  crew: SynopsisCrewMember[];
} {
  const submissionId = String(data._id ?? data.id ?? "");
  const portrait =
    data.portraitImageUrl ||
    data.potraitImageUrl ||
    data.portraitUrl ||
    "";
  const posterUrl =
    portrait || data.landscapeImageUrl || "/fallbacks/no-poster.svg";

  let year: number | undefined;
  if (data.releaseDate) {
    const d = new Date(data.releaseDate);
    if (!Number.isNaN(d.getTime())) year = d.getFullYear();
  }

  return {
    film: {
      movieId: submissionId,
      title: data.title ?? "",
      description: data.synopsis || data.description || "",
      year,
      genres: normalizeGenres(data),
      posterUrl,
    },
    crew: mapCrew(data),
  };
}

async function fetchSubmissionDetail(id: string, signal: AbortSignal): Promise<SubmissionApiResponse> {
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  const urls = [
    `${normalizedBase}/submissions/${encodeURIComponent(id)}`,
    `${normalizedBase}/awards/submissions/${encodeURIComponent(id)}`,
  ];

  let lastStatus = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal });
      lastStatus = res.status;
      if (!res.ok) continue;
      const data = (await res.json()) as SubmissionApiResponse;
      return data;
    } catch {
      // try next URL
    }
  }

  throw new Error(
    lastStatus === 404
      ? "Submission not found."
      : `Failed to load synopsis${lastStatus ? ` (${lastStatus})` : ""}.`
  );
}

export function SynopsisPage({ id }: SynopsisPageProps) {
  const [film, setFilm] = useState<SynopsisFilm | null>(null);
  const [crew, setCrew] = useState<SynopsisCrewMember[]>([]);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setFilm(null);
      setCrew([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const raw = await fetchSubmissionDetail(id, controller.signal);
        const { film: nextFilm, crew: nextCrew } = mapSubmissionToSynopsis(raw);
        setFilm(nextFilm);
        setCrew(nextCrew);
      } catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          setError(e.message || "Failed to load content");
        }
        setFilm(null);
        setCrew([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [id]);

  const synopsisNeedsToggle = useMemo(() => {
    if (!film?.description) return false;
    return film.description.trim().length > 220 || /\n\s*\n/.test(film.description);
  }, [film?.description]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-4 pb-16 pt-28 text-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center py-24">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#c9a227]"
            aria-hidden
          />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black px-4 pb-16 pt-28 text-white">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-14 text-center backdrop-blur-sm">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8b6914] to-[#c9a227]">
            <Film className="h-8 w-8 text-black" />
          </div>
          <h1 className="mb-3 text-xl font-semibold tracking-tight">Unable to load content</h1>
          <p className="text-sm text-white/70">{error}</p>
        </div>
      </main>
    );
  }

  if (!film) {
    return (
      <main className="min-h-screen bg-black px-4 pb-16 pt-28 text-white">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-14 text-center backdrop-blur-sm">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8b6914] to-[#c9a227]">
            <Film className="h-8 w-8 text-black" />
          </div>
          <h1 className="mb-3 text-xl font-semibold tracking-tight">Movie not found</h1>
          <p className="text-sm text-white/70">
            Sorry, we could not find the entry you are looking for.
          </p>
        </div>
      </main>
    );
  }

  const genreLine =
    film.year != null && film.genres.length > 0
      ? `${film.year} | ${film.genres.join(", ")}`
      : film.year != null
        ? String(film.year)
        : film.genres.length > 0
          ? `| ${film.genres.join(", ")}`
          : null;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 md:px-8">
        <section className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
          <div className="flex shrink-0 justify-center lg:w-[38%] lg:justify-end">
            <div className="w-full max-w-[280px] sm:max-w-[320px]">
              <img
                src={film.posterUrl}
                alt={`${film.title} poster`}
                className="w-full rounded-lg border border-white object-cover shadow-lg shadow-black/40"
                style={{ aspectRatio: "2/3" }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/fallbacks/no-poster.svg";
                }}
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 lg:pt-2">
            <h1 className="font-sans text-3xl font-bold tracking-tight text-[#d4af37] sm:text-4xl md:text-5xl">
              {film.title}
            </h1>

            {genreLine ? (
              <p className="mt-3 text-sm leading-relaxed text-[#c9a227]/95 sm:text-base">
                {genreLine}
              </p>
            ) : null}

            <div className="mt-8">
              <div
                className={`rounded-xl border border-white/10 bg-zinc-900/80 px-5 py-5 backdrop-blur-sm sm:px-6 sm:py-6 ${
                  synopsisExpanded ? "" : "relative max-h-[11.5rem] overflow-hidden sm:max-h-[13rem]"
                }`}
              >
                <div
                  className={`text-sm leading-relaxed text-white/90 sm:text-base ${
                    !synopsisExpanded && synopsisNeedsToggle ? "line-clamp-5 sm:line-clamp-6" : ""
                  }`}
                >
                  {film.description ? (
                    film.description.split(/\n\s*\n/).map((para, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-4" : ""}>
                        {para}
                      </p>
                    ))
                  ) : (
                    <p className="text-white/50">No synopsis available.</p>
                  )}
                </div>
                {!synopsisExpanded && synopsisNeedsToggle ? (
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-xl bg-gradient-to-t from-zinc-900 via-zinc-900/90 to-transparent"
                    aria-hidden
                  />
                ) : null}
              </div>

              {synopsisNeedsToggle ? (
                <button
                  type="button"
                  onClick={() => setSynopsisExpanded((v) => !v)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#6b5c2e]/60 bg-[#3d3518] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#c9a227]/50 hover:bg-[#4a4020]"
                >
                  {synopsisExpanded ? "Show less" : "Read more"}
                  {synopsisExpanded ? (
                    <ChevronUp className="h-4 w-4 opacity-90" aria-hidden />
                  ) : (
                    <ChevronDown className="h-4 w-4 opacity-90" aria-hidden />
                  )}
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-14 md:mt-20 md:pt-16">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Cast &amp; Crew
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#c9a227] to-[#8b6914]" />

          {crew.length > 0 ? (
            <div className="relative mt-10">
              <div className="-mx-1 flex gap-4 overflow-x-auto pb-4 pt-1 sm:gap-6">
                {crew.map((person) => (
                  <article
                    key={person.castId}
                    className="w-36 shrink-0 text-center sm:w-40"
                  >
                    <div className="mx-auto mb-3 h-28 w-28 overflow-hidden rounded-full border border-white/15 bg-zinc-800 sm:h-32 sm:w-32">
                      {person.photo ? (
                        <img
                          src={person.photo}
                          alt={person.name ? `${person.name} headshot` : ""}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/25">
                          <Users className="h-10 w-10" aria-hidden />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold leading-snug text-white">{person.name}</p>
                    <p className="mt-1 text-xs leading-snug text-[#c9a227]/90">
                      {person.roles.join(", ")}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-white/30" aria-hidden />
              <p className="text-sm text-white/55">Cast and crew information is not available.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
