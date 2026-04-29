import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { videoUrls } from "../../data/oman-data";
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

const cards = [
  {
    iconName: "Location01Icon",
    title: "Filming Locations",
    descriptor: "Deserts, coastlines, mountains & heritage sites",
    href: "/oman/filming-locations",
  },
  {
    iconName: "Film01Icon",
    title: "Filming Opportunities",
    descriptor: "Feature films, docs, commercials & more",
    href: "/oman/filming-opportunities",
  },
  {
    iconName: "UserGroupIcon",
    title: "Production Support",
    descriptor: "End-to-end local crew & logistics",
    href: "/oman/production-support",
  },
  {
    iconName: "TaskDone01Icon",
    title: "Filming Guide",
    descriptor: "Step-by-step permits & planning guide",
    href: "/oman/filming-guide",
  },
];

export function OmanPage() {
  return (
    <div className="w-full bg-[#0d0d0d]">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0d0d0d]">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={videoUrls.omanHub}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 z-10" />

        {/* Centered content */}
        <div className="relative z-20 text-center px-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#F5F0E8] tracking-tight">
            Filming in Oman
          </h1>
          <div className="mx-auto my-5 w-16 h-px bg-[#C9943A]" />
          <p className="text-sm md:text-base text-[#9e9e9e] tracking-widest uppercase">
            Essential Guide for International Filmmakers
          </p>
        </div>

        {/* Bottom navigation cards */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {cards.map(({ iconName, title, descriptor, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col bg-transparent border border-white/20 hover:border-white/55 p-4 transition-all duration-300"
              >
                <HugeiconsIcon
                  icon={iconMap[iconName]}
                  size={18}
                  color="#C9943A"
                />
                <h3 className="text-[#F5F0E8] text-xs tracking-widest uppercase mt-3 leading-snug">
                  {title}
                </h3>
                <p className="text-[#9e9e9e] text-[10px] tracking-widest uppercase mt-1 leading-relaxed">
                  {descriptor}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
