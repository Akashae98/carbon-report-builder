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
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[1.2rem] border border-black/8 bg-[var(--report-panel)] px-5 py-5"
        >
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black/55">
            {item.label}
          </p>
          <p className="mt-3 text-[2rem] font-semibold leading-none text-[var(--report-text)]">
            {item.value}
          </p>
          <p className="mt-3 text-sm leading-6 text-black/68">{item.supportingText}</p>
        </article>
      ))}
    </div>
  );
}
