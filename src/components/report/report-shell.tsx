import type { PcfReportJobRecord, ReportPreviewModel } from "@/types";
import {
  formatCompactNumber,
  formatLifecycleStage,
  formatPercent,
} from "@/lib/formatting";
import { PrintStageBreakdownChart } from "@/components/charts/print/print-stage-breakdown-chart";

interface ReportShellProps {
  job: PcfReportJobRecord;
  preview: ReportPreviewModel;
}

const reportSectionKindLabels = {
  hero: "Resumen",
  methodology: "Metodología",
  kpis: "Indicadores",
  chart: "Gráfico",
  table: "Tabla",
  narrative: "Análisis",
} as const;

const reportMetrics = [
  {
    label: "Productos",
    getValue: (job: PcfReportJobRecord) => `${job.derivedMetrics.totalProducts}`,
    getDescription: () => "Productos incluidos en esta vista previa del informe.",
  },
  {
    label: "Emisiones totales",
    getValue: (job: PcfReportJobRecord) =>
      `${formatCompactNumber(job.derivedMetrics.totalEmissions)} kgCO2e`,
    getDescription: () => "Total agregado a partir del CSV cargado.",
  },
  {
    label: "Etapa dominante",
    getValue: (job: PcfReportJobRecord) =>
      formatLifecycleStage(job.derivedMetrics.topContributorStage),
    getDescription: (job: PcfReportJobRecord) =>
      `${formatPercent(job.derivedMetrics.topContributorShare)} de las emisiones de la muestra actual.`,
  },
] as const;

export function ReportShell({ job, preview }: ReportShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      <header className="rounded-[1rem] border border-black/8 bg-white p-5 shadow-[0_25px_80px_rgba(28,28,28,0.08)] sm:rounded-[1.25rem] sm:p-6">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(17rem,0.44fr)] md:items-start">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--report-accent)]">
              Vista previa del informe
            </p>
            <h1 className="mt-2 max-w-[14ch] text-[2.3rem] font-semibold leading-[1.02] tracking-tight text-[var(--report-text)] sm:max-w-none sm:text-4xl">
              {job.reportDefinition.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/70">
              {job.reportDefinition.summary}
            </p>

            <dl className="mt-4 grid gap-2 text-sm text-black/70 sm:grid-cols-3">
              <div className="min-w-0">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-black/45">
                  Cliente
                </dt>
                <dd className="mt-1 font-medium text-black/75">Relats</dd>
              </div>
              <div className="min-w-0 sm:col-span-2">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-black/45">
                  Archivo
                </dt>
                <dd className="mt-1 overflow-wrap-anywhere font-medium text-black/75">
                  {job.upload.fileName}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-black/45">
                  Generado
                </dt>
                <dd className="mt-1 font-medium text-black/75">{preview.generatedLabel}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[0.95rem] border border-black/10 bg-[var(--report-panel)] px-4 py-3 text-sm text-black/70 sm:rounded-[1.05rem]">
            <details>
              <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--report-text)] marker:hidden">
                <span className="inline-flex items-center gap-2">
                  Detalles técnicos
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-black/55"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 border-t border-black/10 pt-3 text-black/65">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-black/45">
                  Job ID
                </div>
                <div className="mt-1 overflow-wrap-anywhere font-mono text-[0.8rem]">
                  {job.jobId}
                </div>
              </div>
            </details>
          </div>
        </div>

        <div className="mt-5 rounded-[0.95rem] border border-black/8 bg-[var(--report-panel)] sm:rounded-[1.05rem]">
          <div className="grid divide-y divide-black/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {reportMetrics.map((metric) => (
              <article key={metric.label} className="px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
                  {metric.label}
                </p>
                <p className="mt-2 text-[2rem] font-semibold leading-none text-[var(--report-text)]">
                  {metric.getValue(job)}
                </p>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  {metric.getDescription(job)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1rem] border border-black/8 bg-white p-5 shadow-[0_20px_70px_rgba(28,28,28,0.06)] sm:rounded-[1.25rem] sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--report-accent)]">
              Desglose de emisiones
            </p>
            <h2 className="mt-2 text-[1.9rem] font-semibold leading-[1.08] text-[var(--report-text)] sm:text-2xl">
              Distribución por etapa del ciclo de vida
            </h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              Una vista resumida de las etapas con mayor peso dentro de esta
              vista previa.
            </p>
          </div>

          <PrintStageBreakdownChart stageTotals={job.derivedMetrics.stageTotals} />
        </article>

        <article className="rounded-[1rem] border border-black/8 bg-white p-5 shadow-[0_20px_70px_rgba(28,28,28,0.06)] sm:rounded-[1.25rem] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--report-accent)]">
            Estructura del informe
          </p>
          <div className="mt-4 divide-y divide-black/8 rounded-[1rem] border border-black/8 bg-[var(--report-panel)]">
            {job.reportDefinition.sections.map((section) => (
              <div
                key={section.id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-[var(--report-text)]">
                    {section.title}
                  </h3>
                  {section.description ? (
                    <p className="mt-2 text-sm leading-6 text-black/70">
                      {section.description}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
                  {reportSectionKindLabels[section.kind]}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer className="rounded-[1rem] border border-black/8 bg-white p-5 shadow-[0_20px_70px_rgba(28,28,28,0.06)] sm:rounded-[1.25rem] sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--report-accent)]">
          Siguiente paso
        </p>
        <div className="mt-3 border-t border-black/8 pt-3">
          <p className="max-w-3xl text-sm leading-7 text-black/70">
            Revisa la estructura del informe y el desglose principal antes de
            pasar al flujo final de exportación.
          </p>
        </div>
      </footer>
    </div>
  );
}
