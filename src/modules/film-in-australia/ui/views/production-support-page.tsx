import Link from "next/link";
import { AustraliaSubNav } from "../components/australia-sub-nav";
import { services, videoUrls } from "../../data/australia-data";

export function ProductionSupportPage() {
  return (
    <div className="w-full bg-[#0d0d0d] flex flex-col">
      {/* Hero */}
      <div className="relative w-full h-[55vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={videoUrls.productionSupport}
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
            Production Support
          </h1>
        </div>
      </div>

      {/* Sub-nav */}
      <AustraliaSubNav />

      {/* Main content */}
      <div className="px-10 lg:px-16 py-10">
        {services.map((section, i) => (
          <div key={section.category}>
            {i > 0 && <div className="border-t border-[#2a2a2a] my-10" />}

            <p className="text-[#C9943A] text-xs tracking-widest uppercase mb-3">
              {section.category}
            </p>
            <h2 className="text-white font-light text-2xl mb-6">{section.title}</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-[#161616] border border-[#2a2a2a] border-l-2 border-l-[#C9943A] p-6 hover:border-[#C9943A] transition-colors duration-200"
                >
                  <p className="text-white font-semibold mb-2">{item.name}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
