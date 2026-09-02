import type { Metadata } from "next";

import { PodcastPage } from "@/modules/podcast/ui/views/podcast-page";

export const metadata: Metadata = {
  title: "Podcast | IFFA Awards",
  description:
    "Stories Behind the Screen — conversations, perspectives and stories from the filmmakers, artists and voices shaping cinema.",
};

export default function Page() {
  return <PodcastPage />;
}
