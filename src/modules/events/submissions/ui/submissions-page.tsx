"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import MoviesCard from "@/modules/home/ui/views/carousel/MoviesCard";
import { SubmissionsHeroCarousel } from "./submissions-hero-carousel";
import { SubmissionSpotlightCard } from "./submission-spotlight-card";
import { cn } from "@/lib/utils";
import {
  filmActionKey,
  resolveSubmissionMongoId,
  synopsisHrefForFilm,
  type CarouselFilmItem,
  type FilmCardItem,
} from "../lib/submissions";

// Fixed, not read from window: the grid is server-rendered now, so anything
// width-based would differ between server and client and break hydration.
// 28 is two whole poster/spotlight cycles (12 + 2), so every page ends on a
// full row at 1-4 columns.
const itemsPerPage = 28;

/** How many wide cards appear together each time the run of posters breaks. */
const SPOTLIGHT_RUN = 2;

/**
 * A spotlight pair takes up a whole grid row, so the break has to land on a
 * row boundary or the grid leaves a hole. 12 posters fill whole rows at 2, 3
 * and 4 columns (the grid's sm / md / xl steps), so one value fits every width.
 */
const spotlightInterval = 12;

const isSpotlightIndex = (index: number, interval: number) =>
  index % (interval + SPOTLIGHT_RUN) >= interval;

type SubmissionsPageProps = {
  year: string;
  /** Fetched and cached by the route (ISR), as is the carousel. */
  films: FilmCardItem[];
  carouselFilms: CarouselFilmItem[];
};

export function SubmissionsPage({ year, films, carouselFilms }: SubmissionsPageProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [resolvingKey, setResolvingKey] = useState<string | null>(null);

  const totalPages = useMemo(
    () => Math.ceil(films.length / itemsPerPage),
    [films.length]
  );

  const currentFilms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return films.slice(startIndex, startIndex + itemsPerPage);
  }, [films, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  const openSynopsisAfterResolve = async (film: FilmCardItem) => {
    const key = filmActionKey(film);
    if (!key) return;

    setResolvingKey(key);

    try {
      const resolved = await resolveSubmissionMongoId({
        year,
        contentId: film.contentId,
        title: film.title,
        submissionId: film.submissionObjectId,
      });

      router.push(`/synopsis/${resolved ?? key}`);
    } catch {
      router.push(`/synopsis/${key}`);
    } finally {
      setResolvingKey(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <SubmissionsHeroCarousel films={carouselFilms} />
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-accent-4 md:text-6xl font">
           New Submissions 
          </h1>
          <div className="mx-auto mb-6 h-1 w-24 bg-gradient-to-r from-accent-3 to-accent-6" />
          <p className="text-lg text-accent-6">
            {films.length > 0 ? "" : "No movies found"}
          </p>
        </div>

        {currentFilms.length > 0 ? (
          <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {currentFilms.map((film, index) => {
              const href = synopsisHrefForFilm(film);
              const key = film.movieId || `${film.title}-${film.posterUrl}`;
              const actionKey = filmActionKey(film);
              const isResolving = resolvingKey === actionKey;
              const isSpotlight = isSpotlightIndex(index, spotlightInterval);

              const cardClass = cn(
                "block w-full max-w-[340px] rounded-xl transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60",
                // Capped and centred while it spans the full grid, so the
                // frame keeps roughly the same landscape proportion at every
                // width instead of stretching into a thin letterbox.
                isSpotlight &&
                  "h-full max-w-none rounded-2xl sm:max-w-[600px] md:max-w-[680px] xl:max-w-none"
              );

              const card = isSpotlight ? (
                <SubmissionSpotlightCard film={film} />
              ) : (
                <MoviesCard film={film} />
              );

              return (
                <div
                  key={key}
                  className={cn(
                    "flex min-w-0 justify-center transition-transform duration-300 hover:z-10 hover:scale-105",
                    // A spotlight pair fills one row on its own: two half-width
                    // cards on the 4-column grid, full-width stacked below that.
                    isSpotlight &&
                      "col-span-1 h-100 hover:scale-[1.02] sm:col-span-2 sm:h-105 md:col-span-3 md:h-115 xl:col-span-2 xl:h-105"
                  )}
                >
                  {href ? (
                    <Link href={href} className={cardClass} aria-label={`Open synopsis: ${film.title}`}>
                      {card}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void openSynopsisAfterResolve(film)}
                      disabled={!actionKey || isResolving}
                      className={cardClass}
                      aria-label={`Open synopsis: ${film.title}`}
                    >
                      {card}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Film className="mx-auto mb-4 h-16 w-16 text-white/30" />
            <h2 className="mb-2 text-2xl font-semibold text-white">
              No Movies Found
            </h2>
            <p className="text-blue-200">
              There are no movies to display at the moment.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-10 w-10 rounded-lg font-semibold transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 cursor-pointer"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
