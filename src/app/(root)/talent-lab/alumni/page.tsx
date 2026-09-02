import type { Metadata } from "next";

import { AlumniPage } from "@/modules/talent-lab/ui/views/alumni-page";

export const metadata: Metadata = {
  title: "Alumni Stories | IFFA Talent Lab",
  description:
    "Where IFFA Talent Lab participants went next. Published with each participant's consent; outcomes vary and are not guaranteed.",
};

export default function Page() {
  return <AlumniPage />;
}
