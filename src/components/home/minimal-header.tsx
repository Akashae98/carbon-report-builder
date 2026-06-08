function MappaLogoMark() {
  const squares = [
    "bg-[#ff8a7d]",
    "bg-[#f8a162]",
    "bg-[#e69bc1]",
    "bg-[#b47cf2]",
    "bg-[#ffb3a4]",
    "bg-[#db8dff]",
  ];

  return (
    <span className="grid grid-cols-3 gap-1" aria-hidden="true">
      {squares.map((className, index) => (
        <span
          key={`${className}-${index}`}
          className={`h-2.5 w-2.5 rounded-[4px] ${className} ${
            index === 0 ? "translate-y-3" : ""
          } ${index === 1 ? "translate-y-1.5" : ""} ${
            index === 3 ? "-translate-y-1.5" : ""
          } ${index === 4 ? "-translate-y-3" : ""}`}
        />
      ))}
    </span>
  );
}

export function MinimalHeader() {
  return (
    <header className="flex items-center justify-between py-1">
      <div className="inline-flex items-center gap-3 rounded-full bg-white/74 px-3.5 py-2 shadow-[0_8px_20px_rgba(34,25,58,0.04)] ring-1 ring-black/5 backdrop-blur">
        <MappaLogoMark />
        <span className="text-[0.95rem] font-semibold tracking-[-0.02em] text-[#4a3d69]">
          Mappa
        </span>
      </div>
    </header>
  );
}
