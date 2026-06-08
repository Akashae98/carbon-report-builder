import type { PcfReportJobRecord, ReportPreviewModel } from "@/types";

export function getReportPreviewModel(
  job: PcfReportJobRecord,
): ReportPreviewModel {
  return {
    generatedLabel: new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(job.createdAt)),
    sectionCount: job.reportDefinition.sections.length,
  };
}
