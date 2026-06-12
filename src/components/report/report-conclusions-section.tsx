import type { ReportPreviewModel } from "@/types";

import { ReportNarrativeBlock } from "@/components/report/report-narrative-block";
import { ReportSection } from "@/components/report/report-section";

interface ReportConclusionsSectionProps {
  preview: ReportPreviewModel;
}

export function ReportConclusionsSection({
  preview,
}: ReportConclusionsSectionProps) {
  const topProduct = preview.ranking.items[0]?.productName;

  return (
    <ReportSection
      id="conclusions"
      sectionNumber="7"
      eyebrow="Conclusiones"
      title="Conclusiones principales"
      description="Síntesis final de los principales resultados incluidos en el informe."
    >
      <ReportNarrativeBlock
        paragraphs={[
          `La muestra analizada presenta una mayor contribución de emisiones en la etapa de ${preview.summary.topContributorStageLabel}.`,
          topProduct
            ? `Entre los productos incluidos, ${topProduct} registra el mayor volumen agregado de emisiones.`
            : "Entre los productos incluidos, el ranking permite identificar los mayores volúmenes agregados de emisiones.",
          `Estos resultados permiten identificar de forma inmediata los principales focos de contribución dentro del conjunto analizado, que suma ${preview.summary.totalEmissionsLabel}.`,
        ]}
      />
    </ReportSection>
  );
}
