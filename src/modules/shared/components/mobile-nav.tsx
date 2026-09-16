"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import SubmitFilmButton from "./submit-film-button"
import {
  EVENTS_HREF,
  EVENT_SECTIONS,
  EVENT_YEARS,
  NAV_LABEL,
  PRIMARY_LINKS,
  TALENT_LAB_CTA,
  TALENT_LAB_HREF,
  TALENT_LAB_LINKS,
  isActive,
} from "./nav-data"

const rowClass =
  `block py-3 text-[13px] ${NAV_LABEL} text-white/80 transition-colors ` +
  "hover:text-white data-[active=true]:text-yellow-400"

const triggerClass = `text-[13px] ${NAV_LABEL} data-[state=open]:text-yellow-400`

/**
 * The drawer, for every viewport below `lg` — where the bar drops the nav.
 *
 * Deliberately not the desktop menus at a smaller size: a hover-driven popup
 * nested inside a touch menu meant Talent Lab's links took two taps and opened
 * a floating layer over the sheet. Here the same links are inline accordions,
 * so the whole nav is one scrollable column.
 */
export default function MobileNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()

  return (
    /*
      `fixed` rather than `absolute` works only because the header no longer has
      a backdrop-filter on the element itself — a filter makes an element the
      containing block for its fixed descendants, which used to crop this sheet
      to the height of the bar and push its first rows off the top of the
      screen. The blur now lives on an inner layer. Do not move it back.
    */
    <div
      id="mobile-nav"
      className="fixed inset-0 z-50 flex flex-col bg-[#0E0C15] lg:hidden"
    >
      <div className="flex items-center justify-between border-b border-[#252134] px-5 py-5">
        <SubmitFilmButton onClick={onClose} />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close menu"
          className="text-white hover:bg-white/10 dark:hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* The column scrolls, so a long archive can never push a row out of reach. */}
      <nav className="flex-1 overflow-y-auto overscroll-contain px-5 pb-10">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="talent-lab" className="border-[#252134]">
            <AccordionTrigger
              className={triggerClass}
              data-active={isActive(pathname, TALENT_LAB_HREF)}
            >
              Talent Lab
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-white">
              <div className="flex flex-col border-l border-[#252134] pl-4">
                {TALENT_LAB_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    data-active={pathname === item.href}
                    className={rowClass}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={TALENT_LAB_CTA.href}
                  onClick={onClose}
                  className={`mt-3 rounded-[2px] bg-yellow-400/10 px-3 py-3 text-center text-[12px] font-semibold ${NAV_LABEL} text-yellow-400 transition-colors hover:bg-yellow-400/20`}
                >
                  {TALENT_LAB_CTA.label}
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="events" className="border-[#252134]">
            <AccordionTrigger
              className={triggerClass}
              data-active={isActive(pathname, EVENTS_HREF)}
            >
              Events
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-white">
              <div className="flex flex-col gap-4 border-l border-[#252134] pl-4">
                {EVENT_YEARS.map((year) => (
                  <div key={year}>
                    <span className="font-mono text-[11px] tracking-[0.2em] text-white/40">
                      {year}
                    </span>
                    {/*
                      The three sections sit in a row under their year rather
                      than as a second accordion level: five years × three
                      sections is short enough to show outright, and it saves a
                      tap per destination.
                    */}
                    <div className="mt-1 flex flex-wrap gap-x-5">
                      {EVENT_SECTIONS.map(({ label, segment }) => {
                        const href = `${EVENTS_HREF}/${year}/${segment}`
                        return (
                          <Link
                            key={segment}
                            href={href}
                            onClick={onClose}
                            data-active={pathname === href}
                            className={`py-2 text-[12px] ${NAV_LABEL} text-white/70 transition-colors hover:text-white data-[active=true]:text-yellow-400`}
                          >
                            {label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-2 flex flex-col">
          {PRIMARY_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              data-active={isActive(pathname, item.href)}
              className={`border-b border-[#252134] py-4 text-[13px] ${NAV_LABEL} text-white transition-colors hover:text-yellow-400 data-[active=true]:text-yellow-400`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
