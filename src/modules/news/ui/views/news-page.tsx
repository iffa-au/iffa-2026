"use client";

import React, { useRef } from 'react';
import newsData from '@/modules/news/data/newsData.json';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

const NewsPage = () => {
  const newsTitleRef = useRef<HTMLHeadingElement>(null);
  const year = "2026";

  const featuredItems = newsData.filter((news: any) => news.featured === true);
  const regularItems = newsData.filter((news: any) => !news.featured);

  // Fallback if there are not enough featured items
  const sortedItems = [...featuredItems, ...regularItems];

  // --- DATA SEGMENTATION (like the original) ---
  const s1_main = sortedItems[0] || sortedItems[0];
  const s1_side = sortedItems.slice(1, 6);
  const s2_grid = sortedItems.slice(6, 10);
  const s3_main = sortedItems[10] || sortedItems[1];
  const s3_side = sortedItems.slice(11, 16);
  const s4_tabs = sortedItems.slice(16, 20);
  const s5_main = sortedItems[20] || sortedItems[2];
  const s5_side = sortedItems.slice(21, 26);
  const s6_tabs = sortedItems.slice(26, 30);
  const s7_final = sortedItems.slice(30);

  useGSAP(() => {
    if (newsTitleRef.current) {
      gsap.from(newsTitleRef.current, { y: -30, opacity: 0, duration: 0.6 });
    }
    gsap.from(".editorial-row", { 
      opacity: 0, 
      y: 30, 
      stagger: 0.2, 
      duration: 0.8, 
      ease: "power2.out" 
    });
  });

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 mb-10">
      <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-white whitespace-nowrap">
        {title.split(' ')[0]} <span className="text-yellow-500">{title.split(' ').slice(1).join(' ')}</span>
      </h3>
      <div className="h-[1px] bg-white/20 w-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-16">
      <div className="container max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <h1 ref={newsTitleRef} className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {year} Latest News
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-700 mx-auto mb-6"></div>
        </div>

        {/* --- SECTION 1: HERO + 5 SIDE BAR --- */}
        {s1_main && (
          <div className="editorial-row grid lg:grid-cols-3 gap-12 mb-24">
            <div className="lg:col-span-2">
              <a href={s1_main.link} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 aspect-video mb-6">
                  <Image src={s1_main.poster || '/placeholder.jpg'} fill className="object-cover transition-transform group-hover:scale-105 duration-700" alt="" unoptimized />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 font-bold uppercase text-xs tracking-widest">
                    <span className="text-yellow-500">{s1_main.companyName}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-gray-500">{s1_main.date}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold group-hover:text-yellow-500 transition-colors">{s1_main.description}</h2>
                </div>
              </a>
            </div>
            <div className="space-y-6">
              <SectionHeader title="Trending Headlines" />
              <div className="space-y-6">
                {s1_side.map((news: any, i: number) => (
                  <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="flex gap-4 group items-center border-b border-white/5 pb-4">
                    <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/10">
                      <Image src={news.poster || '/placeholder.jpg'} fill className="object-cover" alt="" unoptimized />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase mb-1">
                        <span className="text-yellow-500">{news.companyName}</span> 
                        <span className="text-gray-500"> • {news.date}</span>
                      </p>
                      <h4 className="text-sm font-bold group-hover:text-yellow-500 line-clamp-2">{news.description}</h4>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION 2: 2x2 GRID --- */}
        {s2_grid.length > 0 && (
          <div className="editorial-row mb-24">
            <SectionHeader title="More Updates" />
            <div className="grid md:grid-cols-2 gap-8">
              {s2_grid.map((news: any, i: number) => (
                <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="group p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-6 hover:bg-white/10 transition-all">
                  <div className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-white/10">
                    <Image src={news.poster || '/placeholder.jpg'} fill className="object-cover" alt="" unoptimized />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-bold uppercase mb-2">
                      <span className="text-yellow-500">{news.companyName}</span> 
                      <span className="text-gray-500"> | {news.date}</span>
                    </p>
                    <h3 className="text-xl font-bold group-hover:text-yellow-500 mb-2 leading-tight">{news.description}</h3>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">By {news.author}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION 3: REVERSED HERO + SIDEBAR --- */}
        {s3_main && (
          <div className="editorial-row grid lg:grid-cols-3 gap-12 mb-24">
            <div className="space-y-6 order-2 lg:order-1">
              <SectionHeader title="Key Moments" />
              <div className="space-y-6">
                {s3_side.map((news: any, i: number) => (
                  <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="flex gap-4 group border-b border-white/5 pb-4">
                    <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-white/10">
                      <Image src={news.poster || '/placeholder.jpg'} fill className="object-cover" alt="" unoptimized />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase mb-1">
                        <span className="text-yellow-500">{news.companyName}</span> 
                        <span className="text-gray-500"> • {news.date}</span>
                      </p>
                      <h4 className="text-sm font-bold group-hover:text-yellow-500 line-clamp-2">{news.description}</h4>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 order-1 lg:order-2">
              <a href={s3_main.link} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 aspect-video mb-6">
                  <Image src={s3_main.poster || '/placeholder.jpg'} fill className="object-cover transition-transform group-hover:scale-105 duration-700" alt="" unoptimized />
                </div>
                <div className="flex items-center gap-3 font-bold uppercase text-xs tracking-widest mb-3">
                  <span className="text-yellow-500">{s3_main.companyName}</span>
                  <span className="text-white/20">•</span>
                  <span className="text-gray-500">{s3_main.date}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold group-hover:text-yellow-500 transition-colors">{s3_main.description}</h2>
              </a>
            </div>
          </div>
        )}

        {/* --- SECTION 4: 4x1 TABS --- */}
        {s4_tabs.length > 0 && (
          <div className="editorial-row mb-24">
            <SectionHeader title="Global Cinema" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {s4_tabs.map((news: any, i: number) => (
                <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-all">
                  <div className="relative w-full h-40 rounded-xl mb-4 overflow-hidden border border-white/5">
                    <Image src={news.poster || '/placeholder.jpg'} fill className="object-cover" alt="" unoptimized />
                  </div>
                  <p className="text-yellow-500 text-[10px] font-bold uppercase mb-2">{news.companyName}</p>
                  <h4 className="font-bold text-sm leading-tight group-hover:text-yellow-500 line-clamp-2 mb-3">{news.description}</h4>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">{news.date}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION 5: HERO + SIDEBAR --- */}
        {s5_main && (
          <div className="editorial-row grid lg:grid-cols-3 gap-12 mb-24">
            <div className="lg:col-span-2">
              <a href={s5_main.link} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 aspect-video mb-6">
                  <Image src={s5_main.poster || '/placeholder.jpg'} fill className="object-cover transition-transform group-hover:scale-105 duration-700" alt="" unoptimized />
                </div>
                <div className="flex items-center gap-3 font-bold uppercase text-xs tracking-widest mb-3">
                  <span className="text-yellow-500">{s5_main.companyName}</span>
                  <span className="text-white/20">•</span>
                  <span className="text-gray-500">{s5_main.date}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold group-hover:text-yellow-500">{s5_main.description}</h2>
              </a>
            </div>
            <div className="space-y-6">
              <SectionHeader title="Top Updates" />
              <div className="space-y-6">
                {s5_side.map((news: any, i: number) => (
                  <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="flex gap-4 group border-b border-white/5 pb-4">
                    <div className="relative w-16 h-16 rounded-lg shrink-0 overflow-hidden border border-white/10">
                      <Image src={news.poster || '/placeholder.jpg'} fill className="object-cover" alt="" unoptimized />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase mb-1">
                        <span className="text-yellow-500">{news.companyName}</span> 
                        <span className="text-gray-500"> • {news.date}</span>
                      </p>
                      <h4 className="text-sm font-bold group-hover:text-yellow-500 line-clamp-2">{news.description}</h4>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION 6: 4x1 TABS --- */}
        {s6_tabs.length > 0 && (
          <div className="editorial-row mb-24">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {s6_tabs.map((news: any, i: number) => (
                <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-all">
                  <div className="relative w-full h-40 rounded-xl mb-4 overflow-hidden border border-white/5">
                    <Image src={news.poster || '/placeholder.jpg'} fill className="object-cover" alt="" unoptimized />
                  </div>
                  <p className="text-yellow-500 text-[10px] font-bold uppercase mb-2">{news.companyName}</p>
                  <h4 className="font-bold text-sm leading-tight group-hover:text-yellow-500 line-clamp-2 mb-3">{news.description}</h4>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">{news.date}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* --- SECTION 7: 2xN FINAL GRID --- */}
        {s7_final.length > 0 && (
          <div className="editorial-row">
            <SectionHeader title="More Highlights" />
            <div className="grid md:grid-cols-2 gap-10">
              {s7_final.map((news: any, i: number) => (
                <a key={i} href={news.link} target="_blank" rel="noopener noreferrer" className="group block border-b border-white/10 pb-10 last:border-0">
                  <div className="flex gap-6">
                    <div className="relative w-40 h-28 shrink-0 rounded-xl overflow-hidden border border-white/10 group-hover:scale-105 transition-transform">
                      <Image src={news.poster || '/placeholder.jpg'} fill className="object-cover" alt="" unoptimized />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase mb-2">
                        <span className="text-yellow-500">{news.companyName}</span> 
                        <span className="text-gray-500"> | {news.date}</span>
                      </p>
                      <h3 className="text-lg font-bold group-hover:text-yellow-500 mb-3 leading-snug">{news.description}</h3>
                      <div className="flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        <span>By {news.author}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NewsPage;
