const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * Podcast episodes from CMS-Hub.
 *
 * YouTube hosts the video; it is never the destination. Everything here exists
 * to turn what the CMS stores into something the IFFA page can embed and frame
 * itself — an embed URL, a poster frame, a readable date — so that no surface
 * has a reason to link a visitor away.
 */

export type Podcast = {
  id: string;
  slug: string;
  title: string;
  /** Card and hero copy. Falls back to the opening of `description`. */
  excerpt: string;
  /** The full write-up, already split into paragraphs. */
  paragraphs: string[];
  youtubeVideoId: string;
  /** CMS artwork override, or "" to use the YouTube poster frame. */
  thumbnailUrl: string;
  category: string;
  host: string;
  guests: string[];
  episodeNumber: number;
  durationMinutes: number;
  relatedFestival: string;
  /** ISO date, e.g. "2026-09-02". Sorting key and display source. */
  publishedAt: string;
  updatedAt: string;
  /** Chosen in the CMS to lead the page. At most one episode carries it. */
  isFeatured: boolean;
};

type PodcastApiItem = {
  _id?: unknown;
  id?: unknown;
  slug?: string;
  title?: string;
  excerpt?: string;
  description?: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  category?: string;
  host?: string;
  guests?: unknown;
  episodeNumber?: unknown;
  durationMinutes?: unknown;
  relatedFestival?: string;
  publishedAt?: string;
  updatedAt?: string;
  isFeatured?: boolean;
};

const VIDEO_ID = /^[\w-]{11}$/;

/**
 * Same guard the film pages use: a bare domain pasted into an image field
 * would otherwise be treated as a relative path and 404 against the app router.
 */
const isValidMediaUrl = (value?: string): value is string =>
  !!value && /^(https?:\/\/|\/)/i.test(value);

/**
 * The server stores a parsed `youtubeVideoId`, so this is a safety net rather
 * than the main path — it covers records written before that field existed and
 * any future caller that only has a URL to hand.
 */
export const extractYouTubeId = (raw?: string): string => {
  const value = (raw ?? "").trim();
  if (!value) return "";
  if (VIDEO_ID.test(value)) return value;

  let parsed: URL;
  try {
    parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return "";
  }

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const segments = parsed.pathname.split("/").filter(Boolean);

  const candidate = (() => {
    if (host === "youtu.be") return segments[0];
    if (!/(^|\.)(youtube\.com|youtube-nocookie\.com)$/.test(host)) return undefined;
    if (segments[0] === "watch") return parsed.searchParams.get("v") ?? undefined;
    if (["embed", "shorts", "live", "v"].includes(segments[0] ?? "")) return segments[1];
    return parsed.searchParams.get("v") ?? undefined;
  })();

  return candidate && VIDEO_ID.test(candidate) ? candidate : "";
};

/**
 * The player source.
 *
 * `youtube-nocookie.com` because nothing on this page needs YouTube's
 * advertising cookies to play a video. `rel=0` keeps the end-of-video
 * suggestions within the same channel rather than turning the last frame into
 * a doorway out of the site, and `modestbranding` drops the YouTube wordmark
 * from the control bar so the player reads as part of the IFFA page.
 *
 * `autoplay` is only ever passed after a click. Nothing here starts on its own.
 */
