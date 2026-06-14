import { randomUUID } from "node:crypto";

import { DEFAULT_BRAND_ID, isBrandId } from "@/lib/branding";
import { buildPcfReportDefinition } from "@/lib/pcf/report-definition";
import { reportJobStore } from "@/lib/jobs/report-job-store";
import { buildPcfDerivedMetrics, buildPcfNormalizedDataset } from "@/lib/pcf/normalization";
import { getPcfValidationDetails, parseAndValidatePcfCsv } from "@/lib/pcf/schema";
import {
  MAX_REPORT_UPLOAD_SIZE_BYTES,
  MAX_REPORT_UPLOAD_SIZE_LABEL,
} from "@/lib/uploads/report-upload-limits";
import type { PcfReportJobRecord, ReportUploadMetadata } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const brandIdPayload = formData.get("brandId");

  if (!(file instanceof File)) {
    return Response.json(
      { error: "Se necesita un archivo CSV para crear un informe PCF." },
      { status: 400 },
    );
  }

  const brandId =
    typeof brandIdPayload !== "string" || brandIdPayload.length === 0
      ? DEFAULT_BRAND_ID
      : brandIdPayload;

  if (!isBrandId(brandId)) {
    return Response.json(
      {
        error: "No se pudo validar el preset visual del informe.",
        details: ["Selecciona un preset visual disponible para esta demo."],
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const upload: ReportUploadMetadata = {
    fileName: file.name,
    contentType: file.type || "text/csv",
    size: file.size,
    receivedAt: now,
  };

  if (file.size > MAX_REPORT_UPLOAD_SIZE_BYTES) {
    return Response.json(
      {
        error: "El CSV supera el tamaño máximo permitido.",
        details: [
          `El tamaño máximo permitido es de ${MAX_REPORT_UPLOAD_SIZE_LABEL}.`,
        ],
      },
      { status: 413 },
    );
  }

  const csvText = await file.text();
  const { rows, validation } = parseAndValidatePcfCsv(csvText, upload.fileName);

  if (!validation.isValid) {
    return Response.json(
      {
        error: "No se pudo validar el CSV.",
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
    brandId,
    reportType: "pcf",
    status: "draft",
    createdAt: now,
    upload,
    schemaValidation: validation,
    normalizedDataset,
    derivedMetrics,
    reportDefinition,
  };

  try {
    await reportJobStore.write(job);
  } catch (error) {
    console.error(
      "Report job persistence failed.",
      error instanceof Error ? error.name : "UnknownError",
    );

    return Response.json(
      {
        error:
          "No se pudo guardar el informe. Inténtalo de nuevo en unos minutos.",
      },
      { status: 503 },
    );
  }

  return Response.json(
    {
      jobId,
      previewPath: `/reports/${jobId}`,
      reportType: job.reportType,
      status: job.status,
      message: "El informe PCF se ha creado correctamente.",
    },
    { status: 201 },
  );
}
