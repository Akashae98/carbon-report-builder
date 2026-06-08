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

export interface ReportPreviewModel {
  generatedLabel: string;
  sectionCount: number;
}
