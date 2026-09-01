/**
 * What is left of the old static festival identity.
 *
 * Everything else this file used to hold — series label, city, venues, dates —
 * now lives in the `FestivalSettings` document in cms-hub and reaches the page
 * through `lib/festival-api.ts`. Only the masterclass banner remains, because
 * the Programs module has not been moved to the CMS yet.
 *
 * Delete this file when `masterclass-page.tsx` gets its banner from the CMS.
 */

export const festivalEdition = {
  /** Must be a file that actually exists in `public/`. */
  bannerImage: "/masterclass_banner.png",
} as const;
