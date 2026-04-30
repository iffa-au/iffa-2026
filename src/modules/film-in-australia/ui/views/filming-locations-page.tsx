"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AustraliaSubNav } from "../components/australia-sub-nav";
import {
  locations,
  filters,
  videoUrls,
  type LocationFilter,
} from "../../data/australia-data";

export function FilmingLocationsPage() {
  const [activeFilter, setActiveFilter] = useState<LocationFilter>("All");

  const filtered =
    activeFilter === "All"
      ? locations
      : locations.filter((l) => l.type === activeFilter);

  return (
    <div className="w-full bg-[#0d0d0d] flex flex-col">
      {/* Hero */}
      <div className="relative w-full h-[55vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={videoUrls.filmingLocations}
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
            Filming Locations
          </h1>
        </div>
      </div>

      {/* Sub-nav */}
      <AustraliaSubNav />

      {/* Filter tabs */}
      <div className="border-b border-[#2a2a2a] px-10 lg:px-16 py-4 flex gap-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-xs tracking-widest uppercase transition-all duration-200 pb-1 ${
              activeFilter === f
                ? "text-[#C9943A] border-b-2 border-[#C9943A] -mb-[1px]"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Location cards */}
      <div className="px-10 lg:px-16 py-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((loc) => (
          <div
            key={loc.id}
            className="relative h-72 overflow-hidden group cursor-default border border-[#2a2a2a] hover:border-[#C9943A] transition-all duration-300"
          >
            {/* Image */}
            <Image
              src={loc.image}
              alt={loc.name}
              fill
              loading="lazy"
              className={`object-cover ${loc.imagePosition ?? "object-center"}`}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/90 via-[#0d0d0d]/30 to-transparent group-hover:from-[#0d0d0d]/95 transition-all duration-300 z-[1]" />

            {/* State + type badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-[2]">
              <span className="bg-[#C9943A] text-black text-xs font-bold px-2 py-0.5">
                {loc.state}
              </span>
              <span className="text-white/50 text-xs tracking-widest uppercase">
                {loc.type}
              </span>
            </div>

            {/* Text */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-[2]">
              <h3 className="text-white font-light text-xl mb-2">{loc.name}</h3>
              <p className="text-white/60 text-xs leading-relaxed mb-3 line-clamp-2">
                {loc.desc}
              </p>
              <div className="flex gap-2 flex-wrap">
                {loc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/20 text-white/30 text-xs px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#9e9e9e]">No locations found for this category.</p>
        </div>
      )}
    </div>
  );
}
