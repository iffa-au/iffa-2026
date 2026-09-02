import type { Metadata } from "next";

import { CohortOneOpportunitiesPage } from "@/modules/talent-lab/ui/views/cohort-one-opportunities-page";

export const metadata: Metadata = {
  title: "Cohort 1 Programs | IFFA Talent Lab",
  description:
    "Every Cohort 1 program open, opening or recently run at the IFFA Talent Lab. Filter by status, discipline, delivery mode and career stage.",
};

export default function Page() {
  return <CohortOneOpportunitiesPage />;
}
