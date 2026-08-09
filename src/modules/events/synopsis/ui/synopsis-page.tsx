"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Film, Play, Users } from "lucide-react";
import {
  formatDuration,
  getYouTubeEmbedUrl,
  pickImageUrl,
} from "@/modules/events/submissions/lib/submissions";
import TrailerModal from "@/modules/home/ui/views/carousel/TrailerModal";

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
  durationHours?: number;
  durationMinutes?: number;
  trailerUrl?: string;
};

export type SynopsisCrewMember = {
  castId: string;
  name: string;
  roles: string[];
  photo: string | null;
  photos: Record<string, string | null>;
};

export type SynopsisFilm = {
  movieId: string;
  title: string;
  description: string;
  year?: number;
  genres: string[];
  posterUrl: string;
  backdropUrl: string;
  duration?: string;
  trailerEmbedUrl: string | null;
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

function mapCrew(data: SubmissionApiResponse, movieId: string): SynopsisCrewMember[] {
  const mapped: SynopsisCrewMember[] = [];
  if (!data.crew || typeof data.crew !== "object") return mapped;

  for (const roleKey of CREW_BUCKET_ORDER) {
    const list = data.crew[roleKey as keyof typeof data.crew];
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
        photos: movieId ? { [movieId]: image } : {},
      });
    });
  }

  // Deduplicate and merge roles just in case someone is listed multiple times
  const uniqueMap = new Map<string, SynopsisCrewMember>();
  mapped.forEach((m) => {
    if (uniqueMap.has(m.castId)) {
      const existing = uniqueMap.get(m.castId)!;
      const mergedRoles = Array.from(new Set([...existing.roles, ...m.roles]));
      uniqueMap.set(m.castId, { ...existing, roles: mergedRoles, photo: existing.photo || m.photo, photos: { ...existing.photos, ...m.photos } });
    } else {
      uniqueMap.set(m.castId, m);
    }
  });

  return Array.from(uniqueMap.values());
}

export function mapSubmissionToSynopsis(data: SubmissionApiResponse): {
  film: SynopsisFilm;
  crew: SynopsisCrewMember[];
} {
  const submissionId = String(data._id ?? data.id ?? "");
  const posterUrl = pickImageUrl(
    data.portraitImageUrl,
    data.potraitImageUrl,
    data.portraitUrl,
    data.landscapeImageUrl
  );
  const backdropUrl = pickImageUrl(
    data.landscapeImageUrl,
    data.portraitImageUrl,
    data.potraitImageUrl,
    data.portraitUrl
  );

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
      backdropUrl,
      duration: formatDuration(data.durationHours, data.durationMinutes),
      trailerEmbedUrl: getYouTubeEmbedUrl(data.trailerUrl),
    },
    crew: mapCrew(data, submissionId),
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

// Support components for UI

