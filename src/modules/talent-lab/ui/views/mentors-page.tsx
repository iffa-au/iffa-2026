"use client";

import { useRef, useState } from "react";

import {
  disciplineOptions,
  MENTOR_TYPE_CLASSES,
  mentorTypeOptions,
} from "../../data/form-options";
import { mentors } from "../../data/mentors-data";
import { pageCopy } from "../../data/talent-lab-edition";
import {
  chipOptions,
  chipSelection,
  EMPTY_MENTOR_FILTERS,
  filterMentors,
  toggleChip,
  type MentorFilters,
} from "../../lib/filters";
import type { Mentor, MentorType } from "../../lib/types";
import { EmptyState } from "../components/empty-state";
import { FilterBar, FilterGroups } from "../components/filter-bar";
import { FilterChipRow } from "../components/filter-chip-row";
import { MentorCard } from "../components/mentor-card";
import { MentorProfileDialog } from "../components/mentor-profile-dialog";
import { PageHeader } from "../components/page-header";
import { PageSection } from "../components/page-section";
import { ResultCount } from "../components/result-count";

const copy = pageCopy.mentors;

const DISCIPLINE_CHIPS = chipOptions(disciplineOptions);
const TYPE_CHIPS = chipOptions(mentorTypeOptions);

/** The badge legend under the intro — the same classes the cards use. */
function TypeLegend({ type }: { type: MentorType }) {
  return (
    <span
      className={`rounded-sm border px-2.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] ${MENTOR_TYPE_CLASSES[type]}`}
    >
      {type}
    </span>
  );
}

export function MentorsPage() {
  const [filters, setFilters] = useState<MentorFilters>(EMPTY_MENTOR_FILTERS);

  /**
   * The dialog keeps the selected mentor after `open` flips to false, so the
   * profile does not blank out mid-close animation.
   *
   * `triggerRef` holds the card that opened it. Radix restores focus to a
   * `DialogTrigger`, and there isn't one here — the directory opens the dialog
   * from state — so the card hands over its own element and the dialog puts
   * focus back on it. See the note in `mentor-profile-dialog.tsx`.
   */
  const [selected, setSelected] = useState<Mentor | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const visible = filterMentors(mentors, filters);

  const clear = () => setFilters(EMPTY_MENTOR_FILTERS);

  return (
    <div className="bg-black text-white">
      <PageHeader
        crumbs={[{ label: "Talent Lab", href: "/talent-lab" }, { label: "Mentors" }]}
        title={copy.title}
        intro={copy.intro}
      >
        <div className="flex flex-wrap gap-2.5">
          {mentorTypeOptions.map((type) => (
            <TypeLegend key={type} type={type} />
          ))}
        </div>
      </PageHeader>

      <FilterBar>
        <FilterGroups>
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
            legend="Type"
            options={TYPE_CHIPS}
            selected={chipSelection(filters.types)}
            onToggle={(value) =>
              setFilters((current) => ({
                ...current,
                types: toggleChip(current.types, value),
              }))
            }
          />
        </FilterGroups>
      </FilterBar>

      <PageSection bordered={false}>
        <ResultCount count={visible.length} noun="person" pluralNoun="people" />

        {visible.length > 0 ? (
          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((mentor) => (
              <MentorCard
                key={mentor.slug}
                mentor={mentor}
                onSelect={(picked, trigger) => {
                  triggerRef.current = trigger;
                  setSelected(picked);
                  setIsOpen(true);
                }}
              />
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

      <MentorProfileDialog
        mentor={selected}
        open={isOpen}
        onOpenChange={setIsOpen}
        triggerRef={triggerRef}
      />
    </div>
  );
}
