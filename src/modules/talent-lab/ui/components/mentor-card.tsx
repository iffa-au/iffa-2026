"use client";

import { MENTOR_TYPE_CLASSES } from "../../data/form-options";
import type { Mentor } from "../../lib/types";
import { PlaceholderPanel } from "./placeholder-panel";

type MentorCardProps = {
  mentor: Mentor;
  /**
   * Opens the profile dialog.
   *
   * The card hands over its own element as well as the mentor: the dialog has
   * to know where to put focus back when it closes, and the card is the only
   * thing that knows which button was pressed.
   */
  onSelect: (mentor: Mentor, trigger: HTMLButtonElement) => void;
};

/**
 * A mentor tile that opens the profile dialog.
 *
 * A real `<button>`, so Enter and Space work and focus returns here when the
 * dialog closes. The type badge is colour-coded *and* labelled — "Past Guest"
 * and "Confirmed Mentor" are a meaningful distinction to a prospective
 * applicant, and it must not be carried by hue alone.
 */
export function MentorCard({ mentor, onSelect }: MentorCardProps) {
  return (
    <button
      type="button"
      onClick={(clickEvent) => onSelect(mentor, clickEvent.currentTarget)}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition-colors hover:border-yellow-400/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
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

        <span
          className={`mt-2 w-fit rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${MENTOR_TYPE_CLASSES[mentor.type]}`}
        >
          {mentor.type}
        </span>
      </span>
    </button>
  );
}
