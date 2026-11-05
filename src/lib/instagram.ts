/**
 * Converts an Instagram post/reel/IGTV URL into an embeddable iframe URL.
 * Profile and other non-post URLs return null (Instagram doesn't iframe them).
 */
export const getInstagramEmbedUrl = (url?: string): string | null => {
  if (!url) return null;

  try {
    const { hostname, pathname } = new URL(url);
    // Exact host match: this ends up in an iframe src.
    if (hostname !== "instagram.com" && !hostname.endsWith(".instagram.com")) return null;

    // Matches /p/CODE, /reel/CODE, /reels/CODE, /tv/CODE, optionally behind /username/.
    const match = pathname.match(/^\/(?:[\w.]+\/)?(p|reels?|tv)\/([\w-]+)/);
    if (!match) return null;

    const type = match[1] === "reels" ? "reel" : match[1];
    return `https://www.instagram.com/${type}/${match[2]}/embed/`;
  } catch {
    return null;
  }
};
