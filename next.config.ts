import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dhbdzeb2cbayq.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
