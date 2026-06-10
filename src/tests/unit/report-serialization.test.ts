import { describe, expect, it } from "vitest";

import { DEFAULT_BRAND_ID } from "@/lib/branding";
import { buildPcfDerivedMetrics, buildPcfNormalizedDataset } from "@/lib/pcf/normalization";
import { buildPcfReportDefinition } from "@/lib/pcf/report-definition";
import { parseAndValidatePcfCsv } from "@/lib/pcf/schema";
import { readSamplePcfCsv } from "@/tests/helpers/sample-pcf";
import type { PcfReportJobRecord } from "@/types";

describe("report job serialization", () => {
  it("stays JSON serializable across the real PCF pipeline", () => {
    const { rows, validation } = parseAndValidatePcfCsv(
      readSamplePcfCsv(),
      "sample_pcf.csv",
    );
    const normalizedDataset = buildPcfNormalizedDataset(validation, rows);
    const derivedMetrics = buildPcfDerivedMetrics(normalizedDataset);
    const reportDefinition = buildPcfReportDefinition({
      jobId: "serialize-me",
      schemaValidation: validation,
      normalizedDataset,
      derivedMetrics,
    });

    const job: PcfReportJobRecord = {
      jobId: "serialize-me",
      brandId: DEFAULT_BRAND_ID,
      reportType: "pcf",
      status: "draft",
      createdAt: "2026-06-08T00:00:00.000Z",
      upload: {
        fileName: "sample_pcf.csv",
        contentType: "text/csv",
        size: readSamplePcfCsv().length,
        receivedAt: "2026-06-08T00:00:00.000Z",
      },
      schemaValidation: validation,
      normalizedDataset,
      derivedMetrics,
      reportDefinition,
    };

    const hydrated = JSON.parse(JSON.stringify(job)) as PcfReportJobRecord;

    expect(hydrated).toEqual(job);
  });
});
