import Image from "next/image";

import { getBrandProfile, type BrandId } from "@/lib/branding";

const previewSections = [
  "Portada",
  "Introducción",
  "Metodología",
  "Síntesis ejecutiva",
  "Desglose del ciclo de vida",
  "Productos con mayor huella agregada",
  "Recomendaciones",
  "Conclusiones",
];

const mobilePreviewSections = [
  "Introducción",
  "Síntesis ejecutiva",
  "Desglose del ciclo de vida",
  "Conclusiones",
];

interface ReportPreviewCardProps {
  selectedBrandId: BrandId;
}

function ReportCoverMock({ selectedBrandId }: ReportPreviewCardProps) {
  const brand = getBrandProfile(selectedBrandId);

  return (
    <div className="relative aspect-[0.72] min-h-[26rem] overflow-hidden rounded-[0.85rem] border border-black/6 bg-white px-4 py-5 pb-4 shadow-[0_14px_30px_rgba(49,32,77,0.07)] sm:px-5 md:h-[38rem] md:aspect-auto xl:h-auto xl:aspect-[0.72]">
      <div
        className="h-1.5 w-16 rounded-full"
        style={{ backgroundColor: brand.primaryColor }}
      />

      <div className="mt-7 flex min-h-[2.5rem] items-center">
        <Image
          src={brand.logoPath}
          alt={brand.name}
          width={150}
          height={42}
          className="max-h-10 w-auto object-contain object-left"
        />
      </div>

      <h3
        className="mt-8 max-w-[12.25rem] text-[1.65rem] font-semibold leading-[1.04] tracking-[-0.055em] sm:text-[1.82rem]"
        style={{ color: brand.textColor }}
      >
        Informe de huella de carbono
      </h3>

      <p
        className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em]"
        style={{ color: brand.primaryColor }}
      >
        Evaluación PCF
      </p>

      <div
        className="absolute bottom-4 left-4 right-4 rounded-[0.9rem] p-4 sm:left-5 sm:right-auto sm:w-[12.75rem]"
        style={{ backgroundColor: brand.secondaryColor }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: brand.textColor }}
        >
          {brand.name}
        </p>
        <p className="mt-1 text-sm text-black/60">Junio de 2026</p>
        <p className="mt-5 text-[0.58rem] uppercase tracking-[0.2em] text-black/42">
          Generado por Footprint Mappa
        </p>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 rounded-tl-[5rem] opacity-10"
        style={{ backgroundColor: brand.primaryColor }}
        aria-hidden="true"
      />
    </div>
  );
}

export function ReportPreviewCard({ selectedBrandId }: ReportPreviewCardProps) {
  const brand = getBrandProfile(selectedBrandId);

  return (
    <aside className="relative z-10 min-w-0 overflow-hidden rounded-[1rem] border border-black/6 bg-white p-4 shadow-[0_18px_46px_rgba(49,32,77,0.08)] sm:rounded-[1.25rem] sm:p-5 lg:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[-0.02em] text-[#241b3c]">
            Vista del PDF generado
          </p>
          <p className="mt-1 text-sm leading-6 text-[#6c6679]">
            Previsualización del estilo aplicado al informe antes de exportarlo.
          </p>
        </div>
        <span
          className="shrink-0 rounded-full border px-2.5 py-1 text-[0.78rem] font-medium"
          style={{
            borderColor: brand.secondaryColor,
            backgroundColor: `${brand.primaryColor}10`,
            color: brand.primaryColor,
          }}
        >
          {brand.name}
        </span>
      </div>

      <div className="min-w-0 rounded-[0.95rem] bg-[#fcfbfe] p-3 ring-1 ring-[#eee8f5] sm:rounded-[1.1rem] sm:p-4 md:p-2.5">
        <div className="space-y-3 md:hidden">
          <div className="rounded-[0.9rem] bg-white p-2.5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[0.85rem] border border-black/6 bg-white px-4 py-4 shadow-[0_12px_26px_rgba(49,32,77,0.06)]">
              <div
                className="h-1.5 w-12 rounded-full"
                style={{ backgroundColor: brand.primaryColor }}
              />
              <div className="mt-5 flex min-h-[2rem] items-center">
                <Image
                  src={brand.logoPath}
                  alt={brand.name}
                  width={118}
                  height={34}
                  className="max-h-8 w-auto object-contain object-left"
                />
              </div>
              <h3
                className="mt-6 max-w-[10.5rem] text-[1.12rem] font-semibold leading-[1.04] tracking-[-0.05em]"
                style={{ color: brand.textColor }}
              >
                Informe de huella de carbono
              </h3>
              <p
                className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.2em]"
                style={{ color: brand.primaryColor }}
              >
                Evaluación PCF
              </p>

              <div
                className="absolute bottom-4 left-4 right-4 rounded-[0.8rem] p-3"
                style={{ backgroundColor: brand.secondaryColor }}
              >
                <p
                  className="text-[0.78rem] font-semibold"
                  style={{ color: brand.textColor }}
                >
                  {brand.name}
                </p>
                <p className="mt-1 text-[0.74rem] text-black/60">
                  Junio de 2026
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[0.9rem] bg-white p-3 ring-1 ring-black/5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9a90ac]">
              Contenido
            </p>
            <div className="mt-3 divide-y divide-black/6">
              {mobilePreviewSections.map((section, index) => (
                <div
                  key={section}
                  className="grid grid-cols-[0.9rem_minmax(0,1fr)] items-start gap-2 py-2.5"
                >
                  <span className="pt-0.5 text-[0.7rem] font-medium text-[#8b819e]">
                    {index + 1}
                  </span>
                  <span className="text-[0.82rem] font-medium leading-5 text-[#30264b]">
                    {section}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden min-w-0 overflow-hidden rounded-[1rem] bg-white ring-1 ring-black/5 md:grid md:grid-cols-[minmax(0,1fr)_minmax(10.5rem,0.4fr)] md:items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(11rem,0.38fr)]">
          <div className="min-w-0 p-3 sm:p-4">
            <ReportCoverMock selectedBrandId={selectedBrandId} />
          </div>

          <div className="min-w-0 border-l border-black/6 bg-white px-4 py-3.5 sm:px-4 sm:py-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#9a90ac]">
              Contenido
            </p>

            <div className="mt-4 divide-y divide-black/6">
              {previewSections.map((section, index) => (
                <div
                  key={section}
                  className="grid min-w-0 grid-cols-[0.9rem_minmax(0,1fr)_0.9rem] items-start gap-3 py-2.5"
                >
                  <span className="pt-0.5 text-[0.7rem] font-medium text-[#8b819e]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 text-[0.78rem] font-medium leading-5 text-[#30264b]">
                    {section}
                  </span>
                  <span className="pt-0.5 text-right text-[0.7rem] text-[#aaa0ba]">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex min-w-0 items-start gap-2 text-sm leading-6 text-[#746d81]">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#8a80a1] ring-1 ring-black/6">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </span>
        <p>
          La vista completa se genera automáticamente después de subir el CSV.
        </p>
      </div>
    </aside>
  );
}
