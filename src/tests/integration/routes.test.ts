import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";

import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/reporting/pdf", () => ({
  PDF_RUNTIME_TARGET: "nodejs",
  buildReportPdfFileName: (jobId: string) => `relats-pcf-report-${jobId}.pdf`,
  generateReportPdf: vi.fn(async () => new Uint8Array([37, 80, 68, 70])),
}));

import { DEFAULT_BRAND_ID } from "@/lib/branding";
import { reportJobStore } from "@/lib/jobs/report-job-store";
import { GET as getPdfRoute } from "@/app/api/reports/pdf/[jobId]/route";
import { GET as getReportPdfRedirectRoute } from "@/app/reports/pdf/[jobId]/route";
import { POST as postUploadRoute } from "@/app/api/reports/upload/route";
import reportPage from "@/app/reports/[jobId]/page";
import { generateReportPdf } from "@/lib/reporting/pdf";
import { readSamplePcfCsv } from "@/tests/helpers/sample-pcf";
import type { ReportJobRecord } from "@/types";

const createdJobIds: string[] = [];
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

function createIncompletePcfJob(jobId: string): ReportJobRecord {
  return {
    jobId,
    brandId: DEFAULT_BRAND_ID,
    reportType: "pcf",
    status: "draft",
    createdAt: "2026-06-09T10:30:00.000Z",
    upload: {
      fileName: "incomplete.csv",
      contentType: "text/csv",
      size: 10,
      receivedAt: "2026-06-09T10:30:00.000Z",
    },
    reportDefinition: {
      reportId: jobId,
      reportType: "pcf",
      title: "Incomplete",
      summary: "Incomplete",
      theme: "relats",
      sections: [],
    },
  } as ReportJobRecord;
}

afterEach(async () => {
  await Promise.all(createdJobIds.map((jobId) => reportJobStore.remove(jobId)));
  createdJobIds.length = 0;
  vi.clearAllMocks();
});

