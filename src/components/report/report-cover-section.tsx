import Image from "next/image";

import type { ReportPreviewModel } from "@/types";

interface ReportCoverSectionProps {
  preview: ReportPreviewModel;
}

export function ReportCoverSection({ preview }: ReportCoverSectionProps) {
  return (
    <section className="report-sheet overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_20px_60px_rgba(28,28,28,0.06)]">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="flex min-h-[28rem] flex-col justify-between">
            <div>
              <Image
                src={preview.branding.logoSrc}
                alt={`${preview.branding.clientName} logo`}
                width={180}
                height={48}
                className="h-10 w-auto object-contain"
              />
              <p className="mt-12 text-[0.78rem] font-semibold uppercase tracking-[0.26em] text-[var(--report-accent)]">
                Informe ejecutivo
              </p>
              <h1 className="mt-4 max-w-[14ch] text-[3rem] font-semibold leading-[0.95] text-[var(--report-text)] sm:text-[4.25rem]">
                {preview.document.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-black/72">
                {preview.document.subtitle}
              </p>
            </div>

            <dl className="mt-10 grid gap-5 border-t border-black/8 pt-6 text-sm text-black/70 sm:grid-cols-2">
              <div>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/45">
                  Cliente
                </dt>
                <dd className="mt-2 text-base font-medium text-[var(--report-text)]">
                  {preview.branding.clientName}
                </dd>
              </div>
              <div>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/45">
                  Fecha de emisión
                </dt>
                <dd className="mt-2 text-base font-medium text-[var(--report-text)]">
                  {preview.document.generatedAtLabel}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/45">
                  Archivo analizado
                </dt>
                <dd className="mt-2 overflow-wrap-anywhere text-base font-medium text-[var(--report-text)]">
                  {preview.document.sourceFileName}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col justify-between bg-[var(--report-panel)] px-6 py-8 sm:px-10 sm:py-12">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/50">
              Resumen ejecutivo
            </p>
            <div className="mt-6 space-y-6">
              <article>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Productos analizados
                </p>
                <p className="mt-2 text-[2.4rem] font-semibold leading-none text-[var(--report-text)]">
                  {preview.summary.productCountLabel}
                </p>
              </article>
              <article>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Huella de carbono total
                </p>
                <p className="mt-2 text-[2rem] font-semibold leading-tight text-[var(--report-text)]">
                  {preview.summary.totalEmissionsLabel}
                </p>
              </article>
              <article>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Principal fuente de emisiones
                </p>
                <p className="mt-2 text-[1.6rem] font-semibold leading-tight text-[var(--report-text)]">
                  {preview.summary.topContributorStageLabel}
                </p>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  {preview.summary.topContributorShareLabel} de la huella de carbono total.
                </p>
              </article>
            </div>
          </div>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-black/55">
            {preview.document.generatedBy}
          </p>
        </div>
      </div>
    </section>
  );
}
