import type { Metadata } from "next";

import { fetchFestivalsPageData } from "@/modules/festivals/lib/festival-api";
import { festivalPhase } from "@/modules/festivals/lib/festival-utils";
import { FestivalPage } from "@/modules/festivals/ui/views/festival-page";

/**
 * Content comes from cms-hub, so the page renders per request: a festival
 * published in the CMS appears here immediately, with no deploy. Metadata and
 * server rendering are preserved, which a client-side fetch would have cost.
 *
 * ISR was tried first and cannot work on this deployment — see the note in
 * festival-api.ts.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Festival | IFFA",
  description:
    "The International Film Festival of Australia — one festival a year in Melbourne. The full programme, night by night.",
};

export default async function Page() {
  const { festival, archive, settings, today } = await fetchFestivalsPageData();

  // Decided here, from Melbourne's date, and passed down. Every component that
  // needs to know whether the festival is coming, running or over reads the
  // same answer, so the countdown and the programme's wording cannot disagree.
  const phase = festival ? festivalPhase(festival, today) : "upcoming";

  return (
    <FestivalPage
      festival={festival}
      archive={archive}
      settings={settings}
      phase={phase}
    />
  );
}
