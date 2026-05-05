import Link from "next/link";
import { MapPin, Film, Users, ListChecks, type LucideIcon } from "lucide-react";
import { videoUrls, subPages } from "../../data/malaysia-data";

const iconMap: Record<string, LucideIcon> = {
  Location01Icon: MapPin,
  Film01Icon: Film,
  UserGroupIcon: Users,
  TaskDone01Icon: ListChecks,
};

export function MalaysiaPage() {
  return (
    <div className="w-full bg-[#0d0d0d]">
      <section className="relative h-screen overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={videoUrls.malaysiaHub}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0d0d0d]/80 via-[#0d0d0d]/30 to-transparent [clip-path:polygon(0_0,85%_0,100%_100%,0_100%)]" />
        <div className="relative z-10 flex items-stretch justify-between h-full">
          <div className="flex items-center px-12 lg:px-24 py-24">
            <div className="max-w-xl">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Filming in<br />Malaysia
              </h1>
              <p className="text-[#cccccc] text-lg leading-relaxed max-w-md">
                A world-class production hub at the heart of Southeast Asia — tropical
                landscapes, generous government incentives, and a thriving creative industry.
              </p>
            </div>
          </div>
          <div className="flex flex-col w-64 lg:w-72 flex-shrink-0">
            <div className="h-28 flex-shrink-0" />
            {subPages.map(({ iconName, label, descriptor, href }) => {
              const Icon = iconMap[iconName];
              return (
                <Link
                  key={href}
                  href={href}
                  className="group flex-1 flex flex-col justify-center px-5 py-4 border-l border-b border-white/20 hover:border-white/55 bg-black/50 backdrop-blur-sm transition-all duration-300 last:border-b-0"
                >
                  <Icon size={18} className="text-[#C9943A]" />
                  <h3 className="text-[#F5F0E8] text-xs tracking-widest uppercase mt-3 leading-snug">{label}</h3>
                  <p className="text-[#9e9e9e] text-[10px] tracking-widest uppercase mt-1 leading-relaxed">{descriptor}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
