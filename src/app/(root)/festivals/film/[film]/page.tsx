import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchFestivalsPageData, findFilm } from "@/modules/festivals/lib/festival-api";
import {
  formatRuntime,
  formatScreeningDates,
} from "@/modules/festivals/lib/festival-utils";
import { FilmPage } from "@/modules/festivals/ui/views/film-page";

/**
 * One film's own page.
 *
 * Flat rather than nested under its screening: a film can be programmed in two
 * sessions, and a URL naming one of them makes the other unreachable at that
 * address. The id is the title slug minted in festival-api.ts, not a Mongo
 * subdocument id — saving a festival reissues those.
 */
/** Rendered per request, for the reason set out in festival-api.ts. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/festivals/film/[film]">): Promise<Metadata> {
  const { film: id } = await params;
  const data = await fetchFestivalsPageData();
  const match = findFilm(data, id);

  if (!match) return { title: "Film not found | IFFA" };

  const { film, screening, festival } = match;
  const runtime = formatRuntime(film.runtimeMinutes, film.runtimeSeconds);
  return {
    title: `${film.title} | ${festival.name} | IFFA`,
    description:
      film.synopsis ||
      `${film.title} screens at ${festival.name} in ${screening.title} on ${formatScreeningDates(screening)}${
        runtime ? `, ${runtime}` : ""
      }.`,
  };
}

export default async function Page({ params }: PageProps<"/festivals/film/[film]">) {
  const { film: id } = await params;

  // One fetch for the whole record, shared with generateMetadata through the
  // request cache. The same response carries the rest of the session, which
  // the page lists at the bottom.
  const data = await fetchFestivalsPageData();
  const match = findFilm(data, id);

  if (!match) notFound();

  const { film, screening, festival } = match;

  return (
    <FilmPage
      film={film}
      screening={screening}
      festival={festival}
      alsoInScreening={screening.films.filter((entry) => entry.id !== film.id)}
    />
  );
}
