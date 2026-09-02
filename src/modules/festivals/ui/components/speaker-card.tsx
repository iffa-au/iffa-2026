import type { MasterclassSpeaker } from "../../data/masterclass-data";

/**
 * Headshots do not exist yet. Rather than stretching `no-poster.svg` into a
 * circle, this reuses the initials-on-gold-gradient placeholder already used by
 * `src/app/(root)/iffa-global/aiffa/page.tsx`.
 */
export function SpeakerCard({ speaker }: { speaker: MasterclassSpeaker }) {
  return (
    <article className="flex h-full flex-col items-center rounded-xl border border-white/10 bg-white/5 p-6 text-center transition-colors duration-300 hover:border-yellow-400/40">
      <div
        aria-hidden
        className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-yellow-400/10 via-yellow-400/5 to-black"
      >
        <span className="text-2xl font-black tracking-wide text-yellow-400/40">
          {speaker.initials}
        </span>
      </div>

      <h3 className="mt-5 text-base font-bold leading-tight text-white">{speaker.name}</h3>

      <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-400">
        {speaker.role}
      </p>

      <div className="mt-4 h-px w-10 bg-yellow-400/40" />

      <p className="mt-4 text-sm leading-relaxed text-white/60">{speaker.country}</p>
      <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-white/60">
        {speaker.experience}
      </p>
    </article>
  );
}
