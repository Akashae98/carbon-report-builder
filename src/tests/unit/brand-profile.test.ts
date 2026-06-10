import { describe, expect, it } from "vitest";

import {
  DEFAULT_BRAND_ID,
  brandProfiles,
  getBrandProfile,
} from "@/lib/branding";

describe("brand profile resolution", () => {
  it("resolves the Relats brand profile", () => {
    const brand = getBrandProfile("relats");

    expect(brand).toEqual(brandProfiles.relats);
    expect(brand.id).toBe(DEFAULT_BRAND_ID);
    expect(brand.name).toBe("Relats");
  });

  it("falls back to Relats for missing or unknown brand ids", () => {
    expect(getBrandProfile()).toEqual(brandProfiles.relats);
    expect(getBrandProfile("unknown")).toEqual(brandProfiles.relats);
  });
});
