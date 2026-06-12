import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ReportPreviewCard } from "@/components/home/report-preview-card";

const expectedSections = [
  "Portada",
  "Introducción",
  "Metodología",
  "Resumen de resultados",
  "Desglose del ciclo de vida",
  "Clasificación de productos",
  "Recomendaciones",
  "Conclusiones",
];

function renderPreview(selectedBrandId: "relats" | "demo-industrial" = "relats") {
  return renderToStaticMarkup(
    createElement(ReportPreviewCard, { selectedBrandId }),
  );
}

describe("Home report preview", () => {
  it("presents the static document as a preview of the generated report", () => {
    const markup = renderPreview();

    expect(markup).toContain("Vista previa del informe");
    expect(markup).toContain(
      "Así se aplicará el preset visual al informe generado.",
    );
    expect(markup).not.toContain("Vista del PDF generado");
  });

  it("shows the complete real report structure in mobile and desktop layouts", () => {
    const markup = renderPreview();

    expect(markup.match(/Estructura del informe/g)).toHaveLength(2);

    for (const section of expectedSections) {
      expect(markup.match(new RegExp(section, "g"))).toHaveLength(2);
    }
  });

  it("does not present fake pagination or pre-upload report metadata", () => {
    const markup = renderPreview();

    expect(markup).not.toContain(">Síntesis ejecutiva</li>");
    expect(markup).not.toContain(
      ">Productos con mayor huella agregada</li>",
    );
    expect(markup).not.toContain("Junio de 2026");
    expect(markup).not.toContain("Evaluación PCF");
  });

  it("uses the selected brand report title, subtitle, and provider attribution", () => {
    const markup = renderPreview("demo-industrial");

    expect(markup).toContain("Informe ejecutivo");
    expect(markup).toContain("Informe de huella de carbono de producto");
    expect(markup).toContain(
      "Síntesis ejecutiva de resultados PCF para Demo Industrial",
    );
    expect(markup).toContain("Generado por Footprint Mappa");
  });

  it("explains that the Home preview is an indicative report structure", () => {
    expect(renderPreview()).toContain(
      "La estructura mostrada es orientativa. El informe completo se genera con los datos del CSV.",
    );
  });
});
