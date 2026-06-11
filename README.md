# Carbon Report Builder

Local MVP for generating client-branded carbon footprint report previews and PDF-ready outputs from PCF CSV datasets.

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- Vitest
- Puppeteer for local PDF generation

## Current Scope
- PCF-only runtime flow
- CSV upload endpoint under `api/reports/upload`
- Report preview route under `reports/[jobId]`
- Local filesystem job store under `.tmp/reports`
- Optional Xano-backed report job store for hosted MVP deployments
- PDF route under `api/reports/pdf/[jobId]`
- Local client branding presets for report preview and PDF surfaces
- Relats remains the default demo client branding

## Local Demo Mode
Local development uses filesystem persistence by default.

```bash
npm run dev
npm run lint
npm run test
npm run build
```

Default local behavior:
- `REPORT_JOB_STORE_DRIVER` can be omitted or set to `filesystem`.
- Report jobs are written to `.tmp/reports`.
- PDF generation uses local Puppeteer by default.
- No Xano or Vercel services are required.
- This storage is intended for local development and demos, not as durable hosted persistence.

Changing the configured driver does not migrate existing report jobs. Jobs created
with the filesystem driver remain in `.tmp/reports`, while jobs created with the
Xano driver remain in Xano.

## Hosted MVP Mode: Vercel + Xano
Phase 1 hosted support covers the homepage, PCF CSV upload, Xano persistence,
and persisted report previews. Set these environment variables in Vercel:

```bash
REPORT_JOB_STORE_DRIVER=xano
XANO_REPORT_JOBS_ENDPOINT=https://your-xano-instance/api:group/report_jobs
XANO_API_KEY=your_xano_api_key
APP_URL=https://your-vercel-app.vercel.app
PDF_BROWSER_DRIVER=vercel
```

Optional / compatibility variables:
- `XANO_BASE_URL`: useful project reference for setup notes; the app uses the concrete `XANO_REPORT_JOBS_ENDPOINT`.
- `XANO_REPORTS_ENDPOINT`: temporary legacy fallback if already configured.
- `NEXT_PUBLIC_APP_URL`: not required for the hosted upload and preview flow.
- `CHROMIUM_EXECUTABLE_PATH`: reserved for future hosted PDF validation.

Do not rely on `.tmp/reports` in hosted mode. Vercel filesystem state is not durable across invocations.

Keep `XANO_API_KEY` as a server-only environment variable. Do not add a
`NEXT_PUBLIC_` prefix, commit a real key, or copy values from `.env.local` into
this README.

CSV uploads are limited to 4 MB so the multipart request remains below Vercel's
function payload limit. Temporary Xano write failures return a controlled
service-unavailable response, and preview read failures show a retry page.

## Xano Report Jobs Schema
Expected table: `report_jobs`

Columns:
- `id`: text/string report id
- `brand_id`: text/string
- `report_type`: text/string
- `status`: text/string
- `source_file_name`: text/string
- `total_emissions`: number/decimal
- `dominant_stage`: text/string
- `payload_json`: JSON containing the full serialized `ReportJobRecord`
- `created_at`: datetime or ISO timestamp string

`payload_json` contains the normalized dataset, derived metrics, report
definition, upload metadata, and selected brand preset. This allows a persisted
report to be reopened and its PDF to be regenerated.

`created_at` is the report generation timestamp. It is not the reporting period
represented by the source dataset and must not be used as a substitute for a
dataset period in future comparisons.

Expected API group routes:
- `GET /report_jobs/{id}`
- `POST /report_jobs`
- `PATCH /report_jobs/{id}`
- `PUT /report_jobs/{id}`
- `DELETE /report_jobs/{id}`

The current adapter uses `PUT /report_jobs/{id}` for `write(job)` as an upsert/replace operation. If the deployed Xano endpoint does not support PUT as upsert, only `src/lib/jobs/xano-report-job-store.ts` should need to change.

## Report History and Comparison
The current schema stores enough information to support a future report history:
- report id and generation timestamp
- selected brand preset
- report type and status
- source filename
- summary emissions values
- the complete serialized report job

The application does not currently provide report history, listing, filtering,
or comparison APIs or UI.

Meaningful comparison is future work because the current PCF CSV does not include
a reporting period. When that feature is introduced, report metadata should add
an optional human-readable dataset label and structured period fields such as
`period_start` and `period_end`. Existing reports without period metadata should
not be presented as chronologically comparable.

## PDF Hosting Note
Local PDF generation remains the default and uses Puppeteer.

During hosted Phase 1, `PDF_BROWSER_DRIVER=vercel` intentionally disables PDF
generation and returns a controlled `503` response. It does not launch Chromium.

Vercel PDF generation remains a separate Phase 2 validation risk. The codebase
includes a Vercel browser adapter using `puppeteer-core` and
`@sparticuz/chromium-min`, but its binary provisioning and version compatibility
must be resolved and validated in a deployed environment before hosted PDF
exports are enabled.

PDF regeneration uses the current application renderer, branding assets, and
layout. It recreates a report from persisted data, but it is not an archival
guarantee that the output will remain pixel-identical after future application
changes.

## Branding Direction
- Carbon Report Builder is the repository/project name.
- Footprint Mappa remains the application/provider brand in the current UI and PDF footer.
- Report preview and PDF surfaces use client-specific branding.
- Relats and Demo Industrial are local demo client presets, not authenticated tenant accounts.
- `brand_id` identifies one of these visual presets; it is not an authorization or tenant-isolation boundary.

## Project Structure
- `src/app`: routes and server entrypoints
- `src/components`: dashboard, upload, report, and chart components
- `docs`: project documentation, report references, and sample source files
- `src/lib/pcf`: PCF domain layers
- `src/lib/reporting`: shared rendering and PDF-related modules
- `src/lib/jobs`: report job store implementations
- `src/types`: shared types
