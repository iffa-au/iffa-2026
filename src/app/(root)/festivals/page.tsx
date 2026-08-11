import type { Metadata } from "next";

import { FestivalsPage } from "@/modules/festivals/ui/views/festivals-page";

export const metadata: Metadata = {
  title: "Festivals | IFFA",
  description:
    "The International Film Festival of Australia, 20-26 August 2026 in Melbourne — screening schedule, festival programs, masterclasses and venues.",
};

export default function Page() {
  return <FestivalsPage />;
}
