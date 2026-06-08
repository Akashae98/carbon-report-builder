import { BackgroundEmissions } from "@/components/home/background-emissions";
import { HomeHero } from "@/components/home/home-hero";
import { MinimalHeader } from "@/components/home/minimal-header";
import { ReportPreviewCard } from "@/components/home/report-preview-card";
import { UploadPanel } from "@/components/upload/upload-panel";

export default function Home() {
  return (
    <main className="app-shell relative min-h-screen overflow-hidden">
      <div className="relative mx-auto w-full max-w-[86rem] px-6 pb-10 pt-5 sm:px-8 lg:px-12 lg:pb-12 lg:pt-4">
        <div className="relative z-10 flex flex-col">
          <MinimalHeader />

          <section className="mt-4 lg:mt-5">
            <HomeHero />
          </section>

          <section className="mt-6 grid gap-4 lg:mt-7 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
            <UploadPanel />
            <div className="relative isolate">
              <BackgroundEmissions />
              <div className="relative z-10">
                <ReportPreviewCard />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
