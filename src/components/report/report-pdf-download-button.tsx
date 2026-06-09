"use client";

import { useState, useTransition } from "react";

interface ReportPdfDownloadButtonProps {
  jobId: string;
}

function getFileNameFromContentDisposition(header: string | null, fallback: string) {
  const match = header?.match(/filename="([^"]+)"/);
  return match?.[1] ?? fallback;
}

export function ReportPdfDownloadButton({ jobId }: ReportPdfDownloadButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDownload() {
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/reports/pdf/${encodeURIComponent(jobId)}`);

        if (!response.ok) {
          setError("No se pudo descargar el PDF. Inténtalo de nuevo.");
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = getFileNameFromContentDisposition(
          response.headers.get("Content-Disposition"),
          `relats-pcf-report-${jobId}.pdf`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch {
        setError("No se pudo conectar con el servidor para descargar el PDF.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full bg-[var(--report-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,87,16,0.16)] transition hover:bg-[#e94d0d] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {isPending ? "Generando PDF..." : "Descargar PDF"}
      </button>
      {error ? (
        <p role="alert" className="max-w-[18rem] text-right text-sm text-[#9a4551]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
