import type { PcfReportJobRecord, ReportPreviewModel } from "@/types";
import { formatCompactNumber, formatPercent } from "@/lib/formatting";
import { PrintStageBreakdownChart } from "@/components/charts/print/print-stage-breakdown-chart";

interface ReportShellProps {
  job: PcfReportJobRecord;
  preview: ReportPreviewModel;
}

export function ReportShell({ job, preview }: ReportShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 md:px-10">
      <header className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_25px_80px_rgba(28,28,28,0.08)]">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--report-accent)]">
              Relats report preview
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--report-text)]">
              {job.reportDefinition.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/70">
              {job.reportDefinition.summary}
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-black/10 bg-[var(--report-panel)] px-4 py-3 text-sm text-black/70">
            <div>Job ID: {job.jobId}</div>
            <div>Source file: {job.upload.fileName}</div>
            <div>Generated: {preview.generatedLabel}</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.5rem] bg-[var(--report-panel)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
              Products
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--report-text)]">
              {job.derivedMetrics.totalProducts}
            </p>
            <p className="mt-2 text-sm text-black/65">
              Stubbed sample rows available for preview rendering.
            </p>
          </article>
          <article className="rounded-[1.5rem] bg-[var(--report-panel)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
              Total emissions
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--report-text)]">
              {formatCompactNumber(job.derivedMetrics.totalEmissions)} kgCO2e
            </p>
            <p className="mt-2 text-sm text-black/65">
              Aggregate from the temporary PCF preview dataset.
            </p>
          </article>
          <article className="rounded-[1.5rem] bg-[var(--report-panel)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
              Dominant stage
            </p>
            <p className="mt-2 text-3xl font-semibold text-[var(--report-text)]">
              {job.derivedMetrics.topContributorStage}
            </p>
            <p className="mt-2 text-sm text-black/65">
              {formatPercent(job.derivedMetrics.topContributorShare)} of current
              sample emissions.
            </p>
          </article>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_20px_70px_rgba(28,28,28,0.06)]">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--report-accent)]">
              Printable chart
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--report-text)]">
              Lifecycle stage breakdown
            </h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              Phase 1 uses a static SVG chart so preview and future PDF output
              share the same safe rendering primitive.
            </p>
          </div>

          <PrintStageBreakdownChart stageTotals={job.derivedMetrics.stageTotals} />
        </article>

        <article className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_20px_70px_rgba(28,28,28,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--report-accent)]">
            Section scaffolding
          </p>
          <div className="mt-4 space-y-4">
            {job.reportDefinition.sections.map((section) => (
              <div
                key={section.id}
                className="rounded-[1.25rem] border border-black/8 bg-[var(--report-panel)] p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-[var(--report-text)]">
                    {section.title}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
                    {section.kind}
                  </span>
                </div>
                {section.description ? (
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    {section.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_20px_70px_rgba(28,28,28,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--report-accent)]">
          Phase 1 status
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-black/70">
          This preview route already reads its payload from the filesystem job
          store and renders without client-only chart dependencies. Phase 2 can
          replace the stub dataset with real PCF parsing without restructuring
          the route layer.
        </p>
      </footer>
    </div>
  );
}
