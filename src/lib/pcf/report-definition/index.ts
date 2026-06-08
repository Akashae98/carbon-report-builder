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
  const methodologyDescription =
    schemaValidation.warnings[0] ??
    "Los valores del CSV se interpretan como emisiones ya calculadas y se resumen sin recalcular la metodología de la huella.";

  return {
    reportId: jobId,
    reportType: "pcf",
    title: "Informe de huella de carbono de producto",
    summary:
      `Generado a partir de los datos PCF de ${normalizedDataset.sourceFileName} para ${derivedMetrics.totalProducts} productos.`,
    theme: "relats",
    sections: [
      {
        id: "overview",
        kind: "hero",
        title: "Resumen de resultados",
        description: `El conjunto de datos de ${normalizedDataset.sourceFileName} incluye ${derivedMetrics.totalProducts} productos.`,
      },
      {
        id: "methodology",
        kind: "methodology",
        title: "Enfoque metodológico",
        description: methodologyDescription,
      },
      {
        id: "breakdown",
        kind: "chart",
        title: "Desglose del ciclo de vida",
        description: `${formatLifecycleStage(derivedMetrics.topContributorStage)} es la etapa con mayor impacto en la vista previa actual.`,
      },
      {
        id: "detailed-analysis",
        kind: "table",
        title: "Análisis detallado por producto",
        description:
          "El informe reserva un apartado para analizar cada producto a partir de los totales agregados de su ciclo de vida.",
      },
    ],
  };
}
