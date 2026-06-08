import { randomUUID } from "node:crypto";

import { buildPcfReportDefinition } from "@/lib/pcf/report-definition";
import {
  buildStubPcfDerivedMetrics,
  buildStubPcfNormalizedDataset,
  buildStubPcfSchemaValidation,
} from "@/fixtures/pcf/stub-pcf-report-bundle";
import { reportJobStore } from "@/lib/jobs/report-job-store";
import type { PcfReportJobRecord, ReportUploadMetadata } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json(
      { error: "A CSV file is required for Phase 1 uploads." },
      { status: 400 },
    );
  }

  const upload: ReportUploadMetadata = {
    fileName: file.name,
    contentType: file.type || "text/csv",
    size: file.size,
    receivedAt: new Date().toISOString(),
  };

  const jobId = randomUUID();
  const schemaValidation = buildStubPcfSchemaValidation(upload);
  const normalizedDataset = buildStubPcfNormalizedDataset(schemaValidation);
  const derivedMetrics = buildStubPcfDerivedMetrics(normalizedDataset);
  const reportDefinition = buildPcfReportDefinition({
    jobId,
    schemaValidation,
    normalizedDataset,
    derivedMetrics,
  });

  const job: PcfReportJobRecord = {
    jobId,
    reportType: "pcf",
    status: "draft",
    createdAt: new Date().toISOString(),
    upload,
    schemaValidation,
    normalizedDataset,
    derivedMetrics,
    reportDefinition,
  };

  await reportJobStore.write(job);

  return Response.json(
    {
      jobId,
      previewPath: `/reports/${jobId}`,
      reportType: job.reportType,
      status: job.status,
      message: "Phase 1 stub report created successfully.",
    },
    { status: 201 },
  );
}
