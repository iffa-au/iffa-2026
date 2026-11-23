import { pickImageUrl } from "@/modules/events/submissions/lib/submissions";

type WinnerApiItem = {
  id?: string | number;
  contentId?: string | number;
  editionYear?: number;
  awardCategoryName?: string;
  title?: string;
  landscapeImageUrl?: string;
  portraitImageUrl?: string;
  crewMemberName?: string;
};

export type WinnerUiItem = {
  winnerId: string;
  movieId?: string;
  awardYear?: number;
  category: string;
  movieName: string;
  photoUrl: string;
  winnerName: string;
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

const winnerPriority = [
  "Best Actor in a Leading Role",
  "Best Actor in a Supporting Role",
  "Best Actress in a Leading Role",
  "Best Actress in a Supporting Role",
  "Best Animated Film",
  "Best Cinematography",
  "Best Direction",
  "Best Documentary Film",
  "Best International Feature Film",
  "Best International Short Film",
  "Best Screenplay Writing",
  "Best Original Web Series",
  "Best Short Film (Under 18 Category)",
  "Best TV Series",
];

const rank = (category: string) => {
  const i = winnerPriority.indexOf(category);
  return i === -1 ? Infinity : i;
};

/** The year's winners in award order. Throws on a failed request. */
export async function fetchWinnersForYear(
  year: string,
  init?: RequestInit
): Promise<WinnerUiItem[]> {
  const res = await fetch(
    `${API_BASE_URL}/submissions/fetchWinnerDetailed?year=${encodeURIComponent(year)}`,
    init
  );
  if (!res.ok) throw new Error(`Failed to fetch winners (${res.status})`);
  const data: unknown = await res.json();
  const items = Array.isArray(data) ? (data as WinnerApiItem[]) : [];

  return items
    .map((w) => ({
      winnerId: String(w.id ?? ""),
      movieId:
        typeof w.id === "string"
          ? w.id
          : typeof w.contentId === "string"
            ? w.contentId
            : undefined,
      awardYear: w.editionYear,
      category: w.awardCategoryName ?? "",
      movieName: w.title ?? "",
      photoUrl: pickImageUrl(w.landscapeImageUrl, w.portraitImageUrl),
      winnerName: w.crewMemberName ?? "",
    }))
    .sort((a, b) => {
      const d = rank(a.category) - rank(b.category);
      return Number.isNaN(d) ? 0 : d; // two unranked categories keep API order
    });
}
