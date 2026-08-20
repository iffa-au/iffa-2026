"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import MoviesCard from "@/modules/home/ui/views/carousel/MoviesCard";
import { SubmissionsHeroCarousel } from "./submissions-hero-carousel";
import {
  fetchSubmissionsForYear,
  filmActionKey,
  resolveSubmissionMongoId,
  synopsisHrefForFilm,
  type FilmCardItem,
} from "../lib/submissions";

const getItemsPerPage = () => {
  if (typeof window === "undefined") return 12;

  const width = window.innerWidth;
  if (width >= 1024) return 30;
  if (width >= 768) return 12;
  return 8;
};

type SubmissionsPageProps = {
  year: string;
};

export function SubmissionsPage({ year }: SubmissionsPageProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const [films, setFilms] = useState<FilmCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvingKey, setResolvingKey] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const nextItemsPerPage = getItemsPerPage();
      setItemsPerPage(nextItemsPerPage);
      setCurrentPage((prevPage) => {
        const nextTotalPages = Math.ceil(films.length / nextItemsPerPage);
        if (nextTotalPages === 0) return 1;
        return prevPage > nextTotalPages ? 1 : prevPage;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [films.length]);

  useEffect(() => {
    if (!year) {
      setFilms([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const mapped = await fetchSubmissionsForYear(year, controller.signal);

        setFilms(mapped);
        setCurrentPage(1);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Failed to load submissions");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadSubmissions();
    return () => controller.abort();
  }, [year]);

  const totalPages = useMemo(
    () => Math.ceil(films.length / itemsPerPage),
    [films.length, itemsPerPage]
  );

  const currentFilms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return films.slice(startIndex, startIndex + itemsPerPage);
  }, [films, currentPage, itemsPerPage]);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <SubmissionsHeroCarousel />
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white">
        <SubmissionsHeroCarousel />
        <div className="mx-auto w-full max-w-7xl px-4 py-20 text-center text-red-400">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <SubmissionsHeroCarousel />
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-accent-4 md:text-6xl">
            {year} Submissions
          </h1>
          <div className="mx-auto mb-6 h-1 w-24 bg-gradient-to-r from-accent-3 to-accent-6" />
          <p className="text-lg text-accent-6">
            {films.length > 0 ? "" : "No movies found"}
          </p>
        </div>

        {currentFilms.length > 0 ? (
          <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {currentFilms.map((film) => {
              const href = synopsisHrefForFilm(film);
              const key = film.movieId || `${film.title}-${film.posterUrl}`;
              const actionKey = filmActionKey(film);
              const isResolving = resolvingKey === actionKey;

              const cardClass =
                "block w-full max-w-[340px] rounded-xl transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60";

              return (
                <div
                  key={key}
                  className="flex min-w-0 justify-center transition-transform duration-300 hover:z-10 hover:scale-105"
                >
                  {href ? (
                    <Link href={href} className={cardClass} aria-label={`Open synopsis: ${film.title}`}>
                      <MoviesCard film={film} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void openSynopsisAfterResolve(film)}
                      disabled={!actionKey || isResolving}
                      className={cardClass}
                      aria-label={`Open synopsis: ${film.title}`}
                    >
                      <MoviesCard film={film} />
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
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
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
                        : "border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
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
              className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
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
