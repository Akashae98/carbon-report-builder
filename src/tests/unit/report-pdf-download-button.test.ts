import { describe, expect, it } from "vitest";

import { getPdfDownloadFileName } from "@/components/report/report-pdf-download-button";

describe("PDF download filename", () => {
  it("uses a quoted filename from Content-Disposition", () => {
    expect(
      getPdfDownloadFileName(
        'attachment; filename="demo-industrial-pcf-report-job-1.pdf"',
        "job-1",
      ),
    ).toBe("demo-industrial-pcf-report-job-1.pdf");
  });

  it("decodes an RFC 5987 filename", () => {
    expect(
      getPdfDownloadFileName(
        "attachment; filename*=UTF-8''relats-pcf-informe%20anual.pdf",
        "job-2",
      ),
    ).toBe("relats-pcf-informe anual.pdf");
  });

  it("sanitizes path separators and control characters", () => {
    expect(
      getPdfDownloadFileName(
        'attachment; filename="../unsafe\\report\u0000.pdf"',
        "job-3",
      ),
    ).toBe("..-unsafe-report.pdf");
  });

  it("uses a safe fallback for missing or invalid headers", () => {
    expect(getPdfDownloadFileName(null, "job-4")).toBe("pcf-report-job-4.pdf");
    expect(
      getPdfDownloadFileName(
        "attachment; filename*=UTF-8''invalid%ZZ.pdf",
        "job-5",
      ),
    ).toBe("pcf-report-job-5.pdf");
  });
});
