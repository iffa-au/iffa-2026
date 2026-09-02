"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "../../lib/types";

/**
 * The FAQ list.
 *
 * Single-open, and the only client component on the landing page — everything
 * around it stays a server component.
 *
 * `aria-expanded` on each trigger comes from Radix rather than being set by
 * hand, along with the arrow-key roving focus and the trigger/panel `aria`
 * wiring. Reimplementing that with `useState` and a `<div onClick>` is how
 * accordions end up unreachable by keyboard.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion type="single" collapsible className="border-t border-white/10">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`faq-${index}`}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent className="max-w-prose text-sm font-light">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
