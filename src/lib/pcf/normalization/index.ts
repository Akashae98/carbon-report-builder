export const PCF_LIFECYCLE_STAGES = [
  "Materials",
  "Manufacturing",
  "Transport",
  "Distribution",
  "Use",
  "End of life",
] as const;

import type {
  PcfDerivedMetrics,
  PcfNormalizedDataset,
  PcfParsedAggregateRow,
  PcfSchemaValidationResult,
} from "@/types";

const STAGE_FIELD_MAP = {
  Materials: "total_materials",
  Manufacturing: "total_manufacturing",
  Transport: "total_transport",
  Distribution: "total_distribution",
  Use: "total_use",
  "End of life": "total_end_of_life",
} as const;

export function buildPcfNormalizedDataset(
  validation: PcfSchemaValidationResult,
  rows: PcfParsedAggregateRow[],
): PcfNormalizedDataset {
  return {
    reportType: "pcf",
    sourceFileName: validation.sourceFileName,
    functionalUnitLabel: "kgCO2e per functional unit",
    sourceRowCount: rows.length,
    lifecycleStages: [...PCF_LIFECYCLE_STAGES],
    products: rows.map((row) => ({
      productName: row.product,
      functionalUnit: row.functional_unit,
      totalEmissions: row.total_emissions,
      lifecycleTotals: {
        Materials: row.total_materials,
        Manufacturing: row.total_manufacturing,
        Transport: row.total_transport,
        Distribution: row.total_distribution,
        Use: row.total_use,
        "End of life": row.total_end_of_life,
      },
    })),
  };
}

export function buildPcfDerivedMetrics(
  dataset: PcfNormalizedDataset,
): PcfDerivedMetrics {
  const stageTotals = dataset.lifecycleStages.reduce<Record<string, number>>(
    (totals, stage) => {
      const field = STAGE_FIELD_MAP[stage as keyof typeof STAGE_FIELD_MAP];
      totals[stage] = dataset.products.reduce((sum, product) => {
        return sum + product.lifecycleTotals[stage];
      }, 0);

      void field;
      return totals;
    },
    {},
  );

  const totalEmissions = dataset.products.reduce(
    (sum, product) => sum + product.totalEmissions,
    0,
  );
  const [topContributorStage = PCF_LIFECYCLE_STAGES[0], topValue = 0] =
    Object.entries(stageTotals).sort((left, right) => right[1] - left[1])[0] ?? [];

  return {
    totalProducts: dataset.products.length,
    totalEmissions,
    averageEmissions:
      dataset.products.length === 0 ? 0 : totalEmissions / dataset.products.length,
    stageTotals,
    topContributorStage,
    topContributorShare: totalEmissions === 0 ? 0 : topValue / totalEmissions,
    topProducts: [...dataset.products]
      .sort((left, right) => right.totalEmissions - left.totalEmissions)
      .slice(0, 3)
      .map((product) => ({
        productName: product.productName,
        totalEmissions: product.totalEmissions,
      })),
  };
}
