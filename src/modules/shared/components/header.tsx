"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import PastEventsDropdown from "./dropdown"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className={`fixed top-0 left-0 w-full z-50 border-b border-[#252134] backdrop-blur-sm transition-colors ${isHome && !isMobileMenuOpen ? "bg-transparent" : "bg-[#0E0C15]/90"}`}>
      
      <div className="relative flex items-center justify-between p-5">
        
        {/* Logo (Left) */}
        <Link href="/" className="block w-[8rem]" onClick={closeMenu}>
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
        <div className="hidden lg:flex items-center gap-4 relative z-20">
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
          <div onClick={closeMenu}>
            <PastEventsDropdown />
          </div>
          <Button variant="ghost" asChild className="rounded-[5px] border-none text-white bg-transparent hover:bg-white/10 hover:text-gray-200 font-sans tracking-[0.2em] uppercase text-sm">
            <Link href="/latest-news" onClick={closeMenu}>LATEST NEWS</Link>
          </Button>
        </div>
      )}
    </div>
  )
}