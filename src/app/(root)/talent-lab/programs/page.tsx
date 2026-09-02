import type { Metadata } from "next";

import { ProgramsPage } from "@/modules/talent-lab/ui/views/programs-page";

export const metadata: Metadata = {
  title: "Programs & Streams | IFFA Talent Lab",
  description:
    "Ten IFFA Talent Lab streams across the two annual cycles, each with its own eligibility, delivery mode, curriculum and mentor group.",
};

export default function Page() {
  return <ProgramsPage />;
}
