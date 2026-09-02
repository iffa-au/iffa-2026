import type { Metadata } from "next";

import { ApplyPage } from "@/modules/talent-lab/ui/views/apply-page";

export const metadata: Metadata = {
  title: "Apply | IFFA Talent Lab",
  description:
    "Apply to an IFFA Talent Lab program. Five short sections covering your contact details, profile, project and consents.",
};

export default function Page() {
  return <ApplyPage />;
}
