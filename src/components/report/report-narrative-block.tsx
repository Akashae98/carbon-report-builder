interface ReportNarrativeBlockProps {
  paragraphs: string[];
}

export function ReportNarrativeBlock({
  paragraphs,
}: ReportNarrativeBlockProps) {
  return (
    <div className="space-y-4 text-[0.98rem] leading-8 text-black/72">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
