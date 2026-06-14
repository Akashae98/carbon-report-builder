# Carbon Report Builder Technical Challenge

Web application that transforms carbon footprint CSV datasets into professional PDF reports.

This directory is tracked with the project so implementation notes, sample datasets, and report references travel with the repository.

The Footprint Mappa brandbook stays outside the repo as a local visual reference and should not be committed here.

## Document Index
- `delivery-readme.md`: short delivery rationale for submission
- `01-prd.md`: product goals, scope, and non-goals
- `02-architecture.md`: high-level system design
- `03-data-model.md`: normalized report and dataset structures
- `04-report-template.md`: current PCF preview and PDF structure
- `05-ui-ux-guidelines.md`: application and report UX direction
- `06-implementation-plan.md`: implementation status and delivery checklist
- `setup.md`: local setup with filesystem or Xano persistence
- `deployment.md`: Vercel and Xano deployment notes
- `research.md`: build / reuse / buy research and rationale
- `assets/`: sample files, branding notes, and report references

Current scope:
- PCF (Product Carbon Footprint) MVP
- Reusable architecture prepared for OCF
- Public Vercel demo available at `https://carbon-report-builder.vercel.app/`
- Designed for Xano-backed persistence in the target deployment
- Server-rendered report preview and Puppeteer-based PDF export

Important boundaries:
- OCF is future scope, not current runtime scope.
- `brand_id` is a visual preset, not a tenant or authorization boundary.
- The current PCF report is a 4-page A4 MVP layout.
- Xano persistence can reopen and regenerate reports, but it is not yet a
  temporal comparison or report history product.

Stack:
- Next.js
- TypeScript
- Tailwind
- PapaParse
- Vitest
- Puppeteer
- Custom React/SVG report charts

See the files in this directory for the full project documentation.
