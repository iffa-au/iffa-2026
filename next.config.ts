import type { NextConfig } from "next";

import { OPTIMIZABLE_IMAGE_HOSTS } from "./src/lib/image-hosts";
import newsData from "./src/modules/news/data/newsData.json";

/*
 * /latest-news posters are hotlinked from the publishers' sites. Going through
 * the optimizer means the browser only ever asks our own origin for them —
 * resized, cached, and without the third-party cookies those sites set. The
 * host list comes from the data file, so adding a story needs no config edit.
 */
// Keeps each poster's protocol: fordhampr.ca's https certificate is broken, so
// browsers (which upgrade http images on an https page) can't load it, but the
// optimizer can fetch it over http and serve it from our own https origin.
// ponytail: one pattern per story, duplicates included; Next doesn't mind.
const newsImagePatterns = newsData
  .map((item) => item.poster)
  .filter((src): src is string => typeof src === "string" && /^https?:\/\//.test(src))
  .map((src) => {
    const { protocol, hostname } = new URL(src);
    return { protocol: protocol.slice(0, -1) as "http" | "https", hostname };
  });

/*
 * Security headers on every response.
 * ponytail: the CSP only covers framing, plugins and <base>, not scripts. A
 * script-src policy needs per-request nonces, which would end the prerendered,
 * CDN-cached pages; add it when that trade is worth making.
 * No Cross-Origin-Embedder-Policy: `require-corp` blocks the YouTube and
 * Instagram iframes, which send no CORP header.
 * HSTS covers subdomains: every iffa.com.au subdomain must serve HTTPS, or
 * browsers that have visited the main site will refuse to open it.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // "0" is the current advice: the old XSS auditor caused more holes than it closed.
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      ...OPTIMIZABLE_IMAGE_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname })),
      ...newsImagePatterns,
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/fallbacks/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
