"use client";

import { useEffect, useState } from "react";
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
  photos: Record<string, string | null>;
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
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
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
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
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
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
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

  return (
    <div className="min-h-screen bg-black pt-28 pb-16 text-white overflow-hidden">
      <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 py-[5%] lg:flex-row container mx-auto px-4 sm:px-6">
        
        {/* Left Side: Poster */}
        <div className="w-full sm:w-3/4 lg:w-1/2 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={film.posterUrl}
            alt={`${film.title} Poster`}
            className="w-2/3 sm:w-3/4 lg:w-1/2 rounded-lg border-2 border-white/10 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-600/30"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/fallbacks/no-poster.svg";
            }}
          />
        </div>
        
        {/* Right Side: details & synopsis */}
        <div className="w-full sm:w-3/4 lg:w-1/2 flex flex-col gap-4 sm:gap-6 relative px-2 sm:px-0 z-10">
          <div className="text-2xl pt-4 sm:pt-0 sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-yellow-500 leading-tight">
            {film.title}
          </div>
          
          <div className="flex w-full flex-row text-sm sm:text-base text-yellow-400/80 flex-wrap">
            <div className="font-medium">{film.year}</div>{film.year && film.genres.length > 0 && <>&nbsp;|&nbsp;</>}
            <div className="flex flex-wrap">
              {film.genres.map((g, index) => (
                <span key={index} className="ml-2">
                  {g}
                  {index < film.genres.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>

          <div className="relative w-full max-w-[42rem]">
            <div
              className={`relative overflow-hidden transition-all duration-300 ${
                synopsisExpanded ? "pointer-events-none" : ""
              }`}
            >
              <div
                className={`text-justify text-sm sm:text-base text-white/80 bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-300 ${
                  !synopsisExpanded ? "line-clamp-3 sm:line-clamp-4" : "opacity-50"
                }`}
                onClick={handleDescriptionToggle}
              >
                {film.description
                  ? film.description.split(/\n\s*\n/).map((para, idx) => (
                      <p key={idx} className="mb-4 last:mb-0">
                        {para}
                      </p>
                    ))
                  : "No description available."}
              </div>

              {!synopsisExpanded && film.description && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none rounded-b-lg" />
              )}
            </div>

            {synopsisExpanded && film.description && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-lg p-4 sm:p-6 border-2 border-yellow-600/30 shadow-2xl transform transition-all duration-500 animate-in fade-in zoom-in-95 z-20 overflow-y-auto">
                <div className="text-justify text-sm sm:text-base text-white leading-relaxed space-y-4">
                  {film.description.split(/\n\s*\n/).map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
                <button
                  onClick={handleDescriptionToggle}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 group z-30"
                >
                  <ChevronUp className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            )}

            {film.description && (
              <button
                onClick={handleDescriptionToggle}
                className={`mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 hover:from-yellow-600/30 hover:to-yellow-500/30 text-white rounded-lg border border-yellow-600/30 hover:border-yellow-500/50 transition-all duration-300 flex items-center gap-2 relative z-30 group ${
                  synopsisExpanded ? "bg-yellow-600/30 relative mt-4 shadow-xl z-10" : ""
                }`}
              >
                <span className="font-medium">
                  {synopsisExpanded ? "Show Less" : "Read More"}
                </span>
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {synopsisExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      <CastSection cast={crew} movieId={film.movieId} />
    </div>
  );
}
