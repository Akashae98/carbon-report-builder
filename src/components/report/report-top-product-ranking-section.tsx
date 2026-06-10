import type { ReportPreviewModel } from "@/types";

import { ReportDataTable } from "@/components/report/report-data-table";
import { ReportSection } from "@/components/report/report-section";

interface ReportTopProductRankingSectionProps {
  preview: ReportPreviewModel;
}

export function ReportTopProductRankingSection({
  preview,
}: ReportTopProductRankingSectionProps) {
  return (
    <ReportSection
      id="top-product-ranking"
      sectionNumber="5"
      eyebrow="Clasificación de productos"
      title="Productos con mayor huella agregada"
      description="Relación de los cinco productos con mayor volumen de emisiones dentro del conjunto analizado."
    >
      <ReportDataTable
        columns={[
          {
            key: "rank",
            header: "#",
            render: (item) => <span className="font-semibold">{item.rank}</span>,
          },
          {
            key: "product",
            header: "Producto",
            render: (item) => (
              <span className="font-medium text-[var(--report-text)]">
                {item.productName}
              </span>
            ),
          },
          {
            key: "functionalUnit",
            header: "Unidad funcional",
            render: (item) => item.functionalUnit,
          },
          {
            key: "emissions",
            header: "Emisiones",
            align: "right",
            render: (item) => item.totalEmissionsLabel,
          },
        ]}
        items={preview.ranking.items}
      />
    </ReportSection>
  );
}
