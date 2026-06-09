import { notFound } from "next/navigation";

import { ReportPdfDownloadButton } from "@/components/report/report-pdf-download-button";
import { ReportShell } from "@/components/report/report-shell";
import { getReportPreviewModel } from "@/lib/reporting/render";
import { isCompletePcfReportJob, reportJobStore } from "@/lib/jobs/report-job-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ReportPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { jobId } = await params;
  const job = await reportJobStore.read(jobId);

  if (!isCompletePcfReportJob(job)) {
    notFound();
  }

  const preview = getReportPreviewModel(job);

  return (
    <main className="report-page min-h-screen">
      <div className="print-hidden mx-auto flex w-full max-w-5xl justify-end px-4 pt-6 sm:px-6 md:px-10">
        <ReportPdfDownloadButton jobId={job.jobId} />
      </div>
      <ReportShell reportDefinition={job.reportDefinition} preview={preview} />
    </main>
  );
}
