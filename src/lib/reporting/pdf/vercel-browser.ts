import type { BrowserAdapter } from "@/lib/reporting/pdf/types";

export async function launchVercelPdfBrowser(): Promise<BrowserAdapter> {
  const [{ default: chromium }, puppeteerCore] = await Promise.all([
    import("@sparticuz/chromium-min"),
    import("puppeteer-core"),
  ]);

  const executablePath =
    process.env.CHROMIUM_EXECUTABLE_PATH ?? (await chromium.executablePath());

  return puppeteerCore.default.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });
}
