/**
 * Converts a raw YouTube watch/share/embed URL into an embeddable player URL.
 *
 * Extracted verbatim from `MoviesCard.tsx` so the festivals screening cards can
 * open trailers without duplicating the parser.
 */
export const getYouTubeEmbedUrl = (url?: string): string | null => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.pathname.startsWith("/embed/")
        ? parsed.pathname.split("/embed/")[1]
        : parsed.searchParams.get("v");
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  } catch {
    return null;
  }
};
