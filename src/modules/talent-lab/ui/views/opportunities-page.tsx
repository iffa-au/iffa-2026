import { opportunities } from "../../data/opportunities-data";
import { pageCopy } from "../../data/talent-lab-edition";
import { CohortCard } from "../components/cohort-card";
import { PageHeader } from "../components/page-header";
import { PageSection } from "../components/page-section";

const copy = pageCopy.opportunitiesLanding;

/**
 * The cohort chooser at `/talent-lab/opportunities`.
 *
 * A server component with no state: it is two cards and a header. The search
 * box, the four filter rows and the program grid all live one level down, in
 * `cohort-one-opportunities-page`, which is still a client component because
 * filtering is client state.
 *
 * There is deliberately no `/cohort-2` route. Cohort 2's card is inert (plan
 * §11); a route stubbed with a "coming soon" page would be a dead link in
 * reverse — a real destination that tells you there is nothing there.
 */

/**
 * Derived, never typed. Adding a ninth entry to `opportunities-data.ts` changes
 * this line's output with no edit here.
 */
const PROGRAM_COUNT = opportunities.length;

const COUNT_LABEL = `${PROGRAM_COUNT} ${
  PROGRAM_COUNT === 1 ? copy.cohortOne.countNoun : `${copy.cohortOne.countNoun}s`
} ${copy.cohortOne.countSuffix}`;

export function OpportunitiesPage() {
  return (
    <div className="bg-black text-white">
      <PageHeader
        crumbs={[
          { label: "Talent Lab", href: "/talent-lab" },
          { label: "Opportunities" },
        ]}
        eyebrow={copy.eyebrow}
        title={copy.title}
        intro={copy.intro}
      />

      <PageSection bordered={false}>
        <div className="grid gap-5 md:grid-cols-2">
          <CohortCard
            eyebrow={copy.cohortOne.eyebrow}
            title={copy.cohortOne.title}
            description={copy.cohortOne.description}
            status={{ kind: "count", label: COUNT_LABEL }}
            href="/talent-lab/opportunities/cohort-1"
            actionLabel={copy.cohortOne.actionLabel}
          />

          <CohortCard
            eyebrow={copy.cohortTwo.eyebrow}
            title={copy.cohortTwo.title}
            description={copy.cohortTwo.description}
            status={{
              kind: "coming-soon",
              label: copy.cohortTwo.statusLabel,
              note: copy.cohortTwo.note,
            }}
            href={null}
            actionLabel={copy.cohortTwo.actionLabel}
          />
        </div>
      </PageSection>
    </div>
  );
}
