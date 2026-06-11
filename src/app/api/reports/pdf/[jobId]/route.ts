import { isCompletePcfReportJob, reportJobStore } from "@/lib/jobs/report-job-store";
import {
  buildReportPdfFileName,
  generateReportPdf,
} from "@/lib/reporting/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PdfRouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(request: Request, { params }: PdfRouteContext) {
  const { jobId } = await params;
  const job = await reportJobStore.read(jobId);

  if (!isCompletePcfReportJob(job)) {
    return Response.json({ error: "Report job not found." }, { status: 404 });
  }

  let pdf: Uint8Array;

  try {
    pdf = await generateReportPdf({
      jobId: job.jobId,
      requestOrigin: new URL(request.url).origin,
    });
  } catch (error) {
    console.error("PDF generation failed", error);
    return Response.json(
      { error: "No se pudo generar el PDF del informe." },
      { status: 500 },
    );
  }

  const pdfBody = new ArrayBuffer(pdf.byteLength);
  new Uint8Array(pdfBody).set(pdf);
  const fileName = buildReportPdfFileName(job.jobId, job.brandId);

  return new Response(pdfBody, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
