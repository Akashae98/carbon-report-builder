import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { reportJobStore } from "@/lib/jobs/report-job-store";
import { GET as getPdfRoute } from "@/app/api/reports/pdf/[jobId]/route";
import { POST as postUploadRoute } from "@/app/api/reports/upload/route";
import reportPage from "@/app/reports/[jobId]/page";
import { readSamplePcfCsv } from "@/tests/helpers/sample-pcf";

const createdJobIds: string[] = [];

afterEach(async () => {
  await Promise.all(createdJobIds.map((jobId) => reportJobStore.remove(jobId)));
  createdJobIds.length = 0;
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

  it("returns 404 for missing PDF jobs", async () => {
    const response = await getPdfRoute(new Request("http://localhost"), {
      params: Promise.resolve({ jobId: "missing-job" }),
    });

    expect(response.status).toBe(404);
  });

  it("keeps the preview page export callable", () => {
    expect(typeof reportPage).toBe("function");
  });

  it("keeps the runtime upload path free from fixture imports", () => {
    const routeSource = existsSync(join(process.cwd(), "src/app/api/reports/upload/route.ts"));

    expect(routeSource).toBe(true);
    expect(
      readFileSync(join(process.cwd(), "src/app/api/reports/upload/route.ts"), "utf8"),
    ).not.toContain('@/fixtures/');
  });
});
