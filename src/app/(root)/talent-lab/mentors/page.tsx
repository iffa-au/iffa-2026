import type { Metadata } from "next";

import { MentorsPage } from "@/modules/talent-lab/ui/views/mentors-page";

export const metadata: Metadata = {
  title: "Mentors | IFFA Talent Lab",
  description:
    "The working practitioners, past guests and partner contacts behind the IFFA Talent Lab. Filter by discipline and type.",
};

export default function Page() {
  return <MentorsPage />;
}
