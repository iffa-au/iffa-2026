import type { Faq } from "../lib/types";

/**
 * PLACEHOLDER CONTENT — pending real data.
 *
 * The twelve FAQ entries from the approved design, verbatim.
 *
 * Two answers make commitments the rest of the section has to honour: "Will
 * this get me a job?" states plainly that no program can guarantee employment,
 * and "Can I request access adjustments?" promises adjustments without
 * requiring a diagnosis. Both are repeated on the landing page. If either
 * answer changes, check the landing page's benefits footnote and inclusion
 * statement in `talent-lab-edition.ts` at the same time.
 *
 * The contact address referenced by the FAQ intro lives in
 * `talent-lab-edition.ts` as `contactEmail` — do not repeat it here.
 */

export const faqs: Faq[] = [
  {
    question: "Who can apply?",
    answer:
      "Emerging and early-career screen practitioners aged 18 and over who are based in Australia. Applicants can come from directing, producing, writing, acting, documentary, crew and technical disciplines.",
  },
  {
    question: "Is the Talent Lab free?",
    answer:
      "Program fees vary by stream and cycle. Where a fee applies it is stated on the program page before you apply, and fee-relief places are available. Public masterclasses and the resource library are free.",
  },
  {
    question: "Can students apply?",
    answer:
      "Yes. Students in their final year of study or recent graduates are eligible, provided they can commit to the program schedule.",
  },
  {
    question: "I live regionally — can I take part?",
    answer:
      "Yes. The Talent Lab is delivered primarily online for exactly this reason, and the Regional & Online stream is designed around remote participation.",
  },
  {
    question: "Is the program online or in person?",
    answer:
      "Primarily online, with optional in-person intensives and a showcase in selected cycles. Delivery mode is listed on every opportunity.",
  },
  {
    question: "Will this get me a job?",
    answer:
      "No program can guarantee that. The Talent Lab provides mentoring, industry introductions and showcase opportunities — these are subject to program availability and do not guarantee employment or representation.",
  },
  {
    question: "Can international applicants apply?",
    answer:
      "Formal cohort places prioritise Australia-based practitioners. International practitioners can join public masterclasses, and selected exchange places are offered through partner organisations.",
  },
  {
    question: "What materials do I need to apply?",
    answer:
      "A short biography, a career objective, a portfolio or showreel link, and a description of the project or practice you want to develop. Nothing needs to be professionally produced.",
  },
  {
    question: "Can I request access adjustments?",
    answer:
      "Yes, at any stage. You do not need to disclose a diagnosis or provide medical information — tell us what you need and we will work with you.",
  },
  {
    question: "How are participants selected?",
    answer:
      "A selection panel assesses readiness, the strength of the stated objective, and what the participant stands to gain. Panels include IFFA staff and independent industry assessors.",
  },
  {
    question: "How do I become a mentor?",
    answer:
      "Register your interest through the partner and mentor form. We match mentors to streams based on discipline, availability and the needs of each cohort.",
  },
  {
    question: "Can my organisation partner with the Talent Lab?",
    answer:
      "Yes. Partners support places, host sessions, provide venues or fund specific streams. Get in touch through the partner enquiry to discuss what fits.",
  },
];
