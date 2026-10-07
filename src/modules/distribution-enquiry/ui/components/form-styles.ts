/**
 * Field styling for the distribution enquiry, matched to `/submit-film-enquiry`
 * so the site's two enquiry forms read as one family.
 *
 * Every text size carries an `md:` twin on purpose: the shadcn `Input` and
 * `Textarea` primitives ship `md:text-xs/relaxed`, and tailwind-merge only
 * dedupes within a variant, so an unprefixed size alone renders at 12px on
 * desktop.
 */

// `block` overrides the Label primitive's flex row, so "(optional)" flows inline
// after a label that wraps instead of being pushed to the far edge.
export const LABEL = "block text-xs uppercase tracking-[0.15em] text-[#a9a086] font-mono";

const FOCUS = "focus-visible:ring-[#e6ba35]/40 focus-visible:border-[#e6ba35]/50";

export const INPUT = `bg-[#0e0c08] border-[#2a2417] text-white rounded-lg h-12 px-4 text-base md:text-base placeholder:text-[#8a8168] ${FOCUS}`;

export const TEXTAREA = `bg-[#0e0c08] border-[#2a2417] text-white rounded-lg px-4 py-3 text-base md:text-base leading-relaxed resize-y placeholder:text-[#8a8168] ${FOCUS}`;

// `h-12` alone loses to the trigger's `data-[size=default]:h-7`.
export const SELECT_TRIGGER = `bg-[#0e0c08] border-[#2a2417] text-white rounded-lg h-12 data-[size=default]:h-12 px-4 w-full text-base md:text-base data-placeholder:text-[#8a8168] ${FOCUS}`;

export const SELECT_CONTENT = "bg-[#0e0d0a] border-[#2a2417] text-white max-h-60";

// MultiSelectDropdown takes no className; its trigger is styled from a wrapper.
export const MULTI_SELECT_WRAP =
  "[&_button]:min-h-[48px] [&_button]:bg-[#0e0c08] [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-[#e6ba35]/40 [&_button]:focus-visible:border-[#e6ba35]/50";

export const MESSAGE = "text-red-400 text-xs";

export const HELP = "text-[#8a8168] text-xs";
