export interface PcfSchemaValidationResult {
  reportType: "pcf";
  sourceFileName: string;
  requiredHeaders: string[];
  receivedHeaders: string[];
  rowCount: number;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PcfNormalizedProduct {
  productName: string;
  functionalUnit: string;
  totalEmissions: number;
  lifecycleTotals: Record<string, number>;
}

export interface PcfNormalizedDataset {
  reportType: "pcf";
  sourceFileName: string;
  functionalUnitLabel: string;
  sourceRowCount: number;
  lifecycleStages: string[];
  products: PcfNormalizedProduct[];
}

export interface PcfDerivedMetrics {
  totalProducts: number;
  totalEmissions: number;
  averageEmissions: number;
  stageTotals: Record<string, number>;
  topContributorStage: string;
  topContributorShare: number;
  topProducts: Array<{
    productName: string;
    totalEmissions: number;
  }>;
}
