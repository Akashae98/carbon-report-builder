# Deployment Notes

This document covers the production Vercel and Xano deployment. See `setup.md`
for local development with filesystem or Xano persistence.

## Production mode: Vercel + Xano

Public demo URL: `https://carbon-report-builder.vercel.app/`

The production deployment uses these environment variables in Vercel:

```bash
REPORT_JOB_STORE_DRIVER=xano
XANO_REPORT_JOBS_ENDPOINT=https://your-xano-instance/api:group/report_jobs
APP_URL=https://your-vercel-app.vercel.app
PDF_BROWSER_DRIVER=vercel
# XANO_API_KEY=your_xano_api_key
```

Optional / compatibility variables:

- `XANO_BASE_URL`: project reference for setup notes; the app uses the concrete
  `XANO_REPORT_JOBS_ENDPOINT`.
- `XANO_REPORTS_ENDPOINT`: temporary legacy fallback if already configured.
- `NEXT_PUBLIC_APP_URL`: not required for the hosted upload and preview flow.

Do not rely on `.tmp/reports` in hosted mode. Vercel filesystem state is not
durable across invocations.

Keep `XANO_API_KEY` as a server-only environment variable. Do not add a
`NEXT_PUBLIC_` prefix, commit a real key, or copy values from `.env.local` into
documentation. Configure different keys for Production, Preview, and local
development, rotate them if they are exposed, and use HTTPS for every Xano
endpoint.

CSV uploads are limited to 4 MB so the multipart request remains below Vercel's
function payload limit. Temporary Xano write failures return a controlled
service-unavailable response, and preview read failures show a retry page.

The application already supports sending `X-API-Key` to Xano as a server-to-
server credential when `XANO_API_KEY` is configured. At the moment, the full
hardening of the environment is still pending in Xano itself: access validation,
rate limiting, and abuse control remain outside the MVP scope and belong to
later production-oriented iterations.

## Recommended Xano API key hardening

Before relying on `XANO_API_KEY` for protection, configure every Xano
`report_jobs` endpoint to validate the same private server-to-server key. This
is not a user login token and not a Xano Metadata API token.

Generate it as a long random secret, store it in Vercel as `XANO_API_KEY`, and
store the same value in Xano as an environment variable named
`XANO_REPORT_JOBS_API_KEY`.

Scope the key and API group to the minimum required `report_jobs` operations.
Do not reuse a Xano account password, Metadata API token, or production key in
Preview/local environments.

When configured, the app sends the secret to Xano on every report job request
using both headers:

- `X-API-Key: <XANO_API_KEY>`
- `Authorization: Bearer <XANO_API_KEY>`

In Xano, add the first validation step to every external `report_jobs` endpoint:

- read the incoming `X-API-Key` request header
- compare it with the Xano environment variable `XANO_REPORT_JOBS_API_KEY`
- return `401 Unauthorized` if the header is missing or does not match
- continue to the database logic only when the key matches

Apply this protection to:

- `GET /report_jobs/{id}`
- `POST /report_jobs`
- `PATCH /report_jobs/{id}`
- `PUT /report_jobs/{id}`
- `DELETE /report_jobs/{id}`

If Xano middleware is available on the plan, prefer a shared middleware for this
check. Otherwise, duplicate the same first validation step in each endpoint.

Additional Xano hardening before launch:

- delete unused auto-generated CRUD endpoints, or disable External Access
- set the API group Swagger/OpenAPI docs to Private or Disabled
- restrict CORS to the Vercel production and preview origins where practical;
  CORS is defense in depth and does not replace API-key validation
- review Xano Request History after deployment for unexpected direct traffic
- redact secrets and uploaded report data from application and request logs

## Xano report jobs schema

Expected table: `report_jobs`

Columns:

- `id`: text/string report id
- `brand_id`: text/string visual preset id
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

Treat `payload_json` as potentially confidential business data. Define retention
and deletion rules, restrict table/API access, and do not include personal data
unless the product has an explicit legal and security basis for processing it.

`created_at` is the report generation timestamp. It is not the reporting period
represented by the source dataset and must not be used as a substitute for a
dataset period in future comparisons.

The current adapter uses `PUT /report_jobs/{id}` for `write(job)` as an
upsert/replace operation. If the deployed Xano endpoint does not support PUT as
upsert, only `src/lib/jobs/xano-report-job-store.ts` should need to change.

## PDF hosting note

Local PDF generation uses the full Puppeteer package. Hosted PDF generation uses
`puppeteer-core@25.1.0` with `@sparticuz/chromium@149.0.0`.

For Vercel Preview deployments, `APP_URL` can be omitted so PDF generation uses
the request origin for that deployment. Production should set `APP_URL` to the
stable production domain.

If Preview Deployment Protection is enabled, configure Protection Bypass for
Automation in the Vercel project. Vercel then provides the server-only
`VERCEL_AUTOMATION_BYPASS_SECRET`, which the PDF browser sends as the official
bypass header. Do not create a `NEXT_PUBLIC_` copy of this secret.

PDF regeneration uses the current application renderer, branding assets, and
layout. It recreates a report from persisted data, but it is not an archival
guarantee that the output will remain pixel-identical after future application
changes.

## Hosted validation checklist

- Upload a PCF CSV and confirm the Xano report job.
- Open the persisted report preview.
- Download the PDF once cold and once warm.
- Verify the `200` response, `application/pdf` content type, and branded
  filename.
- Verify logos, charts, page count, and report layout.
- Confirm the PDF is below Vercel's 4.5 MB response limit.
- Confirm Vercel logs contain no Chromium, timeout, memory, or asset-loading
  errors.
- Confirm direct Xano requests without `X-API-Key` return `401`.
- Confirm direct Xano requests with a wrong `X-API-Key` return `401`.
