"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Film, Users, ListChecks, type LucideIcon } from "lucide-react";
import { subPages } from "../../data/malaysia-data";

const iconMap: Record<string, LucideIcon> = {
  Location01Icon: MapPin,
  Film01Icon: Film,
  UserGroupIcon: Users,
  TaskDone01Icon: ListChecks,
};

export function MalaysiaSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 lg:w-72 flex-shrink-0 sticky top-0 h-screen flex flex-col border-l border-[#2a2a2a]">
      {subPages.map(({ iconName, label, descriptor, href }) => {
        const isActive = pathname === href;
        const Icon = iconMap[iconName];
        return (
          <Link
            key={href}
            href={href}
            className={`group flex-1 flex flex-col justify-center px-5 py-4 border-b border-[#2a2a2a] transition-all duration-300 last:border-b-0 ${
              isActive
                ? "border-l-2 border-l-[#C9943A] bg-[#161616]"
                : "hover:bg-[#161616]"
            }`}
          >
            <Icon size={18} className="text-[#C9943A]" />
            <h3 className="text-[#F5F0E8] text-xs tracking-widest uppercase mt-3 leading-snug">{label}</h3>
            <p className="text-[#9e9e9e] text-[10px] tracking-widest uppercase mt-1 leading-relaxed">{descriptor}</p>
          </Link>
        );
      })}
    </div>
  );
}
