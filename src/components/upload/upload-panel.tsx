"use client";

import {
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";

import { brandOptions, type BrandId } from "@/lib/branding";
import {
  MAX_REPORT_UPLOAD_SIZE_LABEL,
  isWithinReportUploadSizeLimit,
} from "@/lib/uploads/report-upload-limits";

type StandardChipStatus = "active" | "soon";

interface StandardChipProps {
  label: string;
  status: StandardChipStatus;
}

function StandardChip({ label, status }: StandardChipProps) {
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.78rem] font-medium tracking-[-0.01em] ${
        isActive
          ? "bg-[#f7f3fc] text-[#63517d] ring-1 ring-[#e7ddf6]"
          : "bg-[#fff7f3] text-[#9b715f] ring-1 ring-[#efddd5]"
      }`}
    >
      {label}
    </span>
  );
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${size} B`;
}

type UploadFileCandidate = Pick<File, "name" | "size" | "type">;

export function isCsvFile(file: UploadFileCandidate) {
  return (
    file.name.toLowerCase().endsWith(".csv") ||
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel"
  );
}

export function isValidCsvUpload<T extends UploadFileCandidate>(
  file: T | null,
): file is T {
  return (
    file !== null &&
    file.size > 0 &&
    isWithinReportUploadSizeLimit(file.size) &&
    isCsvFile(file)
  );
}

interface UploadPanelProps {
  selectedBrandId: BrandId;
  onBrandChange: (brandId: BrandId) => void;
}

