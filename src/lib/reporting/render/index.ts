import type {
  PcfNormalizedProduct,
  PcfReportJobRecord,
  ReportPreviewModel,
  ReportRankedProduct,
  ReportStageBreakdownItem,
} from "@/types";
import {
  formatLifecycleStage,
  formatNumber,
  formatPercent,
} from "@/lib/formatting";

const REPORT_CLIENT_NAME = "Relats";
const REPORT_LOGO_PATH = "/brands/relats/logo-relats.png";
const REPORT_ACCENT_COLOR = "#ff5710";
const REPORT_GENERATED_BY = "Elaborado con Footprint Mappa";

export function getReportPreviewModel(
  job: PcfReportJobRecord,
): ReportPreviewModel {
  const lifecycleItems = buildLifecycleItems(job);
  const rankingItems = buildRankingItems(job.normalizedDataset.products);
  const topProduct = rankingItems[0];

  return {
    branding: {
      clientName: REPORT_CLIENT_NAME,
      logoSrc: REPORT_LOGO_PATH,
      accentColor: REPORT_ACCENT_COLOR,
    },
    document: {
      title: job.reportDefinition.title,
      subtitle: `Síntesis ejecutiva de resultados PCF para ${REPORT_CLIENT_NAME}`,
      generatedAtLabel: new Intl.DateTimeFormat("es-ES", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(job.createdAt)),
      sourceFileName: job.upload.fileName,
      generatedBy: REPORT_GENERATED_BY,
    },
    summary: {
      productCount: job.derivedMetrics.totalProducts,
      productCountLabel: formatNumber(job.derivedMetrics.totalProducts, 0),
      totalEmissions: job.derivedMetrics.totalEmissions,
      totalEmissionsLabel: `${formatNumber(job.derivedMetrics.totalEmissions)} kgCO2e`,
      averageEmissions: job.derivedMetrics.averageEmissions,
      averageEmissionsLabel: `${formatNumber(job.derivedMetrics.averageEmissions)} kgCO2e`,
      topContributorStage: job.derivedMetrics.topContributorStage,
      topContributorStageLabel: formatLifecycleStage(job.derivedMetrics.topContributorStage),
      topContributorShare: job.derivedMetrics.topContributorShare,
      topContributorShareLabel: formatPercent(job.derivedMetrics.topContributorShare),
    },
    lifecycle: {
      items: lifecycleItems,
      totalStages: lifecycleItems.length,
      narrative: `La etapa de ${formatLifecycleStage(job.derivedMetrics.topContributorStage)} concentra la mayor participación dentro del total presentado, con ${formatPercent(job.derivedMetrics.topContributorShare)}.`,
    },
    ranking: {
      items: rankingItems,
    },
    narratives: {
      introduction:
        `La información analizada incluye ${formatNumber(job.derivedMetrics.totalProducts, 0)} productos y un total agregado de ${formatNumber(job.derivedMetrics.totalEmissions)} kgCO2e.`,
      methodology:
        "El informe presenta valores PCF ya calculados y los organiza en un formato homogéneo para su revisión. La información se estructura por etapas agregadas del ciclo de vida con el fin de facilitar la comparación entre productos. El detalle por subetapas puede incorporarse en futuras iteraciones cuando el alcance del análisis así lo requiera.",
      recommendations: buildRecommendations(job, topProduct),
      conclusions:
        `Los datos presentados muestran una mayor concentración de emisiones en la etapa de ${formatLifecycleStage(job.derivedMetrics.topContributorStage)}, mientras que ${topProduct?.productName ?? "uno de los productos con mayor peso"} se sitúa entre los productos con valores más elevados dentro del conjunto evaluado.`,
    },
  };
}

function buildLifecycleItems(job: PcfReportJobRecord): ReportStageBreakdownItem[] {
  return job.normalizedDataset.lifecycleStages.map((stage) => {
    const total = job.derivedMetrics.stageTotals[stage] ?? 0;
    const share =
      job.derivedMetrics.totalEmissions === 0
        ? 0
        : total / job.derivedMetrics.totalEmissions;

    return {
      stage,
      label: formatLifecycleStage(stage),
      total,
      share,
      totalLabel: `${formatNumber(total)} kgCO2e`,
      shareLabel: formatPercent(share),
    };
  });
}

function buildRankingItems(products: PcfNormalizedProduct[]): ReportRankedProduct[] {
  return [...products]
    .sort((left, right) => right.totalEmissions - left.totalEmissions)
    .slice(0, 5)
    .map((product, index) => ({
      rank: index + 1,
      productName: product.productName,
      functionalUnit: product.functionalUnit,
      totalEmissions: product.totalEmissions,
      totalEmissionsLabel: `${formatNumber(product.totalEmissions)} kgCO2e`,
    }));
}

function buildRecommendations(
  job: PcfReportJobRecord,
  topProduct: ReportRankedProduct | undefined,
) {
  const dominantStage = formatLifecycleStage(job.derivedMetrics.topContributorStage);
  const productFocus =
    topProduct?.productName ??
    "los productos con mayor contribución al resultado agregado";

  return [
    `Conviene revisar la contribución de la etapa de ${dominantStage}, al ser la de mayor peso dentro del resultado agregado.`,
    `Conviene analizar los productos con mayor contribución al resultado agregado, en particular ${productFocus}, para identificar los factores que explican su comportamiento dentro del conjunto analizado.`,
    "Se recomienda mantener una serie temporal con este mismo formato de información para facilitar la revisión evolutiva del portafolio.",
  ];
}
