import type { Metadata } from "next";

import { events } from "@/modules/talent-lab/data/events-data";
import { eventBySlug } from "@/modules/talent-lab/lib/filters";
import {
  EventDetailPage,
  eventSlugs,
} from "@/modules/talent-lab/ui/views/event-detail-page";

/**
 * `params` is a Promise in Next 16 and must be awaited — verified in
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`.
 */
type EventRouteProps = {
  params: Promise<{ slug: string }>;
};

/** All six sessions are prerendered. An unknown slug falls through to notFound(). */
export function generateStaticParams() {
  return eventSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: EventRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const event = eventBySlug(events, slug);

  if (!event) {
    return { title: "Session not found | IFFA Talent Lab" };
  }

  return {
    title: `${event.title} | IFFA Talent Lab`,
    description: event.description,
  };
}

export default async function Page({ params }: EventRouteProps) {
  const { slug } = await params;
  return <EventDetailPage slug={slug} />;
}
