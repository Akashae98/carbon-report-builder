import { describe, expect, it } from "vitest";

import { parseAndValidatePcfCsv } from "@/lib/pcf/schema";
import { readSamplePcfCsv } from "@/tests/helpers/sample-pcf";

describe("PCF schema validation", () => {
  it("validates the sample PCF CSV successfully", () => {
    const result = parseAndValidatePcfCsv(readSamplePcfCsv(), "sample_pcf.csv");

    expect(result.validation.isValid).toBe(true);
    expect(result.validation.missingHeaders).toEqual([]);
    expect(result.validation.parsedRowCount).toBe(6);
    expect(result.validation.validRowCount).toBe(6);
    expect(result.rows).toHaveLength(6);
  });

  it("reports missing required headers", () => {
    const csv = [
      "product,functional_unit,total_emissions,total_materials,total_manufacturing,total_distribution,total_use,total_end_of_life",
      "Bottle,1 unit,12.5,1,2,3,4,5",
    ].join("\n");

    const result = parseAndValidatePcfCsv(csv, "missing-header.csv");

    expect(result.validation.isValid).toBe(false);
    expect(result.validation.missingHeaders).toContain("total_transport");
  });

  it("accepts decimal comma values", () => {
    const csv = [
      "product,functional_unit,total_emissions,total_materials,total_manufacturing,total_transport,total_distribution,total_use,total_end_of_life",
      "Bottle,1 unit,\"107,075\",\"27,781\",\"16,29\",\"20,45\",\"3,201\",\"37,345\",\"2,008\"",
    ].join("\n");

    const result = parseAndValidatePcfCsv(csv, "decimal-comma.csv");

    expect(result.validation.isValid).toBe(true);
    expect(result.rows[0]?.total_emissions).toBeCloseTo(107.075);
    expect(result.rows[0]?.total_use).toBeCloseTo(37.345);
  });

  it("reports invalid numeric values with row and field details", () => {
    const csv = [
      "product,functional_unit,total_emissions,total_materials,total_manufacturing,total_transport,total_distribution,total_use,total_end_of_life",
      "Bottle,1 unit,abc,1,2,3,4,5,6",
    ].join("\n");

    const result = parseAndValidatePcfCsv(csv, "invalid-number.csv");

    expect(result.validation.isValid).toBe(false);
    expect(result.validation.invalidRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowNumber: 2,
          field: "total_emissions",
        }),
      ]),
    );
  });

  it("rejects negative numeric values", () => {
    const csv = [
      "product,functional_unit,total_emissions,total_materials,total_manufacturing,total_transport,total_distribution,total_use,total_end_of_life",
      "Bottle,1 unit,-1,1,2,3,4,5,6",
    ].join("\n");

    const result = parseAndValidatePcfCsv(csv, "negative-number.csv");

    expect(result.validation.isValid).toBe(false);
    expect(result.validation.invalidRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowNumber: 2,
          field: "total_emissions",
          message: "El valor no puede ser negativo.",
        }),
      ]),
    );
  });

  it("rejects CSVs without valid data rows", () => {
    const csv =
      "product,functional_unit,total_emissions,total_materials,total_manufacturing,total_transport,total_distribution,total_use,total_end_of_life\n";

    const result = parseAndValidatePcfCsv(csv, "empty.csv");

    expect(result.validation.isValid).toBe(false);
    expect(result.validation.validRowCount).toBe(0);
    expect(result.validation.errors).toContain(
      "El CSV no contiene ninguna fila de datos PCF válida.",
    );
  });
});
