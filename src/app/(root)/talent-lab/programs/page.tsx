import type { Metadata } from "next";

import { fetchPrograms } from "@/modules/talent-lab/lib/talent-lab-api";
import { ProgramsPage } from "@/modules/talent-lab/ui/views/programs-page";

export const metadata: Metadata = {
  title: "Programs & Streams | IFFA Talent Lab",
  description:
    "IFFA Talent Lab streams across the two annual cycles, each with its own eligibility, delivery mode, curriculum and mentor group.",
};

/**
 * Rendered per request: programs come from cms-hub (see
 * `talent-lab/lib/talent-lab-api.ts`), and Amplify can't regenerate ISR pages.
 */
export const dynamic = "force-dynamic";

export default async function Page() {
  return <ProgramsPage streams={await fetchPrograms()} />;
}
