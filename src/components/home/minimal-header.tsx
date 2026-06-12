import Image from "next/image";

export function MinimalHeader() {
  return (
    <header className="flex min-h-14 items-center justify-between py-1">
      <div className="inline-flex items-center px-1 py-1">
        <Image
          src="/brands/footprint-mappa/logo-gradient-mappa-ui.png"
          alt="Footprint Mappa"
          width={128}
          height={46}
          priority
          className="h-8 w-auto sm:h-9"
          style={{ width: "auto" }}
        />
      </div>
    </header>
  );
}
