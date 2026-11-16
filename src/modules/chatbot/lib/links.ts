import { programCards } from "@/modules/festivals/data/programs-data";
import { festivalData, festivalSlugs } from "@/modules/iffa-global/lib/festival-data";

/**
 * The links the bot may use. Shared by the server (it lists SITE_PAGES in the
 * prompt) and the chat widget (it only turns allowed links into real links;
 * anything else shows as plain text). So a made-up link from the model can
 * never send a visitor to a 404 or to an outside site.
 *
 * No "server-only" here: the widget imports it too. Keep it to plain data.
 */

/** Pages the bot is told it may link to. Add a page here when the site gets a new one. */
export const SITE_PAGES: { path: string; what: string }[] = [
  { path: "/", what: "Home page" },
  { path: "/AboutUs", what: "About IFFA, award categories, voting body, trophy" },
  { path: "/festivals", what: "The current festival: dates, programme, screenings, venues" },
  { path: "/festivals/programs", what: "Festival program streams" },
  { path: "/festivals/programs/masterclass", what: "Masterclasses & sessions" },
  { path: "/submit-film-enquiry", what: "Main form for filmmakers enquiring about submitting a film (preferred starting point)" },
  { path: "/submit-film", what: "Full film submission form" },
  { path: "/distribution-enquiry", what: "Filmmakers looking for distribution" },
  { path: "/contact", what: "Contact form for any other question" },
  { path: "/events/2026/nominations", what: "Nominations by year (2022-2026 available; change the year in the URL)" },
  { path: "/events/2026/winners", what: "Winners by year (2022-2026 available)" },
  { path: "/events/2026/submissions", what: "Submissions by year (2022-2026 available)" },
  { path: "/talent-lab", what: "IFFA Talent Lab overview" },
  { path: "/talent-lab/opportunities", what: "Current Talent Lab opportunities, dates and fees" },
  { path: "/talent-lab/programs", what: "Talent Lab programs & streams" },
  { path: "/talent-lab/mentors", what: "Talent Lab mentors" },
  { path: "/talent-lab/events", what: "Talent Lab events & masterclasses" },
  { path: "/talent-lab/register", what: "Register interest in the Talent Lab" },
  { path: "/talent-lab/resources", what: "Free resource library" },
  { path: "/iffa-global", what: "IFFA's partner festivals around the world" },
  { path: "/australia", what: "Filming in Australia: guide, locations, opportunities, production support" },
  { path: "/malaysia", what: "Filming in Malaysia" },
  { path: "/oman", what: "Filming in Oman (with an enquiry form at /oman/enquiry)" },
  { path: "/education-training", what: "Education & training" },
  { path: "/partnerwithus", what: "Sponsorship and partnership with IFFA" },
  { path: "/podcast", what: "IFFA podcast" },
  { path: "/latest-news", what: "Latest news" },
];

/** Exact paths that are allowed besides SITE_PAGES. */
const EXTRA_PATHS = [
  "/oman/enquiry",
  ...festivalSlugs.map((slug) => `/iffa-global/${slug}`),
  ...programCards.flatMap((p) => (p.href ? [p.href] : [])),
];

/** Page families whose ids come from the live programme or the year. */
const PATH_PATTERNS = [
  /^\/festivals\/(screening|film)\/[\w-]+$/,
  /^\/events\/20\d\d\/(nominations|winners|submissions)$/,
];

const ALLOWED_PATHS = new Set([...SITE_PAGES.map((p) => p.path), ...EXTRA_PATHS].map((p) => p.toLowerCase()));

/** Outside sites the bot may link to: only the IFFA Global partner festivals' own websites. */
const ALLOWED_HOSTS = new Set(
  Object.values(festivalData).flatMap((f) => {
    try {
      return [new URL(f.websiteUrl).host.toLowerCase()];
    } catch {
      return [];
    }
  }),
);

/** True for a site path the bot may link to, e.g. "/contact" or "/festivals/film/abc123". */
export function isSiteLink(href: string): boolean {
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  const path = href.split(/[?#]/)[0].replace(/(.)\/+$/, "$1");
  return ALLOWED_PATHS.has(path.toLowerCase()) || PATH_PATTERNS.some((p) => p.test(path));
}

/** True for an https link to one of the IFFA Global partner festivals' websites. */
export function isAllowedExternalLink(href: string): boolean {
  try {
    const url = new URL(href);
    return url.protocol === "https:" && ALLOWED_HOSTS.has(url.host.toLowerCase());
  } catch {
    return false;
  }
}
