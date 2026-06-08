export interface OcfSchemaValidationResult {
  reportType: "ocf";
  sourceFileName: string;
}

export interface OcfNormalizedDataset {
  reportType: "ocf";
}

export interface OcfDerivedMetrics {
  totalEntities: number;
}
