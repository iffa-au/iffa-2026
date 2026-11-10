import type { Metadata } from "next";

import { OpportunitiesPage } from "@/modules/talent-lab/ui/views/opportunities-page";
import { fetchOpportunities } from "@/modules/talent-lab/lib/talent-lab-api";

/**
 * Rendered per request: the content comes from cms-hub (see
 * `talent-lab/lib/talent-lab-api.ts`), and Amplify can't regenerate ISR pages.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Current Opportunities | IFFA Talent Lab",
  description:
    "IFFA Talent Lab programs run across two annual cycles. Choose a cohort to see what is open, opening or recently run in it.",
};

export default async function Page() {
  return <OpportunitiesPage opportunities={await fetchOpportunities()} />;
}
