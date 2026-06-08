export const PCF_REQUIRED_HEADERS = [
  "product",
  "functional_unit",
  "total_emissions",
  "total_materials",
  "total_manufacturing",
  "total_transport",
  "total_distribution",
  "total_use",
  "total_end_of_life",
] as const;

import Papa from "papaparse";

import type {
  PcfParsedAggregateRow,
  PcfSchemaValidationResult,
  PcfValidationIssue,
} from "@/types";

export const PCF_NUMERIC_HEADERS = [
  "total_emissions",
  "total_materials",
  "total_manufacturing",
  "total_transport",
  "total_distribution",
  "total_use",
  "total_end_of_life",
] as const;

type RawCsvRow = Record<string, string | undefined>;

export interface ParseAndValidatePcfCsvResult {
  rows: PcfParsedAggregateRow[];
  validation: PcfSchemaValidationResult;
}

const MAX_VALIDATION_DETAILS = 6;

function normalizeStringValue(value: string | undefined) {
  return (value ?? "").trim();
}

function parseNumericValue(input: string) {
  const value = input.trim();

  if (!value) {
    return { ok: false as const, message: "Value is required." };
  }

  if (value.includes(",") && value.includes(".")) {
    return {
      ok: false as const,
      message: "Mixed decimal separators are not supported.",
    };
  }

  const normalized = value.includes(",") ? value.replace(",", ".") : value;
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return { ok: false as const, message: "Value must be a valid number." };
  }

  return { ok: true as const, value: parsed };
}

function createValidationIssue(
  rowNumber: number,
  field: string,
  value: string,
  message: string,
): PcfValidationIssue {
  return { rowNumber, field, value, message };
}

function formatParseErrors(errors: Papa.ParseError[]) {
  return errors.map((error) => {
    const rowLabel =
      typeof error.row === "number" && error.row >= 0
        ? ` row ${error.row + 2}`
        : "";

    return `CSV parse error at${rowLabel}: ${error.message}`;
  });
}

export function parseAndValidatePcfCsv(
  csvText: string,
  sourceFileName: string,
): ParseAndValidatePcfCsvResult {
  // Phase 2 intentionally validates only aggregate PCF columns.
  // Detailed sub-stage columns may be present in the CSV but are ignored here.
  const result = Papa.parse<RawCsvRow>(csvText, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  });

  const receivedHeaders = (result.meta.fields ?? []).map((header) => header.trim());
  const missingHeaders = PCF_REQUIRED_HEADERS.filter(
    (header) => !receivedHeaders.includes(header),
  );
  const parseErrors = formatParseErrors(result.errors);
  const invalidRows: PcfValidationIssue[] = [];
  const rows: PcfParsedAggregateRow[] = [];

  if (missingHeaders.length === 0) {
    result.data.forEach((row, index) => {
      const rowNumber = index + 2;
      const product = normalizeStringValue(row.product);
      const functionalUnit = normalizeStringValue(row.functional_unit);

      if (!product) {
        invalidRows.push(
          createValidationIssue(rowNumber, "product", row.product ?? "", "Product is required."),
        );
      }

      if (!functionalUnit) {
        invalidRows.push(
          createValidationIssue(
            rowNumber,
            "functional_unit",
            row.functional_unit ?? "",
            "Functional unit is required.",
          ),
        );
      }

      const numericValues = {} as Record<(typeof PCF_NUMERIC_HEADERS)[number], number>;
      let rowHasNumericErrors = false;

      for (const field of PCF_NUMERIC_HEADERS) {
        const rawValue = normalizeStringValue(row[field]);
        const parsed = parseNumericValue(rawValue);

        if (!parsed.ok) {
          rowHasNumericErrors = true;
          invalidRows.push(
            createValidationIssue(rowNumber, field, row[field] ?? "", parsed.message),
          );
          continue;
        }

        numericValues[field] = parsed.value;
      }

      if (!product || !functionalUnit || rowHasNumericErrors) {
        return;
      }

      rows.push({
        sourceRowNumber: rowNumber,
        product,
        functional_unit: functionalUnit,
        total_emissions: numericValues.total_emissions,
        total_materials: numericValues.total_materials,
        total_manufacturing: numericValues.total_manufacturing,
        total_transport: numericValues.total_transport,
        total_distribution: numericValues.total_distribution,
        total_use: numericValues.total_use,
        total_end_of_life: numericValues.total_end_of_life,
      });
    });
  }

  const errors = [...parseErrors];

  if (missingHeaders.length > 0) {
    errors.push(`Missing required headers: ${missingHeaders.join(", ")}`);
  }

  if (rows.length === 0) {
    errors.push("The CSV does not contain any valid PCF data rows.");
  }

  const validation: PcfSchemaValidationResult = {
    reportType: "pcf",
    sourceFileName,
    requiredHeaders: [...PCF_REQUIRED_HEADERS],
    receivedHeaders,
    missingHeaders,
    parsedRowCount: result.data.length,
    validRowCount: rows.length,
    isValid:
      missingHeaders.length === 0 &&
      parseErrors.length === 0 &&
      invalidRows.length === 0 &&
      rows.length > 0,
    invalidRows,
    errors,
    warnings: [],
  };

  return { rows, validation };
}

export function getPcfValidationDetails(validation: PcfSchemaValidationResult) {
  const details = [...validation.errors];

  if (validation.invalidRows.length > 0) {
    details.push(
      ...validation.invalidRows.map(
        (issue) =>
          `Row ${issue.rowNumber}, ${issue.field}: ${issue.message} (${issue.value || "empty"})`,
      ),
    );
  }

  if (details.length <= MAX_VALIDATION_DETAILS) {
    return details;
  }

  const remainingCount = details.length - MAX_VALIDATION_DETAILS;
  return [
    ...details.slice(0, MAX_VALIDATION_DETAILS),
    `${remainingCount} additional validation issue${remainingCount === 1 ? "" : "s"} not shown.`,
  ];
}
