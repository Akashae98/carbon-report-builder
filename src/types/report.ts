export type ReportType = "pcf" | "ocf";
export type ReportJobStatus = "draft" | "ready";
export type ReportThemeName = "footprint-mappa" | "relats";
export type ReportSectionKind =
  | "hero"
  | "methodology"
  | "kpis"
  | "chart"
  | "table"
  | "narrative";

export interface ReportSectionDefinition {
  id: string;
  kind: ReportSectionKind;
  title: string;
  description?: string;
}

export interface ReportDefinition {
  reportId: string;
  reportType: ReportType;
  title: string;
  summary: string;
  theme: ReportThemeName;
  sections: ReportSectionDefinition[];
}

export interface ReportStageBreakdownItem {
  stage: string;
  label: string;
  total: number;
  share: number;
  totalLabel: string;
  shareLabel: string;
}

export interface ReportRankedProduct {
  rank: number;
  productName: string;
  functionalUnit: string;
  totalEmissions: number;
  totalEmissionsLabel: string;
}

export interface ReportPreviewModel {
  branding: {
    clientName: string;
    logoSrc: string;
    accentColor: string;
  };
  document: {
    title: string;
    subtitle: string;
    generatedAtLabel: string;
    sourceFileName: string;
    generatedBy: string;
  };
  summary: {
    productCount: number;
    productCountLabel: string;
    totalEmissions: number;
    totalEmissionsLabel: string;
    averageEmissions: number;
    averageEmissionsLabel: string;
    topContributorStage: string;
    topContributorStageLabel: string;
    topContributorShare: number;
    topContributorShareLabel: string;
  };
  lifecycle: {
    items: ReportStageBreakdownItem[];
    totalStages: number;
    narrative: string;
  };
  ranking: {
    items: ReportRankedProduct[];
  };
  narratives: {
    introduction: string;
    methodology: string;
    recommendations: string[];
    conclusions: string;
  };
}
