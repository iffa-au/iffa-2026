"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MENTOR_TYPE_CLASSES } from "../../data/form-options";
import type { Mentor } from "../../lib/types";
import { PlaceholderPanel } from "./placeholder-panel";

type MentorProfileDialogProps = {
  mentor: Mentor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * A mentor's full profile.
 *
 * A dialog rather than a route: ten short bios do not justify ten URLs, and the
 * user is browsing a directory — sending them away and back for each one is the
 * wrong shape.
 *
 * Escape, the focus trap, the scroll lock and returning focus to the card that
 * opened it are all Radix's, deliberately not reimplemented here.
 */
export function MentorProfileDialog({
  mentor,
  open,
  onOpenChange,
}: MentorProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {mentor && (
          <>
            <PlaceholderPanel
              aspect="aspect-[16/9]"
              caption={`Portrait — ${mentor.name}, ${mentor.role}`}
            />

            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${MENTOR_TYPE_CLASSES[mentor.type]}`}
                >
                  {mentor.type}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
                  {mentor.year}
                </span>
              </div>

              <DialogTitle className="mt-1 text-xl">{mentor.name}</DialogTitle>

              <DialogDescription>
                {mentor.role}
                <span aria-hidden="true" className="px-2 text-white/30">
                  ·
                </span>
                {mentor.organisation}
                <span aria-hidden="true" className="px-2 text-white/30">
                  ·
                </span>
                {mentor.country}
              </DialogDescription>
            </DialogHeader>

            <p className="text-sm font-light leading-relaxed text-white/80">
              {mentor.bio}
            </p>

            <Link
              href="/talent-lab/programs"
              className="w-fit rounded-sm border-b border-yellow-400/50 pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-yellow-400 transition-colors hover:border-yellow-400 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Programs they mentor on <span aria-hidden="true">→</span>
            </Link>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
