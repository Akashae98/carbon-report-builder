import { formatLifecycleStage, formatPercent } from "@/lib/formatting";

interface PrintStageBreakdownChartProps {
  stageTotals: Record<string, number>;
}

function renderEmptyState(width: number, height: number, label: string) {
  return (
    <>
      <rect x="0" y="0" width={width} height={height} rx="24" fill="#ffffff" />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        fontSize="14"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#6b6578"
      >
        {label}
      </text>
    </>
  );
}

export function PrintStageBreakdownChart({
  stageTotals,
}: PrintStageBreakdownChartProps) {
  const entries = Object.entries(stageTotals);
  const maxValue = Math.max(...entries.map(([, value]) => value), 1);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  const mobileHeight = Math.max(entries.length * 64 + 48, 190);

  return (
    <figure aria-labelledby="stage-breakdown-caption">
      <figcaption id="stage-breakdown-caption" className="sr-only">
        Distribución de emisiones por etapa del ciclo de vida en la vista previa
        del informe.
      </figcaption>

      <svg
        viewBox={`0 0 320 ${mobileHeight}`}
        className="h-auto w-full md:hidden"
        aria-hidden="true"
        focusable="false"
      >
        {entries.length === 0
          ? renderEmptyState(320, mobileHeight, "No hay datos disponibles.")
          : (
              <>
                <rect
                  x="0"
                  y="0"
                  width="320"
                  height={mobileHeight}
                  rx="24"
                  fill="#ffffff"
                />
                {entries.map(([label, value], index) => {
                  const y = 28 + index * 64;
                  const width = (value / maxValue) * 236;
                  const percentage = total === 0 ? 0 : value / total;

                  return (
                    <g key={label}>
                      <text
                        x="24"
                        y={y}
                        fontSize="14"
                        fontFamily="Arial, Helvetica, sans-serif"
                        fill="#4d4d4d"
                      >
                        {formatLifecycleStage(label)}
                      </text>
                      <text
                        x="296"
                        y={y}
                        textAnchor="end"
                        fontSize="14"
                        fontFamily="Arial, Helvetica, sans-serif"
                        fill="#1c1c1c"
                      >
                        {formatPercent(percentage)}
                      </text>
                      <rect
                        x="24"
                        y={y + 14}
                        width="236"
                        height="14"
                        rx="7"
                        fill="#efe8e3"
                      />
                      <rect
                        x="24"
                        y={y + 14}
                        width={width}
                        height="14"
                        rx="7"
                        fill={index === 0 ? "#ff5710" : "#1c1c1c"}
                        opacity={index === 0 ? "1" : `${0.86 - index * 0.1}`}
                      />
                    </g>
                  );
                })}
              </>
            )}
      </svg>

      <svg
        viewBox="0 0 640 340"
        className="hidden h-auto w-full md:block"
        aria-hidden="true"
        focusable="false"
      >
        {entries.length === 0
          ? renderEmptyState(640, 340, "No hay datos disponibles.")
          : (
              <>
                <rect x="0" y="0" width="640" height="340" rx="28" fill="#ffffff" />
                <line
                  x1="120"
                  y1="48"
                  x2="120"
                  y2="282"
                  stroke="#d7cec7"
                  strokeWidth="2"
                />
                <line
                  x1="120"
                  y1="282"
                  x2="584"
                  y2="282"
                  stroke="#d7cec7"
                  strokeWidth="2"
                />

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
                        {formatLifecycleStage(label)}
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
              </>
            )}
      </svg>
    </figure>
  );
}
