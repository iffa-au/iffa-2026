import Link from "next/link";
import { services, videoUrls } from "../../data/malaysia-data";
import { MalaysiaSidebar } from "../components/malaysia-sidebar";

export function ProductionSupportPage() {
  return (
    <div className="w-full bg-[#0d0d0d] flex flex-col">
      <div className="relative w-full h-[65vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrls.productionSupport}
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
            Production Support
          </h1>
        </div>
      </div>

      <div className="border-b border-[#2a2a2a]" />

      <div className="flex flex-1">
        <div className="flex-1 min-w-0 px-8 lg:px-16 py-10">
          {services.map((section, idx) => (
            <div key={section.category}>
              <p className="text-[#C9943A] text-xs tracking-widest uppercase mb-4">
                {section.category}
              </p>
              <h2 className="text-white text-xl font-bold mb-6">
                {section.category} Services
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-[#161616] border border-[#2a2a2a] p-6 hover:border-[#C9943A] transition-colors duration-200"
                  >
                    <h3 className="text-white font-semibold mb-2">{item.name}</h3>
                    <p className="text-[#999999] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              {idx < services.length - 1 && (
                <div className="border-t border-[#2a2a2a] my-10" />
              )}
            </div>
          ))}
        </div>

        <MalaysiaSidebar />
      </div>
    </div>
  );
}
