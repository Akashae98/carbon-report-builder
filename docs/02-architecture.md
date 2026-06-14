# Architecture

## Core Principle

Build a reusable report engine with swappable persistence and brand presets.

PCF CSV
 -> Parser
 -> Normalized Data
 -> Report Definition
 -> Persisted Report Job
 -> Shared Server Renderer
 -> PDF

Future:

OCF CSV
 -> Parser
 -> Normalized Data
 -> Report Definition
 -> Persisted Report Job
 -> Shared Server Renderer
 -> PDF

## Current Runtime Flow

1. The upload UI posts a PCF CSV and selected `brandId` to `api/reports/upload`.
2. The upload route validates the CSV schema, normalizes product rows, derives metrics, and builds a report definition.
3. The report job is written through the configured store driver:
   - `filesystem` by default in local development, under `.tmp/reports`
   - `xano` in production and optionally in local development
4. The preview route `reports/[jobId]` reads the persisted job and renders the report with the selected brand profile.
5. The PDF route `api/reports/pdf/[jobId]` launches Puppeteer/Chromium, loads the same server-rendered preview, and exports an A4 PDF.

## Next.js Strategy

Server Components:
- Layouts
- Report pages
- Static sections
- Report preview rendering

Client Components:
- File upload
- Brand preset selection
- Form controls
- PDF download button with loading/error state

## Current Structure

src/
  app/
    api/reports/upload/
    api/reports/pdf/[jobId]/
    reports/[jobId]/
  components/
    home/
    report/
    upload/
  lib/
    branding/
    jobs/
    pcf/
    reporting/
  types/
