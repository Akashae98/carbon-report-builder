import type { ReactNode } from "react";

interface ReportSectionProps {
  id: string;
  sectionNumber?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function ReportSection({
  id,
  sectionNumber,
  eyebrow,
  title,
  description,
  children,
}: ReportSectionProps) {
  return (
    <section
      id={id}
      className="report-sheet bg-white px-6 py-8 shadow-[0_14px_42px_rgba(28,28,28,0.04)] sm:px-10 sm:py-10"
    >
      <header className="report-section-header max-w-3xl">
        <div className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[var(--report-accent)]">
          {sectionNumber ? (
            <span className="report-section-number text-[var(--report-text)]">
              {sectionNumber}
            </span>
          ) : null}
          {eyebrow ? <p>{eyebrow}</p> : null}
        </div>
        <h2 className="mt-3 text-[1.9rem] font-semibold leading-[1.08] text-[var(--report-text)] sm:text-[2.2rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-black/68">
            {description}
          </p>
        ) : null}
      </header>

      <div className="report-section-body mt-7">{children}</div>
    </section>
  );
}
