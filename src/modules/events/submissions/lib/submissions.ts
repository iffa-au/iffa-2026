const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;
const FALLBACK_POSTER = "/fallbacks/no-poster.svg";

/**
 * CMS data entry can put a bare domain (e.g. "www.example.com") into an
 * image-URL field. Rendered as-is in an <img src>, the browser treats that
 * as a relative path and requests it against the current page route —
 * producing a bogus 404 against the app router instead of a broken image.
 */
export const isValidMediaUrl = (value?: string): value is string =>
  !!value && /^(https?:\/\/|\/)/i.test(value);

export const pickImageUrl = (
  ...candidates: (string | undefined)[]
): string => {
  for (const candidate of candidates) {
    if (isValidMediaUrl(candidate)) return candidate;
  }
  return FALLBACK_POSTER;
};

export type SubmissionApiItem = {
  id?: unknown;
  contentId?: unknown;
  submissionId?: unknown;
  _id?: unknown;
  title?: string;
  portraitImageUrl?: string;
  landscapeImageUrl?: string;
  directors?: string[];
  crewDirectors?: string[];
  genre?: string;
  genres?: string[];
  durationHours?: number;
  durationMinutes?: number;
  cast?: string[];
  description?: string;
  synopsis?: string;
  logline?: string;
  trailerUrl?: string;
  trailer?: string;
  youtubeUrl?: string;
  submissionYear?: number;
  featuredOrder?: number;
};

export function joinNames(names: string[]): string | undefined {
  const cleaned = names.map((n) => n.trim()).filter(Boolean);
  if (cleaned.length === 0) return undefined;
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} & ${cleaned[1]}`;
  return `${cleaned.slice(0, -1).join(", ")} & ${cleaned[cleaned.length - 1]}`;
}

export type FilmCardItem = {
  movieId: string;
  contentId?: string;
  submissionObjectId?: string;
  title: string;
  posterUrl: string;
  directors: string[];
  year?: string;
  genre?: string;
  duration?: string;
  cast?: string[];
  description?: string;
  trailerUrl?: string;
};

export const formatDuration = (
  hours?: number,
  minutes?: number
): string | undefined => {
  if (!hours && !minutes) return undefined;
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  return parts.join(" ");
};

const getYouTubeEmbedUrl = (parsed: URL): string | null => {
  let videoId: string | null = null;

  if (parsed.hostname.includes("youtu.be")) {
    videoId = parsed.pathname.slice(1);
  } else if (parsed.hostname.includes("youtube.com")) {
    videoId = parsed.pathname.startsWith("/embed/")
      ? parsed.pathname.split("/embed/")[1]
      : parsed.searchParams.get("v");
  }

  return videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : null;
};

/**
 * Drive file ids are opaque, but always a run of url-safe characters long
 * enough not to collide with the literal path segments around them.
 */
const DRIVE_FILE_ID = /^[\w-]{10,}$/;

/**
 * Google Drive share links come in several shapes — `/file/d/<id>/view`,
 * the legacy `/open?id=`, and the `/uc?id=` download form. All of them embed
 * through the same `/file/d/<id>/preview` player.
 *
 * The file must be shared "Anyone with the link" — a restricted file renders
 * a Google sign-in page inside the iframe instead of the video.
 */
const getGoogleDriveEmbedUrl = (parsed: URL): string | null => {
  if (!/(^|\.)(drive|docs)\.google\.com$/.test(parsed.hostname)) return null;

  const segments = parsed.pathname.split("/").filter(Boolean);
  const afterFileD =
    segments[0] === "file" && segments[1] === "d" ? segments[2] : undefined;
  const fileId = afterFileD ?? parsed.searchParams.get("id") ?? undefined;

  return fileId && DRIVE_FILE_ID.test(fileId)
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : null;
};

/**
 * Resolves whatever the CMS holds in `trailerUrl` into something an <iframe>
 * can play, or null when the link isn't embeddable (a Dropbox or WeTransfer
 * download, say) — callers hide their trailer button on null.
 */
export const getTrailerEmbedUrl = (url?: string): string | null => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    return getYouTubeEmbedUrl(parsed) ?? getGoogleDriveEmbedUrl(parsed);
  } catch {
    return null;
  }
};

export const isObjectId = (value?: string | null): value is string =>
  typeof value === "string" && OBJECT_ID_REGEX.test(value);

const coerceMongoIdString = (value: unknown): string | undefined => {
  if (typeof value === "string" && isObjectId(value)) return value;
  if (
    value &&
    typeof value === "object" &&
    "$oid" in value &&
    typeof (value as { $oid?: unknown }).$oid === "string" &&
    isObjectId((value as { $oid: string }).$oid)
  ) {
    return (value as { $oid: string }).$oid;
  }
  return undefined;
};

const pickMongoSubmissionId = (item: SubmissionApiItem): string | undefined =>
  coerceMongoIdString(item.id) ??
  coerceMongoIdString(item.submissionId) ??
  coerceMongoIdString(item._id);

const pickContentId = (item: SubmissionApiItem): string | undefined => {
  if (item.contentId != null) return String(item.contentId);
  if (item.id != null) {
    if (typeof item.id === "object") return undefined;
    const idStr = String(item.id);
    if (idStr && !isObjectId(idStr)) return idStr;
  }
  return undefined;
};

export const mapSubmissionFilmListItem = (
  item: SubmissionApiItem,
  year?: string
): FilmCardItem => {
  const submissionObjectId = pickMongoSubmissionId(item);
  const contentId = pickContentId(item);
  return {
    movieId: submissionObjectId ?? contentId ?? "",
    contentId,
    submissionObjectId,
    title: item.title ?? "",
    posterUrl: pickImageUrl(item.portraitImageUrl, item.landscapeImageUrl),
    directors: Array.isArray(item.directors) ? item.directors : [],
    year,
    genre: item.genre ?? item.genres?.join(" / "),
    duration: formatDuration(item.durationHours, item.durationMinutes),
    cast: Array.isArray(item.cast) ? item.cast : undefined,
    description: item.description ?? item.synopsis ?? item.logline,
    trailerUrl: item.trailerUrl ?? item.trailer ?? item.youtubeUrl,
  };
};

export const synopsisHrefForFilm = (film: FilmCardItem): string | null => {
  const id =
    film.submissionObjectId ?? (isObjectId(film.movieId) ? film.movieId : null);
  return id ? `/synopsis/${id}` : null;
};

export const filmActionKey = (film: FilmCardItem): string | undefined =>
  film.submissionObjectId ?? film.contentId ?? film.movieId;

const getApiBase = () =>
  API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

const buildSubmissionsUrl = (path: string, year: string) =>
  `${getApiBase()}${path}?year=${encodeURIComponent(year)}`;

/**
 * The submissions endpoint has been observed returning either a bare array
 * or a `{ data: [...] }` envelope — normalize both to a plain item array.
 */
const normalizeSubmissionsPayload = (payload: unknown): SubmissionApiItem[] => {
  if (Array.isArray(payload)) return payload as SubmissionApiItem[];
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: SubmissionApiItem[] }).data ?? [];
  }
  return [];
};

const fetchSubmissionsList = async (
  url: string,
  signal?: AbortSignal
): Promise<SubmissionApiItem[]> => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch submissions (${response.status})`);
  }
  const payload: unknown = await response.json();
  return normalizeSubmissionsPayload(payload);
};

