"use client";

import Link from "next/link";

interface ReportPreviewErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ReportPreviewError({
  reset,
}: ReportPreviewErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9fd] px-6 py-12">
      <section className="w-full max-w-xl rounded-[1.25rem] bg-white p-6 text-center shadow-[0_18px_45px_rgba(34,25,58,0.08)] ring-1 ring-black/6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#9b715f]">
          Vista previa no disponible
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#241b3c]">
          No se pudo recuperar el informe
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#6b6578]">
          El servicio de informes no está disponible temporalmente. Inténtalo
          de nuevo en unos minutos.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full bg-[#6d3bcf] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5f31b8]"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#6d3bcf] ring-1 ring-[#d9ccf4] transition hover:bg-[#f8f5ff]"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
