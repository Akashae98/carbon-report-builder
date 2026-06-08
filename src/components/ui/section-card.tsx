interface SectionCardProps {
  title: string;
  value: string;
  description: string;
}

export function SectionCard({ title, value, description }: SectionCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--app-accent-1)]">
        {title}
      </p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
    </article>
  );
}
