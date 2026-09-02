import Link from "next/link";
import { notFound } from "next/navigation";

import { mentors } from "../../data/mentors-data";
import { opportunities } from "../../data/opportunities-data";
import { partnerCategories } from "../../data/partners-data";
import { resources } from "../../data/resources-data";
import { streams } from "../../data/streams-data";
import { pageCopy, talentLabEdition } from "../../data/talent-lab-edition";
import {
  mentorsBySlug,
  opportunityForStream,
  resourcesById,
  streamBySlug,
} from "../../lib/filters";
import { canApply } from "../../lib/status";
import type { LabelledFact } from "../../lib/types";
import { CurriculumList } from "../components/curriculum-list";
import { FactGrid } from "../components/fact-grid";
import { MentorPreviewCard } from "../components/mentor-preview-card";
import { PageHeader } from "../components/page-header";
import { ResourceList, ResourceRow } from "../components/resource-row";
import { SidePanel, SideRail } from "../components/side-panel";
import { StatusPill } from "../components/status-pill";

const copy = pageCopy.programDetail;

/** Every slug this route serves. Used by `generateStaticParams`. */
export const programSlugs = streams.map((stream) => stream.slug);

const PRIMARY_ACTION =
  "inline-flex items-center justify-center rounded-sm border border-yellow-400 bg-yellow-400 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const SECONDARY_ACTION =
  "inline-flex items-center justify-center rounded-sm border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400";

function DetailHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-white md:text-2xl">{children}</h2>
  );
}

export function ProgramDetailPage({ slug }: { slug: string }) {
  const stream = streamBySlug(streams, slug);

  if (!stream) {
    notFound();
  }

  /**
   * The opportunity is authoritative where one exists: it carries the dates,
   * and its status is the one the opportunities list is showing. Two of the ten
   * streams have no opportunity, and they fall back to `Stream.status`.
   */
  const opportunity = opportunityForStream(opportunities, stream.slug);
  const status = opportunity?.status ?? stream.status;

  const programMentors = mentorsBySlug(mentors, stream.mentorSlugs);
  const programResources = resourcesById(resources, stream.resourceIds);

  /** Date rows only exist when an intake does. An empty row would be a lie. */
  const keyFacts: LabelledFact[] = [
    ...(opportunity
      ? [
          { label: "Applications open", value: opportunity.opensOn },
          { label: "Applications close", value: opportunity.closesOn },
          { label: "Program dates", value: opportunity.programDates },
          { label: "Cycle", value: opportunity.cycle },
        ]
      : []),
    { label: "Delivery", value: stream.location },
    { label: "Places", value: stream.places },
  ];

  const applyIsOpen = canApply(status);

  return (
    <div className="bg-black text-white">
      <PageHeader
        tone="hero"
        crumbs={[
          { label: "Talent Lab", href: "/talent-lab" },
          { label: "Programs", href: "/talent-lab/programs" },
          { label: stream.name },
        ]}
        title={stream.name}
        intro={stream.description}
        badges={
          <>
            <span className="rounded-sm border border-white/18 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/80">
              Stream {stream.code}
            </span>
            <span className="rounded-sm border border-white/18 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/80">
              {stream.deliveryMode}
            </span>
            <StatusPill status={status} />
          </>
        }
      >
        <div className="mt-3 max-w-4xl">
          <FactGrid facts={keyFacts} />
        </div>
      </PageHeader>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <DetailHeading>{copy.aboutHeading}</DetailHeading>

            {stream.about.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="max-w-prose text-sm font-light leading-relaxed text-white/70 md:text-[15.5px]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <DetailHeading>{copy.eligibilityHeading}</DetailHeading>
            <FactGrid facts={stream.facts} />
          </div>

          <div className="flex flex-col gap-4">
            <DetailHeading>{copy.curriculumHeading}</DetailHeading>
            <CurriculumList weeks={stream.curriculum} />
          </div>

          {programMentors.length > 0 && (
            <div className="flex flex-col gap-4">
              <DetailHeading>{copy.mentorsHeading}</DetailHeading>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {programMentors.map((mentor) => (
                  <MentorPreviewCard key={mentor.slug} mentor={mentor} />
                ))}
              </div>
            </div>
          )}

          {programResources.length > 0 && (
            <div className="flex flex-col gap-4">
              <DetailHeading>{copy.resourcesHeading}</DetailHeading>

              <p className="max-w-prose text-sm font-light leading-relaxed text-white/60">
                {copy.resourcesNote}
              </p>

              <ResourceList>
                {programResources.map((resource) => (
                  <ResourceRow key={resource.id} resource={resource} />
                ))}
              </ResourceList>
            </div>
          )}
        </div>

        <SideRail>
          <SidePanel
            tone="gold"
            eyebrow={
              opportunity
                ? `Applications close ${opportunity.closesOn}`
                : "No scheduled intake"
            }
          >
            <p className="text-[15px] font-light leading-relaxed text-white">
              {opportunity ? stream.assessmentNote : copy.noOpportunityNote}
            </p>

            {applyIsOpen ? (
              <>
                <Link href="/talent-lab/apply" className={PRIMARY_ACTION}>
                  Apply for this program
                </Link>

                <Link href="/talent-lab/register" className={SECONDARY_ACTION}>
                  Register interest instead
                </Link>
              </>
            ) : (
              <>
                <Link href="/talent-lab/register" className={PRIMARY_ACTION}>
                  Register your interest
                </Link>

                <p className="font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.14em] text-white/45">
                  Applications are not open for this stream right now — the
                  status above says where it is in the cycle.
                </p>
              </>
            )}
          </SidePanel>

          <SidePanel eyebrow={copy.partnerRailEyebrow}>
            <ul className="flex flex-col">
              {partnerCategories.map((category) => (
                <li
                  key={category}
                  className="border-b border-white/8 py-2.5 text-[13.5px] text-white/85 last:border-b-0"
                >
                  {category}
                </li>
              ))}
            </ul>

            <p className="text-[12.5px] font-light leading-relaxed text-white/50">
              {copy.partnerRailNote}{" "}
              <Link
                href="/talent-lab/partners"
                className="rounded-sm text-yellow-400 underline underline-offset-4 transition-colors hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                All partners
              </Link>
            </p>
          </SidePanel>

          <SidePanel eyebrow="Questions">
            <p className="text-[13.5px] font-light leading-relaxed text-white/70">
              Email{" "}
              <a
                href={`mailto:${talentLabEdition.contactEmail}`}
                className="rounded-sm text-yellow-400 underline underline-offset-4 transition-colors hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                {talentLabEdition.contactEmail}
              </a>{" "}
              and we will get back to you.
            </p>
          </SidePanel>
        </SideRail>
      </section>
    </div>
  );
}
