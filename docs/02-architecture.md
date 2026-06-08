# Architecture

## Core Principle

Build a reusable report engine.

PCF CSV
 -> Parser
 -> Normalized Data
 -> Report Definition
 -> Shared Renderer
 -> PDF

Future:

OCF CSV
 -> Parser
 -> Normalized Data
 -> Report Definition
 -> Shared Renderer
 -> PDF

## Next.js Strategy

Server Components:
- Layouts
- Report pages
- Static sections

Client Components:
- File upload
- Interactive charts
- Form controls

## Suggested Structure

src/
  app/
  components/
  lib/
  reports/
    shared/
    pcf/
    ocf/
