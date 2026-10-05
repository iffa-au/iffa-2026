/**
 * Fixed vocabularies for the distribution enquiry form.
 *
 * Content type, genre, country and language are deliberately not here — they
 * come from cms-hub (`useSubmissionOptions`), the same lists the submission and
 * film enquiry forms use, so an enquiry can be stored against real ids once the
 * form is wired to a backend.
 */

export type Choice = { value: string; label: string };

export const SUBMITTER_ROLES: Choice[] = [
  { value: "producer", label: "Producer" },
  { value: "director", label: "Director" },
  { value: "sales-agent", label: "Sales agent" },
  { value: "rights-holder", label: "Rights holder" },
  { value: "other", label: "Other" },
];

export const PRODUCTION_STATUSES: Choice[] = [
  { value: "completed", label: "Completed" },
  { value: "post-production", label: "In post-production" },
  { value: "production", label: "In production" },
];

export const RIGHTS: Choice[] = [
  { value: "theatrical", label: "Theatrical" },
  { value: "tv", label: "TV / Broadcast" },
  { value: "svod", label: "Streaming (SVOD)" },
  { value: "tvod", label: "Rental & purchase (TVOD)" },
  { value: "non-theatrical", label: "Airline & non-theatrical" },
  { value: "all", label: "All rights" },
];

export const TERRITORIES: Choice[] = [
  { value: "worldwide", label: "Worldwide" },
  { value: "anz", label: "Australia & New Zealand" },
  { value: "asia", label: "Asia" },
  { value: "mena", label: "Middle East & North Africa" },
  { value: "europe", label: "Europe" },
  { value: "north-america", label: "North America" },
  { value: "latin-america", label: "Latin America" },
  { value: "africa", label: "Sub-Saharan Africa" },
];

export const DELIVERABLES: Choice[] = [
  { value: "dcp", label: "DCP" },
  { value: "prores", label: "ProRes master" },
  { value: "english-subtitles", label: "English subtitles" },
  { value: "me-track", label: "M&E track" },
  { value: "trailer", label: "Trailer" },
  { value: "key-art", label: "Key art" },
];

export const SYNOPSIS_MAX = 1000;
