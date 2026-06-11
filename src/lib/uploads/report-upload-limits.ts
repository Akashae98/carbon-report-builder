export const MAX_REPORT_UPLOAD_SIZE_BYTES = 4 * 1024 * 1024;
export const MAX_REPORT_UPLOAD_SIZE_LABEL = "4 MB";

export function isWithinReportUploadSizeLimit(size: number) {
  return size <= MAX_REPORT_UPLOAD_SIZE_BYTES;
}
