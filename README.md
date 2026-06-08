# Footprint Mappa

Web application that transforms PCF CSV datasets into professional report previews and PDF-ready report outputs.

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- Vitest

## Current Scope
- PCF-only runtime flow
- Upload endpoint under `api/reports/upload`
- Report preview route under `reports/[jobId]`
- Temporary filesystem job store under `.tmp/reports`
- PDF route scaffold under `api/reports/pdf/[jobId]`
- Relats used as the default demo client branding for report preview surfaces

## Branding Direction
- Footprint Mappa is the application brand
- Report preview and PDF surfaces are intended to use client-specific branding
- Relats is the current demo client, not the fixed identity of the product

## Project Structure
- `src/app`: routes and server entrypoints
- `src/components`: dashboard, upload, report, and chart components
- `docs`: project documentation, report references, and sample source files
- `src/lib/pcf`: PCF domain layers
- `src/lib/reporting`: shared rendering and PDF-related modules
- `src/lib/jobs`: temporary report job store
- `src/types`: shared types
- `src/fixtures`: temporary stub data used during scaffolding

## Scripts
```bash
npm run dev
npm run lint
npm run test
npm run build
