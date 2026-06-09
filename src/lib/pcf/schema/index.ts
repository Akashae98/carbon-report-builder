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
    return { ok: false as const, message: "El valor es obligatorio." };
  }

  if (value.includes(",") && value.includes(".")) {
    return {
      ok: false as const,
      message: "No se admiten separadores decimales mezclados.",
    };
  }

  const normalized = value.includes(",") ? value.replace(",", ".") : value;
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return { ok: false as const, message: "El valor debe ser un número válido." };
  }

  if (parsed < 0) {
    return {
      ok: false as const,
      message: "El valor no puede ser negativo.",
    };
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
        ? ` en la fila ${error.row + 2}`
        : "";

    return `Error al interpretar el CSV${rowLabel}: ${error.message}`;
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
          createValidationIssue(
            rowNumber,
            "product",
            row.product ?? "",
            "El producto es obligatorio.",
          ),
        );
      }

      if (!functionalUnit) {
        invalidRows.push(
          createValidationIssue(
            rowNumber,
            "functional_unit",
            row.functional_unit ?? "",
            "La unidad funcional es obligatoria.",
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
    errors.push(`Faltan columnas obligatorias: ${missingHeaders.join(", ")}`);
  }

  if (rows.length === 0) {
    errors.push("El CSV no contiene ninguna fila de datos PCF válida.");
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
          `Fila ${issue.rowNumber}, ${issue.field}: ${issue.message} (${issue.value || "vacío"})`,
      ),
    );
  }

  if (details.length <= MAX_VALIDATION_DETAILS) {
    return details;
  }

  const remainingCount = details.length - MAX_VALIDATION_DETAILS;
  return [
    ...details.slice(0, MAX_VALIDATION_DETAILS),
    `${remainingCount} ${remainingCount === 1 ? "problema adicional no mostrado" : "problemas adicionales no mostrados"}.`,
  ];
}
