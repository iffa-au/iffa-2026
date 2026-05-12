"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import MoviesCard from "@/modules/home/ui/views/carousel/MoviesCard";

type NominationApiItem = {
  id?: string | number;
  contentId?: string | number;
  submissionId?: string;
  _id?: string;
  title?: string;
  portraitImageUrl?: string;
  landscapeImageUrl?: string;
  directors?: string[];
};

type FilmItem = {
  movieId: string;
  contentId?: string;
  submissionObjectId?: string;
  title: string;
  posterUrl: string;
  directors: string[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const OBJECT_ID_REGEX = /^[a-f0-9]{24}$/i;

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
  const [films, setFilms] = useState<FilmItem[]>([]);
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
        const url = `${normalizedBase}/awards/nominations?year=${encodeURIComponent(year)}`;
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Failed to fetch nominations (${response.status})`);
        }

        const data: unknown = await response.json();
        const items = Array.isArray(data) ? (data as NominationApiItem[]) : [];

        const mapped: FilmItem[] = items.map((item) => {
          const contentId =
            item.contentId != null
              ? String(item.contentId)
              : item.id != null
                ? String(item.id)
                : undefined;
          const submissionObjectId =
            typeof item._id === "string"
              ? item._id
              : typeof item.submissionId === "string"
                ? item.submissionId
                : undefined;

          return {
            movieId: submissionObjectId ?? contentId ?? "",
            contentId,
            submissionObjectId,
            title: item.title ?? "",
            posterUrl:
              item.portraitImageUrl ??
              item.landscapeImageUrl ??
              "/fallbacks/no-poster.svg",
            directors: Array.isArray(item.directors) ? item.directors : [],
          };
        });

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

  const handleOpenSynopsis = async (film: FilmItem) => {
    const key = film.submissionObjectId ?? film.contentId ?? film.movieId;
    if (!key) return;

    setResolveError(null);
    setResolvingKey(key);

    try {
      if (isObjectId(film.submissionObjectId) || isObjectId(film.movieId)) {
        router.push(`/synopsis/${film.submissionObjectId ?? film.movieId}`);
        return;
      }

      const resolvedObjectId = await resolveSubmissionId({
        year,
        contentId: film.contentId,
        title: film.title,
        submissionId: film.submissionObjectId,
      });

      if (resolvedObjectId) {
        router.push(`/synopsis/${resolvedObjectId}`);
      } else {
        setResolveError("Unable to resolve details for this movie.");
      }
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
          <h1 className="showingx mb-4 text-4xl font-bold tracking-tight text-accent-4 md:text-6xl">
            {pageTitle}
          </h1>
          <div className="mx-auto mb-6 h-1 w-24 bg-gradient-to-r from-accent-3 to-accent-6" />
          <p className="showingx text-lg text-accent-6">
            {films.length > 0
              ? ""
              : targetYear === 2025
                ? "Official list coming soon"
                : "No nominations found"}
          </p>
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
                  <button
                    type="button"
                    onClick={() => void handleOpenSynopsis(film)}
                    disabled={
                      !film.movieId ||
                      resolvingKey ===
                        (film.submissionObjectId ?? film.contentId ?? film.movieId)
                    }
                    className="block w-full max-w-[340px] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <MoviesCard film={film} />
                  </button>
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
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl opacity-50">[film]</div>
            {targetYear === 2025 ? (
              <>
                <h2 className="mb-4 text-2xl font-semibold text-white md:text-3xl">
                  Nominations not published yet
                </h2>
                <p className="mx-auto max-w-3xl text-lg text-blue-200">
                  The official list of nominations for IFFA Awards 2025 will be
                  released on <strong>15 October 2025</strong>.
                </p>
              </>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-semibold text-white">
                  No Nominations Found
                </h2>
                <p className="text-blue-200">
                  There are no nominations to display for {targetYear}.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

const isObjectId = (value?: string) =>
  typeof value === "string" && OBJECT_ID_REGEX.test(value);

type ResolveSubmissionIdParams = {
  year: string;
  contentId?: string;
  title?: string;
  submissionId?: string;
};

const resolveSubmissionId = async ({
  year,
  contentId,
  title,
  submissionId,
}: ResolveSubmissionIdParams): Promise<string | null> => {
  if (isObjectId(submissionId)) return submissionId ?? null;
  if (isObjectId(contentId)) return contentId ?? null;

  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  const candidateUrls = [
    `${normalizedBase}/awards/nominations?year=${encodeURIComponent(year)}`,
    `${normalizedBase}/awards/submissions?year=${encodeURIComponent(year)}`,
    `${normalizedBase}/submissions?year=${encodeURIComponent(year)}`,
  ];

  for (const url of candidateUrls) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;

      const payload: unknown = await response.json();
      const items = Array.isArray(payload)
        ? (payload as NominationApiItem[])
        : payload &&
            typeof payload === "object" &&
            "data" in payload &&
            Array.isArray((payload as { data?: unknown }).data)
          ? ((payload as { data: NominationApiItem[] }).data ?? [])
          : [];

      const matched = items.find((item) => {
        const itemObjectId =
          typeof item._id === "string"
            ? item._id
            : typeof item.submissionId === "string"
              ? item.submissionId
              : undefined;
        const itemContentId =
          item.contentId != null
            ? String(item.contentId)
            : item.id != null
              ? String(item.id)
              : undefined;

        if (contentId && itemContentId === contentId) return true;
        if (submissionId && itemObjectId === submissionId) return true;
        if (title && item.title && item.title === title) return true;
        return false;
      });

      const resolved =
        (typeof matched?._id === "string" && matched._id) ||
        (typeof matched?.submissionId === "string" && matched.submissionId) ||
        null;

      if (resolved && isObjectId(resolved)) return resolved;
    } catch {
      // Continue trying the next endpoint candidate.
    }
  }

  return null;
};
