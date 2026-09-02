import type { StatTileData } from "../../lib/types";

/**
 * Large gold figure over a mono caption.
 *
 * Used for both the program snapshot and the pilot-outcome targets. The caption
 * carries the framing ("Target program completion rate"), so a target is never
 * mistaken for an achieved result — which is why the value and its caption
 * arrive together as one object rather than as two loose props.
 */
export function StatTile({ stat }: { stat: StatTileData }) {
  return (
    <div className="flex flex-col gap-3 bg-black p-6 md:p-7">
      <p className="text-3xl font-bold leading-none tracking-tight text-yellow-400 md:text-4xl">
        {stat.value}
      </p>
      <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-white/70">
        {stat.caption}
      </p>
    </div>
  );
}

/**
 * Hairline grid wrapper for a row of tiles. The 1px gap over a light background
 * is what draws the dividing rules, so the tiles themselves stay plain.
 */
export function StatTileRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}
