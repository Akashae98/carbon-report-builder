import type { ReportDefinition, ReportPreviewModel } from "@/types";

import { ReportConclusionsSection } from "@/components/report/report-conclusions-section";
import { ReportCoverSection } from "@/components/report/report-cover-section";
import { ReportIntroductionSection } from "@/components/report/report-introduction-section";
import { ReportLifecycleBreakdownSection } from "@/components/report/report-lifecycle-breakdown-section";
import { ReportMethodologySection } from "@/components/report/report-methodology-section";
import { ReportRecommendationsSection } from "@/components/report/report-recommendations-section";
import { ReportResultsOverviewSection } from "@/components/report/report-results-overview-section";
import { ReportTopProductRankingSection } from "@/components/report/report-top-product-ranking-section";

interface ReportShellProps {
  reportDefinition: ReportDefinition;
  preview: ReportPreviewModel;
}

const reportSectionRenderers = {
  cover: ReportCoverSection,
  introduction: ReportIntroductionSection,
  methodology: ReportMethodologySection,
  "results-overview": ReportResultsOverviewSection,
  "lifecycle-breakdown": ReportLifecycleBreakdownSection,
  "top-product-ranking": ReportTopProductRankingSection,
  recommendations: ReportRecommendationsSection,
  conclusions: ReportConclusionsSection,
} as const;

export function ReportShell({ reportDefinition, preview }: ReportShellProps) {
  return (
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      {reportDefinition.sections.map((section) => {
        const SectionComponent =
          reportSectionRenderers[
            section.id as keyof typeof reportSectionRenderers
          ];

        if (!SectionComponent) {
          return null;
        }

        return <SectionComponent key={section.id} preview={preview} />;
      })}
    </article>
  );
}
