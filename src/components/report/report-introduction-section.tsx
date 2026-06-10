import type { ReportPreviewModel } from "@/types";

import { ReportNarrativeBlock } from "@/components/report/report-narrative-block";
import { ReportSection } from "@/components/report/report-section";

interface ReportIntroductionSectionProps {
  preview: ReportPreviewModel;
}

export function ReportIntroductionSection({
  preview,
}: ReportIntroductionSectionProps) {
  return (
    <ReportSection
      id="introduction"
      sectionNumber="1"
      eyebrow="Introducción"
      title="Contexto del análisis"
      description="Alcance del informe y propósito de la información presentada."
    >
      <ReportNarrativeBlock
        paragraphs={[
          preview.narratives.introduction,
          "El documento ofrece una visión sintética de cómo se distribuyen las emisiones entre productos y etapas agregadas del ciclo de vida, con el fin de facilitar la revisión de los datos recibidos.",
        ]}
      />
    </ReportSection>
  );
}
