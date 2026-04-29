"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import PastEventsDropdown from "./dropdown"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 w-full z-50 border-b border-[#252134] bg-[#0E0C15]/90 backdrop-blur-sm">
      
      <div className="relative flex items-center justify-between p-5">
        
        {/* Logo (Left) */}
        <Link href="/" className="block w-[8rem]">
          <Image
            src="/IFFA_logo.png"
            alt="IFFA Logo"
            width={80}
            height={40}
            className="w-20"
          />
        </Link>

        {/* Center Text */}
        <Link
          href="/submit-film-enquiry"
          className="absolute left-1/2 -translate-x-1/2 text-center px-4 z-10"
        >
          <span className="text-[10px] md:text-xs lg:text-sm tracking-[0.2em] uppercase text-yellow-500 whitespace-nowrap hover:text-yellow-400 transition-colors">
            ENTRIES OPEN - IFFA 2026
          </span>
        </Link>

        {/* Right Side Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-4 relative z-20">
          
          {/* Past Events Dropdown */}
          <PastEventsDropdown />

          <Button variant="ghost" className="rounded-[5px] border-none text-white bg-transparent hover:bg-white/10 hover:text-gray-200 font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm">
            LATEST NEWS
          </Button>

        </div>

        {/* Mobile menu toggle */}
        <div className="md:flex lg:hidden flex items-center relative z-20">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0E0C15]/95 border-b border-[#252134] backdrop-blur-md flex flex-col p-4 space-y-2 shadow-xl">
          <div className="flex flex-col items-start w-full">
            <PastEventsDropdown />
          </div>
          <div className="flex flex-col items-start w-full">
            <Button variant="ghost" className="h-8 px-2 md:h-10 md:px-4 justify-start rounded-[5px] border-none text-white bg-transparent hover:bg-white/10 hover:text-gray-200 font-sans tracking-[0.1em] md:tracking-[0.2em] uppercase text-[9px] md:text-xs lg:text-sm">
              LATEST NEWS
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}