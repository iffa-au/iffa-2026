import Link from "next/link";

import { alumni } from "../../data/alumni-data";
import { events } from "../../data/events-data";
import { faqs } from "../../data/faqs-data";
import { mentors } from "../../data/mentors-data";
import { opportunities } from "../../data/opportunities-data";
import { partnerCategories } from "../../data/partners-data";
import { resources } from "../../data/resources-data";
import { streams } from "../../data/streams-data";
import {
  eligibilityCriteria,
  howItWorksSteps,
  participantBenefits,
  pilotOutcomes,
  programSnapshot,
  talentLabEdition,
} from "../../data/talent-lab-edition";
import { partitionEvents } from "../../lib/filters";
import { AlumniCard } from "../components/alumni-card";
import { BenefitCell } from "../components/benefit-cell";
import { CtaBand } from "../components/cta-band";
import { FaqAccordion } from "../components/faq-accordion";
import { MentorPreviewCard } from "../components/mentor-preview-card";
import { OpportunityCard } from "../components/opportunity-card";
import { PlaceholderPanel } from "../components/placeholder-panel";
import { ResourceList, ResourceRow } from "../components/resource-row";
import { SectionHeader } from "../components/section-header";
import { StatTile, StatTileRow } from "../components/stat-tile";
import { StepBlock } from "../components/step-block";
import { StreamCard } from "../components/stream-card";
import { PartnerTile } from "../components/partner-tile";

const { sections } = talentLabEdition;

/**
 * Every preview on this page is a slice of the real collection, never a
 * separately maintained "featured" list. Reordering `opportunities-data.ts`
 * reorders the landing page, and there is no second place to forget to update.
 */
const featuredOpportunities = opportunities.slice(0, 3);
const previewMentors = mentors.slice(0, 5);
const previewAlumni = alumni.slice(0, 3);
const previewResources = resources.slice(0, 4);
const { upcoming: upcomingEvents } = partitionEvents(events);

/** Shared section shell: the container, padding and rhythm used by every band. */
function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-white/8 py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">{children}</div>
    </section>
  );
}

/** A faint top-down wash, used to alternate the bands. */
const TINTED = "bg-gradient-to-b from-white/[0.02] to-transparent";

