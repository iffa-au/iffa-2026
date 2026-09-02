"use client";

import { useState } from "react";

import { alumni } from "../../data/alumni-data";
import { disciplineOptions } from "../../data/form-options";
import { pageCopy } from "../../data/talent-lab-edition";
import {
  chipOptions,
  chipSelection,
  distinctValues,
  EMPTY_ALUMNI_FILTERS,
  filterAlumni,
  toggleChip,
  type AlumniFilters,
} from "../../lib/filters";
import { AlumniCard } from "../components/alumni-card";
import { EmptyState } from "../components/empty-state";
import { FilterBar, FilterGroups } from "../components/filter-bar";
import { FilterChipRow } from "../components/filter-chip-row";
import { PageHeader } from "../components/page-header";
import { PageSection } from "../components/page-section";
import { ResultCount } from "../components/result-count";

const copy = pageCopy.alumni;

/**
 * Year chips are derived from the stories themselves, newest first — a cycle
 * added to `alumni-data.ts` gets a chip without anyone remembering to add one.
 * Disciplines use the catalogue's fixed index, so a discipline with no alumni
 * yet still appears (and honestly returns nothing).
 */
const YEAR_CHIPS = chipOptions(
  distinctValues(alumni, (alumnus) => alumnus.year).sort((a, b) => b.localeCompare(a))
);
const DISCIPLINE_CHIPS = chipOptions(disciplineOptions);

export function AlumniPage() {
  const [filters, setFilters] = useState<AlumniFilters>(EMPTY_ALUMNI_FILTERS);

  const visible = filterAlumni(alumni, filters);

  const clear = () => setFilters(EMPTY_ALUMNI_FILTERS);

  return (
    <div className="bg-black text-white">
      <PageHeader
        crumbs={[
          { label: "Talent Lab", href: "/talent-lab" },
          { label: "Alumni Stories" },
        ]}
        title={copy.title}
        intro={copy.intro}
      />

      <FilterBar>
        <FilterGroups>
          <FilterChipRow
            legend="Year"
            options={YEAR_CHIPS}
            selected={chipSelection(filters.years)}
            onToggle={(value) =>
              setFilters((current) => ({
                ...current,
                years: toggleChip(current.years, value),
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
        </FilterGroups>
      </FilterBar>

      <PageSection bordered={false}>
        <ResultCount count={visible.length} noun="story" pluralNoun="stories" />

        {visible.length > 0 ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((alumnus) => (
              <AlumniCard key={alumnus.slug} alumnus={alumnus} />
            ))}
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
