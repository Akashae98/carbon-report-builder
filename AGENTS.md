<!-- BEGIN:nextjs-agent-rules -->
# Next.js Project Rules

This project uses the current installed Next.js version.

Before changing framework-specific code, check the local Next.js documentation if needed:

`node_modules/next/dist/docs/`

Pay attention to:
- App Router conventions
- Server Components
- Route Handlers
- Metadata API
- runtime limitations
- deprecated APIs

# Project Context

This project generates professional carbon footprint reports from CSV datasets.

Important:
- Do NOT calculate carbon footprints.
- Emissions are already provided in CSV files.
- Focus on data processing, visualization and report generation.

Branding:
- Application: Footprint Mappa
- PDF Reports: Relats

Architecture goal:
CSV -> Normalize -> Metrics -> Report Definition -> Renderer -> PDF

Implementation order:
1. PCF
2. OCF

Prefer:
- Server Components by default
- Client Components only when necessary
- Reusable report sections

<!-- END:nextjs-agent-rules -->
