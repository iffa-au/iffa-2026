import type {
  Alumnus,
  Mentor,
  Opportunity,
  Resource,
  Stream,
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

/**
 * The leading "All" chip.
 *
 * Every filter group in the design opens with an `All` chip, while the
 * functions above express "no filter" as an **empty** selection. Rather than
 * teach `filter-chip-row` about a special case, the two vocabularies are
 * translated here: `withAllChip` prepends the option, `chipSelection` marks it
 * pressed while nothing else is, and `toggleChip` clears the group when it is
 * pressed. A view therefore holds state and renders — it never decides what a
 * chip means.
 *
 * The sentinel is deliberately not a value any real record can hold.
 */
export const ALL_CHIP = "__all__";

export const withAllChip = <T extends { value: string; label?: string }>(
  options: readonly T[]
): { value: string; label?: string }[] => [
  { value: ALL_CHIP, label: "All" },
  ...options,
];

/** Turns a plain string list into chip options, with the `All` chip in front. */
export const chipOptions = (
  values: readonly string[]
): { value: string; label?: string }[] =>
  withAllChip(values.map((value) => ({ value })));

/** What `filter-chip-row` should show as pressed for a given selection. */
export const chipSelection = (selected: readonly string[]): string[] =>
  selected.length === 0 ? [ALL_CHIP] : [...selected];

/** Applies a chip press: `All` clears the group, anything else toggles. */
export const toggleChip = (
  selected: readonly string[],
  value: string
): string[] => (value === ALL_CHIP ? [] : toggleValue(selected, value));

// ------------------------------------------------------------ single records

export const streamBySlug = (
  streams: readonly Stream[],
  slug: string
): Stream | undefined => streams.find((stream) => stream.slug === slug);

export const eventBySlug = (
  events: readonly TalentLabEvent[],
  slug: string
): TalentLabEvent | undefined => events.find((event) => event.slug === slug);

/**
 * The opportunity currently advertising a stream, if there is one.
 *
 * `Stream.status` and `Opportunity.status` state the same fact twice (plan
 * §5.1 puts one on each), and only the opportunity carries the dates. The
 * program detail page therefore resolves the opportunity first and treats it as
 * authoritative, falling back to `Stream.status` for the two streams that have
 * no opportunity of their own. Resolving at the point of consumption removes
 * the duplication without changing the shape of either record.
 */
export const opportunityForStream = (
  opportunities: readonly Opportunity[],
  slug: string
): Opportunity | undefined =>
  opportunities.find((opportunity) => opportunity.streamSlug === slug);
