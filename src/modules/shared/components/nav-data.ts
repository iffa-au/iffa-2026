/**
 * The single source for what is in the site nav.
 *
 * The bar and the drawer render the same destinations in two different shapes,
 * and before this file every label and href was written out twice in
 * `header.tsx` — the two copies had already drifted. Anything that appears in
 * both belongs here.
 */

export type NavLink = {
  label: string
  href: string
}

/** Matches `/talent-lab` for `/talent-lab`, and for `/talent-lab/mentors`, but not for `/talent-lab-foo`. */
export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const TALENT_LAB_HREF = "/talent-lab"

// Flat, unlike the events tree: every Talent Lab destination is a real page, so
// nesting them behind a submenu would add a hover step and buy nothing.
export const TALENT_LAB_LINKS: NavLink[] = [
  { label: "Overview", href: "/talent-lab" },
  { label: "Current Opportunities", href: "/talent-lab/opportunities" },
  { label: "Programs & Streams", href: "/talent-lab/programs" },
  { label: "Mentors", href: "/talent-lab/mentors" },
  { label: "Events & Masterclasses", href: "/talent-lab/events" },
  { label: "Alumni Stories", href: "/talent-lab/alumni" },
  { label: "Resources", href: "/talent-lab/resources" },
  { label: "Partners", href: "/talent-lab/partners" },
]

/** The one destination we actually want people to reach; marked out in gold, not buried in the list. */
export const TALENT_LAB_CTA: NavLink = {
  label: "Register Your Interest",
  href: "/talent-lab/register",
}

export const EVENTS_HREF = "/events"

export const EVENT_YEARS = ["2026", "2025", "2024", "2023", "2022"] as const

export const EVENT_SECTIONS = [
  { label: "Submissions", segment: "submissions" },
  { label: "Nominations", segment: "nominations" },
  { label: "Winners", segment: "winners" },
] as const

/** Top-level links with no menu behind them. */
export const PRIMARY_LINKS: NavLink[] = [
  { label: "Festival", href: "/festivals" },
  { label: "Podcast", href: "/podcast" },
  { label: "Latest News", href: "/latest-news" },
]

/**
 * The header's one call to action.
 *
 * Points at the enquiry form rather than `/submit-film`, matching the CTAs on
 * the nominations and winners pages — the site has two submission forms and
 * only one of them should be the funnel everything feeds into.
 */
export const SUBMIT_CTA: NavLink = {
  label: "Submit Film",
  href: "/submit-film-enquiry",
}

/**
 * The nav's typographic voice: uppercase Raleway at wide tracking. It is the
 * site's established nav language (footer and section sub-navs use it too), so
 * it is shared rather than restated per component.
 */
export const NAV_LABEL = "font-sans tracking-[0.2em] uppercase"

/** A top-level trigger in the desktop bar. The gold rule under the active one is the only accent. */
export const NAV_ITEM =
  "relative rounded-[5px] border-none bg-transparent px-2.5 py-1.5 text-white text-[11px] xl:text-xs " +
  NAV_LABEL +
  " transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-yellow-400/70 " +
  "after:pointer-events-none after:absolute after:inset-x-2.5 after:-bottom-px after:h-px after:origin-center after:scale-x-0 " +
  "after:bg-yellow-400 after:transition-transform after:duration-200 data-[active=true]:after:scale-x-100 " +
  "data-[active=true]:text-yellow-400"

/** A row inside either dropdown menu. */
export const NAV_MENU_ITEM =
  "text-white text-[11px] " +
  NAV_LABEL +
  " focus:bg-white/15 focus:text-white data-[active=true]:text-yellow-400 rounded-[2px] cursor-pointer"
