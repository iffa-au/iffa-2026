import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { videoUrls } from "../../data/oman-data";
import { OmanContactCard } from "../components/oman-contact-card";
import { omanNavCards } from "../../data/oman-nav-data";
import {
  Location01Icon,
  Film01Icon,
  UserGroupIcon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

const iconMap: Record<string, IconSvgElement> = {
  Location01Icon,
  Film01Icon,
  UserGroupIcon,
  TaskDone01Icon,
};

export function OmanPage() {
  return (
    <div className="w-full bg-[#0d0d0d]">
      <section className="relative w-full h-[40vh] min-h-[280px] sm:h-[45vh] md:h-[55vh] lg:h-[62vh]">
        <video className="absolute inset-0 w-full h-full object-cover" src={videoUrls.omanHub} autoPlay loop muted playsInline />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-[#0d0d0d]" />
        <div className="absolute inset-0 z-10">
          <div className="absolute top-1/2 left-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 px-6 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#F5F0E8] tracking-tight">Filming in Oman</h1>
            <div className="mx-auto my-4 w-16 h-px bg-[#C9943A]" />
            <p className="text-xs sm:text-sm md:text-base text-[#9e9e9e] tracking-widest uppercase">Essential Guide for International Filmmakers</p>
          </div>
        </div>
        <div className="hidden lg:block absolute z-20 right-8 xl:right-12 bottom-6 w-80">
          <OmanContactCard />
        </div>
      </section>

      <section className="lg:hidden px-4 py-5 border-t border-white/5">
        <OmanContactCard className="mx-auto max-w-lg w-full" />
      </section>

      <section className="px-3 pb-8 pt-2">
        <div className="overflow-x-auto md:hidden -mx-1 px-1">
          <div className="grid grid-flow-col auto-cols-[min(42vw,180px)] gap-1.5 w-max">
            {omanNavCards.map(({ iconName, title, descriptor, href }) => (
              <Link key={href} href={href} className="block border border-white/20 hover:border-white/55 p-3">
                <HugeiconsIcon icon={iconMap[iconName]} size={16} color="#C9943A" />
                <h3 className="text-[#F5F0E8] text-[10px] tracking-widest uppercase mt-2">{title}</h3>
                <p className="text-[#9e9e9e] text-[9px] uppercase mt-1 line-clamp-2">{descriptor}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-1.5">
          {omanNavCards.map(({ iconName, title, descriptor, href }) => (
            <Link key={href} href={href} className="block border border-white/20 hover:border-white/55 p-4">
              <HugeiconsIcon icon={iconMap[iconName]} size={18} color="#C9943A" />
              <h3 className="text-[#F5F0E8] text-xs tracking-widest uppercase mt-3">{title}</h3>
              <p className="text-[#9e9e9e] text-[10px] uppercase mt-1">{descriptor}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
