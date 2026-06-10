export type BrandId = "relats" | "demo-industrial";

export const DEFAULT_BRAND_ID: BrandId = "relats";

export interface BrandProfile {
  id: BrandId;
  name: string;
  logoPath: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  reportTitle: string;
  reportSubtitle: string;
  providerName: string;
  providerLogoPath: string;
}

export interface BrandOption {
  id: BrandId;
  name: string;
  primaryColor: string;
  logoPath: string;
}

export const brandProfiles = {
  relats: {
    id: "relats",
    name: "Relats",
    logoPath: "/brands/relats/logo-relats.png",
    primaryColor: "#ff5710",
    secondaryColor: "#eae4df",
    textColor: "#1c1c1c",
    reportTitle: "Informe de huella de carbono de producto",
    reportSubtitle: "Síntesis ejecutiva de resultados PCF para Relats",
    providerName: "Footprint Mappa",
    providerLogoPath: "/brands/footprint-mappa/footprint_mapa_logo.png",
  },
  "demo-industrial": {
    id: "demo-industrial",
    name: "Demo Industrial",
    logoPath: "/brands/demo-industrial/logo-demo-industrial.svg",
    primaryColor: "#2563eb",
    secondaryColor: "#dbeafe",
    textColor: "#172033",
    reportTitle: "Informe de huella de carbono de producto",
    reportSubtitle: "Síntesis ejecutiva de resultados PCF para Demo Industrial",
    providerName: "Footprint Mappa",
    providerLogoPath: "/brands/footprint-mappa/footprint_mapa_logo.png",
  },
} as const satisfies Record<BrandId, BrandProfile>;

export const brandOptions: BrandOption[] = Object.values(brandProfiles).map(
  ({ id, name, primaryColor, logoPath }) => ({
    id,
    name,
    primaryColor,
    logoPath,
  }),
);

export function isBrandId(value: unknown): value is BrandId {
  return typeof value === "string" && value in brandProfiles;
}

export function getBrandProfile(brandId?: string): BrandProfile {
  if (isBrandId(brandId)) {
    return brandProfiles[brandId];
  }

  return brandProfiles[DEFAULT_BRAND_ID];
}
