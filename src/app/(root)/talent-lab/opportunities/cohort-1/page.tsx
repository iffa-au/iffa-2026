import type { Metadata } from "next";

import { CohortOneOpportunitiesPage } from "@/modules/talent-lab/ui/views/cohort-one-opportunities-page";
import { fetchOpportunities } from "@/modules/talent-lab/lib/talent-lab-api";

/**
 * Rendered per request: the content comes from cms-hub (see
 * `talent-lab/lib/talent-lab-api.ts`), and Amplify can't regenerate ISR pages.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cohort 1 Programs | IFFA Talent Lab",
  description:
    "Every Cohort 1 program open, opening or recently run at the IFFA Talent Lab. Filter by status, discipline, delivery mode and career stage.",
};

export default async function Page() {
  return <CohortOneOpportunitiesPage opportunities={await fetchOpportunities()} />;
}
