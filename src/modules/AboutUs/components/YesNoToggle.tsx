"use client";

import { cn } from "@/lib/utils";

const OPTIONS = [
  { label: "No", value: false },
  { label: "Yes", value: true },
] as const;

/**
 * The No / Yes pill pair used for the "is this link password-protected?"
 * questions — on the trailer and on every promotional clip — so they can't
 * drift into looking or behaving differently.
 */
export function YesNoToggle({
  value,
  onChange,
  ariaLabel,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <div className="mt-2 flex gap-3" role="radiogroup" aria-label={ariaLabel}>
      {OPTIONS.map((opt) => (
        <button
          key={opt.label}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "min-w-24 rounded-lg border px-5 h-11 text-[15px] font-medium transition-colors",
            value === opt.value
              ? "border-[#e6ba35] bg-[#e6ba35]/12 text-[#e6ba35]"
              : "border-[#2a2418] text-[#8a8268] hover:border-[#e6ba35]/40 hover:text-[#cbc0a0]"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
