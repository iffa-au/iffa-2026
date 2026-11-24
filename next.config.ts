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

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Persists Turbopack's compile cache in .next/cache/turbopack, which
  // amplify.yml keeps between builds (warm compile ~10s -> ~2s locally).
  experimental: { turbopackFileSystemCacheForBuild: true },
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
