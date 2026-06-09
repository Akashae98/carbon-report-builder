import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@sparticuz/chromium-min",
    "puppeteer",
    "puppeteer-core",
  ],
};

export default nextConfig;
