import type { Metadata } from "next";

import { ScreeningPage } from "@/modules/festivals/ui/views/screening-page";

export const metadata: Metadata = {
  title: "Screening Schedule | IFFA Festival",
  description:
    "Screening times, venues and featured films from Oman, India, Malaysia and Spain across the IFFA festival week in Melbourne, 20-26 August 2026.",
};

export default function Page() {
  return <ScreeningPage />;
}
