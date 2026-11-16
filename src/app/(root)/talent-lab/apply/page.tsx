import type { Metadata } from "next";

import { fetchPrograms } from "@/modules/talent-lab/lib/talent-lab-api";
import { ApplyPage } from "@/modules/talent-lab/ui/views/apply-page";

export const metadata: Metadata = {
  title: "Apply | IFFA Talent Lab",
  description:
    "Apply to an IFFA Talent Lab program. Five short sections covering your contact details, profile, project and consents.",
};

/** Rendered per request so the program choices follow the CMS. */
export const dynamic = "force-dynamic";

export default async function Page() {
  return <ApplyPage programNames={(await fetchPrograms()).map((p) => p.name)} />;
}
