"use client";

import { useState } from "react";

import { resourceTopicOptions } from "../../data/form-options";
import { resources } from "../../data/resources-data";
import { pageCopy } from "../../data/talent-lab-edition";
import {
  chipOptions,
  chipSelection,
  EMPTY_RESOURCE_FILTERS,
  filterResources,
  toggleChip,
  type ResourceFilters,
} from "../../lib/filters";
import { EmptyState } from "../components/empty-state";
import { FilterBar } from "../components/filter-bar";
import { FilterChipRow } from "../components/filter-chip-row";
import { PageHeader } from "../components/page-header";
import { PageSection } from "../components/page-section";
import { ResourceList, ResourceRow } from "../components/resource-row";
import { ResultCount } from "../components/result-count";
import { ClearFiltersButton, SearchField } from "../components/search-field";

const copy = pageCopy.resources;

const TOPIC_CHIPS = chipOptions(resourceTopicOptions);

export function ResourcesPage() {
  const [filters, setFilters] = useState<ResourceFilters>(EMPTY_RESOURCE_FILTERS);

  const visible = filterResources(resources, filters);

  const clear = () => setFilters(EMPTY_RESOURCE_FILTERS);

  return (
    <div className="bg-black text-white">
      <PageHeader
        crumbs={[{ label: "Talent Lab", href: "/talent-lab" }, { label: "Resources" }]}
        title={copy.title}
        intro={copy.intro}
      />

      <FilterBar>
        <SearchField
          id="resource-search"
          label="Search"
          placeholder={copy.searchPlaceholder}
          value={filters.query}
          onChange={(query) => setFilters((current) => ({ ...current, query }))}
        >
          <ClearFiltersButton onClear={clear} />
        </SearchField>

        <FilterChipRow
          legend="Topic"
          options={TOPIC_CHIPS}
          selected={chipSelection(filters.tags)}
          onToggle={(value) =>
            setFilters((current) => ({
              ...current,
              tags: toggleChip(current.tags, value),
            }))
          }
        />
      </FilterBar>

      <PageSection bordered={false}>
        {/*
          §11.1 — every `Resource.href` is currently `null`, so every action on
          this page renders inert. Saying so once at the top of the list is more
          honest than nine "Coming soon" labels with no explanation.
        */}
        <p className="mb-7 max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-light leading-relaxed text-white/60">
          {copy.inertNote}
        </p>

        <ResultCount count={visible.length} noun="resource" />

        {visible.length > 0 ? (
          <div className="mt-7">
            <ResourceList>
              {visible.map((resource) => (
                <ResourceRow key={resource.id} resource={resource} showTags />
              ))}
            </ResourceList>
          </div>
        ) : (
          <div className="mt-7">
            <EmptyState message={copy.emptyMessage} hint={copy.emptyHint}>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center justify-center rounded-sm border border-yellow-400 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-400 transition-colors hover:bg-yellow-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                Clear filters
              </button>
            </EmptyState>
          </div>
        )}
      </PageSection>
    </div>
  );
}
