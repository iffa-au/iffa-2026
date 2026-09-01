"use client";

import Link from "next/link";
import { useState } from "react";

import {
  careerStageOptions,
  deliveryModeOptions,
  disciplineOptions,
  statusFilterOptions,
} from "../../data/form-options";
import { opportunities } from "../../data/opportunities-data";
import { pageCopy } from "../../data/talent-lab-edition";
import {
  chipOptions,
  chipSelection,
  EMPTY_OPPORTUNITY_FILTERS,
  filterOpportunities,
  toggleChip,
  withAllChip,
  type OpportunityFilters,
} from "../../lib/filters";
import { CalloutBand } from "../components/callout-band";
import { EmptyState } from "../components/empty-state";
import { FilterBar, FilterGroups } from "../components/filter-bar";
import { FilterChipRow } from "../components/filter-chip-row";
import { OpportunityCard } from "../components/opportunity-card";
import { PageHeader } from "../components/page-header";
import { PageSection } from "../components/page-section";
import { ResultCount } from "../components/result-count";
import { ClearFiltersButton, SearchField } from "../components/search-field";

const copy = pageCopy.opportunities;

/**
 * Chip vocabularies, built once at module scope.
 *
 * Status chips come from `statusFilterOptions`, which is itself derived from
 * the status map — a new state added to `lib/status.ts` therefore appears here
 * automatically rather than being quietly missing from the filter row.
 */
const STATUS_CHIPS = withAllChip(statusFilterOptions);
const DISCIPLINE_CHIPS = chipOptions(disciplineOptions);
const DELIVERY_CHIPS = chipOptions(deliveryModeOptions);
const STAGE_CHIPS = chipOptions(careerStageOptions);

export function CohortOneOpportunitiesPage() {
  const [filters, setFilters] = useState<OpportunityFilters>(
    EMPTY_OPPORTUNITY_FILTERS
  );

  /** Every count and every card comes from this one call. Nothing is typed. */
  const visible = filterOpportunities(opportunities, filters);
  const isFiltered =
    filters.statuses.length > 0 ||
    filters.disciplines.length > 0 ||
    filters.deliveryModes.length > 0 ||
    filters.stages.length > 0 ||
    filters.query.trim() !== "";

  const clear = () => setFilters(EMPTY_OPPORTUNITY_FILTERS);

  return (
    <div className="bg-black text-white">
      <PageHeader
        crumbs={[
          { label: "Talent Lab", href: "/talent-lab" },
          { label: "Opportunities", href: "/talent-lab/opportunities" },
          { label: "Cohort 1" },
        ]}
        eyebrow={copy.eyebrow}
        title={copy.title}
        intro={copy.intro}
      />

      <FilterBar>
        <SearchField
          id="opportunity-search"
          label="Search"
          placeholder={copy.searchPlaceholder}
          value={filters.query}
          onChange={(query) => setFilters((current) => ({ ...current, query }))}
        >
          <ClearFiltersButton onClear={clear} />
        </SearchField>

        <FilterGroups>
          <FilterChipRow
            legend="Status"
            options={STATUS_CHIPS}
            selected={chipSelection(filters.statuses)}
            onToggle={(value) =>
              setFilters((current) => ({
                ...current,
                statuses: toggleChip(current.statuses, value),
              }))
            }
          />

          <FilterChipRow
            legend="Discipline"
            options={DISCIPLINE_CHIPS}
            selected={chipSelection(filters.disciplines)}
            onToggle={(value) =>
              setFilters((current) => ({
                ...current,
                disciplines: toggleChip(current.disciplines, value),
              }))
            }
          />

          <FilterChipRow
            legend="Delivery"
            options={DELIVERY_CHIPS}
            selected={chipSelection(filters.deliveryModes)}
            onToggle={(value) =>
              setFilters((current) => ({
                ...current,
                deliveryModes: toggleChip(current.deliveryModes, value),
              }))
            }
          />

          <FilterChipRow
            legend="Career stage"
            options={STAGE_CHIPS}
            selected={chipSelection(filters.stages)}
            onToggle={(value) =>
              setFilters((current) => ({
                ...current,
                stages: toggleChip(current.stages, value),
              }))
            }
          />
        </FilterGroups>
      </FilterBar>

      <PageSection bordered={false}>
        <ResultCount count={visible.length} noun="program" />

        {visible.length > 0 ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <div className="mt-7">
            <EmptyState message={copy.emptyMessage} hint={copy.emptyHint}>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center justify-center rounded-sm border border-white/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                Clear filters
              </button>

              <Link
                href="/talent-lab/register"
                className="inline-flex items-center justify-center rounded-sm border border-yellow-400 bg-yellow-400 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Register your interest
              </Link>
            </EmptyState>
          </div>
        )}

        {isFiltered && visible.length > 0 && (
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
            Showing {visible.length} of {opportunities.length} —{" "}
            <button
              type="button"
              onClick={clear}
              className="rounded-sm text-yellow-400 underline underline-offset-4 transition-colors hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              clear filters
            </button>
          </p>
        )}

        <div className="mt-14">
          <CalloutBand
            eyebrow={copy.calloutEyebrow}
            heading={copy.calloutHeading}
            body={copy.calloutBody}
            actionLabel="Register your interest"
            actionHref="/talent-lab/register"
          />
        </div>
      </PageSection>
    </div>
  );
}
