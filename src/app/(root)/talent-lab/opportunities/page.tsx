import type { Metadata } from "next";

import { OpportunitiesPage } from "@/modules/talent-lab/ui/views/opportunities-page";

export const metadata: Metadata = {
  title: "Current Opportunities | IFFA Talent Lab",
  description:
    "IFFA Talent Lab programs run across two annual cycles. Choose a cohort to see what is open, opening or recently run in it.",
};

export default function Page() {
  return <OpportunitiesPage />;
}
