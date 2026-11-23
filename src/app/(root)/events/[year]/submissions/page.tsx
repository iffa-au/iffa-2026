import { notFound } from "next/navigation";

import {
  fetchCarouselFilms,
  fetchSubmissionsForYear,
} from "@/modules/events/submissions/lib/submissions";
import { SubmissionsPage } from "@/modules/events/submissions/ui/submissions-page";

// See winners/page.tsx.
export const revalidate = 600;

export async function generateStaticParams() {
  return [];
}

type SubmissionsRouteProps = {
  params: Promise<{ year: string }>;
};

export default async function Page({ params }: SubmissionsRouteProps) {
  const { year } = await params;
  if (!/^\d{4}$/.test(year)) notFound();

  const init = { next: { revalidate: 600 } };
  const [films, carouselFilms] = await Promise.all([
    fetchSubmissionsForYear(year, init),
    // The carousel is decoration: if it fails, the page renders without it.
    fetchCarouselFilms(init).catch(() => []),
  ]);

  return <SubmissionsPage year={year} films={films} carouselFilms={carouselFilms} />;
}
