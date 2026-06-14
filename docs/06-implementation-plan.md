# Implementation Status

## Delivered MVP

- Next.js application with TypeScript and Tailwind CSS
- PCF CSV upload, validation, parsing, and normalization
- Derived PCF metrics and report definition generation
- BrandProfile-based visual presets for Relats and Demo Industrial
- Configurable local report job store: filesystem by default or Xano
- Xano report job store supported for the target hosted deployment
- Server-rendered report preview
- 4-page A4 PCF report structure
- Puppeteer-based PDF generation
- Vercel-compatible Chromium adapter
- Brand-aware PDF filenames
- Loading and error states for PDF generation
- Unit and integration coverage with Vitest

## Delivery Preparation

- Keep local and production environment variables documented in `setup.md` and
  `deployment.md`.
- Keep the public demo URL and deployment wording aligned across the README and
  docs.
- Validate the full hosted flow in Vercel Preview:
  upload, persistence, preview, cold PDF generation, warm PDF generation.
- Review Xano Request History after testing for unexpected direct traffic.

## Delivery Checklist

- Confirm `.env.local` is not committed.
- Confirm `.env.example` contains no secrets.
- Run `npm run lint`, `npm run test`, and `npm run build`.
- Validate upload -> Xano -> preview -> cold PDF -> warm PDF in production.
- If the repository is private, add `victorcuadrat` as a collaborator.

## Security Hardening

The current Xano integration already supports sending an optional server-to-
server API key from the application, but endpoint validation must still be
configured in Xano before it becomes effective.

- Configure the shared key in Xano and Vercel as described in `deployment.md`.
- Confirm Xano rejects missing or incorrect `X-API-Key` values.
- Disable unused public CRUD endpoints and restrict API documentation.
- Use separate keys and datasets for Production, Preview, and local development.
- Define retention and deletion rules for persisted report payloads.

The target deployment is designed to use Xano with `X-API-Key`
authentication. Effective access validation in Xano, plus the remaining
hardening work around rate limiting and abuse control, stays outside the MVP
scope and belongs to later production-oriented iterations.

## Future Work

- OCF report support using the shared report engine.
- Report history, filtering, and comparison.
- Structured reporting periods for meaningful comparisons.
- Authenticated tenant/user model if this becomes a multi-client product.
- Broader visual regression or browser-based e2e coverage.
