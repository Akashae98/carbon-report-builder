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

    return (await response.json()) as ReportJobRecord;
  }

  async write(job: ReportJobRecord): Promise<void> {
    const response = await this.fetchImpl(
      buildXanoReportJobUrl(this.endpoint, job.jobId),
      {
        headers: buildXanoHeaders(this.apiKey),
        method: "PUT",
        signal: AbortSignal.timeout(DEFAULT_XANO_TIMEOUT_MS),
        body: JSON.stringify(job),
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
