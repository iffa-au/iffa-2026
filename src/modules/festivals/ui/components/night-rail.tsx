"use client";

import type { FestivalNight } from "../../lib/types";
import { formatScreeningDate } from "../../lib/screening-utils";

type NightRailProps = {
  /** Always the selected country's own nights — never a hardcoded list. */
  nights: FestivalNight[];
  activeNightId: string;
  onSelect: (nightId: string) => void;
};

export function NightRail({ nights, activeNightId, onSelect }: NightRailProps) {
  return (
    <nav aria-label="Festival nights">
      <ul className="flex flex-col gap-1">
        {nights.map((night) => {
          const isActive = night.id === activeNightId;

          return (
            <li key={night.id}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(night.id)}
                className={`w-full border-l-2 py-3 pl-4 pr-2 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  isActive
                    ? "border-l-yellow-400 bg-yellow-400/5"
                    : "border-l-white/15 hover:border-l-white/40 hover:bg-white/5"
                }`}
              >
                <span
                  className={`block text-sm font-semibold uppercase tracking-[0.12em] ${
                    isActive ? "text-yellow-400" : "text-white"
                  }`}
                >
                  {night.label}
                </span>
                <span className="mt-1 block text-xs text-white/50">
                  {formatScreeningDate(night.date)}
                </span>
                <span className="mt-0.5 block text-[11px] text-white/40">
                  {night.films.length} {night.films.length === 1 ? "film" : "films"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
