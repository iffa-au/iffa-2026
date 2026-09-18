"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { NAV_LABEL, SUBMIT_CTA } from "./nav-data"

/**
 * The header's call to action, and the only place in the bar that carries an
 * accent — everything around it is deliberately quiet so this is what the eye
 * lands on.
 *
 * The hover fill sweeps in from the left rather than cross-fading: it reads as
 * light crossing a screen, which is the subject matter, and it gives the press
 * a direction. `motion-reduce` collapses it to a plain swap.
 */
export default function SubmitFilmButton({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  return (
    <Link
      href={SUBMIT_CTA.href}
      onClick={onClick}
      /*
        `cn` rather than string concatenation: the header passes `hidden` and
        `lg:inline-flex` to hide one of the two instances, and against the
        `inline-flex` in the base list a plain join leaves the winner to
        stylesheet order. tailwind-merge makes the caller's class win.
      */
      className={cn(
        "group/submit relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden",
        "rounded-[3px] border border-yellow-400/70 px-4 py-2.5 lg:px-5",
        "text-[10px] lg:text-[11px] font-semibold whitespace-nowrap",
        NAV_LABEL,
        "text-yellow-400 transition-colors duration-200",
        // The label has to invert wherever the fill arrives, focus included, or
        // a keyboard user gets gold text on a gold ground.
        "hover:text-[#0E0C15] focus-visible:text-[#0E0C15]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0C15]",
        "active:translate-y-px",
        // The fill: a negative-z pseudo element, so the label paints over it.
        "before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0",
        "before:bg-yellow-400 before:transition-transform before:duration-300 before:ease-out",
        "hover:before:scale-x-100 focus-visible:before:scale-x-100",
        "motion-reduce:before:transition-none motion-reduce:transition-none",
        className
      )}
    >
      {SUBMIT_CTA.label}
    </Link>
  )
}
