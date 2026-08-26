import type { Benefit } from "../../lib/types";

/**
 * One cell in the "what participants receive" grid.
 *
 * Plain black on a hairline grid — the 1px gaps in the parent draw the rules,
 * so the cell carries no border of its own.
 */
export function BenefitCell({ benefit }: { benefit: Benefit }) {
  return (
    <div className="flex min-h-[150px] flex-col gap-2.5 bg-black p-6">
      <p className="font-mono text-[10px] tracking-[0.16em] text-yellow-400">
        {benefit.num}
      </p>

      <h3 className="text-base font-semibold text-white">{benefit.title}</h3>

      <p className="text-[13px] font-light leading-relaxed text-white/70">
        {benefit.body}
      </p>
    </div>
  );
}
