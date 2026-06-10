import type { PcfDerivedMetrics, PcfNormalizedDataset, PcfSchemaValidationResult } from "@/types/pcf";
import type { BrandId } from "@/lib/branding";
import type { ReportDefinition, ReportJobStatus } from "@/types/report";

export interface ReportUploadMetadata {
  fileName: string;
  contentType: string;
  size: number;
  receivedAt: string;
}

export interface BaseReportJobRecord {
  jobId: string;
  brandId: BrandId;
  status: ReportJobStatus;
  createdAt: string;
  upload: ReportUploadMetadata;
  reportDefinition: ReportDefinition;
}

export interface PcfReportJobRecord extends BaseReportJobRecord {
  reportType: "pcf";
  schemaValidation: PcfSchemaValidationResult;
  normalizedDataset: PcfNormalizedDataset;
  derivedMetrics: PcfDerivedMetrics;
}

export type ReportJobRecord = PcfReportJobRecord;
