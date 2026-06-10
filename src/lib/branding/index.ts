export type BrandId = "relats";

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
} as const satisfies Record<BrandId, BrandProfile>;

export function getBrandProfile(brandId?: string): BrandProfile {
  if (brandId && brandId in brandProfiles) {
    return brandProfiles[brandId as BrandId];
  }

  return brandProfiles[DEFAULT_BRAND_ID];
}
