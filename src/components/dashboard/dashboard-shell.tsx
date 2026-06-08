import { SectionCard } from "@/components/ui/section-card";
import { DashboardEmissionsPlaceholder } from "@/components/charts/dashboard/dashboard-emissions-placeholder";

const deliveryCards = [
  {
    label: "Flow",
    value: "PCF",
    detail: "Real CSV parsing with validation, normalization, and report metrics.",
  },
  {
    label: "Storage",
    value: ".tmp",
    detail: "Filesystem-backed temporary job store.",
  },
  {
    label: "Preview",
    value: "SSR",
    detail: "Hydration-independent report route.",
  },
];

export function DashboardShell() {
  return (
    <section className="rounded-[2rem] border border-white/12 bg-white/7 p-6 shadow-[0_20px_80px_rgba(4,18,130,0.32)] backdrop-blur">
      <div className="mb-6 flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--app-accent-1)]">
          Summary
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Lightweight upload summary with explicit report boundaries
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
          This screen stays intentionally lightweight. The generated report
          remains the main product, while the preview route stays server-rendered
          and ready for the future PDF path.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {deliveryCards.map((card) => (
          <SectionCard
            key={card.label}
            title={card.label}
            value={card.value}
            description={card.detail}
          />
        ))}
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-[#050f63] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Summary chart boundary
            </h3>
            <p className="text-sm text-[var(--muted)]">
              Client-side placeholder chart for lightweight summary behavior.
            </p>
          </div>
          <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--app-accent-3)]">
            Client chart
          </span>
        </div>

        <DashboardEmissionsPlaceholder />
      </div>
    </section>
  );
}
