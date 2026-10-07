/**
 * The homepage hero banner — the single place to update it each year: edit the
 * copy below and swap the artwork at `public/assets/home/`.
 *
 * "IFFA Awards 2026" being held on "27 March 2027" is correct: this is the 2026
 * edition, which runs in early 2027. Neither year is a typo.
 */

export type HeroBanner = {
  title: string;
  date: string;
  location: string;
  imageSrc: string;
  /** Describes the photograph only — the headline belongs to the <h1>. */
  imageAlt: string;
};

export const heroBanner: HeroBanner = {
  title: "IFFA Awards 2026",
  date: "27 March 2027",
  location: "Melbourne, Australia",
  imageSrc: "/assets/home/iffa-awards-2026-banner.webp",
  imageAlt:
    "Melbourne skyline at dusk across the Yarra River, with Flinders Street Station and Princes Bridge lit up",
};
