import Link from "next/link";

import type { Mentor } from "../../lib/types";
import { PlaceholderPanel } from "./placeholder-panel";

/**
 * The landing page's mentor tile.
 *
 * Deliberately not `mentor-card`. That one is a client component holding a
 * dialog open, which would make the landing page's mentor section a stateful
 * client island for no benefit — on the landing these tiles lead to the
 * directory, exactly as the design has them, so a plain `<Link>` in a server
 * component is the honest implementation.
 *
 * The full profile dialog lives on `/talent-lab/mentors`, where someone is
 * actually browsing mentors.
 */
export function MentorPreviewCard({ mentor }: { mentor: Mentor }) {
  return (
    <Link
      href="/talent-lab/mentors"
      className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-yellow-400/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
    >
      <PlaceholderPanel
        aspect="aspect-square"
        caption={`Portrait — ${mentor.name}`}
        className="rounded-none border-0 border-b border-white/10"
      />

      <span className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[15px] font-semibold text-white">{mentor.name}</span>
        <span className="text-[12.5px] font-light leading-relaxed text-white/70">
          {mentor.role}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
          {mentor.country}
        </span>
      </span>
    </Link>
  );
}
