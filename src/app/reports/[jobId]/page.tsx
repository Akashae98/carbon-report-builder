import { notFound } from "next/navigation";

import { ReportShell } from "@/components/report/report-shell";
import { getReportPreviewModel } from "@/lib/reporting/render";
import { reportJobStore } from "@/lib/jobs/report-job-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ReportPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { jobId } = await params;
  const job = await reportJobStore.read(jobId);

  if (!job || job.reportType !== "pcf") {
    notFound();
  }

  const preview = getReportPreviewModel(job);

  return (
    <main className="report-page min-h-screen">
      <ReportShell job={job} preview={preview} />
    </main>
  );
}
