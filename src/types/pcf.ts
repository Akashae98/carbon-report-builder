export interface PcfValidationIssue {
  rowNumber: number;
  field: string;
  value: string;
  message: string;
}

export interface PcfSchemaValidationResult {
  reportType: "pcf";
  sourceFileName: string;
  requiredHeaders: string[];
  receivedHeaders: string[];
  missingHeaders: string[];
  parsedRowCount: number;
  validRowCount: number;
  isValid: boolean;
  invalidRows: PcfValidationIssue[];
  errors: string[];
  warnings: string[];
}

export interface PcfParsedAggregateRow {
  sourceRowNumber: number;
  product: string;
  functional_unit: string;
  total_emissions: number;
  total_materials: number;
  total_manufacturing: number;
  total_transport: number;
  total_distribution: number;
  total_use: number;
  total_end_of_life: number;
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
