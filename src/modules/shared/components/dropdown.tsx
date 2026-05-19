"use client"

import { useRouter } from "next/navigation"

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

const years = ["2025","2024", "2023", "2022"]

export default function PastEventsDropdown() {
  const router = useRouter()

  const handleNavigate = (year: string, type: string) => {
    router.push(`/events/${year}/${type}`)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-[5px] border-none text-white bg-transparent hover:bg-white/10 hover:text-gray-200 font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm">
          Past Events
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-black/90 border-white/20 rounded-[2px]">
        {years.map((year) => (
          <DropdownMenuSub key={year}>
            <DropdownMenuSubTrigger className="text-white font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm focus:bg-white/20 focus:text-gray-200 rounded-[2px] cursor-pointer">
              {year}
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-black/90 border-white/20 rounded-[2px]">
                <DropdownMenuItem
                  className="text-white font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm focus:bg-white/20 focus:text-gray-200 rounded-[2px] cursor-pointer"
                  onClick={() => handleNavigate(year, "submissions")}
                >
                  Submissions
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-white font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm focus:bg-white/20 focus:text-gray-200 rounded-[2px] cursor-pointer"
                  onClick={() => handleNavigate(year, "nominations")}
                >
                  Nominations
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-white font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm focus:bg-white/20 focus:text-gray-200 rounded-[2px] cursor-pointer"
                  onClick={() => handleNavigate(year, "winners")}
                >
                  Winners
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}