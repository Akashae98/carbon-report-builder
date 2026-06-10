import type { BrowserAdapter } from "@/lib/reporting/pdf/types";

export async function launchLocalPdfBrowser(): Promise<BrowserAdapter> {
  const puppeteer = await import("puppeteer");

  return puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}
