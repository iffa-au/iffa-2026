import {
  joinNames,
  pickImageUrl,
} from "@/modules/events/submissions/lib/submissions";
import {
  featuredFilms as fallbackFilms,
  type FeaturedFilm,
} from "@/modules/home/data/featured-films";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const apiBase = () =>
  API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

const DEFAULT_BADGE = "Official Selection";

type ApiFeaturedFilm = {
  id?: string;
  title?: string;
  synopsis?: string;
  trailerUrl?: string;
  durationHours?: number;
  durationMinutes?: number;
  portraitImageUrl?: string;
  landscapeImageUrl?: string;
  genres?: string[];
  country?: string;
  crewDirectors?: string[];
  directors?: string[];
  badge?: string;
  titleAccent?: string;
  genre?: string;
};

type ApiResponse = {
  success?: boolean;
  /** false until staff first save the row in the CMS. */
  configured?: boolean;
  data?: ApiFeaturedFilm[];
};

/**
 * The accent is honoured only while the title still ends with it — a film
 * renamed after it was featured falls back to accenting its last word rather
 * than rendering a stale fragment. A one-word title is all accent, with
 * `titlePart1` left empty.
 */
const splitTitle = (title: string, accent?: string): [string, string] => {
  const clean = title.trim();
  const wanted = accent?.trim();
  if (wanted && clean.toLowerCase().endsWith(wanted.toLowerCase())) {
    const cut = clean.length - wanted.length;
    return [clean.slice(0, cut).trim(), clean.slice(cut).trim()];
  }
  const lastSpace = clean.lastIndexOf(" ");
  return lastSpace === -1
    ? ["", clean]
    : [clean.slice(0, lastSpace), clean.slice(lastSpace + 1)];
};

const formatRuntime = (hours?: number, minutes?: number): string => {
  const total = (hours ?? 0) * 60 + (minutes ?? 0);
  return total > 0 ? `${total} minutes` : "";
};

const mapFilm = (item: ApiFeaturedFilm, index: number): FeaturedFilm => {
  const [titlePart1, titlePart2] = splitTitle(
    item.title ?? "",
    item.titleAccent,
  );
  const directors = item.crewDirectors?.length
    ? item.crewDirectors
    : (item.directors ?? []);
  return {
    id: item.id ?? String(index),
    badge: item.badge?.trim() || DEFAULT_BADGE,
    titlePart1,
    titlePart2,
    description: item.synopsis?.trim() ?? "",
    director: joinNames(directors) ?? "",
    genre: item.genre?.trim() || (item.genres ?? []).slice(0, 2).join(" / "),
    runtime: formatRuntime(item.durationHours, item.durationMinutes),
    country: item.country ?? "",
    posterUrl: pickImageUrl(item.portraitImageUrl, item.landscapeImageUrl),
    trailerUrl: item.trailerUrl?.trim() ?? "",
  };
};

/**
 * The homepage "Featured Selection" row, as curated in cms-hub under
 * Site content → Featured films.
 *
 * Never throws. The hand-written list in `data/featured-films.ts` is served
 * when the API can't be reached, and when the row has never been saved in the
 * CMS — so the homepage keeps the current six until someone curates it. Once
 * saved, the CMS is authoritative: an emptied row returns no films and the
 * section hides.
 */
export const fetchFeaturedFilms = async (
  signal?: AbortSignal,
): Promise<FeaturedFilm[]> => {
  if (!apiBase()) return fallbackFilms;
  try {
    const response = await fetch(`${apiBase()}/featured-films`, { signal });
    if (!response.ok) {
      console.warn(`Featured films API responded ${response.status}`);
      return fallbackFilms;
    }
    const payload = (await response.json()) as ApiResponse;
    if (!payload.configured) return fallbackFilms;
    return (payload.data ?? []).map(mapFilm);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    console.warn("Failed to load featured films:", error);
    return fallbackFilms;
  }
};
