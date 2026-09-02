import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  TeachingIcon,
  Exchange01Icon,
  MentorIcon,
  Megaphone01Icon,
  Film01Icon,
  Route01Icon,
} from "@hugeicons/core-free-icons";
import { ArrowRight } from "lucide-react";

import type { ProgramCard as ProgramCardData } from "../../lib/types";

const iconMap: Record<string, IconSvgElement> = {
  TeachingIcon,
  Exchange01Icon,
  MentorIcon,
  Megaphone01Icon,
  Film01Icon,
  Route01Icon,
};

const cardBase =
  "relative flex h-full flex-col rounded-xl border p-6 transition-all duration-300 md:p-7";

function CardBody({ program }: { program: ProgramCardData }) {
  const icon = iconMap[program.iconName] ?? Film01Icon;

  return (
    <>
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-yellow-300/40 bg-yellow-400/10">
        <HugeiconsIcon icon={icon} size={22} color="#e6ba35" aria-hidden />
      </div>

      <h3 className="mt-5 text-lg font-semibold leading-snug text-white">
        {program.title}
      </h3>

      <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-white/75">
        {program.description}
      </p>
    </>
  );
}

export function ProgramCardItem({ program }: { program: ProgramCardData }) {
  // Coming-soon streams render as a plain, non-interactive element so the
  // section never ships a dead link. Status is stated in words, not by
  // appearance alone.
  if (program.status !== "live" || !program.href) {
    return (
      <div
        aria-disabled="true"
        className={`${cardBase} border-white/10 bg-white/5 opacity-60`}
      >
        <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70">
          Coming soon
        </span>
        <CardBody program={program} />
      </div>
    );
  }

  return (
    <Link
      href={program.href}
      className={`${cardBase} group border-yellow-300/40 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] hover:-translate-y-1 hover:border-yellow-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400`}
    >
      <CardBody program={program} />

      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-400">
        Explore
        <ArrowRight
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
