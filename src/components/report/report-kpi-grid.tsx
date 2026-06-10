interface ReportKpiItem {
  label: string;
  value: string;
  supportingText: string;
}

interface ReportKpiGridProps {
  items: ReportKpiItem[];
}

export function ReportKpiGrid({ items }: ReportKpiGridProps) {
  return (
    <div className="report-kpi-grid grid gap-px border-y border-black/10 bg-black/10 md:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.label}
          className="bg-white px-5 py-5 sm:px-6 sm:py-6"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-black/50">
            {item.label}
          </p>
          <p className="mt-3 text-[1.8rem] font-semibold leading-tight text-[var(--report-text)]">
            {item.value}
          </p>
          <p className="mt-3 text-sm leading-6 text-black/65">
            {item.supportingText}
          </p>
        </article>
      ))}
    </div>
  );
}
