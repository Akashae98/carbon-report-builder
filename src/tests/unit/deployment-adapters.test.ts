import { afterEach, describe, expect, it, vi } from "vitest";

import { createReportJobStore, resolveReportJobStoreDriver } from "@/lib/jobs/report-job-store";
import { resolvePdfBrowserDriver, resolveReportBaseUrl } from "@/lib/reporting/pdf";

describe("deployment adapters", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("defaults the report job store driver to filesystem", () => {
    expect(resolveReportJobStoreDriver(undefined)).toBe("filesystem");
    expect(createReportJobStore().constructor.name).toBe("FilesystemReportJobStore");
  });

  it("selects the xano job store driver from env", () => {
    vi.stubEnv("REPORT_JOB_STORE_DRIVER", "xano");
    vi.stubEnv("XANO_REPORTS_ENDPOINT", "https://xano.example/api/reports");

    expect(resolveReportJobStoreDriver()).toBe("xano");
    expect(createReportJobStore().constructor.name).toBe("XanoReportJobStore");
  });

  it("defaults the PDF browser driver to local", () => {
    expect(resolvePdfBrowserDriver(undefined)).toBe("local");
  });

  it("selects the Vercel PDF browser driver from env", () => {
    vi.stubEnv("PDF_BROWSER_DRIVER", "vercel");

    expect(resolvePdfBrowserDriver()).toBe("vercel");
  });

  it("loads the Vercel PDF browser adapter without launching Chromium in tests", async () => {
    const fakeBrowser = {
      close: vi.fn(async () => undefined),
      newPage: vi.fn(),
    };

    vi.stubEnv("PDF_BROWSER_DRIVER", "vercel");
    vi.doMock("@/lib/reporting/pdf/vercel-browser", () => ({
      launchVercelPdfBrowser: vi.fn(async () => fakeBrowser),
    }));

    const { createPdfBrowser } = await import("@/lib/reporting/pdf");

    await expect(createPdfBrowser()).resolves.toBe(fakeBrowser);
  });

  it("resolves the report base URL with env precedence", () => {
    vi.stubEnv("APP_URL", "https://app.example.com/");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://public.example.com/");

    expect(resolveReportBaseUrl("http://localhost:3000")).toBe("https://app.example.com");
  });
});
