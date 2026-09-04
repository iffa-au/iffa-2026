import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  fetchFestivalsPageData,
  findScreening,
} from "@/modules/festivals/lib/festival-api";
import { formatDayHeading, formatRuntime } from "@/modules/festivals/lib/festival-utils";
import { ScreeningPage } from "@/modules/festivals/ui/views/screening-page";

/**
 * One film's own page.
 *
 * Sits under the `screening/` segment the old standalone schedule used — that
 * route is a redirect stub, and a static parent segment always wins over a
 * dynamic sibling, so the two cannot collide.
 */
/** Rendered per request, for the reason set out in festival-api.ts. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/festivals/screening/[screening]">): Promise<Metadata> {
  const { screening: id } = await params;
  const data = await fetchFestivalsPageData();
  const match = findScreening(data, id);

  if (!match) return { title: "Screening not found | IFFA" };

  const { screening, festival } = match;
  return {
    title: `${screening.title} | ${festival.name} | IFFA`,
    description:
      screening.synopsis ||
      `${screening.title} screens at ${festival.name} on ${formatDayHeading(screening.date)}${
        screening.runtimeMinutes ? `, ${formatRuntime(screening.runtimeMinutes)}` : ""
      }.`,
  };
}

export default async function Page({
  params,
}: PageProps<"/festivals/screening/[screening]">) {
  const { screening: id } = await params;

  // One fetch for the whole record, shared with generateMetadata through the
  // request cache. The same response carries the rest of that night, which the
  // page lists at the bottom.
  const data = await fetchFestivalsPageData();
  const match = findScreening(data, id);

  if (!match) notFound();

  const sameNight = match.festival.screenings.filter(
    (entry) => entry.date === match.screening.date && entry.id !== match.screening.id,
  );

  return (
    <ScreeningPage
      screening={match.screening}
      festival={match.festival}
      sameNight={sameNight}
    />
  );
}
