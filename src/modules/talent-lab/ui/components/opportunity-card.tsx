import Link from "next/link";

import type { Opportunity } from "../../lib/types";
import { StatusPill } from "./status-pill";

/**
 * Where an opportunity's primary CTA goes.
 *
 * An EOI-stage program has no application form open yet, so sending someone to
 * `/apply` would be a dead end dressed as an action. Routing is derived from
 * status rather than stored on the record, so it cannot fall out of step with
 * the pill the user is looking at.
 */
const ctaHrefFor = (opportunity: Opportunity): string =>
  opportunity.status === "eoi" ? "/talent-lab/register" : "/talent-lab/apply";

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
        {label}
      </p>
      <p className="mt-1 text-[13px] text-white">{value}</p>
    </div>
  );
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-yellow-400/55">
      <div className="flex items-start justify-between gap-3.5">
        <h3 className="text-lg font-semibold leading-snug text-white">
          {opportunity.title}
        </h3>
        <StatusPill status={opportunity.status} />
      </div>

      <p className="text-sm font-light leading-relaxed text-white/70">
        {opportunity.summary}
      </p>

      <ul className="flex flex-wrap gap-1.5">
        {opportunity.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-sm border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/80"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 border-t border-white/10 pt-4 sm:grid-cols-2">
        <MetaCell label="Applications close" value={opportunity.closesOn} />
        <MetaCell label="Program dates" value={opportunity.programDates} />
        <MetaCell label="Delivery" value={opportunity.modeLabel} />
        <MetaCell label="Career stage" value={opportunity.stage} />
      </div>

      <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
        <Link
          href={ctaHrefFor(opportunity)}
          className="inline-flex items-center justify-center rounded-sm border border-yellow-400 bg-yellow-400 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {opportunity.ctaLabel}
        </Link>

        <Link
          href={`/talent-lab/programs/${opportunity.streamSlug}`}
          className="inline-flex items-center justify-center rounded-sm border border-white/20 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          Details
        </Link>
      </div>
    </article>
  );
}
