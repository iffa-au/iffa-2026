import type { Metadata } from "next";

import { ResourcesPage } from "@/modules/talent-lab/ui/views/resources-page";

export const metadata: Metadata = {
  title: "Resource Library | IFFA Talent Lab",
  description:
    "Guides, templates, recorded masterclasses and funding information from the IFFA Talent Lab — free to use, no application required.",
};

export default function Page() {
  return <ResourcesPage />;
}
