import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

type StatTileProps = {
  /** Always pass a value derived from the data, never a literal. */
  value: number | string;
  label: string;
  icon: IconSvgElement;
};

export function StatTile({ value, label, icon }: StatTileProps) {
  return (
    <div className="flex flex-col gap-3 border border-white/10 bg-white/5 p-5 md:p-6">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300/40 bg-yellow-400/10">
        <HugeiconsIcon icon={icon} size={18} color="#e6ba35" aria-hidden />
      </div>
      <p className="text-3xl font-bold leading-none text-white md:text-4xl">{value}</p>
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">{label}</p>
    </div>
  );
}
