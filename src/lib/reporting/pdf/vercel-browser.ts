import type { BrowserAdapter } from "@/lib/reporting/pdf/types";

export async function launchVercelPdfBrowser(): Promise<BrowserAdapter> {
  const [{ default: chromium }, puppeteerCore] = await Promise.all([
    import("@sparticuz/chromium"),
    import("puppeteer-core"),
  ]);

  const executablePath = await chromium.executablePath();

  return puppeteerCore.default.launch({
    args: await puppeteerCore.default.defaultArgs({
      args: chromium.args,
      headless: "shell",
    }),
    executablePath,
    headless: "shell",
  });
}
