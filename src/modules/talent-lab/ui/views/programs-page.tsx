import { pageCopy } from "../../data/talent-lab-edition";
import { PageHeader } from "../components/page-header";
import { PageSection } from "../components/page-section";
import { StreamCard } from "../components/stream-card";
import type { Stream } from "../../lib/types";

const copy = pageCopy.programs;

/**
 * The stream index.
 *
 * Renders every published program, in the order staff set in the CMS (or the
 * built-in data file's order) — there is no "featured" subset, so adding a
 * program adds a card and a detail page in one edit.
 */
export function ProgramsPage({ streams }: { streams: Stream[] }) {
  return (
    <div className="bg-black text-white">
      <PageHeader
        crumbs={[
          { label: "Talent Lab", href: "/talent-lab" },
          { label: "Programs & Streams" },
        ]}
        title={copy.title}
        intro={copy.intro(streams.length)}
      />

      <PageSection bordered={false}>
        <h2 className="sr-only">All streams</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {streams.map((stream) => (
            <StreamCard key={stream.slug} stream={stream} />
          ))}
        </div>
      </PageSection>
    </div>
  );
}
