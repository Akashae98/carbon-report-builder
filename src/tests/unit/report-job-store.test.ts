import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import { FilesystemReportJobStore } from "@/lib/jobs/report-job-store";
import type { PcfReportJobRecord } from "@/types";

const tempRoots: string[] = [];

function createJob(jobId: string): PcfReportJobRecord {
  return {
    jobId,
    reportType: "pcf",
    status: "draft",
    createdAt: "2026-06-08T00:00:00.000Z",
    upload: {
      fileName: "sample.csv",
      contentType: "text/csv",
      size: 42,
      receivedAt: "2026-06-08T00:00:00.000Z",
    },
    schemaValidation: {
      reportType: "pcf",
      sourceFileName: "sample.csv",
      requiredHeaders: ["product"],
      receivedHeaders: ["product"],
      rowCount: 0,
      isValid: true,
      errors: [],
      warnings: [],
    },
    normalizedDataset: {
      reportType: "pcf",
      sourceFileName: "sample.csv",
      functionalUnitLabel: "kgCO2e",
      sourceRowCount: 1,
      lifecycleStages: ["Materials"],
      products: [],
    },
    derivedMetrics: {
      totalProducts: 0,
      totalEmissions: 0,
      averageEmissions: 0,
      stageTotals: { Materials: 0 },
      topContributorStage: "Materials",
      topContributorShare: 0,
      topProducts: [],
    },
    reportDefinition: {
      reportId: jobId,
      reportType: "pcf",
      title: "Stub",
      summary: "Stub",
      theme: "relats",
      sections: [],
    },
  };
}

afterEach(async () => {
  await Promise.all(tempRoots.map((root) => rm(root, { recursive: true, force: true })));
  tempRoots.length = 0;
});

describe("FilesystemReportJobStore", () => {
  it("writes and reads report jobs", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "fm-store-"));
    tempRoots.push(rootDir);

    const store = new FilesystemReportJobStore(rootDir);
    const job = createJob("job-write-read");

    await store.write(job);
    const saved = await store.read(job.jobId);

    expect(saved).toEqual(job);
  });

  it("overwrites an existing job file", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "fm-store-"));
    tempRoots.push(rootDir);

    const store = new FilesystemReportJobStore(rootDir);
    const first = createJob("job-overwrite");
    const second = {
      ...first,
      status: "ready" as const,
      reportDefinition: {
        ...first.reportDefinition,
        summary: "Updated",
      },
    };

    await store.write(first);
    await store.write(second);

    const saved = await store.read(first.jobId);

    expect(saved).toEqual(second);
  });

  it("returns null when a job is missing", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "fm-store-"));
    tempRoots.push(rootDir);

    const store = new FilesystemReportJobStore(rootDir);

    await expect(store.read("missing-job")).resolves.toBeNull();
  });
});
