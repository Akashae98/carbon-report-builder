import Image from "next/image";

import type { ReportPreviewModel } from "@/types";

const FOOTPRINT_MAPPA_LOGO_PATH =
  "/brands/footprint-mappa/footprint_mapa_logo.png";

interface ReportCoverSectionProps {
  preview: ReportPreviewModel;
}

export function ReportCoverSection({ preview }: ReportCoverSectionProps) {
  return (
    <section className="report-cover-sheet report-sheet overflow-hidden bg-white shadow-[0_14px_42px_rgba(28,28,28,0.04)]">
      <div className="report-cover-accent" aria-hidden="true" />
      <div className="report-cover-layout flex min-h-[38rem] flex-col justify-between px-6 py-8 sm:px-10 sm:py-12">
        <div className="report-cover-primary">
          <Image
            src={preview.branding.logoSrc}
            alt={`${preview.branding.clientName} logo`}
            width={270}
            height={76}
            className="h-14 w-auto object-contain"
          />

          <div className="mt-20 max-w-3xl">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--report-accent)]">
              Informe ejecutivo
            </p>
            <h1 className="mt-5 max-w-[14ch] text-[3rem] font-semibold leading-[1] text-[var(--report-text)] sm:text-[4.2rem]">
              {preview.document.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-black/70">
              {preview.document.subtitle}
            </p>
          </div>

          <dl className="report-cover-metadata mt-10 grid max-w-3xl gap-x-8 gap-y-6 border-t border-black/10 pt-7 text-sm text-black/70 sm:grid-cols-3">
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.05em] text-black/45">
                Cliente
              </dt>
              <dd className="mt-2 text-base font-medium text-[var(--report-text)]">
                {preview.branding.clientName}
              </dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.05em] text-black/45">
                Fecha de emisión
              </dt>
              <dd className="mt-2 text-base font-medium text-[var(--report-text)]">
                {preview.document.generatedAtLabel}
              </dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.05em] text-black/45">
                Archivo analizado
              </dt>
              <dd className="mt-2 overflow-wrap-anywhere text-base font-medium text-[var(--report-text)]">
                {preview.document.sourceFileName}
              </dd>
            </div>
          </dl>
        </div>

        <footer className="report-cover-footer mt-14 flex flex-col gap-5 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-black/45">
              Cliente
            </p>
            <div className="mt-3">
              <Image
                src={preview.branding.logoSrc}
                alt={`${preview.branding.clientName} logo`}
                width={230}
                height={70}
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-black/45">
              Preparado con
            </p>
            <div className="mt-3 flex justify-start sm:justify-end">
              <Image
                src={FOOTPRINT_MAPPA_LOGO_PATH}
                alt="Footprint Mappa logo"
                width={280}
                height={74}
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
