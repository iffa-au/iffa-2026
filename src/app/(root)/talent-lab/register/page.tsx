import type { Metadata } from "next";

import { fetchPrograms } from "@/modules/talent-lab/lib/talent-lab-api";
import { RegisterPage } from "@/modules/talent-lab/ui/views/register-page";

export const metadata: Metadata = {
  title: "Register Your Interest | IFFA Talent Lab",
  description:
    "Register an expression of interest in the IFFA Talent Lab. Open all year — we contact you when a program matching your discipline opens.",
};

/** Rendered per request so the program choices follow the CMS. */
export const dynamic = "force-dynamic";

export default async function Page() {
  return <RegisterPage programs={(await fetchPrograms()).map((p) => ({ value: p.slug, label: p.name }))} />;
}
