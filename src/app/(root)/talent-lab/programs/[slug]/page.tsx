import type { Metadata } from "next";

import { streamBySlug } from "@/modules/talent-lab/lib/filters";
import { ProgramDetailPage } from "@/modules/talent-lab/ui/views/program-detail-page";
import { fetchMentors, fetchOpportunities, fetchPrograms } from "@/modules/talent-lab/lib/talent-lab-api";

/**
 * `params` is a Promise in Next 16 and must be awaited — verified in
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`.
 */
type ProgramRouteProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Rendered per request: the content comes from cms-hub (see
 * `talent-lab/lib/talent-lab-api.ts`), and Amplify can't regenerate ISR pages.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProgramRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const stream = streamBySlug(await fetchPrograms(), slug);

  if (!stream) {
    return { title: "Program not found | IFFA Talent Lab" };
  }

  return {
    title: `${stream.name} | IFFA Talent Lab`,
    description: stream.description,
  };
}

export default async function Page({ params }: ProgramRouteProps) {
  const { slug } = await params;
  const [streams, mentors, opportunities] = await Promise.all([
    fetchPrograms(),
    fetchMentors(),
    fetchOpportunities(),
  ]);
  return (
    <ProgramDetailPage slug={slug} streams={streams} mentors={mentors} opportunities={opportunities} />
  );
}
