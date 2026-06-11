import { afterEach, describe, expect, it, vi } from "vitest";

import { createReportJobStore, resolveReportJobStoreDriver } from "@/lib/jobs/report-job-store";
import {
  buildReportPdfFileName,
  resolvePdfBrowserDriver,
  resolveReportBaseUrl,
} from "@/lib/reporting/pdf";

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
    vi.stubEnv("XANO_REPORT_JOBS_ENDPOINT", "https://xano.example/api/report_jobs");

    expect(resolveReportJobStoreDriver()).toBe("xano");
    expect(createReportJobStore().constructor.name).toBe("XanoReportJobStore");
  });

  it("keeps temporary support for the legacy Xano reports endpoint env var", () => {
    vi.stubEnv("REPORT_JOB_STORE_DRIVER", "xano");
    vi.stubEnv("XANO_REPORTS_ENDPOINT", "https://xano.example/api/reports");

    expect(createReportJobStore().constructor.name).toBe("XanoReportJobStore");
  });

  it("requires a Xano report jobs endpoint when xano store driver is selected", () => {
    vi.stubEnv("REPORT_JOB_STORE_DRIVER", "xano");

    expect(() => createReportJobStore()).toThrow(
      "XANO_REPORT_JOBS_ENDPOINT is required when REPORT_JOB_STORE_DRIVER=xano.",
    );
  });

  it("defaults the PDF browser driver to local", () => {
    expect(resolvePdfBrowserDriver(undefined)).toBe("local");
  });

  it("builds brand-aware PDF filenames", () => {
    expect(buildReportPdfFileName("job-1")).toBe("relats-pcf-report-job-1.pdf");
    expect(buildReportPdfFileName("job-2", "demo-industrial")).toBe(
      "demo-industrial-pcf-report-job-2.pdf",
    );
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

  it("launches the Vercel adapter with the supported headless shell configuration", async () => {
    const fakeBrowser = {
      close: vi.fn(async () => undefined),
      newPage: vi.fn(),
    };
    const defaultArgs = vi.fn(() => ["--serverless-arg"]);
    const launch = vi.fn(async () => fakeBrowser);
    const executablePath = vi.fn(async () => "/tmp/chromium");

    vi.doUnmock("@/lib/reporting/pdf/vercel-browser");
    vi.doMock("@sparticuz/chromium", () => ({
      default: {
        args: ["--chromium-arg"],
        executablePath,
      },
    }));
    vi.doMock("puppeteer-core", () => ({
      default: {
        defaultArgs,
        launch,
      },
    }));

    const { launchVercelPdfBrowser } = await import(
      "@/lib/reporting/pdf/vercel-browser"
    );

    await expect(launchVercelPdfBrowser()).resolves.toBe(fakeBrowser);
    expect(executablePath).toHaveBeenCalledOnce();
    expect(defaultArgs).toHaveBeenCalledWith({
      args: ["--chromium-arg"],
      headless: "shell",
    });
    expect(launch).toHaveBeenCalledWith({
      args: ["--serverless-arg"],
      executablePath: "/tmp/chromium",
      headless: "shell",
    });
  });

  it("resolves the report base URL with env precedence", () => {
    vi.stubEnv("APP_URL", "https://app.example.com/");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://public.example.com/");

    expect(resolveReportBaseUrl("http://localhost:3000")).toBe("https://app.example.com");
  });
});
