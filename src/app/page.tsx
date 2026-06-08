import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { UploadPanel } from "@/components/upload/upload-panel";

export default function Home() {
  return (
    <main className="app-shell flex min-h-screen flex-col">
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-8 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_30px_100px_rgba(3,13,87,0.35)] backdrop-blur">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--app-accent-1)]">
            Footprint Mappa
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white lg:text-6xl">
                Serious architecture, lightweight implementation.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] lg:text-lg">
                Phase 1 scaffolds the PCF MVP with clear report boundaries,
                temporary job storage, and a hydration-independent preview route.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/8 px-5 py-4 text-sm text-[var(--muted)]">
              <div>Runtime target: Node</div>
              <div>Current scope: PCF foundation</div>
              <div>OCF: placeholder types only</div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <DashboardShell />
          <UploadPanel />
        </div>
      </section>
    </main>
  );
}
