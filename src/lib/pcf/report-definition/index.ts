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
  return {
    reportId: jobId,
    reportType: "pcf",
    title: "Product Carbon Footprint Report",
    summary:
      "Phase 1 preview generated from a stubbed PCF report bundle. The route and storage boundaries are live; CSV parsing is deferred to Phase 2.",
    theme: "relats",
    sections: [
      {
        id: "overview",
        kind: "hero",
        title: "Results overview",
        description: `${derivedMetrics.totalProducts} products are available in the temporary dataset sourced from ${normalizedDataset.sourceFileName}.`,
      },
      {
        id: "methodology",
        kind: "methodology",
        title: "Methodological approach",
        description: schemaValidation.warnings[0],
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
          "The report definition already has a dedicated place for product-level analysis, even though the current route renders a stub preview.",
      },
    ],
  };
}
