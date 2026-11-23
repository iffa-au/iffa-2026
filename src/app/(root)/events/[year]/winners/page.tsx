import { notFound } from "next/navigation";

import { fetchNominationsForYear } from "@/modules/events/submissions/lib/submissions";
import { fetchWinnersForYear } from "@/modules/events/winners/lib/winners";
import { WinnersPage } from "@/modules/events/winners/ui/winners-page";

// Rendered on the server and cached for 10 minutes (ISR). A failed refresh
// throws, so Next keeps serving the last good page.
export const revalidate = 600;

// Empty list: no year is built ahead; each is rendered on first visit, then cached.
export async function generateStaticParams() {
  return [];
}

type WinnersRouteProps = {
  params: Promise<{ year: string }>;
};

export default async function Page({ params }: WinnersRouteProps) {
  const { year } = await params;
  if (!/^\d{4}$/.test(year)) notFound();

  const init = { next: { revalidate: 600 } };
  const [winners, hasNominations] = await Promise.all([
    fetchWinnersForYear(year, init),
    // Only drives the empty-state link, so a failure just hides it.
    fetchNominationsForYear(year, init).then(
      (n) => n.length > 0,
      () => false
    ),
  ]);

  return <WinnersPage year={year} winners={winners} hasNominations={hasNominations} />;
}
