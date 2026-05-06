import Link from "next/link";
import { workflowSteps, videoUrls } from "../../data/malaysia-data";
import { MalaysiaSidebar } from "../components/malaysia-sidebar";

export function FilmingGuidePage() {
  return (
    <div className="w-full bg-[#0d0d0d] flex flex-col">
      <div className="relative w-full h-[65vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrls.filmingGuide}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/30 via-transparent to-[#0d0d0d]" />
        <div className="absolute bottom-10 left-8 lg:left-16 z-10">
          <Link
            href="/malaysia"
            className="text-[#C9943A] text-xs tracking-[0.3em] uppercase font-semibold mb-2 hover:opacity-70 transition-opacity inline-flex items-center gap-1.5 group"
          >
            <span>←</span>
            <span className="underline underline-offset-4 decoration-[#C9943A]/50 group-hover:decoration-[#C9943A]">
              Malaysia
            </span>
          </Link>
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            Filming Guide
          </h1>
        </div>
      </div>

      <div className="border-b border-[#2a2a2a]" />

      <div className="flex flex-1">
        <div className="flex-1 min-w-0 px-8 lg:px-16 py-10">
          <div>
            {workflowSteps.map((step, idx) => {
              const isLast = idx === workflowSteps.length - 1;
              return (
                <div key={step.phase} className="flex gap-6 pb-12 relative">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#C9943A] text-black font-bold flex items-center justify-center text-sm z-10">
                      {step.phase}
                    </div>
                    {!isLast && (
                      <div className="flex-1 w-px bg-[#2a2a2a] mt-2" />
                    )}
                  </div>

                  <div className="pt-1 pb-2">
                    <div className="flex items-center flex-wrap gap-3 mb-2">
                      <h3 className="text-white font-bold text-lg">{step.title}</h3>
                      <span className="border border-[#C9943A] text-[#C9943A] text-xs px-3 py-0.5">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-[#999999] text-sm leading-relaxed mb-4">{step.desc}</p>
                    <div className="inline-flex gap-2 flex-wrap">
                      {step.actions.map((action) => (
                        <span
                          key={action}
                          className="bg-[#161616] border border-[#2a2a2a] text-[#cccccc] text-xs px-3 py-1"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <MalaysiaSidebar />
      </div>
    </div>
  );
}
