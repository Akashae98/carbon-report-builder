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

## Hosted MVP Mode: Vercel + Xano
Set these environment variables in Vercel when testing hosted upload + preview:

```bash
REPORT_JOB_STORE_DRIVER=xano
XANO_REPORT_JOBS_ENDPOINT=https://your-xano-instance/api:group/report_jobs
XANO_API_KEY=your_xano_api_key
APP_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
```

Optional / compatibility variables:
- `XANO_BASE_URL`: useful project reference for setup notes; the app uses the concrete `XANO_REPORT_JOBS_ENDPOINT`.
- `XANO_REPORTS_ENDPOINT`: temporary legacy fallback if already configured.
- `PDF_BROWSER_DRIVER=vercel`: only enable after separately validating serverless Chromium/Puppeteer on Vercel.
- `CHROMIUM_EXECUTABLE_PATH`: only when the serverless Chromium package requires an explicit binary path.

Do not rely on `.tmp/reports` in hosted mode. Vercel filesystem state is not durable across invocations.

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

Expected API group routes:
- `GET /report_jobs/{id}`
- `POST /report_jobs`
- `PATCH /report_jobs/{id}`
- `PUT /report_jobs/{id}`
- `DELETE /report_jobs/{id}`

The current adapter uses `PUT /report_jobs/{id}` for `write(job)` as an upsert/replace operation. If the deployed Xano endpoint does not support PUT as upsert, only `src/lib/jobs/xano-report-job-store.ts` should need to change.

## PDF Hosting Note
Local PDF generation remains the default and uses Puppeteer.

Vercel PDF generation is a separate validation risk. The codebase includes a Vercel browser adapter using `puppeteer-core` and `@sparticuz/chromium-min`, but it should be validated in a deployed environment before relying on hosted PDF exports.

## Branding Direction
- Carbon Report Builder is the repository/project name.
- Footprint Mappa remains the application/provider brand in the current UI and PDF footer.
- Report preview and PDF surfaces use client-specific branding.
- Relats and Demo Industrial are local demo client presets, not authenticated tenant accounts.

## Project Structure
- `src/app`: routes and server entrypoints
- `src/components`: dashboard, upload, report, and chart components
- `docs`: project documentation, report references, and sample source files
- `src/lib/pcf`: PCF domain layers
- `src/lib/reporting`: shared rendering and PDF-related modules
- `src/lib/jobs`: report job store implementations
- `src/types`: shared types
