import type { Metadata } from "next";

import { fetchEvents } from "@/modules/talent-lab/lib/talent-lab-api";
import { eventBySlug } from "@/modules/talent-lab/lib/filters";
import { EventDetailPage } from "@/modules/talent-lab/ui/views/event-detail-page";

/**
 * `params` is a Promise in Next 16 and must be awaited — verified in
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`.
 */
type EventRouteProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Rendered per request: the content comes from cms-hub (see
 * `talent-lab/lib/talent-lab-api.ts`), and Amplify can't regenerate ISR pages.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: EventRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const event = eventBySlug(await fetchEvents(), slug);

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
  return <EventDetailPage slug={slug} events={await fetchEvents()} />;
}
