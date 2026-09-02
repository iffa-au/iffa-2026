import type { Metadata } from "next";

import { PartnersPage } from "@/modules/talent-lab/ui/views/partners-page";

export const metadata: Metadata = {
  title: "Partners | IFFA Talent Lab",
  description:
    "The categories of organisation the IFFA Talent Lab works with. No organisation is listed as a partner until an agreement is in place.",
};

export default function Page() {
  return <PartnersPage />;
}
