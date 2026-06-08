# UI & UX Guidelines

## Application Branding (Footprint Mappa)

Style:
- SaaS
- Modern
- Technical

Colors:
- #fdc2d8
- #fca65e
- #ff7983
- #041282

Theme:
- Dark first
- Gradient accents

## PDF Branding (Relats)

Colors:
- #ff5710
- #1c1c1c
- #eae4df
- #ffffff

Style:
- Corporate
- Industrial
- Clean
- Print friendly

Current demo behavior:
- Relats is the visible demo client for report preview and PDF-oriented report surfaces.
- This does not define the product identity of Footprint Mappa itself.

Future theming direction:
- App branding = Footprint Mappa
- Report branding = client theme
- Relats remains the default demo client until client-theming is generalized

## Dashboard

Sections:
- Upload CSV
- KPI Cards
- Charts
- Report Preview
- Export PDF

Principles:
- Clarity
- Readability
- Consistency
- Professional presentation

## Responsive Rules

- Primary mobile breakpoint: `sm` (`640px`)
- Mobile flow indicator: compact 3-step horizontal stepper with labels `Subir`, `Vista previa`, `PDF`
- Desktop flow indicator: keep the existing pill-based workflow chips
- Mobile upload panel: reduced padding, tighter spacing, shorter dropzone, full-width primary CTA
- Mobile report preview: compact cover thumbnail plus 3 key sections only
- Desktop report preview: full cover plus complete section index
- Card radii: 16px on mobile, 20px on desktop for main report surfaces
- Report metadata: client, source file and generation date stay visible; `Job ID` remains inside `Detalles técnicos`
- Report KPI layout: a single divided strip instead of nested cards
- Report structure layout: bordered rows instead of stacked inner cards
- Mobile chart layout: labels above bars, larger text, percentage aligned right
