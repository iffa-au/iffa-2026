import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchFestivalsPageData } from "@/modules/festivals/lib/festival-api";
import {
  findFestival,
  formatFestivalDates,
} from "@/modules/festivals/lib/festival-utils";
import { FestivalDetailPage } from "@/modules/festivals/ui/views/festival-detail-page";

/**
 * `[festival]` sits alongside the static `programs/` and `screening/` segments.
 * Next resolves static segments first, so those routes are unaffected — but a
 * new static child of `/festivals` will always win over a festival slug of the
 * same name.
 */
/**
 * Must be a literal: Next statically analyses segment config exports at build
 * time and rejects an imported constant ("Invalid segment configuration
 * export"). Keep in step with FESTIVAL_REVALIDATE_SECONDS in festival-api.ts,
 * which the fetch itself uses.
 */
export const revalidate = 300;

/**
 * A festival published after the last build still has to render. Without this,
 * its URL would 404 until someone redeployed the site.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  // Returns [] if the API is unreachable rather than throwing: a cold backend
  // must not be able to fail an Amplify build. Those pages then render on
  // demand instead of being prerendered.
  const { months } = await fetchFestivalsPageData();
  return months.flatMap((month) =>
    month.festivals.map((festival) => ({ festival: festival.slug }))
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/festivals/[festival]">): Promise<Metadata> {
  const { festival: slug } = await params;
  const { months } = await fetchFestivalsPageData();
  const festival = findFestival(months, slug);

  if (!festival) return { title: "Festival | IFFA" };

  return {
    title: `${festival.name} | IFFA Festivals`,
    description:
      festival.description ||
      `${festival.name} — ${formatFestivalDates(festival)} in ${festival.city}.`,
  };
}

export default async function Page({ params }: PageProps<"/festivals/[festival]">) {
  const { festival: slug } = await params;

  // One fetch for the whole schedule, shared with generateMetadata through the
  // request cache. The detail page needs its neighbours and its month anyway,
  // so fetching the festival alone would cost a second round trip and risk the
  // two views disagreeing.
  const { months } = await fetchFestivalsPageData();
  const festival = findFestival(months, slug);

  if (!festival) notFound();

  return <FestivalDetailPage festival={festival} months={months} />;
}
