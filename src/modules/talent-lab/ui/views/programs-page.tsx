import { streams } from "../../data/streams-data";
import { pageCopy } from "../../data/talent-lab-edition";
import { PageHeader } from "../components/page-header";
import { PageSection } from "../components/page-section";
import { StreamCard } from "../components/stream-card";

const copy = pageCopy.programs;

/**
 * The stream index.
 *
 * Renders the whole `streams` array — there is no "featured" subset and no
 * hand-kept order, so adding a stream to the data file adds a card and a detail
 * page in one edit.
 */
export function ProgramsPage() {
  return (
    <div className="bg-black text-white">
      <PageHeader
        crumbs={[
          { label: "Talent Lab", href: "/talent-lab" },
          { label: "Programs & Streams" },
        ]}
        title={copy.title}
        intro={copy.intro}
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
