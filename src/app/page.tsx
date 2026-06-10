import { HomeHero } from "@/components/home/home-hero";
import { HomeUploadExperience } from "@/components/home/home-upload-experience";
import { MinimalHeader } from "@/components/home/minimal-header";

export default function Home() {
  return (
    <main className="app-shell relative min-h-screen overflow-hidden">
      <div className="relative mx-auto w-full max-w-[86rem] px-6 pb-10 pt-5 sm:px-8 lg:px-12 lg:pb-12 lg:pt-4">
        <div className="relative z-10 flex flex-col">
          <MinimalHeader />

          <section className="mt-4 lg:mt-5">
            <HomeHero />
          </section>

          <HomeUploadExperience />
        </div>
      </div>
    </main>
  );
}
