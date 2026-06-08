import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

import { getReportJobFilePath, TEMP_REPORTS_ROOT } from "@/lib/files/report-paths";
import type { ReportJobRecord } from "@/types";

export interface ReportJobStore {
  read(jobId: string): Promise<ReportJobRecord | null>;
  write(job: ReportJobRecord): Promise<void>;
  remove(jobId: string): Promise<void>;
}

export class FilesystemReportJobStore implements ReportJobStore {
  constructor(private readonly rootDir: string = TEMP_REPORTS_ROOT) {}

  private async ensureStorageDirectory() {
    await mkdir(this.rootDir, { recursive: true });
  }

  async read(jobId: string) {
    try {
      const filePath = getReportJobFilePath(jobId, this.rootDir);
      const payload = await readFile(filePath, "utf8");
      return JSON.parse(payload) as ReportJobRecord;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }

      throw error;
    }
  }

  async write(job: ReportJobRecord) {
    await this.ensureStorageDirectory();
    const filePath = getReportJobFilePath(job.jobId, this.rootDir);
    await writeFile(filePath, JSON.stringify(job, null, 2), "utf8");
  }

  async remove(jobId: string) {
    const filePath = getReportJobFilePath(jobId, this.rootDir);
    await rm(filePath, { force: true });
  }
}

export const reportJobStore = new FilesystemReportJobStore();
