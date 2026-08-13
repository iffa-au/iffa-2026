"use client";

import { useEffect, useRef, useState } from "react";
import { Film, Play } from "lucide-react";
import {
  formatDuration,
  getYouTubeEmbedUrl,
  pickImageUrl,
} from "@/modules/events/submissions/lib/submissions";
import TrailerModal from "@/modules/home/ui/views/carousel/TrailerModal";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";

type NamedRef = { _id?: string; name?: string };

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
  contentType?: NamedRef;
  language?: NamedRef;
  country?: NamedRef;
  productionHouse?: string;
};

export type CrewPerson = {
  id: string;
  name: string;
  role: string;
  photo: string | null;
};

export type SynopsisCrew = {
  directors: CrewPerson[];
  producers: CrewPerson[];
  actors: CrewPerson[];
  other: CrewPerson[];
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
  country?: string;
  language?: string;
  format?: string;
  productionHouse?: string;
  director?: string;
  trailerEmbedUrl: string | null;
};

type SynopsisPageProps = {
  id: string;
};

const BUCKET_DEFAULT_ROLE: Record<string, string> = {
  directors: "Director",
  actors: "Actor",
  producers: "Producer",
  other: "Crew",
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

  if (Array.isArray(data.genres)) {
    data.genres.forEach(pushName);
  } else if (Array.isArray(data.genreIds)) {
    data.genreIds.forEach(pushName);
  }
  return out;
}

function mapCrewGroup(list: unknown, bucket: (typeof CREW_BUCKET_ORDER)[number]): CrewPerson[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((member: unknown, idx: number): CrewPerson | null => {
      if (!member || typeof member !== "object") return null;
      const m = member as Record<string, unknown>;
      const name =
        (typeof m.name === "string" && m.name) ||
        (typeof m.fullName === "string" && m.fullName) ||
        "";
      if (!name.trim()) return null;
      const photo =
        (typeof m.photoUrl === "string" && m.photoUrl) ||
        (typeof m.imageUrl === "string" && m.imageUrl) ||
        null;
      const roleFromMember = typeof m.role === "string" && m.role.trim() ? m.role.trim() : null;
      const id =
        (typeof m.id === "string" && m.id) ||
        (typeof m._id === "string" && m._id) ||
        `${bucket}-${idx}`;
      return {
        id,
        name: name.trim(),
        role: roleFromMember ?? BUCKET_DEFAULT_ROLE[bucket],
        photo,
      };
    })
    .filter((p): p is CrewPerson => p !== null);
}

function mapCrew(data: SubmissionApiResponse): SynopsisCrew {
  const crew = data.crew && typeof data.crew === "object" ? data.crew : {};
  const result = {} as SynopsisCrew;
  for (const bucket of CREW_BUCKET_ORDER) {
    result[bucket] = mapCrewGroup(crew[bucket as keyof typeof crew], bucket);
  }
  return result;
}

function joinNames(names: string[]): string | undefined {
  if (names.length === 0) return undefined;
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

export function mapSubmissionToSynopsis(data: SubmissionApiResponse): {
  film: SynopsisFilm;
  crew: SynopsisCrew;
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

  const crew = mapCrew(data);
  const productionHouse =
    typeof data.productionHouse === "string" && data.productionHouse.trim()
      ? data.productionHouse.trim()
      : undefined;

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
      country: data.country?.name,
      language: data.language?.name,
      format: data.contentType?.name,
      productionHouse,
      director: joinNames(crew.directors.map((d) => d.name)),
      trailerEmbedUrl: getYouTubeEmbedUrl(data.trailerUrl),
    },
    crew,
  };
}

async function fetchSubmissionDetail(id: string, signal: AbortSignal): Promise<SubmissionApiResponse> {
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  // The overview endpoint resolves language/country/content-type names and
  // production house — the bare endpoints below leave those as raw ids, so
  // it's tried first and the others are kept only as a resilience fallback.
  const attempts: Array<{ url: string; unwrap: boolean }> = [
    { url: `${normalizedBase}/submissions/${encodeURIComponent(id)}/overview`, unwrap: true },
    { url: `${normalizedBase}/submissions/${encodeURIComponent(id)}`, unwrap: false },
    { url: `${normalizedBase}/awards/submissions/${encodeURIComponent(id)}`, unwrap: false },
  ];

  let lastStatus = 0;
  for (const attempt of attempts) {
    try {
      const res = await fetch(attempt.url, { signal });
      lastStatus = res.status;
      if (!res.ok) continue;
      const json = await res.json();
      const data = attempt.unwrap ? json?.data : json;
      if (data) return data as SubmissionApiResponse;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") throw e;
      // try next URL
    }
  }

  throw new Error(
    lastStatus === 404
      ? "Submission not found."
      : `Failed to load synopsis${lastStatus ? ` (${lastStatus})` : ""}.`
  );
}

