"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Footer() {
  const pathname = usePathname();
  const acknowledgement =
    "We acknowledge the Traditional Owners of the land where we work and live. We pay our respects to Elders past, present and emerging. We celebrate the stories, culture and traditions of Aboriginal and Torres Strait Islander Elders of all communities who also work and live on this land.";

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "IFFA Global", path: "/iffa-global" },
    { name: "Partner with us", path: "/partnerwithus" },
    { name: "Education & Training", path: "/education&training" },
    { name: "Become A Member", path: "/membership" },
  ];

  const socialLinks = [
    { label: "IG", href: "https://www.instagram.com/iffaawards/" },
    { label: "FB", href: "https://www.facebook.com/iffaawardss" },
    { label: "IN", href: "https://www.linkedin.com/company/iffaawards/?viewAsMember=true" },
    { label: "YT", href: "https://www.youtube.com/channel/UCO2xJ6Cw1-5o1iolIJtO4yQ" },
    { label: "IMDb", href: "https://m.imdb.com/event/ev0074610/2025/1/?ref_=ev_tl_yr_1" },
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-neutral-900 via-neutral-900 to-black text-white relative overflow-hidden">
      <div className="w-full relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 px-4">
            
            {/* Acknowledgement Section */}
            <div className="lg:col-span-4 flex flex-col justify-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                <div className="relative group">
                  <div className="relative w-12 sm:w-16 md:w-18 aspect-video">
                    {/* Placeholder for flags - adjust src path based on where flags.png is migrated in iffa-2026 public folder */}
                    <img
                      src="/images/Home/Footer/flags.png"
                      alt="Flags"
                      className="w-12 sm:w-16 md:w-18 h-auto opacity-100 filter drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-lg blur-sm opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-neutral-700/80 via-yellow-400/50 to-transparent"></div>
              </div>
              <div className="relative group">
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-100 font-light relative z-10 group-hover:text-white transition-colors duration-500">
                  {acknowledgement}
                </p>
                <div className="absolute -inset-4 bg-gradient-to-br from-neutral-800/12 to-transparent rounded-xl blur-sm opacity-40 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Logo & Navigation Section */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center gap-6">
              <Link href="/" className="group block relative mb-3">
                <div className="absolute -inset-3 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-2xl blur-lg opacity-20 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img
                  src="/assets/IFFA_logo.png"
                  alt="IFFA Logo"
                  className="w-24 sm:w-28 group-hover:scale-110 transition-all duration-700 filter drop-shadow-2xl relative z-10"
                />
              </Link>

              {/* Navigation Links */}
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 w-full">
                {navLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`px-1 py-1 text-xs 2xl:text-sm font-light uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
                        isActive
                          ? "text-yellow-400"
                          : "text-white hover:text-yellow-400"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Social Media Section */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center gap-6">
              <div className="text-center lg:text-right relative group">
                <div className="absolute -inset-5 bg-gradient-to-br from-yellow-400/12 to-transparent rounded-2xl blur-lg opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-wide relative z-10 group-hover:text-yellow-400 transition-colors duration-500">
                  Connect With Us
                </h3>
                <p className="text-sm text-neutral-100 font-light mb-8 relative z-10 group-hover:text-white transition-colors duration-500">
                  Stay updated with our latest news and announcements
                </p>
              </div>
              <div className="flex gap-4 flex-wrap justify-center lg:justify-end">
                {socialLinks.map((social, idx) => (
                  <Button
                    key={idx}
                    asChild
                    variant="ghost"
                    size="icon"
                    className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-neutral-800/40 text-white to-neutral-800/30 backdrop-blur-md border border-neutral-700/40 rounded-2xl hover:border-yellow-400/60 hover:bg-gradient-to-br hover:text-yellow-400 hover:from-yellow-400/30 hover:to-yellow-400/20 hover:shadow-2xl hover:shadow-yellow-400/30 transition-all duration-700 transform hover:scale-110 hover:-translate-y-2 shadow-xl shadow-black/35"
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className="z-10 font-bold">
                      {social.label}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Logo Strip Section */}
        <div className="py-10 border-t border-neutral-700/50 border-gradient-to-r from-transparent via-neutral-700/50 to-transparent">
          <img
            src="/images/Home/Footer/strip-no-bg.png"
            alt="Logos strip"
            className="w-full h-auto"
          />
        </div>

        {/* Copyright Section */}
        <div className="py-10 border-t border-neutral-700/50 border-gradient-to-r from-transparent via-neutral-700/50 to-transparent">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-sm text-neutral-100 font-light relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400/12 to-transparent rounded-lg blur-sm opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                © 2026 IFFA Awards. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-400 font-medium">
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-yellow-400/80 to-yellow-300/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
