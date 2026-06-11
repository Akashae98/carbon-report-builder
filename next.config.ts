import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/reports/pdf/*": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
    ],
  },
  serverExternalPackages: [
    "@sparticuz/chromium",
    "puppeteer",
    "puppeteer-core",
  ],
};

export default nextConfig;
