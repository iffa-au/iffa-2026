"use client";

import { useEffect, useMemo, useState } from "react";
import { Trophy } from "lucide-react";
import Link from "next/link";

import { WinnerCard } from "@/modules/events/winners/ui/winner-card";
import { isObjectId, pickImageUrl } from "@/modules/events/submissions/lib/submissions";

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

type WinnerUiItem = {
  winnerId: string;
  movieId?: string;
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
  const [hasNominations, setHasNominations] = useState(false);

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
        const mapped: WinnerUiItem[] = items.map((w) => {
          const movieId =
            typeof w.id === "string"
              ? w.id
              : typeof w.contentId === "string"
                ? w.contentId
                : undefined;
          return {
            winnerId: String(w.id ?? ""),
            movieId,
            awardYear: w.editionYear,
            category: w.awardCategoryName ?? "",
            movieName: w.title ?? "",
            photoUrl: pickImageUrl(w.landscapeImageUrl, w.portraitImageUrl),
            winnerName: w.crewMemberName ?? "",
          };
        });
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

  useEffect(() => {
    if (loading || winners.length > 0) return;
    if (!year || Number.isNaN(targetYear)) return;

    const controller = new AbortController();

    const checkNominations = async () => {
      try {
        const normalizedBase = API_BASE_URL.endsWith("/")
          ? API_BASE_URL.slice(0, -1)
          : API_BASE_URL;
        const url = `${normalizedBase}/nominations/fetchNomination?year=${encodeURIComponent(String(targetYear))}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) return;
        const data: unknown = await res.json();
        setHasNominations(Array.isArray(data) && data.length > 0);
      } catch {
        // Leave hasNominations at its default (false) — the CTA falls back
        // to the submission enquiry link, which is always valid.
      }
    };

    void checkNominations();
    return () => controller.abort();
  }, [loading, winners.length, targetYear, year]);

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

  const isUpcomingOrCurrentYear = targetYear >= new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#0E0C15] px-4 py-12 text-white">
      <div className="container mx-auto">
        <div className="mb-14 text-center sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-yellow-500">
            <Trophy className="h-4 w-4" />
            IFFA {targetYear}
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-widest text-white sm:text-4xl md:text-6xl">
            Award Winners
          </h1>
          <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        </div>

        {sortedWinners.length > 0 ? (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
            {sortedWinners.map((winner) => (
              <WinnerCard
                key={winner.winnerId}
                photoUrl={winner.photoUrl}
                movieName={winner.movieName}
                category={winner.category}
                winnerName={winner.winnerName}
                href={isObjectId(winner.movieId) ? `/synopsis/${winner.movieId}` : null}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-white/10 bg-white/3 px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 sm:h-20 sm:w-20">
              <Trophy className="h-8 w-8 text-yellow-500 sm:h-10 sm:w-10" />
            </div>

            {isUpcomingOrCurrentYear ? (
              <>
                <h2 className="mb-3 text-2xl font-semibold text-white md:text-3xl">
                  Winners Not Announced Yet
                </h2>
                <p className="mx-auto max-w-md text-base text-white/60 md:text-lg">
                  The {targetYear} award winners haven&apos;t been announced.
                  Check back soon, or see who&apos;s been nominated.
                </p>
              </>
            ) : (
              <>
                <h2 className="mb-3 text-2xl font-semibold text-white md:text-3xl">
                  No Winners On Record
                </h2>
                <p className="mx-auto max-w-md text-base text-white/60 md:text-lg">
                  We don&apos;t have a published winners list for {targetYear}.
                </p>
              </>
            )}

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {hasNominations ? (
                <Link
                  href={`/events/${year}/nominations`}
                  className="w-full rounded-lg bg-yellow-500 px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-yellow-400 sm:w-auto"
                >
                  View Nominations
                </Link>
              ) : (
                <Link
                  href="/submit-film-enquiry"
                  className="w-full rounded-lg bg-yellow-500 px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-yellow-400 sm:w-auto"
                >
                  Submit Film Enquiry
                </Link>
              )}
              <Link
                href={`/events/${year}/submissions`}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                Browse Submitted Films
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
