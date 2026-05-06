import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Location01Icon,
  Film01Icon,
  UserGroupIcon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons";
import { videoUrls, navLinks } from "../../data/australia-data";

const iconMap: Record<string, IconSvgElement> = {
  Location01Icon,
  Film01Icon,
  UserGroupIcon,
  TaskDone01Icon,
};

export function AustraliaPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0d0d0d]">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={videoUrls.australiaHub}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/80 via-[#0d0d0d]/20 to-transparent z-[1]" />

      {/* Content pinned to bottom */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-10 lg:pb-14 px-10 lg:px-16">
        {/* Hero text */}
        <div className="text-center max-w-2xl mb-8">
          <h1 className="text-5xl lg:text-7xl font-light text-white leading-tight pb-4 mb-4 border-b border-[#C9943A]">
            Film in Australia
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            From the ancient red outback to world-class studio infrastructure — Australia offers
            unmatched landscape diversity, generous government rebates, and a deep pool of
            experienced screen talent.
          </p>
        </div>

        {/* Nav links */}
        <div className="flex flex-row flex-wrap justify-center gap-6">
          {navLinks.map(({ iconName, label, descriptor, href }) => (
            <Link
              key={href}
              href={href}
              className="group transition-all duration-300 pl-4 border-l-2 border-[#C9943A] hover:border-white pr-4 py-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <HugeiconsIcon
                  icon={iconMap[iconName]}
                  size={14}
                  color="#C9943A"
                />
                <p className="text-white text-sm font-semibold tracking-wide group-hover:text-[#C9943A] transition-colors duration-200">
                  {label}
                </p>
              </div>
              <p className="text-white/50 text-xs">{descriptor}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
