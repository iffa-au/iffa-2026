"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import MoviesCard from "@/modules/home/ui/views/carousel/MoviesCard";
import {
  isObjectId,
  mapSubmissionFilmListItem,
  resolveSubmissionMongoId,
  type FilmCardItem,
  type SubmissionApiItem,
} from "@/modules/events/submissions/lib/submissions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const getItemsPerPage = () => {
  if (typeof window === "undefined") return 12;

  const width = window.innerWidth;
  if (width >= 1024) return 30;
  if (width >= 768) return 12;
  return 8;
};

type NominationsPageProps = {
  year: string;
};

export function NominationsPage({ year }: NominationsPageProps) {
  const router = useRouter();
  const targetYear = parseInt(year, 10);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const [films, setFilms] = useState<FilmCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);
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

    const fetchNominations = async () => {
      try {
        setLoading(true);
        setError(null);
        setResolveError(null);

        const normalizedBase = API_BASE_URL.endsWith("/")
          ? API_BASE_URL.slice(0, -1)
          : API_BASE_URL;
        const url = `${normalizedBase}/nominations/fetchNomination?year=${encodeURIComponent(year)}`;
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch nominations (${response.status})`);
        }

        const data: unknown = await response.json();
        const items = Array.isArray(data) ? (data as SubmissionApiItem[]) : [];
        const mapped = items.map((item) =>
          mapSubmissionFilmListItem(item, year)
        );

        setFilms(mapped);
        setCurrentPage(1);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Failed to load nominations");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchNominations();
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

  const handleOpenSynopsis = async (film: FilmCardItem) => {
    const key = film.submissionObjectId ?? film.contentId;
    if (!key) return;

    setResolveError(null);
    setResolvingKey(key);

    try {
      if (isObjectId(film.submissionObjectId)) {
        router.push(`/synopsis/${film.submissionObjectId}`);
        return;
      }

      const resolvedObjectId = await resolveSubmissionMongoId({
        year,
        contentId: film.contentId,
        title: film.title,
        submissionId: film.submissionObjectId,
      });

      if (!resolvedObjectId) {
        setResolveError("Unable to resolve details for this movie.");
        return;
      }

      router.push(`/synopsis/${resolvedObjectId}`);
    } catch (err) {
      setResolveError(
        err instanceof Error
          ? err.message
          : "Unable to resolve details for this movie."
      );
    } finally {
      setResolvingKey(null);
    }
  };

  const pageTitle =
    targetYear === 2025
      ? "IFFA Awards 2025 - Nominations Announcement"
      : `${year} Nominations`;
  const isUpcomingOrCurrentYear = targetYear >= new Date().getFullYear();

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto w-full max-w-7xl py-20 text-center text-red-400">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
            {pageTitle}
          </h1>
          <div className="mx-auto mb-6 h-1 w-24 bg-gradient-to-r from-yellow-500 to-yellow-200" />
          {resolveError ? (
            <p className="mt-2 text-sm text-red-400">{resolveError}</p>
          ) : null}
        </div>

        {currentFilms.length > 0 ? (
          <>
            <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {currentFilms.map((film) => (
                <div
                  key={film.movieId || `${film.title}-${film.posterUrl}`}
                  className="flex min-w-0 justify-center transition-transform duration-300 hover:z-10 hover:scale-105"
                >
                  {(() => {
                    const key = film.submissionObjectId ?? film.contentId;
                    return (
                  <button
                    type="button"
                    onClick={() => void handleOpenSynopsis(film)}
                    disabled={!key || resolvingKey === key}
                    className="block w-full max-w-[340px] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <MoviesCard film={film} />
                  </button>
                    );
                  })()}
                </div>
              ))}
            </div>

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
          </>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-white/10 bg-white/3 px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 sm:h-20 sm:w-20">
              <Award className="h-8 w-8 text-yellow-500 sm:h-10 sm:w-10" />
            </div>

            {isUpcomingOrCurrentYear ? (
              <>
                <h2 className="mb-3 text-2xl font-semibold text-white md:text-3xl">
                  Nominations Not Announced Yet
                </h2>
                <p className="mx-auto max-w-md text-base text-white/60 md:text-lg">
                  The official {targetYear} nominations list is still being
                  finalized. Check back soon, or explore the films already
                  submitted for consideration.
                </p>
              </>
            ) : (
              <>
                <h2 className="mb-3 text-2xl font-semibold text-white md:text-3xl">
                  No Nominations On Record
                </h2>
                <p className="mx-auto max-w-md text-base text-white/60 md:text-lg">
                  We don&apos;t have a published nominations list for {targetYear}.
                </p>
              </>
            )}

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href={`/events/${year}/submissions`}
                className="w-full rounded-lg bg-yellow-500 px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-yellow-400 sm:w-auto"
              >
                Browse Submitted Films
              </Link>
              <Link
                href="/submit-film-enquiry"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                Submit Your Film Enquiry
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

