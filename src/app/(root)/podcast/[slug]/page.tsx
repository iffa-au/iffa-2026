import type { Metadata } from "next";

import { PodcastDetailPage } from "@/modules/podcast/ui/views/podcast-detail-page";

type PodcastRouteProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Titles and share cards are built on the server even though the page fetches
 * its own data on the client, because a crawler or a chat preview never runs
 * that fetch — without this every episode would share one generic card.
 *
 * A failure here is not worth a 500: the page itself still renders and plays.
 */
export async function generateMetadata({
  params,
}: PodcastRouteProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { fetchPodcastBySlug } = await import("@/modules/podcast/lib/podcasts");
    const podcast = await fetchPodcastBySlug(slug);
    if (!podcast) return { title: "Podcast | IFFA Awards" };

    const description =
      podcast.excerpt ||
      `An IFFA podcast conversation${podcast.host ? ` hosted by ${podcast.host}` : ""}.`;

    return {
      title: `${podcast.title} | IFFA Podcast`,
      description,
      openGraph: {
        type: "video.episode",
        title: podcast.title,
        description,
        images: [`https://i.ytimg.com/vi/${podcast.youtubeVideoId}/maxresdefault.jpg`],
      },
    };
  } catch {
    return { title: "Podcast | IFFA Awards" };
  }
}

export default async function Page({ params }: PodcastRouteProps) {
  const { slug } = await params;
  return <PodcastDetailPage slug={slug} />;
}
