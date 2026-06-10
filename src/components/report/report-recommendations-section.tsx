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
      sectionNumber="6"
      eyebrow="Recomendaciones"
      title="Recomendaciones"
      description="Aspectos que conviene revisar a partir de la distribución observada en los datos disponibles."
    >
      <ol className="divide-y divide-black/10 border-y border-black/10">
        {preview.narratives.recommendations.map((recommendation, index) => (
          <li
            key={recommendation}
            className="flex gap-5 py-5"
          >
            <span className="pt-1 text-sm font-semibold text-[var(--report-accent)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-[0.98rem] leading-7 text-black/72">
              {recommendation}
            </p>
          </li>
        ))}
      </ol>
    </ReportSection>
  );
}
