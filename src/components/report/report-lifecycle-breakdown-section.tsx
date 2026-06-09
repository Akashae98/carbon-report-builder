import type { ReportPreviewModel } from "@/types";

import { PrintStageBreakdownChart } from "@/components/charts/print/print-stage-breakdown-chart";
import { ReportDataTable } from "@/components/report/report-data-table";
import { ReportSection } from "@/components/report/report-section";

interface ReportLifecycleBreakdownSectionProps {
  preview: ReportPreviewModel;
}

export function ReportLifecycleBreakdownSection({
  preview,
}: ReportLifecycleBreakdownSectionProps) {
  return (
    <ReportSection
      id="lifecycle-breakdown"
      eyebrow="Desglose del ciclo de vida"
      title="Distribución por etapa del ciclo de vida"
      description={preview.lifecycle.narrative}
    >
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="rounded-[1.2rem] border border-black/8 bg-[var(--report-panel)] p-4 sm:p-5">
          <PrintStageBreakdownChart items={preview.lifecycle.items} />
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
