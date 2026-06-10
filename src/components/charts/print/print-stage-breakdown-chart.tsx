import type { ReportStageBreakdownItem } from "@/types";

interface PrintStageBreakdownChartProps {
  items: ReportStageBreakdownItem[];
}

function renderEmptyState(width: number, height: number, label: string) {
  return (
    <>
      <rect x="0" y="0" width={width} height={height} fill="#ffffff" />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        fontSize="13"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#6d6a67"
      >
        {label}
      </text>
    </>
  );
}

function getBarColor(isDominant: boolean, index: number) {
  if (isDominant) {
    return "#ff5710";
  }

  return index % 2 === 0 ? "#595959" : "#7a7a7a";
}

export function PrintStageBreakdownChart({
  items,
}: PrintStageBreakdownChartProps) {
  const maxValue = Math.max(...items.map(({ total }) => total), 1);
  const dominantStage = items.reduce<ReportStageBreakdownItem | null>(
    (current, item) =>
      current === null || item.total > current.total ? item : current,
    null,
  )?.stage;
  const mobileHeight = Math.max(items.length * 46 + 30, 160);
  const desktopHeight = Math.max(items.length * 30 + 54, 210);

  return (
    <figure aria-labelledby="stage-breakdown-caption">
      <figcaption id="stage-breakdown-caption" className="sr-only">
        Distribución de emisiones por etapa del ciclo de vida.
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
                <rect x="0" y="0" width="320" height={mobileHeight} fill="#ffffff" />
                {items.map((item, index) => {
                  const y = 22 + index * 46;
                  const width = (item.total / maxValue) * 170;
                  const isDominant = item.stage === dominantStage;

                  return (
                    <g key={item.stage}>
                      <text
                        x="0"
                        y={y}
                        fontSize="12"
                        fontFamily="Arial, Helvetica, sans-serif"
                        fill="#3f3f3f"
                      >
                        {item.label}
                      </text>
                      <rect
                        x="0"
                        y={y + 10}
                        width="185"
                        height="6"
                        rx="2"
                        fill="#eee9e5"
                      />
                      <rect
                        x="0"
                        y={y + 10}
                        width={width}
                        height="6"
                        rx="2"
                        fill={getBarColor(isDominant, index)}
                      />
                      <text
                        x="300"
                        y={y + 16}
                        textAnchor="end"
                        fontSize="12"
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

      <svg
        viewBox={`0 0 640 ${desktopHeight}`}
        className="hidden h-auto w-full md:block"
        aria-hidden="true"
        focusable="false"
      >
        {items.length === 0
          ? renderEmptyState(640, desktopHeight, "No hay datos disponibles.")
          : (
              <>
                <rect x="0" y="0" width="640" height={desktopHeight} fill="#ffffff" />
                {items.map((item, index) => {
                  const y = 34 + index * 30;
                  const width = (item.total / maxValue) * 340;
                  const isDominant = item.stage === dominantStage;

                  return (
                    <g key={item.stage}>
                      <text
                        x="118"
                        y={y + 4}
                        textAnchor="end"
                        fontSize="12"
                        fontFamily="Arial, Helvetica, sans-serif"
                        fill="#3f3f3f"
                      >
                        {item.label}
                      </text>
                      <rect
                        x="140"
                        y={y - 5}
                        width="360"
                        height="8"
                        rx="2"
                        fill="#eee9e5"
                      />
                      <rect
                        x="140"
                        y={y - 5}
                        width={width}
                        height="8"
                        rx="2"
                        fill={getBarColor(isDominant, index)}
                      />
                      <text
                        x="568"
                        y={y + 4}
                        textAnchor="end"
                        fontSize="12"
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
