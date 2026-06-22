"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Film01Icon,
  UserGroupIcon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { OmanContactCard } from "./oman-contact-card";
import { omanNavCards } from "../../data/oman-nav-data";

const iconMap: Record<string, IconSvgElement> = {
  Location01Icon,
  Film01Icon,
  UserGroupIcon,
  TaskDone01Icon,
};

export function OmanSubNav({ showContactCard = true }: { showContactCard?: boolean }) {
  const pathname = usePathname();
  const isEnquiryPage = pathname === "/oman/enquiry";

  return (
    <div className="w-full px-3 pb-3 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {omanNavCards.map(({ iconName, title, descriptor, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group flex flex-col p-4 transition-all duration-300 ${
                isActive
                  ? "bg-transparent border border-[#C9943A]/70"
                  : "bg-transparent border border-white/20 hover:border-white/55"
              }`}
            >
              <HugeiconsIcon icon={iconMap[iconName]} size={18} color="#C9943A" />
              <h3
                className={`text-xs tracking-widest uppercase mt-3 leading-snug ${
                  isActive ? "text-[#C9943A]" : "text-[#F5F0E8] group-hover:text-[#C9943A]"
                } transition-colors duration-300`}
              >
                {title}
              </h3>
              <p className="text-[#9e9e9e] text-[10px] mt-1 leading-relaxed">{descriptor}</p>
            </Link>
          );
        })}
      </div>
      {showContactCard && !isEnquiryPage && (
        <OmanContactCard className="mx-auto max-w-lg w-full lg:max-w-none" />
      )}
    </div>
  );
}
