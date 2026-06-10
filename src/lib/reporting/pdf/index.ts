import type { BrowserAdapter, BrowserPageAdapter } from "@/lib/reporting/pdf/types";

export const PDF_RUNTIME_TARGET = "nodejs";

interface GenerateReportPdfOptions {
  jobId: string;
  requestOrigin?: string;
}

export type PdfBrowserDriver = "local" | "vercel";

export function resolveReportBaseUrl(requestOrigin?: string) {
  return (
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    requestOrigin ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function resolvePdfBrowserDriver(
  value: string | undefined = process.env.PDF_BROWSER_DRIVER,
): PdfBrowserDriver {
  return value === "vercel" ? "vercel" : "local";
}

export function buildReportPdfFileName(jobId: string) {
  return `relats-pcf-report-${jobId}.pdf`;
}

export async function createPdfBrowser(
  driver: PdfBrowserDriver = resolvePdfBrowserDriver(),
): Promise<BrowserAdapter> {
  if (driver === "vercel") {
    const { launchVercelPdfBrowser } = await import("@/lib/reporting/pdf/vercel-browser");
    return launchVercelPdfBrowser();
  }

  const { launchLocalPdfBrowser } = await import("@/lib/reporting/pdf/local-browser");
  return launchLocalPdfBrowser();
}

export async function generateReportPdf({
  jobId,
  requestOrigin,
}: GenerateReportPdfOptions) {
  const baseUrl = resolveReportBaseUrl(requestOrigin);
  const reportUrl = new URL(`/reports/${encodeURIComponent(jobId)}`, baseUrl);
  const browser = await createPdfBrowser();

  try {
    const page = await browser.newPage();
    await page.emulateMediaType("print");
    await page.goto(reportUrl.toString(), {
      waitUntil: "networkidle0",
      timeout: 60_000,
    });
    await waitForReportAssets(page);

    return await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
}

async function waitForReportAssets(page: BrowserPageAdapter) {
  await page.evaluate(async () => {
    await document.fonts.ready;

    const images = Array.from(document.images);
    await Promise.all(
      images.map((image) => {
        if (image.complete) {
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        });
      }),
    );
  });

  await page.waitForSelector(".report-page .report-sheet", { timeout: 15_000 });
}
