import type { Metadata } from "next";

import { MentorsPage } from "@/modules/talent-lab/ui/views/mentors-page";
import { fetchMentors } from "@/modules/talent-lab/lib/talent-lab-api";

/**
 * Rendered per request: the content comes from cms-hub (see
 * `talent-lab/lib/talent-lab-api.ts`), and Amplify can't regenerate ISR pages.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mentors | IFFA Talent Lab",
  description:
    "The working practitioners, past guests and partner contacts behind the IFFA Talent Lab. Filter by discipline and type.",
};

export default async function Page() {
  return <MentorsPage mentors={await fetchMentors()} />;
}
