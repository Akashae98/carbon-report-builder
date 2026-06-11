import { describe, expect, it } from "vitest";

import { isCsvFile, isValidCsvUpload } from "@/components/upload/upload-panel";
import { MAX_REPORT_UPLOAD_SIZE_BYTES } from "@/lib/uploads/report-upload-limits";

function fileCandidate(
  name: string,
  size: number,
  type = "",
): Pick<File, "name" | "size" | "type"> {
  return { name, size, type };
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
