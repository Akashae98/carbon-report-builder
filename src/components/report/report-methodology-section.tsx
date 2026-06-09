import type { ReportPreviewModel } from "@/types";

import { ReportNarrativeBlock } from "@/components/report/report-narrative-block";
import { ReportSection } from "@/components/report/report-section";

interface ReportMethodologySectionProps {
  preview: ReportPreviewModel;
}

export function ReportMethodologySection({
  preview,
}: ReportMethodologySectionProps) {
  return (
    <ReportSection
      id="methodology"
      eyebrow="Metodología"
      title="Criterio de presentación"
      description="Base utilizada para estructurar e interpretar los resultados incluidos en esta entrega."
    >
      <ReportNarrativeBlock
        paragraphs={[
          preview.narratives.methodology,
          "La consistencia del informe se apoya en aplicar la misma estructura de presentación a materiales, fabricación, transporte, distribución, uso y fin de vida.",
        ]}
      />
    </ReportSection>
  );
}
