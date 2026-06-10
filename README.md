# Carbon Report Builder

Local MVP for generating client-branded carbon footprint report previews and PDF-ready outputs from PCF CSV datasets.

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
- Local client branding presets for report preview and PDF surfaces
- Relats remains the default demo client branding

## Branding Direction
- Carbon Report Builder is the repository/project name
- Footprint Mappa remains the application/provider brand in the current UI and PDF footer
- Report preview and PDF surfaces are intended to use client-specific branding
- Relats and Demo Industrial are local demo client presets, not authenticated tenant accounts

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
