import type { ReportPreviewModel, ReportStageBreakdownItem } from "@/types";

import { PrintStageBreakdownChart } from "@/components/charts/print/print-stage-breakdown-chart";
import { ReportDataTable } from "@/components/report/report-data-table";
import { ReportSection } from "@/components/report/report-section";

interface ReportLifecycleBreakdownSectionProps {
  preview: ReportPreviewModel;
}

function buildLifecycleReading(items: ReportStageBreakdownItem[]) {
  const rankedItems = [...items].sort((left, right) => right.total - left.total);
  const [first, second, third] = rankedItems;

  if (!first) {
    return "El desglose por etapas se mantiene disponible para facilitar la revisión del conjunto analizado.";
  }

  if (!second || !third) {
    return `La etapa de ${first.label} representa la mayor contribución dentro del conjunto analizado.`;
  }

  return `La etapa de ${first.label} representa la mayor contribución dentro del conjunto analizado, seguida por ${second.label} y ${third.label}.`;
}

export function ReportLifecycleBreakdownSection({
  preview,
}: ReportLifecycleBreakdownSectionProps) {
  return (
    <ReportSection
      id="lifecycle-breakdown"
      sectionNumber="4"
      eyebrow="Desglose del ciclo de vida"
      title="Distribución por etapa del ciclo de vida"
      description={preview.lifecycle.narrative}
    >
      <div className="report-lifecycle-grid grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="space-y-4">
          <div className="report-chart-panel bg-white p-3 sm:p-4">
            <PrintStageBreakdownChart items={preview.lifecycle.items} />
          </div>
          <p className="report-lifecycle-reading mb-6 border-l-2 border-[var(--report-accent)] pl-4 text-sm leading-6 text-black/68">
            {buildLifecycleReading(preview.lifecycle.items)}
          </p>
        </div>

        <ReportDataTable
          columns={[
            {
              key: "stage",
              header: "Etapa",
              render: (item) => <span className="font-medium">{item.label}</span>,
            },
            {
              key: "share",
              header: "Participación",
              align: "right",
              render: (item) => item.shareLabel,
            },
            {
              key: "total",
              header: "Emisiones",
              align: "right",
              render: (item) => item.totalLabel,
            },
          ]}
          items={preview.lifecycle.items}
        />
      </div>
    </ReportSection>
  );
}
