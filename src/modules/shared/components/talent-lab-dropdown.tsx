"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  NAV_ITEM,
  NAV_LABEL,
  NAV_MENU_ITEM,
  TALENT_LAB_CTA,
  TALENT_LAB_HREF,
  TALENT_LAB_LINKS,
  isActive,
} from "./nav-data"

/**
 * The Talent Lab menu as it appears in the desktop bar. The drawer renders the
 * same links as an accordion instead — see `mobile-nav.tsx`.
 */
export default function TalentLabDropdown() {
  const pathname = usePathname()
  const sectionActive = isActive(pathname, TALENT_LAB_HREF)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          data-active={sectionActive}
          aria-current={sectionActive ? "true" : undefined}
          className={NAV_ITEM}
        >
          Talent Lab
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="bg-[#0E0C15]/95 backdrop-blur-sm border-white/20 rounded-[2px] min-w-[250px]"
      >
        {/*
          `asChild` with a real Link, rather than router.push() in onClick: these
          are page destinations, so they should be anchors that middle-click,
          open in a new tab, and prefetch.
        */}
        {TALENT_LAB_LINKS.map((item) => (
          <DropdownMenuItem key={item.href} asChild className={NAV_MENU_ITEM}>
            <Link href={item.href} data-active={pathname === item.href}>
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-white/15" />

        <DropdownMenuItem
          asChild
          className={`text-yellow-400 bg-yellow-400/10 font-semibold text-[11px] ${NAV_LABEL} focus:bg-yellow-400/25 focus:text-yellow-300 rounded-[2px] cursor-pointer`}
        >
          <Link href={TALENT_LAB_CTA.href}>{TALENT_LAB_CTA.label}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
