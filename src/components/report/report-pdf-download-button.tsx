"use client";

import { useEffect, useRef, useState } from "react";

interface ReportPdfDownloadButtonProps {
  jobId: string;
}

function sanitizePdfFileName(fileName: string) {
  return fileName
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>:"/\\|?*]/g, "-")
    .trim();
}

export function getPdfDownloadFileName(
  contentDisposition: string | null,
  jobId: string,
) {
  const fallback = `pcf-report-${sanitizePdfFileName(jobId)}.pdf`;

  if (!contentDisposition) {
    return fallback;
  }

  const encodedMatch = contentDisposition.match(
    /filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i,
  );
  const plainMatch = contentDisposition.match(
    /filename\s*=\s*(?:"([^"]*)"|([^;]*))/i,
  );
  const rawFileName =
    encodedMatch?.[1]?.trim().replace(/^"|"$/g, "") ??
    plainMatch?.[1]?.trim() ??
    plainMatch?.[2]?.trim();

  if (!rawFileName) {
    return fallback;
  }

  let decodedFileName = rawFileName;

  try {
    decodedFileName = decodeURIComponent(rawFileName);
  } catch {
    return fallback;
  }

  return sanitizePdfFileName(decodedFileName) || fallback;
}

export function ReportPdfDownloadButton({ jobId }: ReportPdfDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDownloadingRef = useRef(false);
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
      requestControllerRef.current = null;
      isDownloadingRef.current = false;
    };
  }, []);

  async function handleDownload() {
    if (isDownloadingRef.current) {
      return;
    }

    isDownloadingRef.current = true;
    setIsDownloading(true);
    setError(null);

    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      const response = await fetch(
        `/api/reports/pdf/${encodeURIComponent(jobId)}`,
        { signal: controller.signal },
      );
      const contentType = response.headers.get("Content-Type");

      if (!response.ok || !contentType?.toLowerCase().startsWith("application/pdf")) {
        throw new Error("PDF download failed.");
      }

      const pdfBlob = await response.blob();
      const fileName = getPdfDownloadFileName(
        response.headers.get("Content-Disposition"),
        jobId,
      );
      const objectUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement("a");

      downloadLink.href = objectUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch (downloadError) {
      if (
        downloadError instanceof DOMException &&
        downloadError.name === "AbortError"
      ) {
        return;
      }

      setError("No se pudo generar el PDF. Inténtalo de nuevo.");
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        isDownloadingRef.current = false;
        setIsDownloading(false);
      }
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        aria-busy={isDownloading}
        className="inline-flex items-center justify-center rounded-full bg-[var(--report-accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,87,16,0.16)] transition hover:bg-[#e94d0d] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        {isDownloading ? "Generando PDF..." : "Descargar PDF"}
      </button>
      {error ? (
        <p role="alert" className="max-w-xs text-right text-sm text-[#9a4551]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
