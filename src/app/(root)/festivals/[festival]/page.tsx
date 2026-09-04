import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import {
  fetchFestivalsPageData,
  findFestivalBySlug,
} from "@/modules/festivals/lib/festival-api";
import { formatFestivalDates } from "@/modules/festivals/lib/festival-utils";
import { FestivalArchivePage } from "@/modules/festivals/ui/views/festival-archive-page";

/**
 * A past festival, at the URL it had while it was the current one.
 *
 * IFFA runs one festival a year, so `/festivals` is the festival — there is no
 * detail page to click through to any more. This route survives for the links
 * that were shared before that was true: the current festival's slug redirects
 * to `/festivals`, and anything older renders its archive recap.
 *
 * `[festival]` sits alongside the static `programs/` and `screening/` segments.
 * Next resolves static segments first, so those routes are unaffected — but a
 * new static child of `/festivals` will always win over a festival slug of the
 * same name.
 */
/** Rendered per request, for the reason set out in festival-api.ts. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/festivals/[festival]">): Promise<Metadata> {
  const { festival: slug } = await params;
  const data = await fetchFestivalsPageData();
  const festival = findFestivalBySlug(data, slug);

  if (!festival) return { title: "Festival not found | IFFA" };

  return {
    title: `${festival.name} ${festival.year} | IFFA`,
    description:
      festival.description ||
      `${festival.name}, ${formatFestivalDates(festival)} in ${festival.city}.`,
  };
}

export default async function Page({ params }: PageProps<"/festivals/[festival]">) {
  const { festival: slug } = await params;

  // One fetch for the whole record, shared with generateMetadata through the
  // request cache. It is also what decides whether this slug is the current
  // festival, which is the only way to know whether to redirect.
  const data = await fetchFestivalsPageData();
  const match = findFestivalBySlug(data, slug);

  if (!match) notFound();

  // The current festival lives at /festivals now. Redirecting rather than
  // rendering it twice keeps one canonical URL for the page people link to.
  if (match.slug === data.festival?.slug) redirect("/festivals");

  return <FestivalArchivePage festival={match} settings={data.settings} />;
}
