import { Trophy } from "lucide-react";
import Link from "next/link";

import { WinnerCard } from "@/modules/events/winners/ui/winner-card";
import { isObjectId } from "@/modules/events/submissions/lib/submissions";
import type { WinnerUiItem } from "@/modules/events/winners/lib/winners";

type WinnersPageProps = {
  year: string;
  /** Already in award order (see fetchWinnersForYear). */
  winners: WinnerUiItem[];
  hasNominations: boolean;
};

// A server component now: the route fetches and caches the data.
export function WinnersPage({ year, winners, hasNominations }: WinnersPageProps) {
  const targetYear = parseInt(year, 10);
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

        {winners.length > 0 ? (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
            {winners.map((winner) => (
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
