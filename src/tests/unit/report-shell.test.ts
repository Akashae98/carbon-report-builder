import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ReportShell } from "@/components/report/report-shell";
import type { ReportDefinition, ReportPreviewModel } from "@/types";

const preview: ReportPreviewModel = {
  branding: {
    clientName: "Relats",
    logoSrc: "/brands/relats/logo-relats.png",
    providerName: "Footprint Mappa",
    providerLogoSrc: "/brands/footprint-mappa/footprint_mapa_logo.png",
    accentColor: "#ff5710",
    panelColor: "#eae4df",
    textColor: "#1c1c1c",
  },
  document: {
    title: "Informe de huella de carbono de producto",
    subtitle: "Sintesis ejecutiva",
    generatedAtLabel: "11 de junio de 2026",
    sourceFileName: "sample.csv",
    generatedBy: "Footprint Mappa",
  },
  summary: {
    productCount: 1,
    productCountLabel: "1",
    totalEmissions: 10,
    totalEmissionsLabel: "10 kgCO2e",
    averageEmissions: 10,
    averageEmissionsLabel: "10 kgCO2e",
    topContributorStage: "Use",
    topContributorStageLabel: "Uso",
    topContributorShare: 1,
    topContributorShareLabel: "100 %",
  },
  lifecycle: {
    items: [
      {
        stage: "Use",
        label: "Uso",
        total: 10,
        share: 1,
        totalLabel: "10 kgCO2e",
        shareLabel: "100 %",
      },
    ],
    totalStages: 1,
    narrative: "Uso concentra las emisiones.",
  },
  ranking: {
    items: [
      {
        rank: 1,
        productName: "Producto",
        functionalUnit: "1 unidad",
        totalEmissions: 10,
        totalEmissionsLabel: "10 kgCO2e",
      },
    ],
  },
  narratives: {
    introduction: "Introduccion.",
    methodology: "Metodologia.",
    recommendations: ["Recomendacion."],
    conclusions: "Conclusion.",
  },
};

const sectionIds = [
  "cover",
  "introduction",
  "methodology",
  "results-overview",
  "lifecycle-breakdown",
  "top-product-ranking",
  "recommendations",
  "conclusions",
] as const;

function buildReportDefinition(
  ids: readonly string[] = sectionIds,
): ReportDefinition {
  return {
    reportId: "report-shell-test",
    reportType: "pcf",
    title: "PCF report",
    summary: "Summary",
    theme: "relats",
    sections: ids.map((id) => ({
      id,
      kind: "narrative",
      title: id,
    })),
  };
}

function renderShell(reportDefinition = buildReportDefinition()) {
  return renderToStaticMarkup(
    createElement(ReportShell, { reportDefinition, preview }),
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("ReportShell PCF MVP pagination", () => {
  it("renders the current PCF template as four ordered document pages", () => {
    const markup = renderShell();

    expect(markup.match(/data-report-page="/g)).toHaveLength(4);
    expect(markup).toContain(preview.document.generatedAtLabel);
    expect(markup.indexOf('data-report-page="1"')).toBeLessThan(
      markup.indexOf('data-report-page="2"'),
    );
    expect(markup.indexOf('data-report-page="2"')).toBeLessThan(
      markup.indexOf('data-report-page="3"'),
    );
    expect(markup.indexOf('data-report-page="3"')).toBeLessThan(
      markup.indexOf('data-report-page="4"'),
    );
    expect(markup.indexOf('id="introduction"')).toBeLessThan(
      markup.indexOf('id="methodology"'),
    );
    expect(markup.indexOf('id="methodology"')).toBeLessThan(
      markup.indexOf('id="results-overview"'),
    );
    expect(markup.indexOf('id="top-product-ranking"')).toBeLessThan(
      markup.indexOf('id="recommendations"'),
    );
    expect(markup.indexOf('id="recommendations"')).toBeLessThan(
      markup.indexOf('id="conclusions"'),
    );
  });

  it("omits missing sections and empty pages without inventing content", () => {
    const markup = renderShell(
      buildReportDefinition(["introduction", "results-overview"]),
    );

    expect(markup.match(/data-report-page="/g)).toHaveLength(1);
    expect(markup).toContain('data-report-page="2"');
    expect(markup).toContain('id="introduction"');
    expect(markup).not.toContain('id="methodology"');
    expect(markup).toContain('id="results-overview"');
  });

  it("preserves reportDefinition section order within each assigned page", () => {
    const markup = renderShell(
      buildReportDefinition([
        "cover",
        "results-overview",
        "introduction",
        "methodology",
      ]),
    );

    expect(markup.indexOf('id="results-overview"')).toBeLessThan(
      markup.indexOf('id="introduction"'),
    );
    expect(markup.indexOf('id="introduction"')).toBeLessThan(
      markup.indexOf('id="methodology"'),
    );
  });

  it("warns about unknown sections only in development", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    vi.stubEnv("NODE_ENV", "development");
    renderShell(buildReportDefinition(["cover", "future-section"]));
    expect(warn).toHaveBeenCalledWith(
      '[ReportShell] Ignoring unknown section "future-section" for report type "pcf".',
    );

    warn.mockClear();
    vi.stubEnv("NODE_ENV", "production");
    renderShell(buildReportDefinition(["cover", "future-section"]));
    expect(warn).not.toHaveBeenCalled();
  });
});
