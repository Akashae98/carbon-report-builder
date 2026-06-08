import { readFileSync } from "node:fs";
import { join } from "node:path";

export function readSamplePcfCsv() {
  return readFileSync(
    join(process.cwd(), "docs", "assets", "sample_pcf_iso_14067.csv"),
    "utf8",
  );
}