export function UploadPanel({
  selectedBrandId,
  onBrandChange,
}: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isDragActive, setIsDragActive] = useState(false);

  function resetFileInput() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function updateSelectedFile(file: File | null) {
    setIsDragActive(false);

    if (!file) {
      setSelectedFile(null);
      setErrors([]);
      resetFileInput();
      return;
    }

    if (file.size === 0) {
      setSelectedFile(null);
      setErrors(["Selecciona un archivo CSV con contenido."]);
      resetFileInput();
      return;
    }

    if (!isCsvFile(file)) {
      setSelectedFile(null);
      setErrors(["Selecciona un archivo con formato .csv."]);
      resetFileInput();
      return;
    }

    if (!isWithinReportUploadSizeLimit(file.size)) {
      setSelectedFile(null);
      setErrors([
        `El archivo supera el tamaño máximo permitido de ${MAX_REPORT_UPLOAD_SIZE_LABEL}.`,
      ]);
      resetFileInput();
      return;
    }

    setSelectedFile(file);
    setErrors([]);
    resetFileInput();
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;

    if (!file) {
      resetFileInput();
      return;
    }

    updateSelectedFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0] ?? null;

    if (!file) {
      setIsDragActive(false);
      return;
    }

    updateSelectedFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);

    if (!isValidCsvUpload(selectedFile)) {
      setErrors(["Selecciona un archivo CSV para generar la vista previa."]);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("brandId", selectedBrandId);

    startTransition(async () => {
      try {
        const response = await fetch("/api/reports/upload", {
          method: "POST",
          body: formData,
        });

        const payload = (await response.json().catch(() => null)) as
          | { error: string; details?: string[] }
          | { previewPath: string }
          | null;

        if (!response.ok || !payload || !("previewPath" in payload)) {
          setErrors(
            payload && "error" in payload
              ? payload.details && payload.details.length > 0
                ? payload.details
                : [payload.error]
              : ["No se pudo generar la vista previa del informe."],
          );
          return;
        }

        window.location.assign(payload.previewPath);
      } catch {
        setErrors([
          "No se pudo conectar con el servidor. Revisa la conexión e inténtalo de nuevo.",
        ]);
      }
    });
  }

  const canGeneratePreview = isValidCsvUpload(selectedFile);

  return (
    <section
      id="upload-csv"
      className="rounded-[1rem] border border-black/6 bg-white p-4 shadow-[0_12px_28px_rgba(34,25,58,0.04)] sm:rounded-[1.25rem] sm:p-5 lg:p-6"
    >
      <div className="mb-4 flex flex-col gap-2.5 sm:mb-5 sm:gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StandardChip label="PCF ISO 14067" status="active" />
          <StandardChip label="OCF ISO 14064" status="soon" />
          <span className="rounded-full bg-[#fff4ef] px-2 py-1 text-[0.68rem] font-medium text-[#cc7e66] ring-1 ring-[#f3ddd3]">
            Próximamente
          </span>
        </div>

        <div className="max-w-[42rem]">
          <h2 className="text-[1.65rem] font-semibold leading-[1.2] tracking-[-0.05em] text-[#241b3c] sm:text-[1.85rem] sm:leading-[1.18]">
            Sube tu CSV y genera la vista previa del informe
          </h2>
          <p className="mt-2 text-[0.95rem] leading-6 text-[#666076] sm:mt-2.5 sm:text-[0.98rem] sm:leading-7">
            Acepta CSV con estructura PCF.
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <fieldset className="rounded-[0.85rem] bg-white px-3 py-2.5 ring-1 ring-black/6 sm:flex sm:items-center sm:justify-between sm:gap-3">
          <legend className="sr-only">
            Preset visual del informe
          </legend>
          <div className="mb-2 min-w-0 sm:mb-0">
            <p className="text-[0.78rem] font-semibold text-[#30264b]">
              Preset visual del informe
            </p>
            <p className="mt-0.5 text-[0.72rem] leading-4 text-[#7b738b]">
              Se aplicar&aacute; a la vista previa y al PDF.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {brandOptions.map((brand) => {
              const isSelected = brand.id === selectedBrandId;

              return (
                <label
                  key={brand.id}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-2.5 py-1.5 text-[0.76rem] font-semibold transition ring-1 ${
                    isSelected
                      ? "bg-[#fff7f3] text-[#30264b] ring-[#ffb29f]"
                      : "bg-[#faf9fd] text-[#6d657e] ring-black/6 hover:ring-[#ead5cb]"
                  }`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="brandId"
                    value={brand.id}
                    checked={isSelected}
                    onChange={() => onBrandChange(brand.id)}
                  />
                  <span
                    className="h-2.5 w-2.5 rounded-full ring-1 ring-black/8"
                    style={{ backgroundColor: brand.primaryColor }}
                    aria-hidden="true"
                  />
                  <span>{brand.name}</span>
                  {isSelected ? (
                    <span className="sr-only">seleccionado</span>
                  ) : null}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div
          className={`rounded-[0.95rem] px-4 py-4 text-center transition ring-1 sm:rounded-[1.2rem] sm:px-6 sm:py-7 ${
            isDragActive
              ? "bg-[#fff9f6] ring-[#ffb29f]"
              : "bg-[#faf9fd] ring-black/5"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (
              event.relatedTarget instanceof Node &&
              event.currentTarget.contains(event.relatedTarget)
            ) {
              return;
            }
            setIsDragActive(false);
          }}
          onDrop={handleDrop}
        >
          <div className="mx-auto flex max-w-[29rem] flex-col items-center gap-3 sm:gap-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[0.85rem] bg-[#f4efff] text-[#7f56d9] ring-1 ring-[#e4daf8] sm:h-11 sm:w-11 sm:rounded-[1rem]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 16V4" />
                <path d="m7 9 5-5 5 5" />
                <path d="M5 20h14" />
              </svg>
            </div>

            <div className="space-y-2">
              <p className="text-[1.15rem] font-semibold tracking-[-0.035em] text-[#251c3e] sm:text-[1.3rem]">
                Arrastra tu archivo CSV aquí
              </p>
              <p className="text-sm leading-6 text-[#6b6578]">
                O selecciona un archivo desde tu dispositivo para generar la
                vista previa.
              </p>
            </div>

            <input
              id="csv-file-input"
              ref={inputRef}
              className="sr-only"
              type="file"
              name="file"
              accept=".csv,text/csv"
              onChange={handleFileInputChange}
            />

            <label
              htmlFor="csv-file-input"
              className={`inline-flex w-full cursor-pointer items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition sm:w-auto ${
                selectedFile
                  ? "bg-white text-[#6d3bcf] ring-1 ring-[#d9ccf4] hover:bg-[#f8f5ff] hover:ring-[#c8b6ed]"
                  : "bg-[#6d3bcf] text-white shadow-[0_12px_24px_rgba(109,59,207,0.18)] hover:bg-[#5f31b8]"
              }`}
            >
              {selectedFile ? "Cambiar archivo" : "Seleccionar archivo CSV"}
            </label>
          </div>
        </div>

        {selectedFile ? (
          <div className="flex flex-col gap-3 rounded-[0.95rem] bg-white px-3 py-3 ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between sm:rounded-[1.05rem]">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.8rem] bg-[#eefaf2] text-[#32a05d] ring-1 ring-[#d6f0df] sm:h-9 sm:w-9 sm:rounded-[0.9rem]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 sm:h-4.5 sm:w-4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="m9 15 2 2 4-4" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#30264b]">
                  Archivo seleccionado: {selectedFile.name}
                </p>
                <p className="mt-1 text-[0.78rem] text-[#7b738b]">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.72rem] font-medium text-[#32a05d] ring-1 ring-[#d6f0df]">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Cargado
              </span>
              <button
                type="button"
                onClick={() => updateSelectedFile(null)}
                className="inline-flex h-9 min-w-fit items-center justify-center whitespace-nowrap rounded-[0.9rem] px-3 text-xs font-semibold text-[#8d849e] ring-1 ring-black/6 transition hover:bg-[#f7f5fb] hover:text-[#5f5478]"
              >
                Quitar archivo
              </button>
            </div>
          </div>
        ) : null}

        {errors.length > 0 ? (
          <div className="rounded-[0.95rem] border border-[#f4c8ce] bg-[#fff5f6] px-4 py-3 text-sm text-[#9a4551] sm:rounded-[1.15rem]">
            <p className="font-semibold">No se pudo validar el CSV.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex justify-end border-t border-black/6 pt-4">
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-[#ff6c4d] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,108,77,0.16)] transition hover:bg-[#f25939] disabled:cursor-not-allowed disabled:bg-[#f2e7e5] disabled:text-[#a99b99] disabled:shadow-none sm:w-auto sm:self-auto"
            type="submit"
            disabled={isPending || !canGeneratePreview}
          >
            {isPending ? "Generando vista previa..." : "Generar vista previa"}
          </button>
        </div>
      </form>
    </section>
  );
}
