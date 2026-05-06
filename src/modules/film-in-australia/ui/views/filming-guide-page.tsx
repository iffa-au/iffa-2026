import Link from "next/link";
import { AustraliaSubNav } from "../components/australia-sub-nav";
import { workflowSteps, warningItems, videoUrls } from "../../data/australia-data";

export function FilmingGuidePage() {
  return (
    <div className="bg-[#0d0d0d] min-h-screen">
      {/* Hero */}
      <section className="relative h-[55vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover object-top z-0"
          src={videoUrls.filmingGuide}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/80 via-[#0d0d0d]/20 to-transparent z-[1]" />
        <div className="absolute bottom-10 left-10 lg:left-16 z-10">
          <Link
            href="/australia"
            className="text-[#C9943A] text-xs tracking-[0.3em] uppercase font-semibold mb-3 hover:opacity-70 transition-opacity inline-flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Australia</span>
          </Link>
          <h1 className="text-4xl lg:text-6xl font-light text-white leading-tight border-b border-[#C9943A] pb-3">
            Filming Guide
          </h1>
        </div>
      </section>

      {/* Sub-nav */}
      <AustraliaSubNav />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 lg:px-0 py-16">
        <p className="text-white/60 text-sm leading-relaxed max-w-2xl mb-14">
          Filming in Australia is well-supported by federal and state government agencies.
          Following this step-by-step guide will help you navigate permits, rebates, and
          on-ground logistics efficiently.
        </p>

        {/* Steps */}
        <div className="flex flex-col">
          {workflowSteps.map((step, idx) => (
            <div key={step.number} className="flex gap-8">
              {/* Number + connector line */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border border-[#C9943A] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9943A] text-xs font-mono">{step.number}</span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <div className="w-px flex-1 bg-[#2a2a2a] mt-2 mb-2" />
                )}
              </div>

              {/* Content */}
              <div className="pb-12">
                <h3 className="text-white text-lg font-light mb-3">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">{step.intro}</p>
                <ul className="space-y-2 mb-4">
                  {step.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                      <span className="text-[#C9943A] mt-0.5 text-xs flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {step.note && (
                  <div className="border-l-2 border-l-[#C9943A] pl-4 py-1">
                    <p className="text-white/40 text-xs leading-relaxed">{step.note}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Warning callout */}
        <div className="mt-4 border border-[#2a2a2a] bg-[#161616] rounded p-6">
          <p className="text-[#C9943A] text-xs tracking-widest uppercase mb-4">
            Requires Additional Approvals
          </p>
          <p className="text-white/50 text-sm mb-5">
            The following production types require additional permits or regulatory approvals
            beyond a standard location permit:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {warningItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                <span className="text-yellow-500/70 text-xs mt-0.5 flex-shrink-0">⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
