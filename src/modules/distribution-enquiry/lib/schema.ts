import { z } from "zod";

import { SYNOPSIS_MAX } from "../data/form-options";

const required = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

/**
 * A link that may be left blank. `z.url()` alone rejects "", which would fail
 * an optional field the moment someone tabbed through it.
 */
const optionalUrl = z.union([
  z.literal(""),
  z.url({ message: "Enter a full link, starting with https://" }),
]);

const pickAtLeastOne = (message: string) => z.array(z.string()).min(1, message);

const THIS_YEAR = new Date().getFullYear();

export const distributionEnquirySchema = z.object({
  // About you
  name: required("Your name"),
  email: z.email({ message: "Enter a valid email address." }),
  phone: z.string().trim(),
  company: required("Company or production house"),
  role: required("Your role"),
  website: optionalUrl,

  // The film
  title: required("Film title"),
  contentTypeId: required("Content type"),
  genreIds: pickAtLeastOne("Choose at least one genre."),
  countryId: required("Country of origin"),
  languageId: required("Original language"),
  runtime: z
    .string()
    .trim()
    .regex(/^\d{1,3}$/, "Enter the runtime in whole minutes.")
    .refine((v) => Number(v) > 0, "Enter the runtime in whole minutes."),
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter a four-digit year.")
    .refine(
      (v) => Number(v) >= 1900 && Number(v) <= THIS_YEAR + 5,
      `Enter a year between 1900 and ${THIS_YEAR + 5}.`,
    ),
  productionStatus: required("Production status"),
  synopsis: required("Synopsis").max(
    SYNOPSIS_MAX,
    `Keep the synopsis under ${SYNOPSIS_MAX} characters.`,
  ),
  festivals: z.string().trim(),

  // Distribution
  rights: pickAtLeastOne("Choose the rights you can offer."),
  territories: pickAtLeastOne("Choose at least one territory."),
  territoriesSold: z.string().trim(),
  deliverables: z.array(z.string()),

  // Screening material
  screenerUrl: z.url({ message: "Enter a full link, starting with https://" }),
  screenerPassword: z.string(),
  trailerUrl: optionalUrl,
  notes: z.string().trim(),

  // `z.literal(true)` here would abort the object parse on an unticked box and
  // hide every other error until it was ticked; a refined boolean reports it
  // alongside the rest.
  rightsConfirmed: z
    .boolean()
    .refine(Boolean, "Confirm you can represent this film's rights."),
});

export type DistributionEnquiryValues = z.infer<typeof distributionEnquirySchema>;

export const EMPTY_ENQUIRY: DistributionEnquiryValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  website: "",
  title: "",
  contentTypeId: "",
  genreIds: [],
  countryId: "",
  languageId: "",
  runtime: "",
  year: "",
  productionStatus: "",
  synopsis: "",
  festivals: "",
  rights: [],
  territories: [],
  territoriesSold: "",
  deliverables: [],
  screenerUrl: "",
  screenerPassword: "",
  trailerUrl: "",
  notes: "",
  rightsConfirmed: false,
};

/**
 * The request body a backend would receive. Nothing sends it yet — see the
 * note in the page's submit handler — but shaping it now means wiring the form
 * up is one `fetch` at that boundary, not a rewrite.
 */
export function toPayload(values: DistributionEnquiryValues) {
  return {
    name: values.name,
    email: values.email.trim(),
    phone: values.phone,
    company: values.company,
    role: values.role,
    website: values.website,
    title: values.title,
    contentType: values.contentTypeId,
    genreIds: values.genreIds,
    country: values.countryId,
    language: values.languageId,
    runtimeMinutes: Number(values.runtime),
    year: Number(values.year),
    productionStatus: values.productionStatus,
    synopsis: values.synopsis,
    festivals: values.festivals,
    rights: values.rights,
    territories: values.territories,
    territoriesSold: values.territoriesSold,
    deliverables: values.deliverables,
    screenerUrl: values.screenerUrl.trim(),
    screenerPassword: values.screenerPassword,
    trailerUrl: values.trailerUrl,
    notes: values.notes,
  };
}
