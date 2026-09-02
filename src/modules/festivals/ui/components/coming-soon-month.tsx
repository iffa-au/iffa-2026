import { Lock } from "lucide-react";

/**
 * The locked state for a month whose programme is not published yet.
 *
 * The ghost posters behind the panel are empty plates, never real films: an
 * unannounced festival must not leak a title, a date or a poster through a
 * blur. They exist so the month reads as "not yet" rather than as a page that
 * failed to load.
 */
export function ComingSoonMonth({ note }: { note?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent px-6 py-14 md:px-10 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center gap-5 opacity-[0.13] blur-[7px]"
      >
        {[0, 1, 2, 3, 4, 5].map((plate) => (
          <div
            key={plate}
            className="h-56 w-36 shrink-0 rounded-lg border border-white/25 bg-gradient-to-br from-white/30 via-white/10 to-transparent"
          />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[28rem] -translate-x-1/2 rounded-full bg-yellow-400/[0.06] blur-3xl"
      />

      <div className="relative mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-yellow-300/30 bg-yellow-400/10">
          <Lock aria-hidden className="h-4 w-4 text-yellow-400" />
        </span>

        <h3 className="mt-6 text-2xl font-bold uppercase tracking-[0.14em] text-white md:text-3xl">
          Coming Soon
        </h3>

        <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
          {note ?? "More festivals and screening schedules will be announced soon."}
        </p>
      </div>
    </div>
  );
}
