import type { ReactNode } from "react";

interface ReportSectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function ReportSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: ReportSectionProps) {
  return (
    <section
      id={id}
      className="report-sheet rounded-[1.5rem] border border-black/8 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(28,28,28,0.06)] sm:px-10 sm:py-10"
    >
      <header className="report-section-header max-w-3xl">
        {eyebrow ? (
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[var(--report-accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-[2rem] font-semibold leading-[1.05] text-[var(--report-text)] sm:text-[2.25rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-7 text-black/68">{description}</p>
        ) : null}
      </header>

      <div className="report-section-body mt-8">{children}</div>
    </section>
  );
}
