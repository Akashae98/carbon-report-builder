interface ReportPdfDownloadButtonProps {
  jobId: string;
}

export function ReportPdfDownloadButton({ jobId }: ReportPdfDownloadButtonProps) {
  return (
    <a
      href={`/reports/pdf/${encodeURIComponent(jobId)}`}
      className="inline-flex items-center justify-center rounded-full bg-[var(--report-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,87,16,0.16)] transition hover:bg-[#e94d0d]"
    >
      Descargar PDF
    </a>
  );
}
