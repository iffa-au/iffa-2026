import type { Metadata } from "next";

import { PodcastPage } from "@/modules/podcast/ui/views/podcast-page";

export const metadata: Metadata = {
  title: "Podcast | IFFA Awards",
  description:
    "Conversations worth listening to — ideas, journeys and stories from the people shaping cinema, creativity and culture.",
};

export default function Page() {
  return <PodcastPage />;
}
