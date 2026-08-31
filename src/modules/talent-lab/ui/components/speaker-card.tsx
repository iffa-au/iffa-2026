import { PlaceholderPanel } from "./placeholder-panel";

type SpeakerCardProps = {
  name: string;
  role: string;
  /** What the session says about how the speaker's material is handled. */
  note: string;
};

/**
 * The speaker block on an event detail page.
 *
 * Not `mentor-card`: several speakers are not mentors (a past showcase is
 * credited to "Cycle One participants"), and this block never opens a profile
 * dialog. Treating it as a mentor tile would imply a directory entry that may
 * not exist.
 */
export function SpeakerCard({ name, role, note }: SpeakerCardProps) {
  return (
    <div className="flex flex-wrap items-center gap-5 rounded-xl border border-white/10 bg-white/5 p-5">
      <PlaceholderPanel
        aspect="aspect-[4/5]"
        caption={`Portrait — ${name}`}
        className="w-32 flex-none sm:w-40"
      />

      <div className="flex min-w-[180px] flex-1 flex-col gap-1.5">
        <p className="text-[17px] font-semibold text-white">{name}</p>
        <p className="text-[13.5px] text-white/70">{role}</p>
        <p className="mt-1 text-[13px] font-light leading-relaxed text-white/60">{note}</p>
      </div>
    </div>
  );
}
