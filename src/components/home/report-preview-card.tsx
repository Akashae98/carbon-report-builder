const previewSections = [
  "Portada",
  "Resumen ejecutivo",
  "Desglose de emisiones",
  "Principales contribuyentes",
  "Recomendaciones",
];

const mobilePreviewSections = [
  "Resumen ejecutivo",
  "Desglose de emisiones",
  "Recomendaciones",
];

function ReportCoverArtwork() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 w-[42%] overflow-hidden rounded-r-[1rem]">
      <div className="absolute inset-y-0 right-[-12%] w-[135%] bg-[radial-gradient(circle_at_20%_10%,rgba(255,187,173,0.9),rgba(255,187,173,0)_28%),linear-gradient(180deg,#ff856f_0%,#ff6f78_18%,#d35cc0_45%,#6b3ec9_75%,#3a2685_100%)]" />
      <div className="absolute inset-y-0 right-[4%] w-[78%] rounded-l-[7rem] bg-[linear-gradient(180deg,rgba(255,188,176,0.96)_0%,rgba(255,130,118,0.82)_14%,rgba(210,99,190,0.72)_42%,rgba(99,63,183,0.88)_76%,rgba(44,28,105,1)_100%)] opacity-95" />
      <div className="absolute inset-y-0 right-[16%] w-[52%] rounded-l-[6rem] bg-[linear-gradient(180deg,rgba(255,203,194,0.88)_0%,rgba(255,150,134,0.78)_22%,rgba(188,95,184,0.62)_50%,rgba(72,51,149,0.92)_100%)]" />
      <div className="absolute bottom-0 right-0 h-[42%] w-[88%] bg-[radial-gradient(circle_at_left_top,rgba(255,255,255,0.26),rgba(255,255,255,0)_45%),radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1.2px)] [background-size:auto,10px_10px] opacity-65" />
    </div>
  );
}

export function ReportPreviewCard() {
  return (
    <aside className="min-w-0 overflow-hidden rounded-[1rem] border border-black/6 bg-white/96 p-4 shadow-[0_18px_46px_rgba(49,32,77,0.08)] backdrop-blur-[2px] sm:rounded-[1.25rem] sm:p-5 lg:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[-0.02em] text-[#241b3c]">
            Vista previa del informe
          </p>
          <p className="mt-1 text-sm leading-6 text-[#6c6679]">
            Ejemplo de vista previa con branding cliente, usando Relats como
            demo actual.
          </p>
        </div>
        <span className="rounded-full border border-[#ffe0d6] bg-[#fff7f3] px-2.5 py-1 text-[0.78rem] font-medium text-[#ff6c4d]">
          Relats
        </span>
      </div>

      <div className="min-w-0 rounded-[0.95rem] bg-[#fcfbfe] p-3 ring-1 ring-[#eee8f5] sm:rounded-[1.1rem] sm:p-4">
        <div className="space-y-3 md:hidden">
          <div className="rounded-[0.9rem] bg-white p-2.5 ring-1 ring-black/5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[0.85rem] border border-black/6 bg-white px-4 py-4">
              <ReportCoverArtwork />
              <div className="relative z-10 max-w-[58%]">
                <div className="h-1.5 w-10 rounded-full bg-[#ff6c4d]" />
                <p className="mt-4 text-[1rem] font-semibold tracking-[-0.04em] text-[#1c1c1c]">
                  Relats
                </p>
                <h3 className="mt-4 text-[1rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#1c1c1c]">
                  Informe de huella de carbono
                </h3>
                <p className="mt-3 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#ff6c4d]">
                  Evaluación PCF
                </p>
              </div>

              <div className="relative z-10 mt-6 max-w-[9.25rem] rounded-[0.8rem] bg-[#f1ece7] p-3">
                <p className="text-[0.78rem] font-medium text-[#1c1c1c]">Relats</p>
                <p className="mt-1 text-[0.74rem] text-black/60">Junio de 2026</p>
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

        <div className="hidden min-w-0 gap-3 md:grid md:grid-cols-[minmax(0,1fr)_minmax(11.25rem,0.52fr)] md:items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(12rem,0.48fr)]">
          <div className="min-w-0 rounded-[1rem] bg-white p-3 ring-1 ring-black/5 sm:p-4">
            <div className="relative min-h-[22rem] overflow-hidden rounded-[0.95rem] border border-black/6 bg-white px-4 py-5 pb-4 sm:px-5">
              <ReportCoverArtwork />
              <div className="relative z-10 max-w-[60%]">
                <div className="h-1.5 w-14 rounded-full bg-[#ff6c4d]" />
                <p className="mt-5 text-[1.65rem] font-semibold tracking-[-0.05em] text-[#1c1c1c] sm:text-[1.9rem]">
                  Relats
                </p>
                <h3 className="mt-6 text-[1.9rem] font-semibold leading-[1.01] tracking-[-0.06em] text-[#1c1c1c] sm:text-[2.1rem]">
                  Informe de huella de carbono
                </h3>
                <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-[#ff6c4d]">
                  Evaluación PCF
                </p>
              </div>

              <div className="relative z-10 mt-12 max-w-[13rem] rounded-[0.9rem] bg-[#f1ece7] p-4">
                <p className="text-sm font-medium text-[#1c1c1c]">Relats</p>
                <p className="mt-1 text-sm text-black/60">Junio de 2026</p>
                <p className="mt-7 text-[0.68rem] uppercase tracking-[0.22em] text-black/42">
                  Generado por Footprint Mappa
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-[1rem] bg-white px-4 py-3.5 ring-1 ring-black/5 sm:px-4 sm:py-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#9a90ac]">
              Contenido
            </p>

            <div className="mt-4 divide-y divide-black/6">
              {previewSections.map((section, index) => (
                <div
                  key={section}
                  className="grid min-w-0 grid-cols-[0.9rem_minmax(0,1fr)_0.9rem] items-start gap-3 py-3"
                >
                  <span className="pt-0.5 text-[0.7rem] font-medium text-[#8b819e]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 text-[0.86rem] font-medium leading-5 text-[#30264b]">
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
