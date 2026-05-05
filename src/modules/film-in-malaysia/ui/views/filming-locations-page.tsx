"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { filters, locations, videoUrls } from "../../data/malaysia-data";
import type { LocationFilter } from "../../data/malaysia-data";
import { MalaysiaSidebar } from "../components/malaysia-sidebar";

export function FilmingLocationsPage() {
  const [activeFilter, setActiveFilter] = useState<LocationFilter>("All");

  const filtered =
    activeFilter === "All"
      ? locations
      : locations.filter((l) => l.type === activeFilter);

  return (
    <div className="w-full bg-[#0d0d0d] flex flex-col">
      <div className="relative w-full h-[65vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoUrls.filmingLocations}
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
            Filming Locations
          </h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="px-8 lg:px-16 pt-14 border-b border-[#2a2a2a]">
          <div className="flex gap-2 flex-wrap pb-4">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-200 ${
                  activeFilter === f
                    ? "text-[#C9943A] border-b-2 border-[#C9943A] -mb-[1px]"
                    : "text-[#999999] hover:text-[#C9943A]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1">
          <div className="flex-1 min-w-0 px-8 lg:px-16 py-10">
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-[#161616] border border-[#2a2a2a] overflow-hidden hover:border-[#C9943A] transition-all duration-300"
                >
                  <div className="relative w-full h-52 bg-[#1f1f1f]">
                    <Image
                      src={loc.image}
                      alt={loc.name}
                      fill
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-[#C9943A] text-black text-xs font-bold px-2 py-0.5">
                        {loc.state}
                      </span>
                      <span className="text-[#555555] text-xs tracking-widest uppercase">
                        {loc.type}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">{loc.name}</h3>
                    <p className="text-[#999999] text-sm leading-relaxed mb-4">{loc.desc}</p>
                    <div className="flex gap-2 flex-wrap">
                      {loc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-[#2a2a2a] text-[#555555] text-xs px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <MalaysiaSidebar />
        </div>
      </div>
    </div>
  );
}
