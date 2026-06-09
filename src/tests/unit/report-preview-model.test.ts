import { describe, expect, it } from "vitest";

import { buildPcfDerivedMetrics, buildPcfNormalizedDataset } from "@/lib/pcf/normalization";
import { buildPcfReportDefinition } from "@/lib/pcf/report-definition";
import { getReportPreviewModel } from "@/lib/reporting/render";
import { parseAndValidatePcfCsv } from "@/lib/pcf/schema";
import { readSamplePcfCsv } from "@/tests/helpers/sample-pcf";
import type { PcfReportJobRecord } from "@/types";

function createJob(): PcfReportJobRecord {
  const csv = readSamplePcfCsv();
  const { rows, validation } = parseAndValidatePcfCsv(csv, "sample_pcf.csv");
  const normalizedDataset = buildPcfNormalizedDataset(validation, rows);
  const derivedMetrics = buildPcfDerivedMetrics(normalizedDataset);
  const reportDefinition = buildPcfReportDefinition({
    jobId: "preview-model-job",
    schemaValidation: validation,
    normalizedDataset,
    derivedMetrics,
  });

  return {
    jobId: "preview-model-job",
    reportType: "pcf",
    status: "draft",
    createdAt: "2026-06-09T10:30:00.000Z",
    upload: {
      fileName: "sample_pcf.csv",
      contentType: "text/csv",
      size: csv.length,
      receivedAt: "2026-06-09T10:30:00.000Z",
    },
    schemaValidation: validation,
    normalizedDataset,
    derivedMetrics,
    reportDefinition,
  };
}

describe("getReportPreviewModel", () => {
  it("builds a full report preview model from a saved PCF job", () => {
    const preview = getReportPreviewModel(createJob());

    expect(preview.branding.logoSrc).toBe("/brands/relats/logo-relats.png");
    expect(preview.lifecycle.items).toHaveLength(6);
    expect(preview.ranking.items.length).toBeLessThanOrEqual(5);
    expect(preview.ranking.items[0]?.rank).toBe(1);
    expect(preview.narratives.recommendations).toHaveLength(3);
  });

  it("keeps lifecycle stages in normalized dataset order", () => {
    const preview = getReportPreviewModel(createJob());

    expect(preview.lifecycle.items.map((item) => item.stage)).toEqual([
      "Materials",
      "Manufacturing",
      "Transport",
      "Distribution",
      "Use",
      "End of life",
    ]);
  });

  it("caps product ranking at the top five products", () => {
    const preview = getReportPreviewModel(createJob());

    expect(preview.ranking.items).toHaveLength(5);
  });
});
