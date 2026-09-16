// ─── Shared style tokens ──────────────────────────────────────────────────────
// Used by both SubmitFilmForm and the CrewList cards embedded in it, so a crew
// card doesn't read as a denser, secondary form inside the main one. They lived
// in both files as hand-synchronised copies until a type-scale change had to be
// applied twice; one definition is what keeps them from drifting.
//
// Sizes here are deliberately well above the 10–11px the form used to run on:
// this is a long, dense form filled in once, under pressure, often on a
// laptop — legibility matters more than fitting another field above the fold.
//
// The input text size is also why `I` is 16px and not 15: iOS Safari zooms the
// page on focus for any input whose text is under 16px, which every field on
// this form used to trigger.

export const L = "text-[14px] font-semibold tracking-[0.01em] text-[#cbc0a0]";

// `md:text-[16px]` is not redundant with the unprefixed size, and removing it
// silently shrinks every input on desktop to 12px.
//
// The shadcn Input and Textarea primitives carry `md:text-xs/relaxed` in their
// own base class. tailwind-merge only dedupes classes within the same variant,
// so a bare `text-[16px]` here does not conflict with their `md:` rule — both
// survive, and above 768px theirs wins on specificity. Declaring the size at
// the `md:` level too is what actually lets the merge drop theirs. (SelectTrigger
// uses an unprefixed `text-xs/relaxed`, which the bare class already handles.)
export const I =
  "bg-[#0a0908] border-[#2a2418] text-white text-[16px] md:text-[16px] placeholder-[#4a4436] focus:border-[#e6ba35]/50 focus-visible:ring-[#e6ba35]/20 focus-visible:ring-2 rounded-lg h-12 px-4";

export const HELP = "text-[14px] text-[#8a8268] leading-relaxed mt-2";

export const ERR = "text-red-400 text-[14px] mt-1.5";
