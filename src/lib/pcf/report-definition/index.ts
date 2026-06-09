import type {
  PcfDerivedMetrics,
  PcfNormalizedDataset,
  PcfSchemaValidationResult,
  ReportDefinition,
} from "@/types";
import { formatLifecycleStage } from "@/lib/formatting";

interface BuildPcfReportDefinitionOptions {
  jobId: string;
  schemaValidation: PcfSchemaValidationResult;
  normalizedDataset: PcfNormalizedDataset;
  derivedMetrics: PcfDerivedMetrics;
}

export function buildPcfReportDefinition({
  jobId,
  schemaValidation,
  normalizedDataset,
  derivedMetrics,
}: BuildPcfReportDefinitionOptions): ReportDefinition {
  void schemaValidation;

  return {
    reportId: jobId,
    reportType: "pcf",
    title: "Informe de huella de carbono de producto",
    summary:
      `Generado a partir de los datos PCF de ${normalizedDataset.sourceFileName} para ${derivedMetrics.totalProducts} productos.`,
    theme: "relats",
    sections: [
      {
        id: "cover",
        kind: "hero",
        title: "Portada",
        description: "Presentación ejecutiva del informe para cliente.",
      },
      {
        id: "introduction",
        kind: "narrative",
        title: "Introducción",
        description:
          `El conjunto de datos ${normalizedDataset.sourceFileName} incluye ${derivedMetrics.totalProducts} productos evaluados.`,
      },
      {
        id: "methodology",
        kind: "methodology",
        title: "Metodología",
        description:
          "El análisis se estructura sobre etapas agregadas del ciclo de vida declaradas en el CSV fuente.",
      },
      {
        id: "results-overview",
        kind: "kpis",
        title: "Resumen de resultados",
        description:
          "Indicadores ejecutivos con volumen analizado, emisiones agregadas y etapa dominante.",
      },
      {
        id: "lifecycle-breakdown",
        kind: "chart",
        title: "Desglose del ciclo de vida",
        description:
          `${formatLifecycleStage(derivedMetrics.topContributorStage)} concentra la mayor aportación al resultado total.`,
      },
      {
        id: "top-product-ranking",
        kind: "table",
        title: "Clasificación de productos",
        description:
          "Comparativa de los productos con mayor nivel de emisiones agregadas.",
      },
      {
        id: "recommendations",
        kind: "narrative",
        title: "Recomendaciones",
        description:
          "Líneas de acción priorizadas a partir de la distribución de impactos observada.",
      },
      {
        id: "conclusions",
        kind: "narrative",
        title: "Conclusiones",
        description:
          "Cierre ejecutivo con los principales hallazgos del conjunto analizado.",
      },
    ],
  };
}
