import { Big_Shoulders, Newsreader } from "next/font/google";

/**
 * Two faces, loaded for the Festival section only.
 *
 * Deliberately not in the root layout: the rest of the site is Raleway, and
 * these exist to give the festival its own voice. `next/font` scopes a font to
 * wherever its variable class is applied, so putting the class on the page's
 * outermost element is what keeps the download on this route.
 *
 * Big Shoulders is condensed signage type — festival marquees, poster
 * lettering, the numerals on a ticket. Newsreader is the programme booklet:
 * a reading serif with real optical sizes, so the long passages sit at a
 * different weight class from the display type rather than competing with it.
 */

export const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-big-shoulders",
  // Variable across the full weight range: the page uses 300 for quiet data
  // labels and 800 for the year, and one axis covers both without two files.
  weight: "variable",
  display: "swap",
  // Big Shoulders is too recently renamed to be in next/font's metrics table,
  // so it cannot compute a size-adjusted fallback and warns at build time.
  // Naming the fallback explicitly and turning the adjustment off is the
  // honest version of that: a stated condensed fallback, no silent guess.
  fallback: ["Arial Narrow", "Helvetica Neue Condensed", "sans-serif"],
  adjustFontFallback: false,
});

export const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

/** Applied to the Festival section's root element. */
export const festivalFontClass = `${bigShoulders.variable} ${newsreader.variable}`;
