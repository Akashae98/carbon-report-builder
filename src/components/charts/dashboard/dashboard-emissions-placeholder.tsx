"use client";

import { useState } from "react";

const stages = [
  { key: "Materials", value: 41 },
  { key: "Manufacturing", value: 24 },
  { key: "Transport", value: 18 },
  { key: "Use", value: 11 },
  { key: "End of life", value: 6 },
];

export function DashboardEmissionsPlaceholder() {
  const [activeStage, setActiveStage] = useState(stages[0].key);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {stages.map((stage) => {
          const isActive = stage.key === activeStage;

          return (
            <button
              key={stage.key}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--app-accent-1)] text-[#041282]"
                  : "border border-white/12 bg-white/6 text-[var(--muted)] hover:bg-white/10"
              }`}
              type="button"
              onClick={() => setActiveStage(stage.key)}
            >
              {stage.key}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3">
        {stages.map((stage) => {
          const isActive = stage.key === activeStage;

          return (
            <div key={stage.key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={isActive ? "text-white" : "text-[var(--muted)]"}>
                  {stage.key}
                </span>
                <span className={isActive ? "text-white" : "text-[var(--muted)]"}>
                  {stage.value}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/8">
                <div
                  className={`h-full rounded-full transition-all ${
                    isActive ? "bg-[var(--app-accent-2)]" : "bg-white/18"
                  }`}
                  style={{ width: `${stage.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
