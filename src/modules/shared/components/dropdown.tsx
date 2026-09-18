"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  EVENTS_HREF,
  EVENT_SECTIONS,
  EVENT_YEARS,
  NAV_ITEM,
  NAV_MENU_ITEM,
  isActive,
} from "./nav-data"

/**
 * The events archive as it appears in the desktop bar: a year, then a section
 * within it. Kept nested because the archive grows by one year at a time and a
 * flat list of every year × section would be 15 rows and climbing.
 */
export default function PastEventsDropdown() {
  const pathname = usePathname()
  const sectionActive = isActive(pathname, EVENTS_HREF)

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          data-active={sectionActive}
          aria-current={sectionActive ? "true" : undefined}
          className={NAV_ITEM}
        >
          Events
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="bg-[#0E0C15]/95 backdrop-blur-sm border-white/20 rounded-[2px]"
      >
        {EVENT_YEARS.map((year) => (
          <DropdownMenuSub key={year}>
            <DropdownMenuSubTrigger
              data-active={pathname.startsWith(`${EVENTS_HREF}/${year}`)}
              className={NAV_MENU_ITEM}
            >
              {year}
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-[#0E0C15]/95 backdrop-blur-sm border-white/20 rounded-[2px]">
                {EVENT_SECTIONS.map(({ label, segment }) => {
                  const href = `${EVENTS_HREF}/${year}/${segment}`
                  return (
                    <DropdownMenuItem key={segment} asChild className={NAV_MENU_ITEM}>
                      <Link href={href} data-active={pathname === href}>
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
