import type { PartnerGroup } from "../lib/types";

/**
 * PLACEHOLDER CONTENT — pending real data.
 *
 * The five partner categories from the approved design, verbatim.
 *
 * Every entry is a generic role description ("State screen agency"), not an
 * organisation name, and deliberately so: no organisation is listed as a Talent
 * Lab partner until an agreement is in place. Replacing a placeholder with a
 * real name is therefore a statement of fact about a signed relationship — the
 * partners page says so in its intro, and this is the file where that
 * commitment is either kept or broken.
 */

export const partnerGroups: PartnerGroup[] = [
  {
    category: "Government & screen agencies",
    organisations: [
      "National screen agency",
      "State screen agency",
      "Regional arts body",
      "Local government partner",
    ],
  },
  {
    category: "Industry organisations",
    organisations: [
      "Directors guild",
      "Producers association",
      "Actors union",
      "Crew guild",
    ],
  },
  {
    category: "Education partners",
    organisations: [
      "Film school",
      "University screen faculty",
      "TAFE screen program",
    ],
  },
  {
    category: "International partners",
    organisations: [
      "Partner festival — Asia",
      "Partner festival — Middle East",
      "Partner festival — Europe",
    ],
  },
  {
    category: "Corporate supporters",
    organisations: [
      "Equipment supplier",
      "Post-production facility",
      "Insurance partner",
    ],
  },
];

/**
 * The landing page's partner strip shows one tile per category. Derived from
 * `partnerGroups` so the strip can never list a category the partners page
 * does not have.
 */
export const partnerCategories: string[] = partnerGroups.map(
  (group) => group.category
);
