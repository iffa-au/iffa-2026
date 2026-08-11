"use client";

import type { ScreeningCountry } from "../../lib/types";

export const ALL_COUNTRIES = "all";

type CountryFilterBarProps = {
  countries: ScreeningCountry[];
  /** Either `ALL_COUNTRIES` or a `country.code`. */
  selected: string;
  onSelect: (code: string) => void;
};

const baseButton =
  "rounded-md border px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400";

export function CountryFilterBar({
  countries,
  selected,
  onSelect,
}: CountryFilterBarProps) {
  const options = [
    { code: ALL_COUNTRIES, name: "All" },
    ...countries.map((country) => ({ code: country.code, name: country.name })),
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
      <p
        id="country-filter-label"
        className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45"
      >
        Country
      </p>

      <div
        role="group"
        aria-labelledby="country-filter-label"
        className="flex flex-wrap gap-2.5"
      >
        {options.map((option) => {
          const isSelected = option.code === selected;

          return (
            <button
              key={option.code}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.code)}
              className={`${baseButton} ${
                isSelected
                  ? "border-yellow-400 text-yellow-400"
                  : "border-white/25 text-white hover:border-white/60"
              }`}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
