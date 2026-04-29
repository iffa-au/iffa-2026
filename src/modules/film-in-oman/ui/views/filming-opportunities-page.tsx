import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Layers01Icon,
  SparklesIcon,
  FlashIcon,
  AnalyticsUpIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { OmanSubNav } from "../components/oman-sub-nav";
import { features, opportunities, quickFacts, videoUrls } from "../../data/oman-data";

const iconMap: Record<string, IconSvgElement> = {
  Layers01Icon,
  SparklesIcon,
  FlashIcon,
  AnalyticsUpIcon,
};

export function FilmingOpportunitiesPage() {
  return (
    <div className="w-full bg-[#0d0d0d]">

      {/* ── SECTION 1: HERO + SUBNAV ─────────────────────────── */}
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-[#0d0d0d]">
          {/* Background video */}
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={videoUrls.filmingOpportunities}
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
              Filming Opportunities in Oman
            </h1>
            <div className="mx-auto my-5 w-16 h-px bg-[#C9943A]" />
            <p className="text-sm md:text-base text-[#9e9e9e] max-w-2xl mx-auto">
              Oman offers a compelling set of advantages for international productions
              across every format and scale.
            </p>
          </div>
        </section>

        <OmanSubNav />
      </div>

      {/* ── SECTION 2: FEATURES + OPPORTUNITIES + SIDEBAR ────── */}
      <section className="bg-[#0d0d0d] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ── LEFT: MAIN CONTENT ── */}
            <div className="lg:col-span-2">

              {/* Part A — Intro block */}
              <div>
                <p className="text-[#C9943A] text-xs tracking-[0.3em] uppercase mb-3">
                  WHY OMAN
                </p>
                <h2 className="text-3xl font-bold text-[#F5F0E8]">
                  Why Explore Oman for Your Next Production
                </h2>
                <div className="w-12 h-px bg-[#C9943A] my-5" />
                <p className="text-[#9e9e9e] leading-relaxed">
                  Oman stands apart as a filming destination — not just for its landscapes, but for
                  the convergence of practical advantages and untapped cinematic potential that few
                  destinations in the region can match.
                </p>
              </div>

              {/* Part B — Feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
                {features.map(({ icon, title, description }) => (
                  <div
                    key={title}
                    className="bg-[#161616] border border-[#2a2a2a] hover:border-[#C9943A] rounded-lg p-6 transition-all duration-300"
                  >
                    <HugeiconsIcon
                      icon={iconMap[icon]}
                      size={24}
                      color="#C9943A"
                    />
                    <h3 className="text-[#F5F0E8] font-semibold text-base mt-4">
                      {title}
                    </h3>
                    <p className="text-[#9e9e9e] text-sm mt-2 leading-relaxed">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Part C — Opportunity types */}
              <div className="mt-12">
                <p className="text-[#C9943A] text-xs tracking-[0.3em] uppercase mb-5">
                  OPPORTUNITY TYPES
                </p>
                <h2 className="text-2xl font-bold text-[#F5F0E8] mb-6">
                  What&apos;s Available
                </h2>
                <div>
                  {opportunities.map(({ title, desc }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 py-4 border-b border-[#2a2a2a]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9943A] mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-[#F5F0E8] font-medium text-sm">{title}</p>
                        <p className="text-[#9e9e9e] text-xs mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: STICKY SIDEBAR ── */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-6">
                  <p className="text-[#C9943A] text-xs tracking-[0.3em] uppercase mb-4">
                    QUICK FACTS
                  </p>
                  <div className="space-y-4">
                    {quickFacts.map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between items-center border-b border-[#2a2a2a] pb-3"
                      >
                        <span className="text-[#9e9e9e] text-xs">{label}</span>
                        <span className="text-[#F5F0E8] text-xs font-semibold">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
