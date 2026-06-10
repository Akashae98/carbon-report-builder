import { DEFAULT_BRAND_ID } from "@/lib/branding";
import type { ReportJobRecord } from "@/types";

const DEFAULT_XANO_TIMEOUT_MS = 15_000;

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function buildXanoHeaders(apiKey?: string) {
  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  });

  if (apiKey) {
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("X-API-Key", apiKey);
  }

  return headers;
}

export function buildXanoReportJobUrl(baseUrl: string, jobId: string) {
  return `${stripTrailingSlash(baseUrl)}/${encodeURIComponent(jobId)}`;
}

export interface XanoReportJobRow {
  id: string;
  brand_id: string;
  report_type: string;
  status: string;
  source_file_name: string;
  total_emissions: number;
  dominant_stage: string;
  payload_json: unknown;
  created_at: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parsePayloadJson(value: unknown): ReportJobRecord | null {
  if (typeof value === "string") {
    try {
      return parsePayloadJson(JSON.parse(value));
    } catch {
      return null;
    }
  }

  if (!isRecord(value)) {
    return null;
  }

  return {
    ...value,
    brandId:
      typeof value.brandId === "string" ? value.brandId : DEFAULT_BRAND_ID,
  } as ReportJobRecord;
}

export function toXanoReportJobRow(job: ReportJobRecord): XanoReportJobRow {
  return {
    id: job.jobId,
    brand_id: job.brandId,
    report_type: job.reportType,
    status: job.status,
    source_file_name: job.upload.fileName,
    total_emissions: job.derivedMetrics.totalEmissions,
    dominant_stage: job.derivedMetrics.topContributorStage,
    payload_json: job,
    created_at: job.createdAt,
  };
}

export function fromXanoReportJobRow(row: unknown): ReportJobRecord | null {
  if (!isRecord(row) || !("payload_json" in row)) {
    return null;
  }

  return parsePayloadJson(row.payload_json);
}

export interface XanoReportJobStoreOptions {
  apiKey?: string;
  endpoint: string;
  fetchImpl?: typeof fetch;
}

export class XanoReportJobStore {
  private readonly apiKey?: string;
  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;

  constructor({ apiKey, endpoint, fetchImpl = fetch }: XanoReportJobStoreOptions) {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
    this.fetchImpl = fetchImpl;
  }

  async read(jobId: string): Promise<ReportJobRecord | null> {
    const response = await this.fetchImpl(buildXanoReportJobUrl(this.endpoint, jobId), {
      headers: buildXanoHeaders(this.apiKey),
      method: "GET",
      signal: AbortSignal.timeout(DEFAULT_XANO_TIMEOUT_MS),
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Xano read failed with status ${response.status}.`);
    }

    return fromXanoReportJobRow(await response.json());
  }

  async write(job: ReportJobRecord): Promise<void> {
    const response = await this.fetchImpl(
      buildXanoReportJobUrl(this.endpoint, job.jobId),
      {
        headers: buildXanoHeaders(this.apiKey),
        method: "PUT",
        signal: AbortSignal.timeout(DEFAULT_XANO_TIMEOUT_MS),
        body: JSON.stringify(toXanoReportJobRow(job)),
      },
    );

    if (!response.ok) {
      throw new Error(`Xano write failed with status ${response.status}.`);
    }
  }

  async remove(jobId: string): Promise<void> {
    const response = await this.fetchImpl(buildXanoReportJobUrl(this.endpoint, jobId), {
      headers: buildXanoHeaders(this.apiKey),
      method: "DELETE",
      signal: AbortSignal.timeout(DEFAULT_XANO_TIMEOUT_MS),
    });

    if (response.status === 404) {
      return;
    }

    if (!response.ok) {
      throw new Error(`Xano delete failed with status ${response.status}.`);
    }
  }
}
