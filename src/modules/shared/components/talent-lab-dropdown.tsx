"use client"

import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

// Flat, unlike PastEventsDropdown: every Talent Lab destination is a real page,
// so nesting them behind a submenu would add a hover step and buy nothing.
const items = [
  { label: "Overview", href: "/talent-lab" },
  { label: "Current Opportunities", href: "/talent-lab/opportunities" },
  { label: "Programs & Streams", href: "/talent-lab/programs" },
  { label: "Mentors", href: "/talent-lab/mentors" },
  { label: "Events & Masterclasses", href: "/talent-lab/events" },
  { label: "Alumni Stories", href: "/talent-lab/alumni" },
  { label: "Resources", href: "/talent-lab/resources" },
  { label: "Partners", href: "/talent-lab/partners" },
]

const itemClass =
  "text-white font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm focus:bg-white/20 focus:text-gray-200 rounded-[2px] cursor-pointer"

export default function TalentLabDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter()

  const handleNavigate = (href: string) => {
    router.push(href)
    onNavigate?.()
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-[5px] border-none text-white bg-transparent hover:bg-white/10 hover:text-gray-200 font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm">
          Talent Lab
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-black/90 border-white/20 rounded-[2px] min-w-[250px]">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.href}
            className={itemClass}
            onClick={() => handleNavigate(item.href)}
          >
            {item.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-white/15" />

        {/* The primary action, marked out in gold rather than buried in the list. */}
        <DropdownMenuItem
          className="text-yellow-400 bg-yellow-400/10 font-sans font-semibold tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm focus:bg-yellow-400/25 focus:text-yellow-300 rounded-[2px] cursor-pointer"
          onClick={() => handleNavigate("/talent-lab/register")}
        >
          Register Your Interest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
