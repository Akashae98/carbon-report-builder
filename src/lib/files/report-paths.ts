import path from "node:path";

export const TEMP_REPORTS_ROOT = path.join(process.cwd(), ".tmp", "reports");

export function getReportJobFilePath(
  jobId: string,
  rootDir: string = TEMP_REPORTS_ROOT,
) {
  return path.join(rootDir, `${jobId}.json`);
}
