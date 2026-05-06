import Link from "next/link";
import { AustraliaSubNav } from "../components/australia-sub-nav";
import { opportunities, videoUrls } from "../../data/australia-data";

export function FilmingOpportunitiesPage() {
  return (
    <div className="w-full bg-[#0d0d0d] flex flex-col">
      {/* Hero */}
      <div className="relative w-full h-[55vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={videoUrls.filmingOpportunities}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/80 via-[#0d0d0d]/20 to-transparent" />
        <div className="absolute bottom-10 left-10 lg:left-16 z-10">
          <Link
            href="/australia"
            className="text-[#C9943A] text-xs tracking-[0.3em] uppercase font-semibold mb-3 hover:opacity-70 transition-opacity inline-flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Australia</span>
          </Link>
          <h1 className="text-4xl lg:text-6xl font-light text-white leading-tight border-b border-[#C9943A] pb-3">
            Filming Opportunities
          </h1>
        </div>
      </div>

      {/* Sub-nav */}
      <AustraliaSubNav />

      {/* Main content */}
      <div className="px-10 lg:px-16 py-10">
        <p className="text-white/60 text-sm leading-relaxed max-w-2xl mb-10">
          Australia offers one of the world&apos;s most competitive screen incentive frameworks —
          combining federal rebates through Screen Australia with state-level top-ups to maximise
          your return on qualifying production spend.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {opportunities.map((opp) => (
            <div
              key={opp.title}
              className="bg-[#161616] border border-[#2a2a2a] p-8 hover:border-[#C9943A] transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-white font-light text-xl">{opp.title}</h3>
                <span className="flex-shrink-0 border border-[#C9943A] text-[#C9943A] text-xs font-bold px-3 py-1">
                  {opp.rebate}
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">{opp.desc}</p>
              <ul className="space-y-2">
                {opp.details.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                    <span className="text-[#C9943A] mt-0.5 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
