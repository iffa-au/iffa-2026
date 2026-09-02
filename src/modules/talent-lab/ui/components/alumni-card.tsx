import type { Alumnus } from "../../lib/types";
import { PlaceholderPanel } from "./placeholder-panel";

/**
 * An alumni story.
 *
 * Not a link and not a button: there is no alumnus detail page, and there is no
 * plan for one. The outcome is the whole story, so the card states it and stops
 * — rather than implying a destination that does not exist.
 */
export function AlumniCard({ alumnus }: { alumnus: Alumnus }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <PlaceholderPanel
        aspect="aspect-[16/10]"
        caption={`Project still — ${alumnus.name}`}
        className="rounded-none border-0 border-b border-white/10"
      />

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-yellow-400">
          {alumnus.cycle}
        </p>

        <h3 className="text-lg font-semibold text-white">{alumnus.name}</h3>

        <p className="text-[13px] font-light leading-relaxed text-white/70">
          {alumnus.role}
        </p>

        <p className="mt-auto border-t border-white/10 pt-3 text-[13px] font-light leading-relaxed text-white/85">
          {alumnus.outcome}
        </p>
      </div>
    </article>
  );
}
