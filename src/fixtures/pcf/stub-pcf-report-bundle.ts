import type {
  PcfDerivedMetrics,
  PcfNormalizedDataset,
  PcfNormalizedProduct,
  PcfSchemaValidationResult,
  ReportUploadMetadata,
} from "@/types";
import { PCF_LIFECYCLE_STAGES } from "@/lib/pcf/normalization";
import { PCF_REQUIRED_HEADERS } from "@/lib/pcf/schema";

const stubProducts: PcfNormalizedProduct[] = [
  {
    productName: "Botella PET 500ml",
    functionalUnit: "1 unidad",
    totalEmissions: 107.075,
    lifecycleTotals: {
      Materials: 27.781,
      Manufacturing: 16.29,
      Transport: 20.45,
      Distribution: 3.201,
      Use: 37.345,
      "End of life": 2.008,
    },
  },
  {
    productName: "Caja carton corrugado",
    functionalUnit: "1 unidad",
    totalEmissions: 102.775,
    lifecycleTotals: {
      Materials: 8.865,
      Manufacturing: 26.864,
      Transport: 17.77,
      Distribution: 5.131,
      Use: 27.392,
      "End of life": 16.753,
    },
  },
  {
    productName: "Camiseta algodon",
    functionalUnit: "1 unidad",
    totalEmissions: 108.876,
    lifecycleTotals: {
      Materials: 12.416,
      Manufacturing: 17.324,
      Transport: 17.414,
      Distribution: 0.166,
      Use: 51.591,
      "End of life": 9.965,
    },
  },
];

export function buildStubPcfSchemaValidation(
  upload: ReportUploadMetadata,
): PcfSchemaValidationResult {
  return {
    reportType: "pcf",
    sourceFileName: upload.fileName,
    requiredHeaders: [...PCF_REQUIRED_HEADERS],
    receivedHeaders: [...PCF_REQUIRED_HEADERS],
    missingHeaders: [],
    parsedRowCount: 0,
    validRowCount: 0,
    invalidRows: [],
    isValid: true,
    errors: [],
    warnings: [
      "Phase 1 uses fixture-backed validation output. Real CSV header and row validation starts in Phase 2.",
    ],
  };
}

export function buildStubPcfNormalizedDataset(
  validation: PcfSchemaValidationResult,
): PcfNormalizedDataset {
  return {
    reportType: "pcf",
    sourceFileName: validation.sourceFileName,
    functionalUnitLabel: "kgCO2e per functional unit",
    sourceRowCount: stubProducts.length,
    lifecycleStages: [...PCF_LIFECYCLE_STAGES],
    products: stubProducts,
  };
}

export function buildStubPcfDerivedMetrics(
  dataset: PcfNormalizedDataset,
): PcfDerivedMetrics {
  const stageTotals = dataset.lifecycleStages.reduce<Record<string, number>>(
    (totals, stage) => {
      totals[stage] = dataset.products.reduce(
        (sum, product) => sum + product.lifecycleTotals[stage],
        0,
      );

      return totals;
    },
    {},
  );

  const totalEmissions = dataset.products.reduce(
    (sum, product) => sum + product.totalEmissions,
    0,
  );
  const [topContributorStage, topValue] = Object.entries(stageTotals).sort(
    (left, right) => right[1] - left[1],
  )[0];

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
