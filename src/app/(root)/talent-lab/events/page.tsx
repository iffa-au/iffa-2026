import type { Metadata } from "next";

import { EventsPage } from "@/modules/talent-lab/ui/views/events-page";

export const metadata: Metadata = {
  title: "Events & Masterclasses | IFFA Talent Lab",
  description:
    "Public IFFA Talent Lab masterclasses and workshops — open to anyone, no application required — plus the archive of past sessions.",
};

export default function Page() {
  return <EventsPage />;
}
