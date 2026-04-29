import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick01Icon,
  InformationCircleIcon,
  AlertCircleIcon,
  Alert01Icon,
} from "@hugeicons/core-free-icons";
import { OmanSubNav } from "../components/oman-sub-nav";
import { workflowSteps, warningItems, videoUrls } from "../../data/oman-data";

export function FilmingGuidePage() {
  return (
    <div className="bg-[#0d0d0d] min-h-screen">

      {/* ── SECTION 1: HERO + SUBNAV ─────────────────────────── */}
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-[#0d0d0d]">
          {/* Background video */}
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={videoUrls.filmingGuide}
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0d0d] to-transparent z-20" />

          <div className="relative z-30 text-center px-6">
            <Link
              href="/oman"
              className="text-[#C9943A] text-xs tracking-widest uppercase mb-6 inline-block hover:opacity-80 transition-opacity"
            >
              ← Filming in Oman
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-[#F5F0E8] tracking-tight mt-4">
              Step-by-Step Filming Workflow in Oman
            </h1>
            <div className="mx-auto my-5 w-16 h-px bg-[#C9943A]" />
            <p className="text-sm md:text-base text-[#9e9e9e] max-w-2xl mx-auto">
              A clear and structured approach for international filmmakers planning a production in Oman.
            </p>
          </div>
        </section>

        <OmanSubNav />
      </div>

      {/* ── SECTION 2: INTRO + TIMELINE ──────────────────────── */}
      <section className="bg-[#0d0d0d] py-16 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Intro */}
          <p className="text-[#9e9e9e] leading-relaxed text-center max-w-2xl mx-auto mb-16">
            For international filmmakers planning a production in Oman, a clear and structured
            approach is essential. The following workflow outlines the typical process for
            preparing and executing a production.
          </p>

          {/* Vertical Timeline */}
          <div className="relative before:content-[''] before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-[#C9943A] before:opacity-20">
            {workflowSteps.map((step, idx) => (
              <div key={step.number} className="relative flex gap-8 mb-12">

                {/* Number indicator */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#161616] border border-[#C9943A] flex items-center justify-center z-10">
                  <span className="text-[#C9943A] font-bold text-sm">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className={`flex-1 pb-12 ${
                  idx < workflowSteps.length - 1 ? "border-b border-[#2a2a2a]" : ""
                }`}>
                  <h3 className="text-[#F5F0E8] font-bold text-xl mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#9e9e9e] leading-relaxed mb-5">
                    {step.intro}
                  </p>
                  <ul className="space-y-2 mb-5">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <HugeiconsIcon
                          icon={Tick01Icon}
                          size={14}
                          color="#C9943A"
                          className="flex-shrink-0 mt-0.5"
                        />
                        <span className="text-[#9e9e9e] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {step.note && (
                    <div className="bg-[#161616] border-l-2 border-[#C9943A] rounded-r-lg px-4 py-3 mt-4 flex items-start gap-2">
                      <HugeiconsIcon
                        icon={InformationCircleIcon}
                        size={14}
                        color="#C9943A"
                        className="flex-shrink-0 mt-0.5"
                      />
                      <p className="text-[#9e9e9e] text-xs leading-relaxed italic">
                        {step.note}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: PLANNING NOTE ─────────────────────────── */}
      <section className="bg-[#111111] border-t border-[#2a2a2a] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#161616] border border-[#C9943A] rounded-lg p-8">

            <div className="flex items-center gap-3 mb-5">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                size={22}
                color="#C9943A"
              />
              <span className="text-[#C9943A] text-xs tracking-[0.3em] uppercase font-semibold">
                Production Planning Note
              </span>
            </div>

            <h2 className="text-[#F5F0E8] font-bold text-xl mb-4">
              Early Coordination Is Highly Recommended
            </h2>

            <p className="text-[#9e9e9e] text-sm leading-relaxed mb-5">
              Particularly for productions involving any of the following — early engagement with
              authorities and local partners is essential to avoid delays:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {warningItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg px-4 py-3"
                >
                  <HugeiconsIcon
                    icon={Alert01Icon}
                    size={14}
                    color="#C9943A"
                    className="flex-shrink-0"
                  />
                  <span className="text-[#F5F0E8] text-sm">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
