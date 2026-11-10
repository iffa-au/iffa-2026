import type { Metadata } from "next";

import { EventsPage } from "@/modules/talent-lab/ui/views/events-page";
import { fetchEvents } from "@/modules/talent-lab/lib/talent-lab-api";

/**
 * Rendered per request: the content comes from cms-hub (see
 * `talent-lab/lib/talent-lab-api.ts`), and Amplify can't regenerate ISR pages.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events & Masterclasses | IFFA Talent Lab",
  description:
    "Public IFFA Talent Lab masterclasses and workshops — open to anyone, no application required — plus the archive of past sessions.",
};

export default async function Page() {
  return <EventsPage events={await fetchEvents()} />;
}
