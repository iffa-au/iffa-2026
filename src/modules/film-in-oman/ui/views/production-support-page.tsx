import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ClipboardIcon,
  Film01Icon,
  FileValidationIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { OmanSubNav } from "../components/oman-sub-nav";
import { productionServices, videoUrls } from "../../data/oman-data";

const iconMap: Record<string, IconSvgElement> = {
  ClipboardIcon,
  Film01Icon,
  FileValidationIcon,
};

export function ProductionSupportPage() {
  return (
    <div className="w-full bg-[#0d0d0d]">

      {/* ── SECTION 1: HERO + SUBNAV ─────────────────────────── */}
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-[#0d0d0d]">
          {/* Background video */}
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={videoUrls.productionSupport}
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
              Get Production Support in Oman
            </h1>
            <div className="mx-auto my-5 w-16 h-px bg-[#C9943A]" />
            <p className="text-sm md:text-base text-[#9e9e9e] max-w-2xl mx-auto">
              From concept to execution — professional, efficient, and at international standards.
            </p>
          </div>
        </section>

        <OmanSubNav />
      </div>

      {/* ── SECTION 2: INTRO ─────────────────────────────────── */}
      <section className="bg-[#0d0d0d] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#C9943A] text-xs tracking-[0.3em] uppercase mb-3">
            END-TO-END SUPPORT
          </p>
          <h2 className="text-3xl font-bold text-[#F5F0E8]">
            End-to-End Production Support
          </h2>
          <div className="w-12 h-px bg-[#C9943A] my-5" />
          <p className="text-[#9e9e9e] leading-relaxed">
            Whether you are an independent filmmaker or a major studio, our production support
            services in Oman are designed to handle the complexities of international filming —
            so you can focus on your creative vision.
          </p>
          <p className="text-[#9e9e9e] leading-relaxed mt-4">
            We coordinate directly with local authorities, crew networks, and location owners to
            ensure your production runs on schedule and within budget.
          </p>
        </div>
      </section>

      {/* ── SECTION 3: SERVICES GRID ─────────────────────────── */}
      <section className="bg-[#111111] py-16 px-6 border-t border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9943A] text-xs tracking-[0.3em] uppercase mb-3 text-center">
            WHAT WE OFFER
          </p>
          <h2 className="text-3xl font-bold text-[#F5F0E8] text-center">
            Our Production Services
          </h2>
          <div className="mx-auto w-12 h-px bg-[#C9943A] my-5" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {productionServices.map(({ icon, title, items }) => (
              <div
                key={title}
                className="bg-[#161616] border border-[#2a2a2a] hover:border-[#C9943A] rounded-lg p-8 transition-all duration-300"
              >
                <HugeiconsIcon icon={iconMap[icon]} size={28} color="#C9943A" />
                <h3 className="text-[#F5F0E8] font-semibold text-lg mt-5 mb-5">
                  {title}
                </h3>
                <div className="w-8 h-px bg-[#C9943A] mb-5" />
                <ul className="space-y-3">
                  {items.map((item) => (
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
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
