import Link from "next/link";

import type { Stream } from "../../lib/types";

/**
 * A stream tile linking to its detail page.
 *
 * The whole card is one `<Link>` rather than a `<div>` with a nested link, so
 * the click target and the focus target are the same rectangle — a keyboard
 * user tabs once and gets the ring around the thing they are about to open.
 */
export function StreamCard({ stream }: { stream: Stream }) {
  return (
    <Link
      href={`/talent-lab/programs/${stream.slug}`}
      className="group flex h-full flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-yellow-400/55 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
    >
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-yellow-400/40 font-mono text-[11px] text-yellow-400"
      >
        {stream.code}
      </span>

      <h3 className="text-base font-semibold leading-snug text-white">
        {stream.name}
      </h3>

      <p className="text-[13px] font-light leading-relaxed text-white/70">
        {stream.description}
      </p>

      <span className="mt-auto pt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-yellow-400">
        Learn more <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