export const fetchSubmissionsForYear = async (
  year: string,
  signal?: AbortSignal
): Promise<FilmCardItem[]> => {
  const items = await fetchSubmissionsList(
    buildSubmissionsUrl("/submissions", year),
    signal
  );
  return items.map((item) => mapSubmissionFilmListItem(item, year));
};

export type CarouselFilmItem = {
  movieId: string;
  title: string;
  backdropUrl: string;
  posterUrl: string;
  director?: string;
  year?: number;
  genres: string[];
  cast?: string[];
  description?: string;
  duration?: string;
  trailerEmbedUrl: string | null;
};

const mapSubmissionToCarouselItem = (item: SubmissionApiItem): CarouselFilmItem => {
  const movieId = coerceMongoIdString(item.id) ?? coerceMongoIdString(item._id) ?? "";
  const directors = item.crewDirectors?.length ? item.crewDirectors : item.directors ?? [];
  return {
    movieId,
    title: item.title ?? "",
    backdropUrl: pickImageUrl(item.landscapeImageUrl, item.portraitImageUrl),
    posterUrl: pickImageUrl(item.portraitImageUrl, item.landscapeImageUrl),
    director: joinNames(directors),
    year: item.submissionYear,
    genres: item.genres ?? [],
    cast: item.cast,
    description: item.description ?? item.synopsis ?? item.logline,
    duration: formatDuration(item.durationHours, item.durationMinutes),
    trailerEmbedUrl: getTrailerEmbedUrl(item.trailerUrl ?? item.trailer ?? item.youtubeUrl),
  };
};

/**
 * The admin-curated hero carousel — up to 5 films picked from the CMS
 * carousel page, already sorted server-side by featuredOrder. Not scoped to
 * a single year (the CMS picker isn't year-scoped either).
 */
export const fetchCarouselFilms = async (
  signal?: AbortSignal
): Promise<CarouselFilmItem[]> => {
  const url = `${getApiBase()}/submissions?featured=true`;
  const items = await fetchSubmissionsList(url, signal);
  return items.map(mapSubmissionToCarouselItem);
};

export type ResolveSubmissionIdParams = {
  year: string;
  contentId?: string;
  title?: string;
  submissionId?: string;
};

/**
 * Falls back to scanning the submissions list when a card only carries a
 * non-Mongo contentId, resolving the real ObjectId the synopsis route needs.
 */
export const resolveSubmissionMongoId = async ({
  year,
  contentId,
  title,
  submissionId,
}: ResolveSubmissionIdParams): Promise<string | null> => {
  if (isObjectId(submissionId)) return submissionId;
  if (isObjectId(contentId)) return contentId;

  const candidateUrls = [
    buildSubmissionsUrl("/fetchSubmissions", year),
    buildSubmissionsUrl("/submissions", year),
  ];

  for (const url of candidateUrls) {
    try {
      const items = await fetchSubmissionsList(url);

      const matched = items.find((item) => {
        const itemObjectId = pickMongoSubmissionId(item);
        const itemContentId = pickContentId(item);
        if (contentId && itemContentId === contentId) return true;
        if (submissionId && itemObjectId === submissionId) return true;
        if (title && item.title && item.title === title) return true;
        return false;
      });

      const resolved = matched ? pickMongoSubmissionId(matched) : null;
      if (resolved && isObjectId(resolved)) return resolved;
    } catch {
      // Continue trying the next endpoint candidate.
    }
  }

  return null;
};
