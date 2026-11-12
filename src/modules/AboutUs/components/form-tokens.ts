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

export const L = "text-[14px] font-bold tracking-[0.01em] text-[#e8b830]";

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
  "bg-[#161613] border-[#26241d] text-[#e9e6dc] text-[16px] md:text-[16px] placeholder:text-[#5e5a4c] focus:border-[#9a7a1e] focus-visible:ring-[#e8b830]/20 focus-visible:ring-2 rounded-md h-11 px-3.5";

// ─── Dropdowns ────────────────────────────────────────────────────────────────
// Single-choice fields use the Radix Select; multi-choice ones use
// MultiSelectDropdown. These make the two read as one control: the same input
// box (I), and the multi-select's panel, rows and chevron on the Radix side.
// Pair SELECT_PANEL with `position="popper" sideOffset={2}` on SelectContent so
// the list drops below the box like the multi-select's, rather than over it.

/**
 * MultiSelectDropdown's `className`: its box, in the form's input colours.
 * `dark:bg-input/30` is what the Input primitive actually renders with here —
 * it outranks I's own bg-[#161613].
 */
export const MULTI_BOX = "bg-[#161613] dark:bg-input/30 rounded-md px-3.5";

// `data-[size=default]:h-11`: the primitive's data-[size=default]:h-7
// outranks I's plain h-11, which left these boxes 28px tall beside 44px ones.
export const SELECT_TRIGGER = `${I} data-[size=default]:h-11 group w-full data-placeholder:text-[14px] data-placeholder:text-[#8a8168]`;

/** For `<ChevronDown size={13} />` passed as SelectTrigger's `icon`. */
export const SELECT_CHEVRON = "text-[#4a4232] transition-transform group-data-[state=open]:rotate-180";

/**
 * Radix hides its viewport scrollbar and adds scroll arrows; undo both. The
 * scrollbar rules need `!`: Radix injects its own as an unlayered <style>,
 * which outranks anything in Tailwind's utilities layer regardless of
 * specificity.
 */
export const SELECT_PANEL =
  "rounded-xl border border-[#2a2418] bg-[#0e0d0a] text-white ring-0 shadow-2xl shadow-black/80 max-h-52 w-(--radix-select-trigger-width) data-open:animate-none data-closed:animate-none [&_[data-slot^=select-scroll]]:hidden [&_[data-radix-select-viewport]]:[scrollbar-width:auto]! [&_[data-radix-select-viewport]::-webkit-scrollbar]:block!";

export const SELECT_ITEM =
  "rounded-none px-4 py-2.5 text-sm text-[#9a9278] focus:bg-[#141210] focus:text-white not-data-[variant=destructive]:focus:**:text-inherit data-[state=checked]:bg-[#e6ba35]/8 data-[state=checked]:text-[#e6ba35] data-[state=checked]:focus:text-[#e6ba35] [&_svg:not([class*='size-'])]:size-3 [&_svg]:text-[#e6ba35]";

export const HELP ="text-[14px] text-[#8a8470] leading-relaxed mt-2";

// Decorative red-orange asterisk — the schema carries the actual rule.
export const REQ = "text-[#e86a3a] ml-0.5";

export const OPTIONAL_PILL =
  "ml-2 align-middle rounded-full border border-[#26241d] px-2 py-[1px] text-[11px] font-medium uppercase tracking-wider text-[#8a8470]";

export const ERR = "text-red-400 text-[14px] mt-1.5";

// Radio / checkbox row from the mockup: the native input is visually hidden
// (still focusable, arrow keys still move between radios of one name) and the
// label's ::before draws the gold circle. Add PICK_CHECK for a tick.
export const PICK =
  "relative flex items-center gap-3 cursor-pointer text-[15px] font-semibold text-[#8a8470] hover:text-[#e9e6dc] has-[:checked]:text-[#e8b830] before:content-[''] before:flex-none before:grid before:place-items-center before:size-[22px] before:rounded-full before:border-2 before:border-[#9a7a1e] before:text-[13px] before:font-bold before:text-[#16120a] before:transition-[background-color,border-color,box-shadow] hover:before:border-[#e8b830] has-[:checked]:before:bg-[#e8b830] has-[:checked]:before:border-[#e8b830] has-[:checked]:before:shadow-[0_0_10px_#e8b83066] has-[:focus-visible]:before:outline-2 has-[:focus-visible]:before:outline-[#e8b830] has-[:focus-visible]:before:outline-offset-[3px]";

export const PICK_CHECK = "has-[:checked]:before:content-['✓']";
