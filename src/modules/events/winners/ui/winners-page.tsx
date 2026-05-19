"use client";

import { useEffect, useMemo, useState } from "react";

import { WinnerCard } from "@/modules/events/winners/ui/winner-card";

type WinnerApiItem = {
  id?: string | number;
  editionYear?: number;
  awardCategoryName?: string;
  title?: string;
  landscapeImageUrl?: string;
  portraitImageUrl?: string;
  crewMemberName?: string;
};

type WinnerUiItem = {
  winnerId: string;
  awardYear?: number;
  category: string;
  movieName: string;
  photoUrl: string;
  winnerName: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

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

type WinnersPageProps = {
  year: string;
};

export function WinnersPage({ year }: WinnersPageProps) {
  const targetYear = parseInt(year, 10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [winners, setWinners] = useState<WinnerUiItem[]>([]);

  useEffect(() => {
    if (!year || Number.isNaN(targetYear)) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const normalizedBase = API_BASE_URL.endsWith("/")
          ? API_BASE_URL.slice(0, -1)
          : API_BASE_URL;
        const url = `${normalizedBase}/submissions/fetchWinnerDetailed?year=${encodeURIComponent(String(targetYear))}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Failed to fetch winners (${res.status})`);
        }
        const data: unknown = await res.json();
        const items = Array.isArray(data) ? (data as WinnerApiItem[]) : [];
        const mapped: WinnerUiItem[] = items.map((w) => ({
          winnerId: String(w.id ?? ""),
          awardYear: w.editionYear,
          category: w.awardCategoryName ?? "",
          movieName: w.title ?? "",
          photoUrl:
            w.landscapeImageUrl ??
            w.portraitImageUrl ??
            "/fallbacks/no-poster.svg",
          winnerName: w.crewMemberName ?? "",
        }));
        setWinners(mapped);
      } catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          setError(e.message || "Failed to load winners");
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [targetYear]);

  const sortedWinners = useMemo(() => {
    return [...winners].sort((a, b) => {
      const indexA = winnerPriority.indexOf(a.category);
      const indexB = winnerPriority.indexOf(b.category);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [winners]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0E0C15] px-4 py-12 text-white">
        <div className="container mx-auto flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0E0C15] px-4 py-12 text-white">
        <div className="container mx-auto text-center text-red-400">{error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0E0C15] px-4 py-12 text-white">
      <div className="container mx-auto">
        <h1 className="mb-16 text-center text-4xl font-bold uppercase tracking-widest text-accent-3">
          {targetYear} Award Winners
        </h1>

        {sortedWinners.length > 0 ? (
          targetYear === 2025 ? (
            <div className="space-y-12">
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
                {sortedWinners.map((winner) => (
                  <WinnerCard
                    key={winner.winnerId}
                    photoUrl={winner.photoUrl}
                    movieName={winner.movieName}
                    category={winner.category}
                    winnerName={winner.winnerName}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {sortedWinners.map((winner) => (
                <div
                  key={winner.winnerId}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-md backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <img
                    src={winner.photoUrl}
                    alt={winner.movieName}
                    className="aspect-[2/3] w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/fallbacks/no-poster.svg";
                    }}
                  />
                  <div className="space-y-2 p-4">
                    <h2 className="text-lg font-semibold">{winner.movieName}</h2>
                    <p className="text-sm text-accent-6">{winner.category}</p>
                    <p className="text-sm text-white/60">{winner.winnerName}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
            <p className="text-xl font-light text-white/50">
              {targetYear === new Date().getFullYear()
                ? "This year's winners will be announced soon!"
                : "Event yet to take place"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
