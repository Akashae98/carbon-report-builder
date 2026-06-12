import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  UploadPanel,
  isCsvFile,
  isValidCsvUpload,
} from "@/components/upload/upload-panel";
import { MAX_REPORT_UPLOAD_SIZE_BYTES } from "@/lib/uploads/report-upload-limits";

function fileCandidate(
  name: string,
  size: number,
  type = "",
): Pick<File, "name" | "size" | "type"> {
  return { name, size, type };
}

function renderUploadPanel() {
  return renderToStaticMarkup(
    createElement(UploadPanel, {
      selectedBrandId: "relats",
      onBrandChange: () => undefined,
    }),
  );
}

describe("Upload panel CSV selection", () => {
  it("accepts CSV files by extension even when the browser reports an empty MIME type", () => {
    expect(isCsvFile(fileCandidate("pcf-upload.csv", 1024))).toBe(true);
  });

  it("accepts browser CSV MIME variants", () => {
    expect(isCsvFile(fileCandidate("pcf-upload", 1024, "text/csv"))).toBe(
      true,
    );
    expect(
      isCsvFile(fileCandidate("pcf-upload", 1024, "application/vnd.ms-excel")),
    ).toBe(true);
  });

  it("rejects non-CSV files", () => {
    expect(isCsvFile(fileCandidate("pcf-upload.xlsx", 1024))).toBe(false);
    expect(isValidCsvUpload(fileCandidate("pcf-upload.txt", 1024))).toBe(false);
  });

  it("rejects missing and empty files before preview generation can run", () => {
    expect(isValidCsvUpload(null)).toBe(false);
    expect(isValidCsvUpload(fileCandidate("empty.csv", 0))).toBe(false);
  });

  it("allows preview generation only for non-empty CSV uploads within the limit", () => {
    expect(isValidCsvUpload(fileCandidate("pcf-upload.csv", 1))).toBe(true);
    expect(
      isValidCsvUpload(
        fileCandidate("pcf-upload.csv", MAX_REPORT_UPLOAD_SIZE_BYTES),
      ),
    ).toBe(true);
  });

  it("rejects CSV files above the hosted-safe upload limit", () => {
    expect(
      isValidCsvUpload(
        fileCandidate("pcf-upload.csv", MAX_REPORT_UPLOAD_SIZE_BYTES + 1),
      ),
    ).toBe(false);
  });
});

describe("Upload panel onboarding copy", () => {
  it("offers the public PCF sample as a subtle download link", () => {
    const markup = renderUploadPanel();

    expect(markup).toContain('href="/samples/sample_pcf_iso_14067.csv"');
    expect(markup).toContain('download=""');
    expect(markup).toContain("Descargar ejemplo");
  });

  it("keeps PCF active and communicates OCF availability once", () => {
    const markup = renderUploadPanel();

    expect(markup).toContain("PCF ISO 14067");
    expect(markup).toContain("OCF ISO 14064 · Próximamente");
    expect(markup.match(/Próximamente/g)).toHaveLength(1);
  });

  it("describes the preset as applying to the generated report", () => {
    expect(renderUploadPanel()).toContain(
      "Se aplicará al informe generado.",
    );
  });

  it("uses a concise drag-and-drop instruction", () => {
    const markup = renderUploadPanel();

    expect(markup).toContain(
      "Arrastra tu archivo CSV o selecciónalo desde tu dispositivo.",
    );
    expect(markup).not.toContain(
      "O selecciona un archivo desde tu dispositivo para generar la vista previa.",
    );
  });

  it("publishes the same validated PCF sample used by the test suite", () => {
    const root = process.cwd();
    const documentedSample = readFileSync(
      join(root, "docs", "assets", "sample_pcf_iso_14067.csv"),
    );
    const publicSample = readFileSync(
      join(root, "public", "samples", "sample_pcf_iso_14067.csv"),
    );

    expect(publicSample).toEqual(documentedSample);
  });
});
