const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;

export type SubmissionApiItem = {
  id?: unknown;
  contentId?: unknown;
  submissionId?: unknown;
  _id?: unknown;
  title?: string;
  portraitImageUrl?: string;
  landscapeImageUrl?: string;
  directors?: string[];
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
};

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

const formatDuration = (
  hours?: number,
  minutes?: number
): string | undefined => {
  if (!hours && !minutes) return undefined;
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  return parts.join(" ");
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
    posterUrl:
      item.portraitImageUrl ||
      item.landscapeImageUrl ||
      "/fallbacks/no-poster.svg",
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
