import type { ReportPreviewModel } from "@/types";

import { ReportKpiGrid } from "@/components/report/report-kpi-grid";
import { ReportSection } from "@/components/report/report-section";

interface ReportResultsOverviewSectionProps {
  preview: ReportPreviewModel;
}

export function ReportResultsOverviewSection({
  preview,
}: ReportResultsOverviewSectionProps) {
  return (
    <ReportSection
      id="results-overview"
      eyebrow="Resumen de resultados"
      title="Síntesis ejecutiva"
      description="Principales magnitudes de la información PCF incluida en el informe."
    >
      <ReportKpiGrid
        items={[
          {
            label: "Productos analizados",
            value: preview.summary.productCountLabel,
            supportingText:
              "Productos incluidos en la información analizada.",
          },
          {
            label: "Huella de carbono total",
            value: preview.summary.totalEmissionsLabel,
            supportingText:
              "Suma total de la huella de carbono incluida en este informe.",
          },
          {
            label: "Promedio por producto",
            value: preview.summary.averageEmissionsLabel,
            supportingText:
              "Valor medio por producto dentro del conjunto analizado.",
          },
          {
            label: "Principal fuente de emisiones",
            value: preview.summary.topContributorStageLabel,
            supportingText:
              `${preview.summary.topContributorShareLabel} de la huella de carbono total.`,
          },
        ]}
      />
    </ReportSection>
  );
}
