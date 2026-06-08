import { formatPercent } from "@/lib/formatting";

interface PrintStageBreakdownChartProps {
  stageTotals: Record<string, number>;
}

export function PrintStageBreakdownChart({
  stageTotals,
}: PrintStageBreakdownChartProps) {
  const entries = Object.entries(stageTotals);
  const maxValue = Math.max(...entries.map(([, value]) => value), 1);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  return (
    <svg
      viewBox="0 0 640 340"
      className="h-auto w-full"
      role="img"
      aria-label="Lifecycle stage breakdown chart"
    >
      <rect x="0" y="0" width="640" height="340" rx="28" fill="#ffffff" />
      <line x1="120" y1="48" x2="120" y2="282" stroke="#d7cec7" strokeWidth="2" />
      <line x1="120" y1="282" x2="584" y2="282" stroke="#d7cec7" strokeWidth="2" />

      {entries.map(([label, value], index) => {
        const y = 72 + index * 42;
        const width = (value / maxValue) * 420;
        const percentage = total === 0 ? 0 : value / total;

        return (
          <g key={label}>
            <text
              x="108"
              y={y + 14}
              textAnchor="end"
              fontSize="13"
              fontFamily="Arial, Helvetica, sans-serif"
              fill="#4d4d4d"
            >
              {label}
            </text>
            <rect
              x="132"
              y={y}
              width={width}
              height="22"
              rx="11"
              fill={index === 0 ? "#ff5710" : "#1c1c1c"}
              opacity={index === 0 ? "1" : `${0.86 - index * 0.1}`}
            />
            <text
              x={Math.min(132 + width + 12, 576)}
              y={y + 15}
              fontSize="13"
              fontFamily="Arial, Helvetica, sans-serif"
              fill="#1c1c1c"
            >
              {formatPercent(percentage)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
