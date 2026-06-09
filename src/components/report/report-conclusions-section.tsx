import type { ReportPreviewModel } from "@/types";

import { ReportNarrativeBlock } from "@/components/report/report-narrative-block";
import { ReportSection } from "@/components/report/report-section";

interface ReportConclusionsSectionProps {
  preview: ReportPreviewModel;
}

export function ReportConclusionsSection({
  preview,
}: ReportConclusionsSectionProps) {
  return (
    <ReportSection
      id="conclusions"
      eyebrow="Conclusiones"
      title="Conclusiones"
      description="Síntesis final de los principales resultados incluidos en el informe."
    >
      <ReportNarrativeBlock
        paragraphs={[
          preview.narratives.conclusions,
          `En conjunto, la información presentada suma ${preview.summary.totalEmissionsLabel} y proporciona una visión clara de los productos y etapas con mayor contribución dentro del conjunto evaluado.`,
        ]}
      />
    </ReportSection>
  );
}
