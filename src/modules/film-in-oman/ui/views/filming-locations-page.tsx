"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { OmanSubNav } from "../components/oman-sub-nav";
import {
  filmingLocations,
  categories,
  videoUrls,
  type LocationCategory,
} from "../../data/oman-data";

export function FilmingLocationsPage() {
  const [activeCategory, setActiveCategory] = useState<LocationCategory>("All");

  const filtered =
    activeCategory === "All"
      ? filmingLocations
      : filmingLocations.filter((l) => l.category === activeCategory);

  return (
    <div className="w-full bg-[#0d0d0d]">

      {/* ── SECTION 1: HERO + SUBNAV ─────────────────────────── */}
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-[#0d0d0d]">
          {/* Background video */}
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={videoUrls.filmingLocations}
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
              Filming Locations in Oman
            </h1>
            <div className="mx-auto my-5 w-16 h-px bg-[#C9943A]" />
            <p className="text-sm md:text-base text-[#9e9e9e] max-w-2xl mx-auto">
              An extraordinary variety of natural and built environments — all within a single
              production-friendly destination.
            </p>
          </div>
        </section>

        <OmanSubNav />
      </div>

      {/* ── SECTION 1.5: FILTER TABS ─────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#0d0d0d] border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs tracking-wider rounded-sm transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#C9943A] text-black font-semibold"
                  : "bg-[#161616] text-[#9e9e9e] border border-[#2a2a2a] hover:border-[#C9943A] hover:text-[#F5F0E8]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: IMAGE GRID ────────────────────────────── */}
      <section className="bg-[#0d0d0d] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((location) => (
              <div
                key={location.id}
                className="group relative overflow-hidden rounded-lg bg-[#161616] border border-[#2a2a2a] hover:border-[#C9943A] transition-all duration-300 cursor-pointer aspect-[4/3]"
              >
                {/* Shimmer placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#222222] to-[#161616] animate-pulse" />

                {/* Location image */}
                {location.image && (
                  <Image
                    src={location.image}
                    alt={location.title}
                    fill
                    loading="lazy"
                    className="object-cover z-[1]"
                  />
                )}

                {/* Bottom gradient with text */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[3] p-5">
                  <p className="text-[#C9943A] text-xs tracking-widest uppercase mb-1">
                    {location.category}
                  </p>
                  <h3 className="text-[#F5F0E8] font-semibold text-lg">
                    {location.title}
                  </h3>
                  <p className="text-[#9e9e9e] text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {location.description}
                  </p>
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
      </section>

    </div>
  );
}
