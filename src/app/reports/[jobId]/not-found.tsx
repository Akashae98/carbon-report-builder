import Link from "next/link";

export default function ReportPreviewNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9fd] px-6 py-12">
      <section className="w-full max-w-xl rounded-[1.25rem] bg-white p-6 text-center shadow-[0_18px_45px_rgba(34,25,58,0.08)] ring-1 ring-black/6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#9b715f]">
          Informe no disponible
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#241b3c]">
          No se encontró la vista previa del informe
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#6b6578]">
          El enlace ya no es válido o no se ha encontrado el informe.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#6d3bcf] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5f31b8]"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
