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

export function formatCompactNumber(value: number) {
  return compactFormatter.format(value);
}

export function formatPercent(value: number) {
  return percentFormatter.format(value);
}

export function formatLifecycleStage(stage: string) {
  return lifecycleStageLabels[stage] ?? stage;
}
