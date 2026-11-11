import type { Metadata } from "next";

import { TalentLabPage } from "@/modules/talent-lab/ui/views/talent-lab-page";
import { fetchEvents, fetchMentors, fetchOpportunities } from "@/modules/talent-lab/lib/talent-lab-api";


/**
 * Rendered per request: the content comes from cms-hub (see
 * `talent-lab/lib/talent-lab-api.ts`), and Amplify can't regenerate ISR pages.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Talent Lab | IFFA",
  description:
    "IFFA Talent Lab connects emerging Australian screen talent with experienced practitioners, organisations and international networks through mentoring, masterclasses, workshops and project development.",
};

export default async function Page() {
  const [events, mentors, opportunities] = await Promise.all([
    fetchEvents(),
    fetchMentors(),
    fetchOpportunities(),
  ]);
  return <TalentLabPage events={events} mentors={mentors} opportunities={opportunities} />;
}
