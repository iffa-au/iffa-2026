import type { LabelledFact } from "../../lib/types";

/**
 * A hairline grid of label / value pairs.
 *
 * Used for the program detail hero's key dates, its eligibility rows and the
 * event detail sidebar. A `<dl>` rather than a grid of `<div>`s: these really
 * are terms and their definitions, and the pairing is the content.
 *
 * The 1px gap over a light background draws the rules, so each cell stays a
 * plain black block — the same construction as `stat-tile`'s row.
 */
export function FactGrid({
  facts,
  columns = "auto",
}: {
  facts: readonly LabelledFact[];
  /** "auto" fits as many as will go; "stack" keeps one per row. */
  columns?: "auto" | "stack";
}) {
  return (
    <dl
      className={`grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 ${
        columns === "auto" ? "sm:grid-cols-2 lg:grid-cols-3" : ""
      }`}
    >
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-1.5 bg-black p-5">
          <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
            {fact.label}
          </dt>
          <dd className="text-sm leading-relaxed text-white">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
