import { isValidMediaUrl } from "@/modules/events/submissions/lib/submissions";
import { fallbackTrailers, type HomepageTrailer } from "@/modules/home/data/homepage-trailers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const apiBase = () => (API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL);

/** The homepage has five trailer slots; the API caps at five too. */
export const TRAILER_SLOTS = 5;

type ApiTrailer = { id?: string; title?: string; videoUrl?: string; youtubeUrl?: string; learnMoreUrl?: string };
type ApiResponse = { success?: boolean; configured?: boolean; data?: ApiTrailer[] };

const mapTrailer = (item: ApiTrailer, index: number): HomepageTrailer | null => {
  const videoUrl = item.videoUrl?.trim() ?? "";
  if (!isValidMediaUrl(videoUrl)) return null; // a slot with nothing playable is left empty
  return {
    id: item.id ?? String(index),
    title: item.title?.trim() ?? "",
    videoUrl,
    youtubeUrl: item.youtubeUrl?.trim() || undefined,
    learnMoreUrl: item.learnMoreUrl?.trim() || undefined,
  };
};

/**
 * The homepage trailer slots, as curated in cms-hub under Site content →
 * Homepage trailers. Never throws (except AbortError): any failure, and a list
 * never saved in the CMS, serves today's hardcoded five.
 */
export const fetchHomepageTrailers = async (signal?: AbortSignal): Promise<HomepageTrailer[]> => {
  if (!apiBase()) return fallbackTrailers;
  try {
    const response = await fetch(`${apiBase()}/homepage-trailers`, { signal });
    if (!response.ok) {
      console.warn(`Homepage trailers API responded ${response.status}`);
      return fallbackTrailers;
    }
    const payload = (await response.json()) as ApiResponse;
    if (!payload.configured) return fallbackTrailers;
    return (payload.data ?? [])
      .slice(0, TRAILER_SLOTS)
      .map(mapTrailer)
      .filter((t): t is HomepageTrailer => t !== null);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    console.warn("Failed to load homepage trailers:", error);
    return fallbackTrailers;
  }
};
