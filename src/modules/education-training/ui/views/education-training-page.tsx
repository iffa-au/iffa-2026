import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  sections,
  phaseHighlights,
  programmeDelivery,
  programmeOutcomes,
} from "../../data/education-data";

export function EducationTrainingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-yellow-300/5 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-40 pb-16 md:px-8 md:pt-44 md:pb-24">
        <div className="flex flex-col items-center text-center">
          <p className="mb-4 inline-block border border-yellow-300/70 bg-yellow-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200 shadow-[0_0_20px_rgba(253,224,71,0.2)]">
            IFFA Programs
          </p>

          <h1 className="text-4xl font-bold text-center text-white md:text-5xl">
            Education &amp; Training
          </h1>

          <div className="mt-6 max-w-5xl space-y-4 text-center text-neutral-300 leading-relaxed">
            <p>
              IFFA provides Education &amp; Training as a structured global initiative to support emerging talent across film, media, and digital storytelling. Through this programme, IFFA delivers mentorship, professional training, practical experience, and international collaboration.
            </p>
            <p>
              Education &amp; Training is designed to support participants across the full lifecycle of filmmaking — from concept development through to completed projects and industry engagement. The programme is structured as a three-phase model.
            </p>
          </div>

          <div className="mt-6 h-1 w-40 bg-gradient-to-r from-yellow-300 to-transparent" />
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-stretch md:gap-3">
          {phaseHighlights.map(({ title, text, Icon }, index) => (
            <div key={title} className="contents">
              <article className="group relative overflow-hidden border border-yellow-300/40 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] md:flex-1">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
                <div className="relative z-10">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-yellow-300/55 bg-yellow-300/10 text-yellow-200">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-yellow-200 transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-300">{text}</p>
                </div>
              </article>

              {index < phaseHighlights.length - 1 && (
                <div className="hidden md:flex items-center justify-center px-1 text-yellow-200/80">
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-center text-white md:text-3xl">
                {section.title}
              </h2>

              <div className="mt-5 overflow-hidden border border-yellow-300/40 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] p-3 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                <div className="overflow-hidden border border-white/15">
                  <div className="relative w-full bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] p-6 md:p-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.18),transparent_45%)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/55" />

                    <div className="relative z-10 w-full max-w-5xl text-left">
                      <p className="text-lg font-semibold text-white md:text-xl">{section.intro}</p>

                      <div className="mt-5 space-y-4 text-neutral-100/90 leading-relaxed md:text-[15px]">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>

                      <p className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-yellow-200">
                        <span className="h-2 w-2 rounded-full bg-yellow-300" />
                        Key areas include:
                      </p>
                      <ul className="mt-3 grid gap-2 text-neutral-100 md:grid-cols-2">
                        {section.points.map((point) => (
                          <li key={point} className="flex items-start gap-2 rounded border border-white/10 bg-black/20 px-3 py-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-300" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16 space-y-8 border-t border-white/15 pt-14">
          <div className="grid gap-6 md:grid-cols-2">
            <article className="border border-yellow-300/40 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] px-6 py-7 text-white shadow-[0_10px_35px_rgba(0,0,0,0.4)]">
              <h3 className="text-xl font-bold uppercase tracking-wide">Programme Delivery</h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed md:text-base">
                {programmeDelivery.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="border border-yellow-300/40 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] px-6 py-7 text-white shadow-[0_10px_35px_rgba(0,0,0,0.4)]">
              <h3 className="text-xl font-bold uppercase tracking-wide">Programme Outcomes</h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed md:text-base">
                {programmeOutcomes.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <article className="border border-yellow-300/40 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] p-6 md:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
            <h3 className="text-xl font-semibold text-white">Global Collaboration</h3>
            <ul className="mt-3 text-neutral-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-300" />
                <span>
                  IFFA Education &amp; Training is delivered in collaboration with universities, industry organisations, cultural institutions, and international partners, creating a globally connected ecosystem that supports knowledge exchange, cross-border collaboration, and international industry engagement.
                </span>
              </li>
            </ul>
          </article>

          <article className="border border-yellow-300/40 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] p-6 md:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
            <h3 className="text-xl font-semibold text-white">Institutional Alignment</h3>
            <ul className="mt-3 text-neutral-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-300" />
                <span>
                  The programme is aligned with key institutional priorities, including youth development and capacity building, skills training and workforce readiness, employment and career pathways, cultural exchange and diplomacy, and the continued growth of the creative industries.
                </span>
              </li>
            </ul>
          </article>

          <article className="border border-yellow-300/40 bg-gradient-to-br from-[#5a4a1a] via-[#2a2514] to-[#0e0d0a] p-6 md:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
            <h3 className="text-xl font-semibold text-white">Participation &amp; Access</h3>
            <ul className="mt-3 text-neutral-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-300" />
                <span>
                  Delivered in partnership with governments and institutions, the programme is designed to support inclusive participation. Selected participants may receive supported or subsidised access, depending on programme structure and collaborative frameworks.
                </span>
              </li>
            </ul>
          </article>
        </section>

        <div className="mt-16 flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-yellow-300/60 bg-gradient-to-r from-[#302611] via-[#1f1a10] to-[#0f0d09] px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-yellow-300 hover:text-yellow-300"
          >
            Enquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
