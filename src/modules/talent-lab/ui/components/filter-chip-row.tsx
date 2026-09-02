"use client";

export type FilterChipOption = {
  /** The value stored in the selection array. */
  value: string;
  /** What the user reads. Defaults to `value`. */
  label?: string;
};

type FilterChipRowProps = {
  /** Mono label naming the group, e.g. "Discipline". */
  legend: string;
  options: readonly FilterChipOption[];
  selected: readonly string[];
  onToggle: (value: string) => void;
};

/**
 * A labelled group of filter chips.
 *
 * Every chip is a real `<button>` with `aria-pressed`, not a styled `<div>`:
 * these are toggles, and a toggle that a keyboard cannot reach or a screen
 * reader cannot report the state of is not a control.
 *
 * The group is a `<fieldset>` so the legend is programmatically attached to the
 * chips rather than merely sitting above them.
 */
export function FilterChipRow({
  legend,
  options,
  selected,
  onToggle,
}: FilterChipRowProps) {
  return (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
        {legend}
      </legend>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(option.value)}
              className={`rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                isSelected
                  ? "border-yellow-400 bg-yellow-400/15 text-yellow-400"
                  : "border-white/15 bg-white/5 text-white/70 hover:border-white/35 hover:text-white"
              }`}
            >
              {option.label ?? option.value}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
