import { notFound } from "next/navigation";

import { NominationsPage } from "@/modules/events/nominations/ui/nominations-page";
import { fetchNominationsForYear } from "@/modules/events/submissions/lib/submissions";

// See winners/page.tsx.
export const revalidate = 600;

export async function generateStaticParams() {
  return [];
}

type NominationsRouteProps = {
  params: Promise<{ year: string }>;
};

export default async function Page({ params }: NominationsRouteProps) {
  const { year } = await params;
  if (!/^\d{4}$/.test(year)) notFound();

  const films = await fetchNominationsForYear(year, { next: { revalidate: 600 } });
  return <NominationsPage year={year} films={films} />;
}
