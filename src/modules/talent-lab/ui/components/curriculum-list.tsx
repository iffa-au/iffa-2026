import type { CurriculumWeek } from "../../lib/types";

/**
 * The week-by-week outline on a program detail page.
 *
 * An ordered list, because the order is the content — this is a six-week
 * sequence ending in a showcase, not a set of independent topics. The week
 * label is real text rather than a CSS counter so it survives being read out
 * and can say "Showcase" where a number would be wrong.
 */
export function CurriculumList({ weeks }: { weeks: readonly CurriculumWeek[] }) {
  return (
    <ol className="flex flex-col overflow-hidden rounded-xl border border-white/10">
      {weeks.map((week) => (
        <li
          key={week.week}
          className="flex flex-col gap-1.5 border-b border-white/8 bg-white/[0.03] px-5 py-5 last:border-b-0 sm:flex-row sm:gap-5"
        >
          <span className="flex-none pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-yellow-400 sm:w-20">
            {week.week}
          </span>

          <span className="flex flex-col gap-1.5">
            <span className="text-[15px] font-semibold text-white">{week.title}</span>
            <span className="text-[13.5px] font-light leading-relaxed text-white/70">
              {week.body}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
