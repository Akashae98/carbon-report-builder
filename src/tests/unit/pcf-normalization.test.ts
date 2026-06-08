import { describe, expect, it } from "vitest";

import { buildPcfDerivedMetrics, buildPcfNormalizedDataset } from "@/lib/pcf/normalization";
import { parseAndValidatePcfCsv } from "@/lib/pcf/schema";
import { readSamplePcfCsv } from "@/tests/helpers/sample-pcf";

describe("PCF normalization and metrics", () => {
  it("builds a normalized dataset and derived metrics from the sample CSV", () => {
    const { rows, validation } = parseAndValidatePcfCsv(
      readSamplePcfCsv(),
      "sample_pcf.csv",
    );

    expect(validation.isValid).toBe(true);

    const dataset = buildPcfNormalizedDataset(validation, rows);
    const metrics = buildPcfDerivedMetrics(dataset);

    expect(dataset.products).toHaveLength(6);
    expect(metrics.totalProducts).toBe(6);
    expect(metrics.totalEmissions).toBeCloseTo(573.045);
    expect(metrics.topContributorStage).toBe("Use");
    expect(metrics.stageTotals.Use).toBeCloseTo(178.629);
    expect(metrics.topProducts[0]?.productName).toBe("Camiseta algodon");
  });
});
