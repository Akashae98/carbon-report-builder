import type { PcfReportJobRecord } from "@/types";

export function buildStubPdfResponse(job: PcfReportJobRecord) {
  return {
    jobId: job.jobId,
    reportType: job.reportType,
    status: "not_implemented",
    message:
      "Phase 1 reserves this route for the future Puppeteer PDF pipeline. The report preview route is already live.",
  };
}
