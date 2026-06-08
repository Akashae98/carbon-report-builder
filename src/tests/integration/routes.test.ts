import { existsSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { reportJobStore } from "@/lib/jobs/report-job-store";
import { GET as getPdfRoute } from "@/app/api/reports/pdf/[jobId]/route";
import { POST as postUploadRoute } from "@/app/api/reports/upload/route";
import reportPage from "@/app/reports/[jobId]/page";

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

  it("creates a stub report job through the upload route", async () => {
    const formData = new FormData();
    formData.set("file", new File(["product,total_emissions"], "sample.csv"));

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
});
