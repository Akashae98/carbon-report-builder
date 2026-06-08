"use client";

import { useState, useTransition } from "react";

export function UploadPanel() {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Choose a CSV file to create a Phase 1 stub report.");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as
        | { error: string }
        | { previewPath: string };

      if (!response.ok || !("previewPath" in payload)) {
        setError(
          "error" in payload
            ? payload.error
            : "The upload route did not return a preview path.",
        );
        return;
      }

      window.location.assign(payload.previewPath);
    });
  }

  return (
    <section className="rounded-[2rem] border border-white/12 bg-white/7 p-6 shadow-[0_20px_80px_rgba(4,18,130,0.32)] backdrop-blur">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--app-accent-2)]">
          Upload
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Create a temporary PCF report job
        </h2>
        <p className="text-sm leading-6 text-[var(--muted)]">
          Phase 1 does not parse the CSV yet. It validates that a file exists,
          then writes a stubbed PCF report bundle into <code>.tmp/reports</code>.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <label className="flex cursor-pointer flex-col gap-3 rounded-[1.5rem] border border-dashed border-white/20 bg-white/4 p-5 transition hover:border-[var(--app-accent-1)] hover:bg-white/8">
          <span className="text-sm font-medium text-white">
            CSV upload
          </span>
          <span className="text-sm text-[var(--muted)]">
            {selectedFileName ?? "Choose a `.csv` file for the stub upload flow."}
          </span>
          <input
            className="text-sm text-[var(--muted)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--app-accent-1)] file:px-4 file:py-2 file:font-medium file:text-[#041282]"
            type="file"
            name="file"
            accept=".csv,text/csv"
            onChange={(event) =>
              setSelectedFileName(event.currentTarget.files?.[0]?.name ?? null)
            }
          />
        </label>

        <div className="rounded-[1.5rem] border border-white/10 bg-[#03104f] p-4 text-sm text-[var(--muted)]">
          <div>
            Flow wired: upload to schema to normalization to metrics to report
            definition to temp store.
          </div>
          <div>Current data: stubbed PCF content only.</div>
        </div>

        {error ? (
          <p className="rounded-xl border border-[#ff7983]/40 bg-[#ff7983]/12 px-4 py-3 text-sm text-[#ffd4d8]">
            {error}
          </p>
        ) : null}

        <button
          className="inline-flex w-full items-center justify-center rounded-full bg-[var(--app-accent-2)] px-5 py-3 text-sm font-semibold text-[#1f1331] transition hover:bg-[#ffbb7f] disabled:cursor-not-allowed disabled:opacity-65"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating report job..." : "Create Phase 1 Report Job"}
        </button>
      </form>
    </section>
  );
}
