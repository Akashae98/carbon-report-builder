import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

import { getReportJobFilePath, TEMP_REPORTS_ROOT } from "@/lib/files/report-paths";
import type { PcfReportJobRecord, ReportJobRecord } from "@/types";

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

      if (error instanceof SyntaxError) {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function hasFiniteNumberValues(value: unknown) {
  return (
    isRecord(value) &&
    Object.values(value).every((item) => isFiniteNumber(item))
  );
}

export function isCompletePcfReportJob(
  job: ReportJobRecord | null,
): job is PcfReportJobRecord {
  if (!isRecord(job) || job.reportType !== "pcf") {
    return false;
  }

  const upload = job.upload;
  const reportDefinition = job.reportDefinition;
  const schemaValidation = job.schemaValidation;
  const normalizedDataset = job.normalizedDataset;
  const derivedMetrics = job.derivedMetrics;

  if (
    typeof job.jobId !== "string" ||
    typeof job.createdAt !== "string" ||
    !isRecord(upload) ||
    typeof upload.fileName !== "string" ||
    !isRecord(reportDefinition) ||
    typeof reportDefinition.title !== "string" ||
    !Array.isArray(reportDefinition.sections) ||
    !isRecord(schemaValidation) ||
    typeof schemaValidation.isValid !== "boolean" ||
    !isRecord(normalizedDataset) ||
    !isStringArray(normalizedDataset.lifecycleStages) ||
    !Array.isArray(normalizedDataset.products) ||
    !isRecord(derivedMetrics) ||
    !isFiniteNumber(derivedMetrics.totalProducts) ||
    !isFiniteNumber(derivedMetrics.totalEmissions) ||
    !isFiniteNumber(derivedMetrics.averageEmissions) ||
    typeof derivedMetrics.topContributorStage !== "string" ||
    !isFiniteNumber(derivedMetrics.topContributorShare) ||
    !hasFiniteNumberValues(derivedMetrics.stageTotals)
  ) {
    return false;
  }

  return normalizedDataset.products.every((product) => {
    if (!isRecord(product) || !isRecord(product.lifecycleTotals)) {
      return false;
    }

    return (
      typeof product.productName === "string" &&
      typeof product.functionalUnit === "string" &&
      isFiniteNumber(product.totalEmissions) &&
      normalizedDataset.lifecycleStages.every((stage) =>
        isFiniteNumber(product.lifecycleTotals[stage]),
      )
    );
  });
}
