import Link from "next/link";

import type { TalentLabEvent } from "../../lib/types";

/**
 * An upcoming or past session.
 *
 * "Register to attend" is inert on every event because no ticketing destination
 * exists yet — a disabled `<button>` with `aria-disabled` and a stated reason,
 * never a link that goes nowhere. Setting `registerHref` in `events-data.ts`
 * turns it into a real link with no change here.
 *
 * Past sessions drop the register action entirely rather than showing it
 * disabled: "you cannot register" and "this already happened" are different
 * facts, and only one of them is about a missing destination.
 */
export function EventCard({ event }: { event: TalentLabEvent }) {
  const isPast = event.state === "past";

  return (
    <article className="flex h-full flex-col gap-3.5 rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-yellow-400/55">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-yellow-400">
        {event.format}
      </p>

      <h3 className="text-lg font-semibold leading-snug text-white">{event.title}</h3>

      <p className="text-[13px] text-white/80">{event.when}</p>

      <dl className="flex flex-col gap-1.5 border-t border-white/10 pt-3.5 text-[13px]">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
            Speaker
          </dt>
          <dd className="text-white">
            {event.speakerName}
            <span className="text-white/55"> — {event.speakerRole}</span>
          </dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
            Mode
          </dt>
          <dd className="text-white">{event.mode}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-3">
        {!isPast &&
          (event.registerHref === null ? (
            <>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="cursor-not-allowed rounded-sm border border-white/12 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35"
              >
                Register to attend
              </button>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
                Registration opens soon
              </span>
            </>
          ) : (
            <Link
              href={event.registerHref}
              className="inline-flex items-center justify-center rounded-sm border border-yellow-400 bg-yellow-400 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Register to attend
            </Link>
          ))}

        <Link
          href={`/talent-lab/events/${event.slug}`}
          className="inline-flex items-center justify-center rounded-sm border border-white/20 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-yellow-400 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          Details
        </Link>
      </div>
    </article>
  );
}
