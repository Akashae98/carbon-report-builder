# Technology Survey: Build / Reuse / Buy

The technical decisions were evaluated against the needs of this challenge and
what I decided to create:
deliver a complete PCF CSV -> preview -> PDF flow, keep preview and PDF
consistent, support local development, and provide durable hosted persistence
without building unnecessary infrastructure.

## Application Framework

### Options considered

- Next.js with React.
- Vite + React.

### Decision

Next.js was selected because it fit the shape and delivery constraints of this
MVP:

- App Router provides UI pages, dynamic report routes, and server endpoints in
  one project.
- Server rendering allows `reports/[jobId]` to load persisted data before
  producing the report HTML.
- Route handlers support CSV upload and PDF generation without introducing a
  separate API project.
- Puppeteer can navigate to the same server-rendered report route used by the
  browser preview.
- The framework has a direct deployment path to Vercel.

Vite + React would have provided a lightweight frontend setup and a familiar
React development experience. However, additional decisions and integration
work would still have been required for server-side rendering, API endpoints,
persisted report routes, and the server-side PDF workflow.

Next.js already provided those capabilities within one framework, reducing
integration effort and deployment complexity for this challenge.

Although I had prior experience with Angular during my DAW studies, it was not part of the primary evaluation because the challenge guidance focused on frameworks with integrated SSR and closer to Next.js.

## PDF Generation

### Options considered

- Puppeteer/Chromium.
- React-PDF.
- PDFKit.

### Decision

Puppeteer was selected so the preview and exported PDF could share the same
React components, HTML, CSS, data, and branding rules. This reduces divergence
between what the user reviews and what is downloaded.

For local development, the project uses the full Puppeteer package with its
local Chromium runtime. The hosted MVP required a serverless-compatible
alternative, so the Vercel deployment uses `puppeteer-core` with Sparticuz
Chromium. This preserves the same HTML/CSS rendering pipeline in both
environments while allowing PDF generation inside Vercel Functions.

The accepted trade-off is operational complexity: Chromium increases package
size, cold-start cost, and serverless deployment requirements. React-PDF would
provide a React-oriented PDF document model, while PDFKit would provide
low-level drawing control, but either approach would require a second report
renderer and separate layout maintenance. The additional runtime complexity was
accepted to keep the preview and exported document on the same rendering path.

## Persistence

### Options considered

- Local filesystem.
- Xano.
- PostgreSQL or Supabase.

### Decision

The application uses a swappable persistence adapter:

- Filesystem is the local default because it requires no external service and
  supports development, tests, and offline demos.
- Xano is used by the hosted MVP because Vercel filesystem state is not durable
  and Xano provides managed storage and API endpoints with limited setup.

PostgreSQL or Supabase would provide stronger relational querying, migrations,
constraints, and a clearer path toward report history and multi-user features.
They were not necessary for the current single-record lookup flow and would
have increased setup and schema-management work during the challenge.

Persistence was not considered a differentiating capability of this MVP.
Therefore, a managed service was preferred over investing challenge time in a
custom persistence backend, database infrastructure, migration tooling, and
backend administration.

The Xano choice optimizes delivery speed rather than defining the permanent
data architecture. API-key validation, retention rules, and access controls
remain explicit hardening work.

## Hosting

### Options considered

- Vercel.
- Self-managed or container-based infrastructure.

### Decision

Vercel was selected for its direct Next.js deployment workflow and low
operational overhead. It was appropriate for validating the complete hosted
flow within the available time.

The final hosted flow was deployed and validated on Vercel with Xano
persistence and serverless PDF generation.

The accepted constraints are ephemeral filesystem state, function payload and
response limits, and additional Chromium packaging requirements. A container or
dedicated PDF worker would offer greater runtime control and may be preferable
for larger reports, higher traffic, longer processing, or stricter observability
requirements.

## Supporting Libraries

The project reuses mature libraries where custom implementation would not add
product value:

- Tailwind CSS for consistent UI and print styling.
- PapaParse for CSV parsing and parser-level errors.
- Vitest for unit and integration tests.
- `puppeteer-core` with Sparticuz Chromium for the Vercel PDF runtime.

## Build / Reuse / Buy Summary

| Category | Scope | Reason | Accepted trade-off |
| --- | --- | --- | --- |
| Build | PCF validation rules, normalization, metrics, report definition, preview, branding, and export flow | These elements define the product-specific behavior | More application code to own and test |
| Reuse | Next.js, React, Tailwind CSS, PapaParse, Puppeteer, and Vitest | Mature technical capabilities with no product advantage in rebuilding them | Dependency maintenance and framework constraints |
| Buy / managed services | Vercel deployment and Xano persistence | Faster hosted delivery with low infrastructure overhead | Service limits, configuration requirements, and vendor coupling |

## Limits and Revisit Triggers

The current decisions should be revisited if the product requires:

- authentication or tenant isolation;
- report listing, filtering, or longitudinal comparison;
- stronger relational integrity and migrations;
- high-volume or long-running PDF generation;
- immutable archived PDFs;
- OCF runtime support;
- stricter security, retention, or observability requirements.
