import { describe, expect, it } from "vitest";

import {
  DEFAULT_BRAND_ID,
  brandOptions,
  brandProfiles,
  getBrandProfile,
  isBrandId,
} from "@/lib/branding";

describe("brand profile resolution", () => {
  it("resolves the Relats brand profile", () => {
    const brand = getBrandProfile("relats");

    expect(brand).toEqual(brandProfiles.relats);
    expect(brand.id).toBe(DEFAULT_BRAND_ID);
    expect(brand.name).toBe("Relats");
  });

  it("resolves the Demo Industrial brand profile", () => {
    const brand = getBrandProfile("demo-industrial");

    expect(brand).toEqual(brandProfiles["demo-industrial"]);
    expect(brand.name).toBe("Demo Industrial");
    expect(brand.logoPath).toBe(
      "/brands/demo-industrial/logo-demo-industrial.svg",
    );
    expect(brand.primaryColor).toBe("#2563eb");
  });

  it("exposes local brand options for the upload selector", () => {
    expect(brandOptions.map((brand) => brand.id)).toEqual([
      "relats",
      "demo-industrial",
    ]);
  });

  it("identifies supported brand ids", () => {
    expect(isBrandId("relats")).toBe(true);
    expect(isBrandId("demo-industrial")).toBe(true);
    expect(isBrandId("unknown")).toBe(false);
    expect(isBrandId(null)).toBe(false);
  });

  it("falls back to Relats for missing or unknown brand ids", () => {
    expect(getBrandProfile()).toEqual(brandProfiles.relats);
    expect(getBrandProfile("unknown")).toEqual(brandProfiles.relats);
  });
});
