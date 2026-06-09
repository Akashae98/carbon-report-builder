import type { ReactNode } from "react";

interface ReportDataTableColumn<TItem> {
  key: string;
  header: string;
  align?: "left" | "right";
  render: (item: TItem) => ReactNode;
}

interface ReportDataTableProps<TItem> {
  columns: Array<ReportDataTableColumn<TItem>>;
  items: TItem[];
}

export function ReportDataTable<TItem>({
  columns,
  items,
}: ReportDataTableProps<TItem>) {
  return (
    <div className="overflow-hidden rounded-[1.1rem] border border-black/8">
      <table className="w-full border-collapse bg-white text-sm">
        <thead>
          <tr className="bg-[var(--report-panel)] text-left">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/55 ${
                  column.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, rowIndex) => (
            <tr key={rowIndex} className="border-t border-black/8">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 align-top text-black/75 ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
