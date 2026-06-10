import { describe, expect, it, vi } from "vitest";

import { DEFAULT_BRAND_ID } from "@/lib/branding";
import {
  buildXanoReportJobUrl,
  fromXanoReportJobRow,
  parsePayloadJson,
  toXanoReportJobRow,
  XanoReportJobStore,
} from "@/lib/jobs/xano-report-job-store";
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

  it("maps report jobs to Xano summary rows", () => {
    const job = createJob("xano-map");

    expect(toXanoReportJobRow(job)).toEqual({
      id: job.jobId,
      brand_id: job.brandId,
      report_type: job.reportType,
      status: job.status,
      source_file_name: job.upload.fileName,
      total_emissions: job.derivedMetrics.totalEmissions,
      dominant_stage: job.derivedMetrics.topContributorStage,
      payload_json: job,
      created_at: job.createdAt,
    });
  });

  it("reconstructs report jobs from object payload_json", () => {
    const job = createJob("xano-object-payload");

    expect(fromXanoReportJobRow({ payload_json: job })).toEqual(job);
  });

  it("reconstructs report jobs from string payload_json", () => {
    const job = createJob("xano-string-payload");

    expect(parsePayloadJson(JSON.stringify(job))).toEqual(job);
    expect(fromXanoReportJobRow({ payload_json: JSON.stringify(job) })).toEqual(job);
  });

  it("returns null for missing or invalid payload_json", () => {
    expect(fromXanoReportJobRow({ id: "missing-payload" })).toBeNull();
    expect(fromXanoReportJobRow({ payload_json: "{" })).toBeNull();
    expect(fromXanoReportJobRow({ payload_json: null })).toBeNull();
    expect(parsePayloadJson(42)).toBeNull();
  });

  it("returns null on 404 reads", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 404 }));
    const store = new XanoReportJobStore({
      endpoint: "https://xano.example/api/report_jobs",
      fetchImpl,
    });

    await expect(store.read("missing")).resolves.toBeNull();
  });

  it("reads persisted jobs from Xano payload_json", async () => {
    const job = createJob("xano-read");
    const fetchImpl = vi.fn(async () =>
      Response.json({
        id: job.jobId,
        payload_json: job,
      }),
    );
    const store = new XanoReportJobStore({
      endpoint: "https://xano.example/api/report_jobs",
      apiKey: "secret",
      fetchImpl,
    });

    await expect(store.read(job.jobId)).resolves.toEqual(job);
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://xano.example/api/report_jobs/xano-read",
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("writes jobs with PUT and mapped Xano row body", async () => {
    const job = createJob("xano-write");
    const fetchImpl = vi.fn(async () => new Response(null, { status: 200 }));
    const store = new XanoReportJobStore({
      endpoint: "https://xano.example/api/report_jobs",
      apiKey: "secret",
      fetchImpl,
    });

    await store.write(job);

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://xano.example/api/report_jobs/xano-write",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify(toXanoReportJobRow(job)),
      }),
    );
  });

  it("removes jobs with DELETE and treats 404 deletes as already removed", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 404 }));
    const store = new XanoReportJobStore({
      endpoint: "https://xano.example/api/report_jobs",
      fetchImpl,
    });

    await expect(store.remove("missing job")).resolves.toBeUndefined();
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://xano.example/api/report_jobs/missing%20job",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });
});
