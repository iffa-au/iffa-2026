import type {
  Alumnus,
  Mentor,
  Opportunity,
  Resource,
  TalentLabEvent,
} from "./types";

/**
 * One pure filter function per filterable collection.
 *
 * Five collections share the same chip-filter shape, so the logic lives here
 * once rather than inline in five views. Every "{n} shown" count on every page
 * is `filterX(...).length` — no page ever types a number that describes data.
 *
 * Selection semantics are uniform: an **empty** selection means "no filter
 * applied", so a page with nothing selected shows everything. Within one group
 * the chips are OR'd; across groups they are AND'd.
 */

/** True when nothing is selected, or when `value` is one of the selections. */
const matches = (selected: readonly string[], value: string): boolean =>
  selected.length === 0 || selected.includes(value);

/** True when nothing is selected, or when any of `values` is selected. */
const matchesAny = (selected: readonly string[], values: readonly string[]): boolean =>
  selected.length === 0 || values.some((value) => selected.includes(value));

/** Case- and whitespace-insensitive substring match across several fields. */
const matchesQuery = (query: string, ...fields: string[]): boolean => {
  const needle = query.trim().toLowerCase();
  if (needle === "") return true;
  return fields.some((field) => field.toLowerCase().includes(needle));
};

// ---------------------------------------------------------------- opportunities

export type OpportunityFilters = {
  statuses: readonly string[];
  disciplines: readonly string[];
  deliveryModes: readonly string[];
  stages: readonly string[];
  query: string;
};

export const EMPTY_OPPORTUNITY_FILTERS: OpportunityFilters = {
  statuses: [],
  disciplines: [],
  deliveryModes: [],
  stages: [],
  query: "",
};

export const filterOpportunities = (
  opportunities: readonly Opportunity[],
  filters: OpportunityFilters
): Opportunity[] =>
  opportunities.filter(
    (opportunity) =>
      matches(filters.statuses, opportunity.status) &&
      matches(filters.disciplines, opportunity.discipline) &&
      matches(filters.deliveryModes, opportunity.deliveryMode) &&
      matches(filters.stages, opportunity.stage) &&
      matchesQuery(
        filters.query,
        opportunity.title,
        opportunity.summary,
        opportunity.modeLabel,
        ...opportunity.tags
      )
  );

// --------------------------------------------------------------------- mentors

export type MentorFilters = {
  disciplines: readonly string[];
  types: readonly string[];
};

export const EMPTY_MENTOR_FILTERS: MentorFilters = { disciplines: [], types: [] };

export const filterMentors = (
  mentors: readonly Mentor[],
  filters: MentorFilters
): Mentor[] =>
  mentors.filter(
    (mentor) =>
      matches(filters.disciplines, mentor.discipline) &&
      matches(filters.types, mentor.type)
  );

// ---------------------------------------------------------------------- alumni

export type AlumniFilters = {
  years: readonly string[];
  disciplines: readonly string[];
};

export const EMPTY_ALUMNI_FILTERS: AlumniFilters = { years: [], disciplines: [] };

export const filterAlumni = (
  alumni: readonly Alumnus[],
  filters: AlumniFilters
): Alumnus[] =>
  alumni.filter(
    (alumnus) =>
      matches(filters.years, alumnus.year) &&
      matches(filters.disciplines, alumnus.discipline)
  );

// ------------------------------------------------------------------- resources

export type ResourceFilters = {
  tags: readonly string[];
  query: string;
};

export const EMPTY_RESOURCE_FILTERS: ResourceFilters = { tags: [], query: "" };

export const filterResources = (
  resources: readonly Resource[],
  filters: ResourceFilters
): Resource[] =>
  resources.filter(
    (resource) =>
      matchesAny(filters.tags, resource.tags) &&
      matchesQuery(filters.query, resource.title, resource.meta, ...resource.tags)
  );

// ------------------------------------------------------------------ resolution

/**
 * A stream stores mentor slugs and resource ids rather than embedded objects,
 * so a mentor edited once is corrected everywhere. These resolve the references
 * and silently drop any that no longer exist.
 */

export const mentorsBySlug = (
  mentors: readonly Mentor[],
  slugs: readonly string[]
): Mentor[] =>
  slugs
    .map((slug) => mentors.find((mentor) => mentor.slug === slug))
    .filter((mentor): mentor is Mentor => mentor !== undefined);

export const resourcesById = (
  resources: readonly Resource[],
  ids: readonly string[]
): Resource[] =>
  ids
    .map((id) => resources.find((resource) => resource.id === id))
    .filter((resource): resource is Resource => resource !== undefined);

/** Splits the event list on `state` so neither list is maintained by hand. */
export const partitionEvents = (
  events: readonly TalentLabEvent[]
): { upcoming: TalentLabEvent[]; past: TalentLabEvent[] } => ({
  upcoming: events.filter((event) => event.state === "upcoming"),
  past: events.filter((event) => event.state === "past"),
});

// ---------------------------------------------------------------------- chips

/** Distinct values in first-seen order — used to build chip rows from data. */
export const distinctValues = <T,>(
  items: readonly T[],
  pick: (item: T) => string
): string[] => Array.from(new Set(items.map(pick)));

/** Every distinct tag across a collection, flattened and de-duplicated. */
export const distinctTags = <T,>(
  items: readonly T[],
  pick: (item: T) => readonly string[]
): string[] => Array.from(new Set(items.flatMap((item) => pick(item))));

/** Adds `value` to a selection, or removes it when already present. */
export const toggleValue = (selected: readonly string[], value: string): string[] =>
  selected.includes(value)
    ? selected.filter((entry) => entry !== value)
    : [...selected, value];
