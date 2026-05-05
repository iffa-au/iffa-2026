import Link from "next/link";
import { opportunities, videoUrls } from "../../data/malaysia-data";
import { MalaysiaSidebar } from "../components/malaysia-sidebar";

export function FilmingOpportunitiesPage() {
  return (
    <div className="w-full bg-[#0d0d0d] flex flex-col">
      <div className="relative w-full h-[65vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrls.filmingOpportunities}
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
            Filming Opportunities
          </h1>
        </div>
      </div>

      <div className="border-b border-[#2a2a2a]" />

      <div className="flex flex-1">
        <div className="flex-1 min-w-0 px-8 lg:px-16 py-10">
          <p className="text-[#999999] text-sm leading-relaxed max-w-2xl mb-10">
            Malaysia offers one of Southeast Asia&apos;s most competitive incentive landscapes for
            international productions. From blockbuster features to branded content, FINAS and
            state-level programs are structured to reduce your production spend and maximise
            creative opportunity.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {opportunities.map((op) => (
              <div
                key={op.title}
                className="bg-[#161616] border border-[#2a2a2a] p-8 hover:border-[#C9943A] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-white font-bold text-xl leading-snug">{op.title}</h3>
                  <span className="border border-[#C9943A] text-[#C9943A] text-xs font-bold px-3 py-1 ml-4 flex-shrink-0">
                    {op.rebate}
                  </span>
                </div>
                <p className="text-[#999999] text-sm leading-relaxed mb-6">{op.desc}</p>
                <ul className="space-y-2">
                  {op.details.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-[#C9943A] font-bold mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-[#cccccc] text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <MalaysiaSidebar />
      </div>
    </div>
  );
}
