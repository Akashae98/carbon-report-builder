import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@sparticuz/chromium",
    "puppeteer",
    "puppeteer-core",
  ],
};

export default nextConfig;