const getAvatarUrl = (name: string) => {
  const formattedName = name.replace(/ /g, "+");
  return `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
};

const RoleBadgeList = ({ roles }: { roles: string[] }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleRoles = showAll ? roles : roles.slice(0, 3);
  const hiddenCount = roles.length - 3;

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {visibleRoles.map((role, idx) => (
        <span
          key={idx}
          className="px-2 sm:px-3 py-1 bg-white/10 text-white/90 rounded-full text-xs sm:text-sm font-medium border border-white/20 backdrop-blur-sm truncate max-w-full"
        >
          {role}
        </span>
      ))}

      {roles.length > 3 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAll(!showAll)
          }}
          className="px-2 sm:px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs sm:text-sm font-medium border border-white/10"
        >
          {showAll ? "Show less" : `+${hiddenCount}`}
        </button>
      )}
    </div>
  );
};

const CastCard = ({ person, movieId }: { person: SynopsisCrewMember; movieId: string }) => {
  const photoPath = (person.photos?.[movieId] || person.photo) ?? null;

  const handleCastClick = () => {
    // router.push(`/cast/${person.castId}?from=${movieId}`); 
    // Left empty or routed to a generic endpoint if cast routes don't exist yet
  };

  return (
    <div
      onClick={() => handleCastClick()}
      className="flex-shrink-0 w-48 sm:w-56 md:w-64 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg flex flex-col cursor-pointer"
    >
      {/* Photo Section */}
      <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoPath || getAvatarUrl(person.name)}
          alt={person.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = getAvatarUrl(person.name);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-base sm:text-lg leading-tight drop-shadow-lg line-clamp-2">
            {person.name}
          </h3>
        </div>
      </div>

      {/* Roles Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-end">
        <RoleBadgeList roles={person.roles} />
      </div>
    </div>
  );
};

const CastSection = ({ cast, movieId }: { cast: SynopsisCrewMember[]; movieId: string }) => {
  // Define sort logic (Directors first, then Producers, then Actors, then other)
  const roleWeights: Record<string, number> = {
    Director: 1,
    Producer: 2,
    Actor: 3,
  };
  
  const sortedCast = [...cast].sort((a, b) => {
    const wA = Math.min(...a.roles.map(r => roleWeights[r] || 99));
    const wB = Math.min(...b.roles.map(r => roleWeights[r] || 99));
    if (wA !== wB) return wA - wB;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="py-8 sm:py-12 lg:py-16 w-full">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white hover:opacity-90">
            <span>Cast & Crew</span>
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full" />
        </div>

        {sortedCast.length > 0 ? (
          <div className="relative">
            <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scrollbar-thin scrollbar-thumb-yellow-600/50 scrollbar-track-white/10 px-2 min-h-[300px]">
              {sortedCast.map((person) => (
                <CastCard key={person.castId} person={person} movieId={movieId} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10">
            <Users className="w-12 sm:w-16 h-12 sm:h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-base sm:text-lg">Cast and crew information not available</p>
          </div>
        )}
      </div>
    </div>
  );
};


export function SynopsisPage({ id }: SynopsisPageProps) {
  const [film, setFilm] = useState<SynopsisFilm | null>(null);
  const [crew, setCrew] = useState<SynopsisCrewMember[]>([]);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      // Defer synchronous state update to avoid cascading effect renders warning
      setTimeout(() => {
        setFilm(null);
        setCrew([]);
        setLoading(false);
      }, 0);
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

  const handleDescriptionToggle = () => {
    setSynopsisExpanded(!synopsisExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <Film className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">Loading Film Details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Film className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">Unable to load content</h2>
          <p className="text-white/70 mb-8">{error}</p>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center bg-white/5 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Film className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">Movie not found</h2>
          <p className="text-white/70 mb-8">
            Sorry, we could not find the movie you are looking for.
          </p>
        </div>
      </div>
    );
  }

  const metaParts = [
    film.year ? String(film.year) : null,
    film.duration ?? null,
    film.genres.length > 0 ? film.genres.join(", ") : null,
  ].filter((part): part is string => Boolean(part));

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero backdrop */}
      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden sm:h-[52vh] lg:h-[62vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={film.backdropUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-50 blur-[2px]"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />
      </div>

      {/* Poster + title, overlapping the backdrop */}
      <div className="container relative z-10 mx-auto -mt-24 px-4 pb-4 sm:-mt-32 sm:px-6 lg:-mt-40">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          <div className="mx-auto w-40 shrink-0 sm:mx-0 sm:w-48 lg:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={film.posterUrl}
              alt={`${film.title} Poster`}
              className="w-full rounded-xl border-2 border-white/10 shadow-2xl shadow-black/50"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/fallbacks/no-poster.svg";
              }}
            />
          </div>

          <div className="min-w-0 flex-1 text-center sm:pb-2 sm:text-left">
            <span className="inline-flex items-center rounded-md bg-yellow-500 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-black">
              IFFA Selection
            </span>
            <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl xl:text-5xl">
              {film.title}
            </h1>

            {metaParts.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm text-white/70 sm:justify-start sm:text-base">
                {metaParts.map((part, idx) => (
                  <span key={idx} className="flex items-center gap-2.5">
                    {idx > 0 && <span className="text-white/30">&bull;</span>}
                    {part}
                  </span>
                ))}
              </div>
            )}

            {film.trailerEmbedUrl && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-yellow-400"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Trailer
              </button>
            )}
          </div>
        </div>

        {/* Synopsis */}
        <div className="mx-auto mt-10 max-w-3xl sm:mx-0 sm:mt-14">
          <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">Synopsis</h2>
          <div className="relative">
            <div
              className={`text-sm leading-relaxed text-white/80 sm:text-base ${
                !synopsisExpanded ? "line-clamp-4" : ""
              }`}
            >
              {film.description
                ? film.description.split(/\n\s*\n/).map((para, idx) => (
                    <p key={idx} className="mb-4 last:mb-0">
                      {para}
                    </p>
                  ))
                : "No description available."}
            </div>
          </div>

          {film.description && (
            <button
              onClick={handleDescriptionToggle}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-yellow-500 transition-colors hover:text-yellow-400"
            >
              {synopsisExpanded ? "Show Less" : "Read More"}
              {synopsisExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      <CastSection cast={crew} movieId={film.movieId} />

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        embedUrl={film.trailerEmbedUrl}
        title={film.title}
      />
    </div>
  );
}
