import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/demo", destination: "/demo/index.html" }];
  },
};

export default nextConfig;
