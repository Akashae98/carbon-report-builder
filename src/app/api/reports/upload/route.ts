import { randomUUID } from "node:crypto";

import { buildPcfReportDefinition } from "@/lib/pcf/report-definition";
import { reportJobStore } from "@/lib/jobs/report-job-store";
import { buildPcfDerivedMetrics, buildPcfNormalizedDataset } from "@/lib/pcf/normalization";
import { getPcfValidationDetails, parseAndValidatePcfCsv } from "@/lib/pcf/schema";
import type { PcfReportJobRecord, ReportUploadMetadata } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json(
      { error: "A CSV file is required to create a PCF report." },
      { status: 400 },
    );
  }

  const upload: ReportUploadMetadata = {
    fileName: file.name,
    contentType: file.type || "text/csv",
    size: file.size,
    receivedAt: new Date().toISOString(),
  };

  const csvText = await file.text();
  const { rows, validation } = parseAndValidatePcfCsv(csvText, upload.fileName);

  if (!validation.isValid) {
    return Response.json(
      {
        error: "CSV validation failed.",
        details: getPcfValidationDetails(validation),
      },
      { status: 400 },
    );
  }

  const jobId = randomUUID();
  const normalizedDataset = buildPcfNormalizedDataset(validation, rows);
  const derivedMetrics = buildPcfDerivedMetrics(normalizedDataset);
  const reportDefinition = buildPcfReportDefinition({
    jobId,
    schemaValidation: validation,
    normalizedDataset,
    derivedMetrics,
  });

  const job: PcfReportJobRecord = {
    jobId,
    reportType: "pcf",
    status: "draft",
    createdAt: new Date().toISOString(),
    upload,
    schemaValidation: validation,
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
      message: "PCF report job created successfully.",
    },
    { status: 201 },
  );
}