export const youtubeEmbedUrl = (
  videoId: string,
  { autoplay = false }: { autoplay?: boolean } = {},
): string => {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Poster frames, widest first.
 *
 * `maxresdefault` only exists for videos uploaded in HD and 404s otherwise,
 * which is exactly why this is a list: the image component walks down it on
 * error. `mqdefault` is the floor because it is the smallest size YouTube
 * generates for every video and is a true 16:9 crop — `hqdefault` would fit
 * the frame with black bars down the sides.
 */
export const youtubePosterCandidates = (videoId: string): string[] =>
  videoId
    ? [
        `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        `https://i.ytimg.com/vi/${videoId}/hq720.jpg`,
        `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      ]
    : [];

/** CMS artwork when set, otherwise YouTube's own poster frames. */
export const posterCandidates = (podcast: Podcast): string[] =>
  isValidMediaUrl(podcast.thumbnailUrl)
    ? [podcast.thumbnailUrl, ...youtubePosterCandidates(podcast.youtubeVideoId)]
    : youtubePosterCandidates(podcast.youtubeVideoId);

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "2026-09-02" -> "September 2, 2026".
 *
 * Split by hand rather than through `new Date()`: an ISO date-only string is
 * parsed as UTC midnight, which renders as the previous day for every visitor
 * west of Greenwich. The stored value is a calendar date, not an instant.
 */
export const formatPodcastDate = (iso: string): string => {
  const [year, month, day] = (iso ?? "").split("-").map(Number);
  if (!year || !month || !MONTHS[month - 1]) return "";
  return `${MONTHS[month - 1]} ${day}, ${year}`;
};

/** An ISO timestamp (`updatedAt`) down to the same calendar-date label. */
export const formatTimestampDate = (value: string): string =>
  formatPodcastDate((value ?? "").slice(0, 10));

/** 95 -> "1 hr 35 min". Display only; the player reports the real runtime. */
export const formatRuntime = (minutes: number): string => {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
};

export const podcastHref = (slug: string): string => `/podcast/${slug}`;

/**
 * The episode the page leads with: the one chosen in the CMS, or the newest.
 *
 * The fallback is what keeps the page from ever being headless — a fresh
 * install, or an editor who un-featured something and moved on, still gets a
 * hero. It also means the flag reads as an override rather than a field
 * somebody has to remember to set on every release.
 *
 * `find` over a list already sorted newest-first, so two episodes flagged at
 * once (which the server prevents, but a direct database edit would not)
 * resolve to the more recent rather than to whichever happened to be returned
 * first.
 */
export const pickFeatured = (podcasts: Podcast[]): Podcast | undefined =>
  podcasts.find((podcast) => podcast.isFeatured) ?? podcasts[0];

/**
 * Blank lines separate paragraphs. A single run of text stays one paragraph —
 * the detail page sets the measure, so it does not need help wrapping.
 */
const toParagraphs = (description: string): string[] =>
  description
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s+\n/g, "\n").trim())
    .filter(Boolean);

/** First sentence-ish of the body, for a record saved without an excerpt. */
const deriveExcerpt = (paragraphs: string[]): string => {
  const first = paragraphs[0] ?? "";
  return first.length > 220 ? `${first.slice(0, 217).trimEnd()}…` : first;
};

const wholeNumber = (raw: unknown): number => {
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
};

const mapPodcast = (item: PodcastApiItem): Podcast | null => {
  const id = String(item._id ?? item.id ?? "");
  const slug = (item.slug ?? "").trim();
  const title = (item.title ?? "").trim();
  const videoId = (item.youtubeVideoId ?? "").trim() || extractYouTubeId(item.youtubeUrl);

  // An episode with no slug has no page to reach, and one with no readable
  // video has nothing to play. Either way it is dropped rather than rendered
  // as a card that leads somewhere broken.
  if (!id || !slug || !title || !videoId) return null;

  const paragraphs = toParagraphs((item.description ?? "").trim());
  const excerpt = (item.excerpt ?? "").trim() || deriveExcerpt(paragraphs);

  return {
    id,
    slug,
    title,
    excerpt,
    paragraphs,
    youtubeVideoId: videoId,
    thumbnailUrl: (item.thumbnailUrl ?? "").trim(),
    category: (item.category ?? "").trim(),
    host: (item.host ?? "").trim(),
    guests: Array.isArray(item.guests)
      ? item.guests.map((guest) => String(guest ?? "").trim()).filter(Boolean)
      : [],
    episodeNumber: wholeNumber(item.episodeNumber),
    durationMinutes: wholeNumber(item.durationMinutes),
    relatedFestival: (item.relatedFestival ?? "").trim(),
    publishedAt: (item.publishedAt ?? "").trim(),
    updatedAt: (item.updatedAt ?? "").trim(),
    isFeatured: !!item.isFeatured,
  };
};

const getApiBase = () =>
  API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

/** The endpoint has been observed in both shapes across this API. */
const unwrap = (payload: unknown): unknown =>
  payload && typeof payload === "object" && "data" in payload
    ? (payload as { data: unknown }).data
    : payload;

/**
 * Published episodes, newest first.
 *
 * The order comes from the server, which sorts on the CMS publish date. It is
 * re-asserted here anyway: the hero picks `[0]`, so a proxy or a future caching
 * layer quietly reordering the list would silently feature the wrong episode.
 *
 * `limit` is for callers that only want the top of the list — the "more
 * podcasts" rail on a detail page has no use for the back catalogue, and
 * capping it server-side keeps that page's cost flat as the archive grows.
 */
export const fetchPodcasts = async (
  signal?: AbortSignal,
  limit?: number,
): Promise<Podcast[]> => {
  const query = limit && limit > 0 ? `?limit=${Math.floor(limit)}` : "";
  const response = await fetch(`${getApiBase()}/podcasts${query}`, { signal });
  if (!response.ok) throw new Error(`Failed to fetch podcasts (${response.status})`);

  const data = unwrap(await response.json());
  const items: PodcastApiItem[] = Array.isArray(data) ? data : [];

  return items
    .map(mapPodcast)
    .filter((podcast): podcast is Podcast => podcast !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
};

/** One published episode. Resolves to null when the slug does not exist. */
export const fetchPodcastBySlug = async (
  slug: string,
  signal?: AbortSignal,
): Promise<Podcast | null> => {
  const response = await fetch(
    `${getApiBase()}/podcasts/slug/${encodeURIComponent(slug)}`,
    { signal },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Failed to fetch podcast (${response.status})`);

  const data = unwrap(await response.json());
  return data && typeof data === "object" ? mapPodcast(data as PodcastApiItem) : null;
};
