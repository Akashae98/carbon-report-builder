const compactFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 1,
  notation: "compact",
});

const percentFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 1,
  style: "percent",
});

const lifecycleStageLabels: Record<string, string> = {
  Materials: "Materiales",
  Manufacturing: "Fabricación",
  Transport: "Transporte",
  Distribution: "Distribución",
  Use: "Uso",
  "End of life": "Fin de vida",
};

const mojibakeDisplayReplacements: Record<string, string> = {
  "Ã¡": "á",
  "Ã©": "é",
  "Ã­": "í",
  "Ã³": "ó",
  "Ãº": "ú",
  "Ã±": "ñ",
  "Ã": "Á",
  "Ã‰": "É",
  "Ã": "Í",
  "Ã“": "Ó",
  "Ãš": "Ú",
  "Ã‘": "Ñ",
};

const spanishDisplayWordReplacements: Record<string, string> = {
  algodon: "algodón",
  carton: "cartón",
  liquido: "líquido",
  plastico: "plástico",
};

export function formatCompactNumber(value: number) {
  return compactFormatter.format(value);
}

export function formatPercent(value: number) {
  return percentFormatter.format(value);
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits,
  }).format(value);
}

export function formatLifecycleStage(stage: string) {
  return normalizeSpanishDisplayText(lifecycleStageLabels[stage] ?? stage);
}

export function formatEmissionsLabel(value: number) {
  return `${formatNumber(value)} kgCO₂e`;
}

export function normalizeSpanishDisplayText(value: string) {
  const normalizedEncoding = Object.entries(mojibakeDisplayReplacements).reduce(
    (normalized, [search, replacement]) => normalized.replaceAll(search, replacement),
    value.replaceAll("CO2e", "CO₂e"),
  );

  return Object.entries(spanishDisplayWordReplacements).reduce(
    (normalized, [search, replacement]) =>
      normalized.replace(new RegExp(`\\b${search}\\b`, "gi"), replacement),
    normalizedEncoding,
  );
}
