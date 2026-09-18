"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import PastEventsDropdown from "./dropdown"
import TalentLabDropdown from "./talent-lab-dropdown"
import MobileNav from "./mobile-nav"
import SubmitFilmButton from "./submit-film-button"
import { Button } from "@/components/ui/button"
import { NAV_ITEM, PRIMARY_LINKS, isActive } from "./nav-data"

export default function Header() {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const isHome = pathname === "/"

  /*
    The drawer stores the route it was opened on rather than a plain boolean, so
    that "open" is derived: the moment the route changes the sheet is closed,
    with no effect reaching back in to set state. That covers back/forward and
    any navigation started from inside the sheet, not just its own links.
  */
  const [openedOn, setOpenedOn] = useState<string | null>(null)
  const isMobileMenuOpen = openedOn === pathname

  const closeMenu = () => setOpenedOn(null)

  /*
    The header is fixed — the home hero shows through it — so `main` has to be
    padded down by exactly its height. That number used to be hardcoded at 88px
    against a header that measured 121px. Publish the measured height instead;
    globals.css carries a default so the first paint is right before this runs.
  */
  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    const publishHeight = () =>
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`)

    publishHeight()
    const observer = new ResizeObserver(publishHeight)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu()
    }

    // Without this the page behind the sheet scrolls under the touch.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isMobileMenuOpen])

  return (
    <header ref={headerRef} className="fixed top-0 left-0 z-50 w-full">
      {/*
        The background sits on its own layer rather than on the header itself.
        `backdrop-filter` makes an element the containing block for its
        fixed-position descendants, so with the blur on the header the drawer's
        `inset-0` resolved against the bar — a 375×120 box — and its first rows,
        Talent Lab among them, rendered above the top of the screen where no one
        could reach them. Keep the blur here.
      */}
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 border-b border-[#252134] backdrop-blur-sm transition-colors ${
          isHome && !isMobileMenuOpen ? "bg-transparent" : "bg-[#0E0C15]/90"
        }`}
      />

      {/*
        One row, three columns. Below `lg` the middle column holds the CTA and
        the nav collapses into the drawer; from `lg` the middle column holds the
        nav and the CTA moves to the right.

        `1fr auto 1fr` from `lg` rather than `auto 1fr auto`: equal side columns
        are what centre the nav against the viewport instead of against whatever
        the logo and the button happen to measure.

        The fit is tight by design — the five links plus gaps are 544px, which
        leaves each side column 220px at 1024px. A sixth top-level link does not
        fit; at that point shorten the labels or put the nav back on its own row.
      */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" aria-label="IFFA home" onClick={closeMenu} className="block">
          <Image
            src="/IFFA_logo.png"
            alt="IFFA Logo"
            width={80}
            height={80}
            loading="eager"
            className="h-auto w-14 lg:w-20"
          />
        </Link>

        <div className="flex min-w-0 justify-center">
          <SubmitFilmButton className="lg:hidden" />

          <nav
            aria-label="Main"
            className="hidden items-center gap-1 lg:flex xl:gap-2"
          >
            <TalentLabDropdown />
            <PastEventsDropdown />
            {PRIMARY_LINKS.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                data-active={isActive(pathname, item.href)}
                className={NAV_ITEM}
              >
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex justify-end">
          <SubmitFilmButton className="hidden lg:inline-flex" />

          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            className="text-white hover:bg-white/10 dark:hover:bg-white/10 lg:hidden"
            onClick={() => setOpenedOn(pathname)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && <MobileNav onClose={closeMenu} />}
    </header>
  )
}
