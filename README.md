# Carbon Report Builder

MVP to transform PCF datasets into professional reports through a complete
flow:

`PCF CSV -> web preview -> PDF export`

The project prioritizes a verifiable and deployable delivery before building a
broader SaaS platform.

## What it is

The project generates a product carbon footprint report from a CSV that
contains already calculated PCF values. The application:

- validates the file structure
- normalizes the data
- derives readable metrics
- renders a report preview
- allows the user to download a PDF with preset-based visual branding

The public Vercel demo is available at:

`https://carbon-report-builder.vercel.app/`

## Current flow

- Select the visual preset that will be applied to the generated report
- Upload a PCF CSV from the UI
- Validate required headers, mandatory fields, and non-negative numeric values
- Generate a server-rendered report preview
- Export the final report as PDF

Optional helper:

- Download a sample CSV from the Home page

## Scope

Included in the MVP:

- PCF runtime flow
- configurable persistence with Xano or `filesystem`
- PDF rendered from the same HTML/CSS view reviewed by the user
- unit and integration tests with Vitest

Out of scope for now:

- authentication and multi-user support
- analytics dashboard
- complete report history
- longitudinal comparisons
- full branding editor
- operational OCF runtime
- certified PCF calculation engine

`brand_id` represents a visual preset, not a real tenant or authorization
boundary. `createdAt` is the report generation date, not the dataset period.

## Deployment and persistence

Persistence is configured through `REPORT_JOB_STORE_DRIVER`.

- Locally, the app can use Xano or `filesystem`.
- `filesystem` is the default for development, tests, and offline demos.
- The target hosted deployment uses Xano-backed persistence.

The application already supports server-to-server authentication with
`X-API-Key` for the Xano integration when `XANO_API_KEY` is configured.
Effective access validation in Xano, rate limiting, and abuse control are still
outside the MVP scope and remain later production-oriented work.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- PapaParse
- Puppeteer / `puppeteer-core`
- Sparticuz Chromium for Vercel
- Vitest
- Xano for hosted persistence

## Quick start

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

Environment variables, persistence, and deployment details are documented in
the technical documentation.

## Documentation

- [Short delivery README](docs/delivery-readme.md)
- [Build / reuse / buy research](docs/research.md)
- [Local setup](docs/setup.md)
- [Vercel and Xano deployment](docs/deployment.md)
- [Architecture](docs/02-architecture.md)
- [Data model](docs/03-data-model.md)
- [Implementation status](docs/06-implementation-plan.md)
- [Full documentation index](docs/README.md)

## Brands and visual assets

Third-party names, logos, and visual assets are used only as demonstration
material within the context of this technical challenge. Their inclusion does
not imply affiliation, sponsorship, or any transfer of trademark rights.

These assets are not part of any code license and should be replaced or used
only with explicit authorization before any commercial or public reuse of the
project.
