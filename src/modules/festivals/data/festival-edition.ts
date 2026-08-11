/**
 * Festival identity for the current edition.
 *
 * Named `festival-edition.ts` on purpose: `src/modules/iffa-global/lib/festival-data.ts`
 * already exists and describes a completely different concept (the sister
 * festivals AIFFA / MIFFA / AKSOMAN / ABIFF). Keep the two names distinct.
 */

export type FestivalVenue = {
  name: string;
  suburb: string;
};

export type FestivalEdition = {
  editionLabel: string;
  title: string;
  tagline: string;
  intro: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  /** Must be a file that actually exists in `public/`. */
  bannerImage: string;
  venues: FestivalVenue[];
};

export const festivalEdition: FestivalEdition = {
  editionLabel: "FESTIVAL 2026-2027",
  title: "International Film Festival of Australia",
  tagline: "20-26 August 2026 - Melbourne, Australia",
  intro:
    "Seven nights of curated world cinema across four countries, paired with masterclasses, industry exchange and mentorship for the filmmakers coming next.",
  startDate: "2026-08-20",
  endDate: "2026-08-26",
  city: "Melbourne",
  country: "Australia",
  bannerImage: "/masterclass_banner.png",
  venues: [
    { name: "Main Theatre", suburb: "Melbourne CBD" },
    { name: "Cinema Two", suburb: "Melbourne CBD" },
    { name: "Docklands Screen", suburb: "Docklands" },
    { name: "Federation Hall", suburb: "Southbank" },
    { name: "Riverside Pavilion", suburb: "South Wharf" },
  ],
};
