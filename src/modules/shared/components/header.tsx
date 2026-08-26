"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import PastEventsDropdown from "./dropdown"
import TalentLabDropdown from "./talent-lab-dropdown"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className={`fixed top-0 left-0 w-full z-50 border-b border-[#252134] backdrop-blur-sm transition-colors ${isHome && !isMobileMenuOpen ? "bg-transparent" : "bg-[#0E0C15]/90"}`}>
      
      {/*
        Below `lg` this is the original flex row with an absolutely centred
        banner, unchanged.

        From `lg` up — where the desktop nav appears — it becomes a 3-column
        grid instead. The banner used to be absolutely positioned at every
        width, so it ignored the nav entirely and overlapped it once the nav
        grew: measured at 1024-1440px after TALENT LAB was added (and already
        at 1024-1100px before it). In flow the three columns cannot collide.
      */}
      <div className="relative flex items-center justify-between p-5 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-3">
        
        {/* Logo (Left) */}
        <Link href="/" className="block w-[8rem]" onClick={closeMenu}>
          <Image
            src="/IFFA_logo.png"
            alt="IFFA Logo"
            width={80}
            height={80}
            loading="eager"
            className="w-20 h-auto"
          />
        </Link>

        {/* Center Text */}
        <Link
          href="/submit-film-enquiry"
          className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:justify-self-center text-center px-4 z-10"
        >
          <span className="text-[10px] md:text-xs lg:text-sm tracking-[0.2em] uppercase text-yellow-500 whitespace-nowrap hover:text-yellow-400 transition-colors">
            ENTRIES OPEN - IFFA 2026
          </span>
        </Link>

        {/* Right Side Navigation (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 relative z-20">
          <TalentLabDropdown />
          <Button variant="ghost" asChild className="rounded-[5px] border-none text-white bg-transparent hover:bg-white/10 hover:text-gray-200 font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm">
            <Link href="/festivals">FESTIVALS</Link>
          </Button>
          <PastEventsDropdown />
          <Button variant="ghost" asChild className="rounded-[5px] border-none text-white bg-transparent hover:bg-white/10 hover:text-gray-200 font-sans tracking-[0.2em] uppercase text-[10px] md:text-xs lg:text-sm">
            <Link href="/latest-news">LATEST NEWS</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center relative z-20">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu — full-screen overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 bg-[#0E0C15] flex flex-col items-center justify-center gap-6 z-40">
          <Button variant="ghost" size="icon" className="absolute top-5 right-5 text-white hover:bg-white/10" onClick={closeMenu}>
            <X className="w-5 h-5" />
          </Button>
          <div className="flex flex-col items-center gap-3 w-full max-w-[280px] py-5 border-y border-white/10">
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-yellow-400">Talent Lab</span>
            <TalentLabDropdown onNavigate={closeMenu} />
          </div>
          <Button variant="ghost" asChild className="rounded-[5px] border-none text-white bg-transparent hover:bg-white/10 hover:text-gray-200 font-sans tracking-[0.2em] uppercase text-sm">
            <Link href="/festivals" onClick={closeMenu}>FESTIVALS</Link>
          </Button>
          <div>
            <PastEventsDropdown onNavigate={closeMenu} />
          </div>
          <Button variant="ghost" asChild className="rounded-[5px] border-none text-white bg-transparent hover:bg-white/10 hover:text-gray-200 font-sans tracking-[0.2em] uppercase text-sm">
            <Link href="/latest-news" onClick={closeMenu}>LATEST NEWS</Link>
          </Button>
        </div>
      )}
    </div>
  )
}