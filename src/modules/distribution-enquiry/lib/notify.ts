import { FIELD_KEYS } from "@/lib/email/field-keys";
import type { ConfirmationEmailPayload } from "@/lib/email/types";

import {
  DELIVERABLES,
  PRODUCTION_STATUSES,
  RIGHTS,
  SUBMITTER_ROLES,
  TERRITORIES,
  type Choice,
} from "../data/form-options";
import type { DistributionEnquiryValues } from "./schema";

type Named = { _id: string; name: string };

/** The cms-hub lists the form already loaded, used to turn ids back into names. */
export type NameLists = {
  contentTypes: Named[];
  genres: Named[];
  countries: Named[];
  languages: Named[];
};

const label = (choices: Choice[], value: string) =>
  choices.find((c) => c.value === value)?.label ?? value;
const labels = (choices: Choice[], values: string[]) =>
  values.map((v) => label(choices, v)).join(", ");
const nameOf = (list: Named[], id: string) => list.find((x) => x._id === id)?.name ?? id;

/**
 * The admin notification and submitter confirmation for an enquiry that cms-hub
 * has already stored. The screener password is left out on purpose: staff read
 * it in the CMS, and it has no business sitting in two inboxes.
 */
export function toConfirmationEmail(
  values: DistributionEnquiryValues,
  lists: NameLists,
): ConfirmationEmailPayload {
  return {
    formType: "distribution-enquiry",
    submitterEmail: values.email.trim(),
    submitterName: values.name.trim(),
    fields: {
      [FIELD_KEYS.FULL_NAME]: values.name.trim(),
      [FIELD_KEYS.EMAIL]: values.email.trim(),
      [FIELD_KEYS.PHONE_NUMBER]: values.phone,
      [FIELD_KEYS.COUNTRY]: nameOf(lists.countries, values.countryId),
      "Company / Production House": values.company,
      Role: label(SUBMITTER_ROLES, values.role),
      "Film Title": values.title,
      "Content Type": nameOf(lists.contentTypes, values.contentTypeId),
      Genres: values.genreIds.map((id) => nameOf(lists.genres, id)).join(", "),
      Language: nameOf(lists.languages, values.languageId),
      "Runtime (minutes)": values.runtime,
      Year: values.year,
      "Production Status": label(PRODUCTION_STATUSES, values.productionStatus),
      "Rights Available": labels(RIGHTS, values.rights),
      "Territories Sought": labels(TERRITORIES, values.territories),
      "Deliverables Ready": labels(DELIVERABLES, values.deliverables),
      "Screener Link": values.screenerUrl.trim(),
    },
  };
}
