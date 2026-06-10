import type {
  PcfNormalizedProduct,
  PcfReportJobRecord,
  ReportPreviewModel,
  ReportRankedProduct,
  ReportStageBreakdownItem,
} from "@/types";
import { getBrandProfile } from "@/lib/branding";
import {
  formatEmissionsLabel,
  formatLifecycleStage,
  formatNumber,
  formatPercent,
  normalizeSpanishDisplayText,
} from "@/lib/formatting";

export function getReportPreviewModel(
  job: PcfReportJobRecord,
): ReportPreviewModel {
  const brand = getBrandProfile(job.brandId);
  const lifecycleItems = buildLifecycleItems(job);
  const rankingItems = buildRankingItems(job.normalizedDataset.products);
  const topProduct = rankingItems[0];
  const hasZeroEmissions = job.derivedMetrics.totalEmissions === 0;

  return {
    branding: {
      clientName: brand.name,
      logoSrc: brand.logoPath,
      providerName: brand.providerName,
      providerLogoSrc: brand.providerLogoPath,
      accentColor: brand.primaryColor,
    },
    document: {
      title: job.reportDefinition.title,
      subtitle: brand.reportSubtitle,
      generatedAtLabel: new Intl.DateTimeFormat("es-ES", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(job.createdAt)),
      sourceFileName: job.upload.fileName,
      generatedBy: `Elaborado con ${brand.providerName}`,
    },
    summary: {
      productCount: job.derivedMetrics.totalProducts,
      productCountLabel: formatNumber(job.derivedMetrics.totalProducts, 0),
      totalEmissions: job.derivedMetrics.totalEmissions,
      totalEmissionsLabel: formatEmissionsLabel(job.derivedMetrics.totalEmissions),
      averageEmissions: job.derivedMetrics.averageEmissions,
      averageEmissionsLabel: formatEmissionsLabel(
        job.derivedMetrics.averageEmissions,
      ),
      topContributorStage: job.derivedMetrics.topContributorStage,
      topContributorStageLabel: formatLifecycleStage(job.derivedMetrics.topContributorStage),
      topContributorShare: job.derivedMetrics.topContributorShare,
      topContributorShareLabel: formatPercent(job.derivedMetrics.topContributorShare),
    },
    lifecycle: {
      items: lifecycleItems,
      totalStages: lifecycleItems.length,
      narrative: hasZeroEmissions
        ? "No se han declarado emisiones en el conjunto analizado. El desglose por etapas se mantiene para facilitar la revisión de la estructura del archivo."
        : `La etapa de ${formatLifecycleStage(job.derivedMetrics.topContributorStage)} concentra la mayor participación dentro del total presentado, con ${formatPercent(job.derivedMetrics.topContributorShare)}.`,
    },
    ranking: {
      items: rankingItems,
    },
    narratives: {
      introduction:
        `La información analizada incluye ${formatNumber(job.derivedMetrics.totalProducts, 0)} productos y un total agregado de ${formatEmissionsLabel(job.derivedMetrics.totalEmissions)}.`,
      methodology:
        "El informe presenta valores PCF ya calculados y los organiza en un formato homogéneo para su revisión. La información se estructura por etapas agregadas del ciclo de vida con el fin de facilitar la comparación entre productos. El detalle por subetapas puede incorporarse en futuras iteraciones cuando el alcance del análisis así lo requiera.",
      recommendations: buildRecommendations(job, topProduct),
      conclusions:
        hasZeroEmissions
          ? "Los datos presentados no declaran emisiones asociadas al conjunto evaluado, por lo que conviene revisar que los valores de entrada reflejan el alcance esperado del análisis."
          : `Los datos presentados muestran una mayor concentración de emisiones en la etapa de ${formatLifecycleStage(job.derivedMetrics.topContributorStage)}, mientras que ${topProduct?.productName ?? "uno de los productos con mayor peso"} se sitúa entre los productos con valores más elevados dentro del conjunto evaluado.`,
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
      totalLabel: formatEmissionsLabel(total),
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
      productName: normalizeSpanishDisplayText(product.productName),
      functionalUnit: normalizeSpanishDisplayText(product.functionalUnit),
      totalEmissions: product.totalEmissions,
      totalEmissionsLabel: formatEmissionsLabel(product.totalEmissions),
    }));
}

function buildRecommendations(
  job: PcfReportJobRecord,
  topProduct: ReportRankedProduct | undefined,
) {
  if (job.derivedMetrics.totalEmissions === 0) {
    return [
      "Conviene revisar que los valores de emisiones declarados en el CSV reflejan correctamente el alcance del análisis.",
      "Se recomienda confirmar si los ceros corresponden a ausencia real de impacto declarado o a datos pendientes de completar.",
      "Mantener este mismo formato facilitará la comparación cuando se incorporen valores de emisiones en futuras revisiones.",
    ];
  }

  const dominantStage = formatLifecycleStage(job.derivedMetrics.topContributorStage);
  const productFocus =
    topProduct?.productName ??
    "los productos con mayor contribución al resultado agregado";

  return [
    `Conviene revisar la contribución de la etapa de ${dominantStage}, al ser la de mayor peso dentro del resultado agregado.`,
    `Conviene revisar los productos con mayor contribución al resultado agregado, especialmente aquellos situados en las primeras posiciones del ranking, para identificar posibles oportunidades de mejora. Producto de referencia: ${productFocus}.`,
    "Se recomienda mantener una serie temporal con este mismo formato de información para facilitar la revisión evolutiva del portafolio.",
  ];
}
