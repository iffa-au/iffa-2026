import type { Metadata } from "next";

import { fetchFestivalsPageData } from "@/modules/festivals/lib/festival-api";
import { FestivalsPage } from "@/modules/festivals/ui/views/festivals-page";

/**
 * Content comes from cms-hub, so the page is regenerated rather than rebuilt:
 * a festival published in the CMS appears here within the revalidate window,
 * with no deploy. Metadata and prerendering are preserved, which a client-side
 * fetch would have cost.
 */
/**
 * Must be a literal: Next statically analyses segment config exports at build
 * time and rejects an imported constant ("Invalid segment configuration
 * export"). Keep in step with FESTIVAL_REVALIDATE_SECONDS in festival-api.ts,
 * which the fetch itself uses.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Festivals | IFFA",
  description:
    "Upcoming IFFA festivals in Melbourne — two festivals a month, with the full screening schedule, films, times and venues for each.",
};

export default async function Page() {
  const { months, settings } = await fetchFestivalsPageData();
  return <FestivalsPage months={months} settings={settings} />;
}
