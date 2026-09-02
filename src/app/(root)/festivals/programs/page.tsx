import type { Metadata } from "next";

import { ProgramsPage } from "@/modules/festivals/ui/views/programs-page";

export const metadata: Metadata = {
  title: "Festival Programs | IFFA",
  description:
    "Explore IFFA festival learning experiences — masterclasses, industry exchange, mentorship, pitching, showcases and pathways to IFFA Melbourne.",
};

export default function Page() {
  return <ProgramsPage />;
}
