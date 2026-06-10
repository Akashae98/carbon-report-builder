import { describe, expect, it, vi } from "vitest";

import { DEFAULT_BRAND_ID } from "@/lib/branding";
import { buildXanoReportJobUrl, XanoReportJobStore } from "@/lib/jobs/xano-report-job-store";
import type { PcfReportJobRecord } from "@/types";

function createJob(jobId: string): PcfReportJobRecord {
  return {
    jobId,
    brandId: DEFAULT_BRAND_ID,
    reportType: "pcf",
    status: "draft",
    createdAt: "2026-06-09T00:00:00.000Z",
    upload: {
      fileName: "sample.csv",
      contentType: "text/csv",
      size: 12,
      receivedAt: "2026-06-09T00:00:00.000Z",
    },
    schemaValidation: {
      reportType: "pcf",
      sourceFileName: "sample.csv",
      requiredHeaders: ["product", "functional_unit", "total_emissions"],
      receivedHeaders: ["product", "functional_unit", "total_emissions"],
      missingHeaders: [],
      parsedRowCount: 1,
      validRowCount: 1,
      isValid: true,
      invalidRows: [],
      errors: [],
      warnings: [],
    },
    normalizedDataset: {
      reportType: "pcf",
      sourceFileName: "sample.csv",
      functionalUnitLabel: "kgCO2e",
      sourceRowCount: 1,
      lifecycleStages: ["Use"],
      products: [
        {
          productName: "Sample",
          functionalUnit: "1 unit",
          totalEmissions: 1,
          lifecycleTotals: {
            Use: 1,
          },
        },
      ],
    },
    derivedMetrics: {
      totalProducts: 1,
      totalEmissions: 1,
      averageEmissions: 1,
      stageTotals: { Use: 1 },
      topContributorStage: "Use",
      topContributorShare: 1,
      topProducts: [
        {
          productName: "Sample",
          totalEmissions: 1,
        },
      ],
    },
    reportDefinition: {
      reportId: jobId,
      reportType: "pcf",
      title: "Sample",
      summary: "Sample",
      theme: "relats",
      sections: [],
    },
  };
}

describe("XanoReportJobStore", () => {
  it("builds stable job URLs", () => {
    expect(buildXanoReportJobUrl("https://xano.example/api/reports/", "job 1")).toBe(
      "https://xano.example/api/reports/job%201",
    );
  });

  it("returns null on 404 reads", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 404 }));
    const store = new XanoReportJobStore({
      endpoint: "https://xano.example/api/reports",
      fetchImpl,
    });

    await expect(store.read("missing")).resolves.toBeNull();
  });

  it("reads persisted jobs from Xano", async () => {
    const job = createJob("xano-read");
    const fetchImpl = vi.fn(async () => Response.json(job));
    const store = new XanoReportJobStore({
      endpoint: "https://xano.example/api/reports",
      apiKey: "secret",
      fetchImpl,
    });

    await expect(store.read(job.jobId)).resolves.toEqual(job);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("writes jobs with PUT", async () => {
    const job = createJob("xano-write");
    const fetchImpl = vi.fn(async () => new Response(null, { status: 200 }));
    const store = new XanoReportJobStore({
      endpoint: "https://xano.example/api/reports",
      apiKey: "secret",
      fetchImpl,
    });

    await store.write(job);

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://xano.example/api/reports/xano-write",
      expect.objectContaining({
        method: "PUT",
      }),
    );
  });

  it("treats 404 deletes as already removed", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 404 }));
    const store = new XanoReportJobStore({
      endpoint: "https://xano.example/api/reports",
      fetchImpl,
    });

    await expect(store.remove("missing")).resolves.toBeUndefined();
  });
});
