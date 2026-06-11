import type { ReportDefinition, ReportPreviewModel } from "@/types";
import type { CSSProperties, ReactNode } from "react";

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

type ReportSectionId = keyof typeof reportSectionRenderers;

interface PcfMvpPage {
  id: string;
  sectionIds: readonly ReportSectionId[];
}

// This pagination is intentionally limited to the current, bounded PCF MVP
// template. It is not a generic pagination strategy for future report types.
const pcfMvpPages: readonly PcfMvpPage[] = [
  {
    id: "cover",
    sectionIds: ["cover"],
  },
  {
    id: "overview",
    sectionIds: ["introduction", "methodology", "results-overview"],
  },
  {
    id: "lifecycle",
    sectionIds: ["lifecycle-breakdown"],
  },
  {
    id: "actions",
    sectionIds: [
      "top-product-ranking",
      "recommendations",
      "conclusions",
    ],
  },
];

export function ReportShell({ reportDefinition, preview }: ReportShellProps) {
  const brandStyle = {
    "--report-accent": preview.branding.accentColor,
    "--report-text": preview.branding.textColor,
    "--report-panel": preview.branding.panelColor,
  } as CSSProperties;
  const renderedSections: Array<{
    id: ReportSectionId;
    content: ReactNode;
  }> = [];

  for (const section of reportDefinition.sections) {
    const sectionId = section.id as ReportSectionId;
    const SectionComponent = reportSectionRenderers[sectionId];

    if (!SectionComponent) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[ReportShell] Ignoring unknown section "${section.id}" for report type "${reportDefinition.reportType}".`,
        );
      }

      continue;
    }

    renderedSections.push({
      id: sectionId,
      content: <SectionComponent key={section.id} preview={preview} />,
    });
  }

  return (
    <article
      className="report-shell mx-auto flex w-full flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8"
      style={brandStyle}
    >
      {pcfMvpPages.map((page, pageIndex) => {
        const pageSectionIds = new Set(page.sectionIds);
        const pageSections = renderedSections
          .filter((section) => pageSectionIds.has(section.id))
          .map((section) => section.content);

        if (pageSections.length === 0) {
          return null;
        }

        return (
          <div
            key={page.id}
            className={`report-document-page report-document-page--${page.id}`}
            data-report-page={pageIndex + 1}
          >
            {pageSections}
          </div>
        );
      })}
    </article>
  );
}
