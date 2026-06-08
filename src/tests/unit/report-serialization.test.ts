import { describe, expect, it } from "vitest";

import {
  buildStubPcfDerivedMetrics,
  buildStubPcfNormalizedDataset,
  buildStubPcfSchemaValidation,
} from "@/fixtures/pcf/stub-pcf-report-bundle";
import { buildPcfReportDefinition } from "@/lib/pcf/report-definition";
import type { PcfReportJobRecord } from "@/types";

describe("report job serialization", () => {
  it("stays JSON serializable across the Phase 1 PCF pipeline", () => {
    const schemaValidation = buildStubPcfSchemaValidation({
      fileName: "sample.csv",
      contentType: "text/csv",
      size: 10,
      receivedAt: "2026-06-08T00:00:00.000Z",
    });
    const normalizedDataset = buildStubPcfNormalizedDataset(schemaValidation);
    const derivedMetrics = buildStubPcfDerivedMetrics(normalizedDataset);
    const reportDefinition = buildPcfReportDefinition({
      jobId: "serialize-me",
      schemaValidation,
      normalizedDataset,
      derivedMetrics,
    });

    const job: PcfReportJobRecord = {
      jobId: "serialize-me",
      reportType: "pcf",
      status: "draft",
      createdAt: "2026-06-08T00:00:00.000Z",
      upload: {
        fileName: "sample.csv",
        contentType: "text/csv",
        size: 10,
        receivedAt: "2026-06-08T00:00:00.000Z",
      },
      schemaValidation,
      normalizedDataset,
      derivedMetrics,
      reportDefinition,
    };

    const hydrated = JSON.parse(JSON.stringify(job)) as PcfReportJobRecord;

    expect(hydrated).toEqual(job);
  });
});
