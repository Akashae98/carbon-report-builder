import type { ReportPreviewModel } from "@/types";

import { ReportSection } from "@/components/report/report-section";

interface ReportRecommendationsSectionProps {
  preview: ReportPreviewModel;
}

export function ReportRecommendationsSection({
  preview,
}: ReportRecommendationsSectionProps) {
  return (
    <ReportSection
      id="recommendations"
      eyebrow="Recomendaciones"
      title="Líneas de revisión recomendadas"
      description="Aspectos que conviene revisar a partir de la distribución observada en los datos disponibles."
    >
      <ol className="space-y-4">
        {preview.narratives.recommendations.map((recommendation, index) => (
          <li
            key={recommendation}
            className="flex gap-4 rounded-[1.1rem] border border-black/8 bg-[var(--report-panel)] px-5 py-5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--report-accent)] text-sm font-semibold text-white">
              {index + 1}
            </span>
            <p className="pt-1 text-[0.98rem] leading-7 text-black/72">
              {recommendation}
            </p>
          </li>
        ))}
      </ol>
    </ReportSection>
  );
}
