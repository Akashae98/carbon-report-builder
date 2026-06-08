import type {
  PcfDerivedMetrics,
  PcfNormalizedDataset,
  PcfSchemaValidationResult,
  ReportDefinition,
} from "@/types";

interface BuildPcfReportDefinitionOptions {
  jobId: string;
  schemaValidation: PcfSchemaValidationResult;
  normalizedDataset: PcfNormalizedDataset;
  derivedMetrics: PcfDerivedMetrics;
}

export function buildPcfReportDefinition({
  jobId,
  schemaValidation,
  normalizedDataset,
  derivedMetrics,
}: BuildPcfReportDefinitionOptions): ReportDefinition {
  const methodologyDescription =
    schemaValidation.warnings[0] ??
    "Uploaded CSV values are treated as already calculated emissions and summarized without recalculating footprint methodology.";

  return {
    reportId: jobId,
    reportType: "pcf",
    title: "Product Carbon Footprint Report",
    summary:
      `Generated from uploaded PCF data in ${normalizedDataset.sourceFileName} for ${derivedMetrics.totalProducts} products.`,
    theme: "relats",
    sections: [
      {
        id: "overview",
        kind: "hero",
        title: "Results overview",
        description: `${derivedMetrics.totalProducts} products are available in the uploaded dataset sourced from ${normalizedDataset.sourceFileName}.`,
      },
      {
        id: "methodology",
        kind: "methodology",
        title: "Methodological approach",
        description: methodologyDescription,
      },
      {
        id: "breakdown",
        kind: "chart",
        title: "Lifecycle breakdown",
        description: `${derivedMetrics.topContributorStage} is currently the highest-impact stage in the sample preview.`,
      },
      {
        id: "detailed-analysis",
        kind: "table",
        title: "Detailed product analysis",
        description:
          "The report definition keeps a dedicated place for product-level analysis based on the uploaded aggregate lifecycle totals.",
      },
    ],
  };
}
