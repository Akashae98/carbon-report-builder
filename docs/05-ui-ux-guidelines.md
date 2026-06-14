# UI & UX Guidelines

## Application Branding (Footprint Mappa)

Style:
- SaaS
- Modern
- Technical
- Light-first workspace

Colors:
- #fdc2d8
- #fca65e
- #ff7983
- #041282

Theme:
- Light first
- Clean operational interface
- Restrained gradient and accent usage

## Report Branding

Client report surfaces use brand profiles rather than the application theme.

Current local presets:
- Relats
- Demo Industrial

Relats remains the default demo client. These presets are visual only; they are
not authenticated tenants or authorization boundaries.

## Upload and Report Experience

Main surfaces:
- Home hero with a three-step flow: upload, preview, PDF
- CSV upload panel
- Brand preset selector
- Report preview card
- Server-rendered report preview
- PDF export button with loading and error states

Principles:
- Clarity
- Readability
- Consistency
- Professional presentation
- Preview-before-export confidence

## Responsive Rules

- Primary mobile breakpoint: `sm` (`640px`)
- Mobile flow indicator: compact 3-step horizontal stepper with labels `Subir`, `Vista previa`, `PDF`
- Desktop flow indicator: pill-based workflow chips
- Mobile upload panel: reduced padding, tighter spacing, shorter dropzone, full-width primary CTA
- Mobile report preview card: compact cover thumbnail plus key sections
- Desktop report preview card: full cover mock plus complete section index
- Report metadata: client, source file, and generation date stay visible
- Report KPI layout: divided strip instead of nested cards
- Report structure layout: bordered rows instead of stacked inner cards
- Mobile chart layout: labels above bars, larger text, percentage aligned right

## Preview and PDF Consistency

- Preview uses the same report sections and brand profile as the generated PDF.
- The current PCF MVP report is intentionally paginated into 4 A4 pages.
- The preview includes a PDF download button outside the printable area.
- Print CSS hides interactive controls and preserves report colors.
- The PDF filename includes the selected brand id.
