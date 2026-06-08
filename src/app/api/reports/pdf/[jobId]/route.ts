import { buildStubPdfResponse } from "@/fixtures/reporting/stub-pdf-response";
import { reportJobStore } from "@/lib/jobs/report-job-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PdfRouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: Request, { params }: PdfRouteContext) {
  const { jobId } = await params;
  const job = await reportJobStore.read(jobId);

  if (!job || job.reportType !== "pcf") {
    return Response.json({ error: "Report job not found." }, { status: 404 });
  }

  return Response.json(buildStubPdfResponse(job));
}
