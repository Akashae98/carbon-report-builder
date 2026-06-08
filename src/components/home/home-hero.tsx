import type { ReactNode } from "react";

const workflowSteps = [
  {
    shortLabel: "Subir",
    fullLabel: "1. Subir CSV",
    tone: "coral" as const,
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
      </svg>
    ),
  },
  {
    shortLabel: "Vista previa",
    fullLabel: "2. Generar vista previa",
    tone: "violet" as const,
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h9l5 5v13H6z" />
        <path d="M15 3v6h6" />
        <path d="M9 13h6" />
        <path d="M9 17h6" />
      </svg>
    ),
  },
  {
    shortLabel: "PDF",
    fullLabel: "3. Exportar PDF",
    tone: "coral" as const,
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h9l5 5v13H6z" />
        <path d="M15 3v6h6" />
        <path d="M8 14h8" />
        <path d="M8 18h5" />
      </svg>
    ),
  },
];

function WorkflowStep({
  icon,
  label,
  tone = "coral",
  isLast = false,
}: {
  icon: ReactNode;
  label: string;
  tone?: "coral" | "violet";
  isLast?: boolean;
}) {
  const iconTone =
    tone === "violet"
      ? "bg-[#f3efff] text-[#7450d7] ring-[#e4daf9]"
      : "bg-[#fff5f2] text-[#ff6c4d] ring-[#ffe0d6]";

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-3 whitespace-nowrap rounded-full bg-white/92 px-3 py-2 ring-1 ring-black/6 shadow-[0_8px_18px_rgba(34,25,58,0.04)]">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${iconTone}`}
        >
          {icon}
        </span>
        <span className="text-sm font-medium text-[#40345f]">{label}</span>
      </div>
      {!isLast ? (
        <span className="hidden text-[#9b92ad] md:inline-flex" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </span>
      ) : null}
    </div>
  );
}

export function HomeHero() {
  return (
    <div className="max-w-[39rem]">
      <h1 className="max-w-[12ch] text-balance text-[2.35rem] font-semibold tracking-[-0.065em] text-[#22193a] sm:text-[3.05rem] lg:max-w-none lg:text-[3.2rem] lg:leading-[1.01]">
        Genera informes
        <br />
        de huella de carbono
      </h1>

      <p className="mt-4 max-w-[32rem] text-[0.96rem] leading-7 text-[#655d73] sm:text-[1.02rem]">
        Sube un archivo PCF y revisa la vista previa antes de exportar el
        informe.
      </p>

      <ol className="relative mt-5 grid grid-cols-3 gap-3 sm:hidden">
        <span
          aria-hidden="true"
          className="absolute left-[16.66%] right-[16.66%] top-4 h-px bg-[#ddd5eb]"
        />
        {workflowSteps.map((step, index) => (
          <li
            key={step.fullLabel}
            className="relative flex min-w-0 flex-col items-center gap-2 text-center"
          >
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white text-[0.82rem] font-semibold ${
                step.tone === "violet"
                  ? "border-[#d9cef4] text-[#7450d7]"
                  : "border-[#ffd8ce] text-[#ff6c4d]"
              }`}
            >
              {index + 1}
            </span>
            <span className="text-[0.72rem] font-medium leading-4 text-[#574d6b]">
              {step.shortLabel}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-5 hidden flex-wrap items-center gap-2.5 sm:flex lg:flex-nowrap">
        {workflowSteps.map((step, index) => (
          <WorkflowStep
            key={step.fullLabel}
            label={step.fullLabel}
            tone={step.tone}
            isLast={index === workflowSteps.length - 1}
            icon={step.icon}
          />
        ))}
      </div>
    </div>
  );
}
