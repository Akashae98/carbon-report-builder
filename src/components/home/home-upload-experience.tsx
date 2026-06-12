"use client";

import { useState } from "react";

import { BackgroundEmissions } from "@/components/home/background-emissions";
import { ReportPreviewCard } from "@/components/home/report-preview-card";
import { UploadPanel } from "@/components/upload/upload-panel";
import { DEFAULT_BRAND_ID, type BrandId } from "@/lib/branding";

export function HomeUploadExperience() {
  const [selectedBrandId, setSelectedBrandId] =
    useState<BrandId>(DEFAULT_BRAND_ID);

  return (
    <section className="mt-6 grid gap-4 lg:mt-7 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
      <div className="relative z-20 min-w-0 xl:z-auto">
        <UploadPanel
          selectedBrandId={selectedBrandId}
          onBrandChange={setSelectedBrandId}
        />
      </div>
      <div className="relative isolate min-w-0">
        <BackgroundEmissions />
        <div className="relative z-10">
          <ReportPreviewCard selectedBrandId={selectedBrandId} />
        </div>
      </div>
    </section>
  );
}
