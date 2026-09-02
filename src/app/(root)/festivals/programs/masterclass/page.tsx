import type { Metadata } from "next";

import { MasterclassPage } from "@/modules/festivals/ui/views/masterclass-page";

export const metadata: Metadata = {
  title: "Masterclasses & Sessions | IFFA Festival",
  description:
    "Craft-focused masterclasses with working directors, writers, producers and editors during the IFFA festival week in Melbourne, 20-26 August 2026.",
};

export default function Page() {
  return <MasterclassPage />;
}