// A faint fractal-noise data URI, layered over the hero backdrop at very low
// opacity so the cinematic wash reads as film grain rather than flat color.
const GRAIN_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
)}")`;

function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-500">
      {children}
    </span>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

function CrewAvatar({ person, size }: { person: CrewPerson; size: "lg" | "sm" }) {
  const [failed, setFailed] = useState(false);
  const dims = size === "lg" ? "h-16 w-16 sm:h-20 sm:w-20" : "h-12 w-12 sm:h-14 sm:w-14";

  if (!person.photo || failed) {
    return (
      <div
        className={cn(
          dims,
          "flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/4 text-white/50"
        )}
        style={{ fontFamily: SERIF }}
      >
        <span className={size === "lg" ? "text-lg" : "text-sm"}>{initials(person.name)}</span>
      </div>
    );
  }
  return (
    <div className={cn(dims, "shrink-0 overflow-hidden rounded-full border border-white/10 bg-black")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={person.photo}
        alt=""
        className="h-full w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function FeaturedCredit({ person }: { person: CrewPerson }) {
  return (
    <div className="group flex items-center gap-4 sm:gap-5">
      <CrewAvatar person={person} size="lg" />
      <div className="min-w-0">
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-yellow-500/80">{person.role}</p>
        <h3
          className="mt-1 text-xl font-bold leading-tight text-white sm:text-2xl"
          style={{ fontFamily: SERIF }}
        >
          {person.name}
        </h3>
      </div>
    </div>
  );
}

function Credit({ person }: { person: CrewPerson }) {
  return (
    <div className="group flex items-center gap-3">
      <CrewAvatar person={person} size="sm" />
      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-yellow-500/70">{person.role}</p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-white sm:text-base">{person.name}</p>
      </div>
    </div>
  );
}

function CrewSection({ crew }: { crew: SynopsisCrew }) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();
  const supporting = [...crew.producers, ...crew.actors, ...crew.other];
  const isEmpty = crew.directors.length === 0 && supporting.length === 0;

  return (
    <section
      ref={ref}
      className={cn(
        "relative border-t border-white/[0.06] bg-gradient-to-b from-black to-[#0b0a08] py-20 transition-all duration-700 ease-out sm:py-28",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mb-12 sm:mb-16">
          <SectionEyebrow>Crew</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: SERIF }}>
            The People Behind the Film
          </h2>
          <div className="mt-6 h-px w-16 bg-gradient-to-r from-yellow-500 to-transparent" />
        </div>

        {isEmpty ? (
          <p className="text-sm text-white/50">Crew details have not been published for this title yet.</p>
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {crew.directors.length > 0 && (
              <div
                className={cn(
                  "grid gap-x-10 gap-y-8",
                  crew.directors.length > 1 ? "sm:grid-cols-2" : "sm:max-w-md"
                )}
              >
                {crew.directors.map((d) => (
                  <FeaturedCredit key={d.id} person={d} />
                ))}
              </div>
            )}

            {supporting.length > 0 && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
                {supporting.map((p) => (
                  <Credit key={p.id} person={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function SynopsisSection({ description }: { description: string }) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();
  const paragraphs = description ? description.split(/\n\s*\n/).filter(Boolean) : [];

  return (
    <section
      ref={ref}
      className={cn(
        "relative border-t border-white/[0.06] bg-black py-20 transition-all duration-700 ease-out sm:py-28",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mb-10 sm:mb-14">
          <SectionEyebrow>Synopsis</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: SERIF }}>
            The Story
          </h2>
          <div className="mt-6 h-px w-16 bg-gradient-to-r from-yellow-500 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-3 -top-10 select-none text-[8rem] leading-none text-white/[0.05] sm:-left-6 sm:-top-14 sm:text-[10rem]"
            style={{ fontFamily: SERIF }}
          >
            &ldquo;
          </span>
          <div className="relative border-l border-white/10 pl-6 sm:pl-10">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="mb-6 text-lg leading-[1.9] text-white/80 last:mb-0 sm:text-xl"
                >
                  {para}
                </p>
              ))
            ) : (
              <p className="text-lg text-white/50 sm:text-xl">No description available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">{label}</p>
      <p className="mt-1 text-base font-medium text-white sm:text-lg">{value}</p>
    </div>
  );
}

function HeroSection({
  film,
  mounted,
  onWatchTrailer,
}: {
  film: SynopsisFilm;
  mounted: boolean;
  onWatchTrailer: () => void;
}) {
  const metaFields: Array<{ label: string; value?: string }> = [
    { label: "Country of Origin", value: film.country },
    { label: "Release Year", value: film.year ? String(film.year) : undefined },
    { label: "Duration", value: film.duration },
    { label: "Format", value: film.format },
    { label: "Primary Language", value: film.language },
    { label: "Production House", value: film.productionHouse },
  ].filter((f) => f.value);

  return (
    <section className="relative overflow-hidden">
      {/* Ambient cinematic wash behind the whole hero — not a boxed banner */}
      <div className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={film.backdropUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-110 object-cover opacity-55 blur-xl"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Darkens left-to-right so the metadata column (right, on desktop)
            stays legible without flattening the backdrop's color entirely. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/55 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_70%,black_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_DATA_URI }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          {/* Poster */}
          <div
            className={cn(
              "relative mx-auto w-48 transition-all duration-700 ease-out sm:w-64 lg:mx-0 lg:w-full",
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-yellow-500/10 blur-3xl" />
            <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={film.posterUrl}
                alt={`${film.title} poster`}
                className="aspect-[2/3] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/fallbacks/no-poster.svg";
                }}
              />
            </div>
          </div>

          {/* Identity + metadata */}
          <div
            className={cn(
              "text-center transition-all delay-100 duration-700 ease-out lg:text-left",
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <SectionEyebrow>Film</SectionEyebrow>
            <h1
              className="mt-4 text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: SERIF }}
            >
              {film.title}
            </h1>

            {film.director && (
              <p className="mt-4 text-base text-white/60 sm:text-lg">
                Directed by <span className="text-white/90">{film.director}</span>
              </p>
            )}

            {metaFields.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-white/10 pt-8 text-left sm:max-w-lg lg:mx-0">
                {metaFields.map((f) => (
                  <MetaField key={f.label} label={f.label} value={f.value} />
                ))}
              </div>
            )}

            {film.genres.length > 0 && (
              <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
                {film.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/70"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {film.trailerEmbedUrl && (
              <button
                onClick={onWatchTrailer}
                className="mt-9 inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-yellow-400"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusScreen({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  message?: string;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-white sm:text-2xl" style={{ fontFamily: SERIF }}>
        {title}
      </h2>
      {message && <p className="mt-3 max-w-sm text-sm text-white/60">{message}</p>}
    </div>
  );
}

export function SynopsisPage({ id }: SynopsisPageProps) {
  const [film, setFilm] = useState<SynopsisFilm | null>(null);
  const [crew, setCrew] = useState<SynopsisCrew>({ directors: [], producers: [], actors: [], other: [] });
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!id) {
      setTimeout(() => {
        setFilm(null);
        setCrew({ directors: [], producers: [], actors: [], other: [] });
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
        setCrew({ directors: [], producers: [], actors: [], other: [] });
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (loading || !film) return;
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, [loading, film]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <StatusScreen
          icon={<Film className="h-7 w-7 animate-pulse text-yellow-500" />}
          title="Loading Film Details…"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <StatusScreen
          icon={<Film className="h-7 w-7 text-yellow-500" />}
          title="Unable to Load This Title"
          message={error}
        />
      </div>
    );
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-black">
        <StatusScreen
          icon={<Film className="h-7 w-7 text-yellow-500" />}
          title="Film Not Found"
          message="Sorry, we could not find the film you are looking for."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection film={film} mounted={mounted} onWatchTrailer={() => setIsTrailerOpen(true)} />
      <SynopsisSection description={film.description} />
      <CrewSection crew={crew} />

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        embedUrl={film.trailerEmbedUrl}
        title={film.title}
      />
    </div>
  );
}