describe("route scaffolding", () => {
  it("exposes the expected route files", () => {
    const root = process.cwd();

    expect(existsSync(join(root, "src/app/page.tsx"))).toBe(true);
    expect(existsSync(join(root, "src/app/reports/[jobId]/page.tsx"))).toBe(true);
    expect(existsSync(join(root, "src/app/api/reports/upload/route.ts"))).toBe(
      true,
    );
    expect(
      existsSync(join(root, "src/app/api/reports/pdf/[jobId]/route.ts")),
    ).toBe(true);
    expect(existsSync(join(root, "src/app/reports/pdf/[jobId]/route.ts"))).toBe(
      true,
    );
  });

  it("creates a real report job through the upload route", async () => {
    const formData = new FormData();
    formData.set(
      "file",
      new File([readSamplePcfCsv()], "sample_pcf.csv", { type: "text/csv" }),
    );

    const request = new Request("http://localhost/api/reports/upload", {
      method: "POST",
      body: formData,
    });

    const response = await postUploadRoute(request);
    const payload = (await response.json()) as { jobId: string; previewPath: string };

    createdJobIds.push(payload.jobId);

    expect(response.status).toBe(201);
    expect(payload.previewPath).toBe(`/reports/${payload.jobId}`);

    const saved = await reportJobStore.read(payload.jobId);
    expect(saved?.jobId).toBe(payload.jobId);
    expect(saved?.brandId).toBe(DEFAULT_BRAND_ID);
    expect(saved?.reportType).toBe("pcf");
    expect(saved?.schemaValidation.isValid).toBe(true);
    expect(saved?.derivedMetrics.totalProducts).toBe(6);
    expect(saved?.derivedMetrics.topContributorStage).toBe("Use");
  });

  it("returns structured validation errors for invalid CSV uploads", async () => {
    const invalidCsv = [
      "product,functional_unit,total_emissions,total_materials,total_manufacturing,total_transport,total_distribution,total_use,total_end_of_life",
      "Bottle,1 unit,abc,1,2,3,4,5,6",
    ].join("\n");
    const formData = new FormData();
    formData.set("file", new File([invalidCsv], "invalid.csv", { type: "text/csv" }));

    const request = new Request("http://localhost/api/reports/upload", {
      method: "POST",
      body: formData,
    });

    const response = await postUploadRoute(request);
    const payload = (await response.json()) as { error: string; details: string[] };

    expect(response.status).toBe(400);
    expect(payload.error).toBe("No se pudo validar el CSV.");
    expect(payload.details.some((detail) => detail.includes("total_emissions"))).toBe(
      true,
    );
  });

  it("rejects oversized CSV uploads", async () => {
    const formData = new FormData();
    formData.set(
      "file",
      new File([new Uint8Array(MAX_UPLOAD_SIZE_BYTES + 1)], "too-large.csv", {
        type: "text/csv",
      }),
    );

    const request = new Request("http://localhost/api/reports/upload", {
      method: "POST",
      body: formData,
    });

    const response = await postUploadRoute(request);
    const payload = (await response.json()) as { error: string; details: string[] };

    expect(response.status).toBe(400);
    expect(payload.error).toBe("El CSV supera el tamaño máximo permitido.");
  });

  it("returns 404 for missing PDF jobs", async () => {
    const response = await getPdfRoute(new Request("http://localhost"), {
      params: Promise.resolve({ jobId: "missing-job" }),
    });

    expect(response.status).toBe(404);
    expect(generateReportPdf).not.toHaveBeenCalled();
  });

  it("returns 404 for incomplete PDF jobs", async () => {
    const jobId = "incomplete-pdf-job";
    await reportJobStore.write(createIncompletePcfJob(jobId));
    createdJobIds.push(jobId);

    const response = await getPdfRoute(new Request("http://localhost"), {
      params: Promise.resolve({ jobId }),
    });

    expect(response.status).toBe(404);
    expect(generateReportPdf).not.toHaveBeenCalled();
  });

  it("returns a real PDF response for saved PCF jobs", async () => {
    const formData = new FormData();
    formData.set(
      "file",
      new File([readSamplePcfCsv()], "sample_pcf.csv", { type: "text/csv" }),
    );

    const uploadRequest = new Request("http://localhost/api/reports/upload", {
      method: "POST",
      body: formData,
    });

    const uploadResponse = await postUploadRoute(uploadRequest);
    const payload = (await uploadResponse.json()) as { jobId: string };
    createdJobIds.push(payload.jobId);

    const response = await getPdfRoute(
      new Request(`http://localhost/api/reports/pdf/${payload.jobId}`),
      {
        params: Promise.resolve({ jobId: payload.jobId }),
      },
    );
    const bytes = new Uint8Array(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe(
      `attachment; filename="relats-pcf-report-${payload.jobId}.pdf"`,
    );
    expect(bytes).toEqual(new Uint8Array([37, 80, 68, 70]));
    expect(generateReportPdf).toHaveBeenCalledWith({
      jobId: payload.jobId,
      requestOrigin: "http://localhost",
    });
  });

  it("returns a controlled error when PDF generation fails", async () => {
    vi.mocked(generateReportPdf).mockRejectedValueOnce(new Error("PDF failed"));
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const formData = new FormData();
    formData.set(
      "file",
      new File([readSamplePcfCsv()], "sample_pcf.csv", { type: "text/csv" }),
    );

    const uploadResponse = await postUploadRoute(
      new Request("http://localhost/api/reports/upload", {
        method: "POST",
        body: formData,
      }),
    );
    const payload = (await uploadResponse.json()) as { jobId: string };
    createdJobIds.push(payload.jobId);

    const response = await getPdfRoute(
      new Request(`http://localhost/api/reports/pdf/${payload.jobId}`),
      {
        params: Promise.resolve({ jobId: payload.jobId }),
      },
    );
    const errorPayload = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(errorPayload.error).toBe("No se pudo generar el PDF del informe.");
    consoleError.mockRestore();
  });

  it("redirects friendly report PDF URLs to the API PDF endpoint", async () => {
    const response = await getReportPdfRedirectRoute(
      new Request("http://localhost/reports/pdf/friendly-job"),
      {
        params: Promise.resolve({ jobId: "friendly-job" }),
      },
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      "http://localhost/api/reports/pdf/friendly-job",
    );
  });

  it("renders the saved PCF report preview from persisted job data", async () => {
    const formData = new FormData();
    formData.set(
      "file",
      new File([readSamplePcfCsv()], "sample_pcf.csv", { type: "text/csv" }),
    );

    const uploadRequest = new Request("http://localhost/api/reports/upload", {
      method: "POST",
      body: formData,
    });

    const uploadResponse = await postUploadRoute(uploadRequest);
    const payload = (await uploadResponse.json()) as { jobId: string };
    createdJobIds.push(payload.jobId);

    const element = await reportPage({
      params: Promise.resolve({ jobId: payload.jobId }),
    });
    const markup = renderToStaticMarkup(element);

    expect(markup).toContain("Informe de huella de carbono de producto");
    expect(markup).toContain("Contexto del análisis");
    expect(markup).toContain("Productos con mayor huella agregada");
    expect(markup).toContain("Preparado con");
    expect(markup).toContain("Footprint Mappa logo");
    expect(markup).toContain("Descargar PDF");
  });

  it("does not render incomplete PCF report previews", async () => {
    const jobId = "incomplete-preview-job";
    await reportJobStore.write(createIncompletePcfJob(jobId));
    createdJobIds.push(jobId);

    await expect(
      reportPage({
        params: Promise.resolve({ jobId }),
      }),
    ).rejects.toThrow();
  });

  it("keeps the runtime upload path free from fixture imports", () => {
    const routeSource = existsSync(join(process.cwd(), "src/app/api/reports/upload/route.ts"));

    expect(routeSource).toBe(true);
    expect(
      readFileSync(join(process.cwd(), "src/app/api/reports/upload/route.ts"), "utf8"),
    ).not.toContain('@/fixtures/');
  });
});
