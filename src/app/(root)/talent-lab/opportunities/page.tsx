import type { Metadata } from "next";

import { OpportunitiesPage } from "@/modules/talent-lab/ui/views/opportunities-page";

export const metadata: Metadata = {
  title: "Current Opportunities | IFFA Talent Lab",
  description:
    "Every IFFA Talent Lab program open, opening or recently run across the two annual cycles. Filter by status, discipline, delivery mode and career stage.",
};

export default function Page() {
  return <OpportunitiesPage />;
}
