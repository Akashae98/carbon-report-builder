export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ReportPdfRedirectRouteContext {
  params: Promise<{ jobId: string }>;
}

export async function GET(request: Request, { params }: ReportPdfRedirectRouteContext) {
  const { jobId } = await params;
  const pdfUrl = new URL(
    `/api/reports/pdf/${encodeURIComponent(jobId)}`,
    request.url,
  );

  return Response.redirect(pdfUrl, 307);
}
