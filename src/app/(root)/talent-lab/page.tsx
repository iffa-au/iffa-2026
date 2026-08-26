import type { Metadata } from "next";

import { TalentLabPage } from "@/modules/talent-lab/ui/views/talent-lab-page";

export const metadata: Metadata = {
  title: "Talent Lab | IFFA",
  description:
    "IFFA Talent Lab connects emerging Australian screen talent with experienced practitioners, organisations and international networks through mentoring, masterclasses, workshops and project development.",
};

export default function Page() {
  return <TalentLabPage />;
}
