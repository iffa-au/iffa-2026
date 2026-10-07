"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Choice } from "../../data/form-options";

/**
 * A short multi-choice list shown in full rather than behind a dropdown — six
 * to eight options are faster to scan laid out than opened one at a time.
 *
 * Each chip is a real checkbox (visually hidden) inside its label, so the group
 * keeps native keyboard and screen-reader behaviour; the caller wraps it in a
 * `<fieldset>` whose `<legend>` names the group.
 */
export function OptionChips({
  name,
  options,
  value,
  onChange,
  invalid = false,
}: {
  name: string;
  options: Choice[];
  value: string[];
  onChange: (next: string[]) => void;
  invalid?: boolean;
}) {
  const toggle = (option: string) =>
    onChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option],
    );

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = value.includes(option.value);
        return (
          <label
            key={option.value}
            className={cn(
              "inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
              "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#e6ba35]/50",
              checked
                ? "border-[#e6ba35]/70 bg-[#e6ba35]/12 text-[#f1d27a]"
                : "border-[#2a2417] bg-[#0e0c08] text-white/75 hover:border-[#e6ba35]/35 hover:text-white",
              invalid && !checked && "border-red-500/40",
            )}
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => toggle(option.value)}
              aria-invalid={invalid || undefined}
              className="sr-only"
            />
            {checked && <Check aria-hidden className="h-3.5 w-3.5" />}
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
