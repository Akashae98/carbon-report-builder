import type { ReportStageBreakdownItem } from "@/types";

interface PrintStageBreakdownChartProps {
  items: ReportStageBreakdownItem[];
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
  items,
}: PrintStageBreakdownChartProps) {
  const maxValue = Math.max(...items.map(({ total }) => total), 1);
  const mobileHeight = Math.max(items.length * 64 + 48, 190);

  return (
    <figure aria-labelledby="stage-breakdown-caption">
      <figcaption id="stage-breakdown-caption" className="sr-only">
        Distribucion de emisiones por etapa del ciclo de vida.
      </figcaption>

      <svg
        viewBox={`0 0 320 ${mobileHeight}`}
        className="h-auto w-full md:hidden"
        aria-hidden="true"
        focusable="false"
      >
        {items.length === 0
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
                {items.map((item, index) => {
                  const y = 28 + index * 64;
                  const width = (item.total / maxValue) * 236;

                  return (
                    <g key={item.stage}>
                      <text
                        x="24"
                        y={y}
                        fontSize="14"
                        fontFamily="Arial, Helvetica, sans-serif"
                        fill="#4d4d4d"
                      >
                        {item.label}
                      </text>
                      <text
                        x="296"
                        y={y}
                        textAnchor="end"
                        fontSize="14"
                        fontFamily="Arial, Helvetica, sans-serif"
                        fill="#1c1c1c"
                      >
                        {item.shareLabel}
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
        {items.length === 0
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

                {items.map((item, index) => {
                  const y = 72 + index * 42;
                  const width = (item.total / maxValue) * 420;

                  return (
                    <g key={item.stage}>
                      <text
                        x="108"
                        y={y + 14}
                        textAnchor="end"
                        fontSize="13"
                        fontFamily="Arial, Helvetica, sans-serif"
                        fill="#4d4d4d"
                      >
                        {item.label}
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
                        {item.shareLabel}
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
