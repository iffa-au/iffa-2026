"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Location01Icon,
  Film01Icon,
  UserGroupIcon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons";

const iconMap: Record<string, IconSvgElement> = {
  Location01Icon,
  Film01Icon,
  UserGroupIcon,
  TaskDone01Icon,
};

const subNavItems = [
  {
    iconName: "Location01Icon",
    label: "Filming Locations",
    href: "/australia/filming-locations",
  },
  {
    iconName: "Film01Icon",
    label: "Filming Opportunities",
    href: "/australia/filming-opportunities",
  },
  {
    iconName: "UserGroupIcon",
    label: "Production Support",
    href: "/australia/production-support",
  },
  {
    iconName: "TaskDone01Icon",
    label: "Filming Guide",
    href: "/australia/filming-guide",
  },
];

export function AustraliaSubNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-[#2a2a2a] bg-[#0d0d0d]">
      <div className="flex">
        {subNavItems.map(({ iconName, label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs tracking-widest uppercase transition-all duration-200 border-r border-[#2a2a2a] last:border-r-0 border-t-2 ${
                isActive
                  ? "text-[#C9943A] border-t-[#C9943A] bg-[#161616]"
                  : "text-white/40 hover:text-white/70 hover:bg-[#161616] border-t-transparent"
              }`}
            >
              <HugeiconsIcon
                icon={iconMap[iconName]}
                size={14}
                color={isActive ? "#C9943A" : "currentColor"}
              />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
