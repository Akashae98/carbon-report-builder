export const PDF_RUNTIME_TARGET = "nodejs";

interface PdfPlaceholderPayload {
  jobId: string;
  reportType: "pcf";
}

export function buildPdfPlaceholderResponse({
  jobId,
  reportType,
}: PdfPlaceholderPayload) {
  return {
    jobId,
    reportType,
    status: "not_implemented",
    message:
      "PDF export is reserved for the next implementation step. The report preview route is already available.",
  };
}