export function TalentLabPage() {
  return (
    <div className="bg-black text-white">
      {/* ------------------------------------------------------- 1. Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[repeating-linear-gradient(112deg,rgba(255,255,255,0.028)_0_2px,transparent_2px_11px),radial-gradient(90%_80%_at_72%_18%,rgba(230,186,53,0.14),transparent_60%),linear-gradient(180deg,#14121a_0%,#0a090e_45%,#000_100%)]"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 md:px-8 md:pb-24 md:pt-20">
          <div className="flex max-w-3xl flex-col gap-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-yellow-400">
              {talentLabEdition.eyebrow}
            </p>

            <h1 className="text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {talentLabEdition.title}
            </h1>

            <p className="text-lg font-light tracking-wide text-yellow-400 md:text-2xl">
              {talentLabEdition.tagline}
            </p>

            <p className="max-w-2xl text-sm font-light leading-relaxed text-white/70 md:text-base">
              {talentLabEdition.intro}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/talent-lab/opportunities"
                className="inline-flex items-center justify-center rounded-sm border border-yellow-400 bg-yellow-400 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                View Current Opportunities
              </Link>

              <Link
                href="/talent-lab/register"
                className="inline-flex items-center justify-center rounded-sm border border-yellow-400 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-yellow-400 transition-colors hover:bg-yellow-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                Register Your Interest
              </Link>
            </div>

            <Link
              href="/talent-lab/partners"
              className="w-fit rounded-sm border-b border-white/30 pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Become a mentor or partner <span aria-hidden="true">→</span>
            </Link>

            <p className="mt-3 font-mono text-[10px] uppercase leading-loose tracking-[0.16em] text-white/30">
              <span aria-hidden="true">[ image ] </span>
              {talentLabEdition.heroImageCaption}
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------- 2. Program snapshot */}
      <section className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
          <h2 className="sr-only">Program snapshot</h2>
          <StatTileRow>
            {programSnapshot.map((stat) => (
              <StatTile key={stat.caption} stat={stat} />
            ))}
          </StatTileRow>
        </div>
      </section>

      {/* ------------------------------- 3. Why the Talent Lab exists */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-5">
            <SectionHeader eyebrow={sections.why.eyebrow} heading={sections.why.heading} />

            {sections.why.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="max-w-prose text-sm font-light leading-relaxed text-white/70 md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <PlaceholderPanel caption={sections.why.imageCaption} />
        </div>
      </Section>

      {/* -------------------------------------------- 4. How it works */}
      <Section className={TINTED}>
        <SectionHeader
          eyebrow={sections.howItWorks.eyebrow}
          heading={sections.howItWorks.heading}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((step) => (
            <StepBlock key={step.step} step={step} />
          ))}
        </div>
      </Section>

      {/* ------------------------------------ 5. Current opportunities */}
      <Section>
        <SectionHeader
          eyebrow={sections.opportunities.eyebrow}
          heading={sections.opportunities.heading}
          viewAllHref="/talent-lab/opportunities"
          viewAllLabel="View all opportunities"
        />

        <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </Section>

      {/* ----------------------------------------- 6. Talent Lab streams */}
      <Section className={TINTED}>
        <SectionHeader
          eyebrow={sections.streams.eyebrow}
          heading={sections.streams.heading}
          subtitle={sections.streams.body}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {streams.map((stream) => (
            <StreamCard key={stream.slug} stream={stream} />
          ))}
        </div>
      </Section>

      {/* -------------------------------- 7. What participants receive */}
      <Section>
        <SectionHeader
          eyebrow={sections.benefits.eyebrow}
          heading={sections.benefits.heading}
        />

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {participantBenefits.map((benefit) => (
            <BenefitCell key={benefit.num} benefit={benefit} />
          ))}
        </div>

        <p className="mt-5 max-w-3xl font-mono text-[10.5px] leading-loose tracking-[0.06em] text-white/45">
          {sections.benefits.footnote}
        </p>
      </Section>

      {/* ------------------------------------------- 8. Who can apply */}
      <Section className={TINTED}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-5">
            <SectionHeader
              eyebrow={sections.eligibility.eyebrow}
              heading={sections.eligibility.heading}
            />

            <ul className="flex flex-col gap-3">
              {eligibilityCriteria.map((criterion) => (
                <li
                  key={criterion.slice(0, 40)}
                  className="flex items-start gap-3 border-b border-white/8 pb-3"
                >
                  <span aria-hidden="true" className="leading-relaxed text-yellow-400">
                    ●
                  </span>
                  <span className="text-sm font-light leading-relaxed text-white/70 md:text-[15px]">
                    {criterion}
                  </span>
                </li>
              ))}
            </ul>

            <p className="font-mono text-[10.5px] leading-loose tracking-[0.06em] text-white/45">
              {sections.eligibility.footnote}
            </p>
          </div>

          <div className="flex flex-col gap-4 self-start rounded-xl border border-yellow-400/30 bg-yellow-400/5 p-7 md:p-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-yellow-400">
              {sections.eligibility.inclusionEyebrow}
            </p>

            <p className="text-[15px] font-light leading-relaxed text-white md:text-base">
              {sections.eligibility.inclusionStatement}
            </p>

            <p className="text-sm font-light leading-relaxed text-white/70 md:text-[15px]">
              {sections.eligibility.adjustmentsNote}
            </p>

            <Link
              href="/talent-lab/register"
              className="mt-2 w-fit rounded-sm border border-yellow-400 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-400 transition-colors hover:bg-yellow-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Register your interest
            </Link>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------ 9. Mentors preview */}
      <Section>
        <SectionHeader
          eyebrow={sections.mentors.eyebrow}
          heading={sections.mentors.heading}
          viewAllHref="/talent-lab/mentors"
          viewAllLabel="Meet our mentors"
        />

        <div className="mt-11 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {previewMentors.map((mentor) => (
            <MentorPreviewCard key={mentor.slug} mentor={mentor} />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------ 10. Partners */}
      <Section className={TINTED}>
        <SectionHeader
          eyebrow={sections.partners.eyebrow}
          heading={sections.partners.heading}
          viewAllHref="/talent-lab/partners"
          viewAllLabel="All partners"
        />

        <div className="mt-9 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {partnerCategories.map((category) => (
            <PartnerTile key={category} organisation={category} />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------ 11. Outcomes */}
      <Section>
        <SectionHeader
          eyebrow={sections.outcomes.eyebrow}
          heading={sections.outcomes.heading}
        />

        <div className="mt-9">
          <StatTileRow>
            {pilotOutcomes.map((outcome) => (
              <StatTile key={outcome.caption} stat={outcome} />
            ))}
          </StatTileRow>
        </div>
      </Section>

      {/* ------------------------------------------ 12. Alumni preview */}
      <Section className={TINTED}>
        <SectionHeader
          eyebrow={sections.alumni.eyebrow}
          heading={sections.alumni.heading}
          viewAllHref="/talent-lab/alumni"
          viewAllLabel="All alumni stories"
        />

        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {previewAlumni.map((alumnus) => (
            <AlumniCard key={alumnus.slug} alumnus={alumnus} />
          ))}
        </div>
      </Section>

      {/* --------------------------------------- 13. Resources preview */}
      <Section>
        <SectionHeader
          eyebrow={sections.resources.eyebrow}
          heading={sections.resources.heading}
          viewAllHref="/talent-lab/resources"
          viewAllLabel="Resource library"
        />

        <div className="mt-8">
          <ResourceList>
            {previewResources.map((resource) => (
              <ResourceRow key={resource.id} resource={resource} />
            ))}
          </ResourceList>
        </div>
      </Section>

      {/* ----------------------------------------------------- 14. FAQ */}
      <Section className={TINTED}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          <div className="flex flex-col gap-3.5 self-start">
            <SectionHeader eyebrow={sections.faq.eyebrow} heading={sections.faq.heading} />

            <p className="text-sm font-light leading-relaxed text-white/70 md:text-[15px]">
              Still unsure? Email{" "}
              <a
                href={`mailto:${talentLabEdition.contactEmail}`}
                className="rounded-sm text-yellow-400 underline underline-offset-4 transition-colors hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                {talentLabEdition.contactEmail}
              </a>{" "}
              and we will get back to you.
            </p>

            {upcomingEvents.length > 0 && (
              <p className="mt-2 font-mono text-[10px] uppercase leading-loose tracking-[0.14em] text-white/45">
                {upcomingEvents.length} public {upcomingEvents.length === 1 ? "session" : "sessions"} scheduled —{" "}
                <Link
                  href="/talent-lab/events"
                  className="rounded-sm text-yellow-400 transition-colors hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  see events
                </Link>
              </p>
            )}
          </div>

          <FaqAccordion faqs={faqs} />
        </div>
      </Section>

      {/* ----------------------------------------------- 15. Final CTA */}
      <CtaBand
        eyebrow={sections.finalCta.eyebrow}
        heading={sections.finalCta.heading}
        body={sections.finalCta.body}
        actions={[
          {
            label: "Register Your Interest",
            href: "/talent-lab/register",
            variant: "primary",
          },
          {
            label: "View Open Programs",
            href: "/talent-lab/opportunities",
            variant: "outline",
          },
          {
            label: "Partner with IFFA Talent Lab",
            href: "/talent-lab/partners",
            variant: "outline",
          },
        ]}
      />
    </div>
  );
}
