const compactFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  notation: "compact",
});

const percentFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
  style: "percent",
});

export function formatCompactNumber(value: number) {
  return compactFormatter.format(value);
}

export function formatPercent(value: number) {
  return percentFormatter.format(value);
}
