# Delivery README

Short rationale prepared for the technical challenge submission.

## What I built

I built an MVP that transforms a PCF CSV dataset into a professional report
through a complete flow:

`CSV upload -> web preview -> PDF export`

The scope is intentionally narrow. The goal was to deliver a deterministic,
reviewable, and deployable PCF reporting flow before attempting broader SaaS
features such as authentication, report history, tenant isolation, or AI-driven
report generation.

## Path / Blend Chosen

I chose **Path A** as the primary path: generate a correct and professional PDF
from already calculated PCF data.

I also covered a limited part of **Path B** through branding presets, so the
same report structure can be presented with different visual identities.

I did **not** prioritize **Path C** as a core runtime path. Prompt-based report
generation can be valuable later, but for this challenge I considered it more
important to close a reliable CSV -> preview -> PDF flow with explicit rules,
known inputs, and predictable output.

This choice reduced delivery risk and kept the MVP focused on proving the core
conversion capability.

## Build / Reuse / Buy

The main decision framework was:

- **Build** the product-specific logic:
  PCF CSV validation, normalization, derived metrics, report definition,
  preview composition, branding presets, and PDF flow.
- **Reuse** mature libraries and frameworks:
  Next.js, React, Tailwind CSS, PapaParse, Puppeteer, and Vitest.
- **Buy / use managed services** where infrastructure was not the differentiator:
  Vercel for hosting and Xano for hosted persistence.

Why:

- Next.js allowed UI, server-rendered preview routes, upload endpoints, and PDF
  generation to live in one application.
- Puppeteer allowed the preview and PDF to share the same rendering path,
  reducing divergence between what the user sees and what gets exported.
- Xano and Vercel reduced infrastructure work so challenge time could stay
  focused on the reporting flow itself.

The full survey of alternatives and the detailed justification are documented
in [research.md](research.md).

## How I used AI

I used AI as an **engineering and documentation assistant**, not as a
substitute for product or technical judgment.

### What I delegated to AI

- architecture exploration and tradeoff discussion
- scaffolding and repetitive implementation support
- naming and structure proposals
- draft documentation and consistency review
- prompts for edge cases, stale docs, and overpromising risks

### What I decided and reviewed myself

- MVP scope and non-goals
- the chosen path/blend
- the final architecture boundaries
- build / reuse / buy decisions
- which AI suggestions to accept, modify, or reject
- what the project should and should not claim in the final delivery

### Tools used

- ChatGPT for reasoning, documentation drafting, and tradeoff framing
- Codex for implementation assistance, code review support, and delivery
  preparation

I also used `AGENTS.md` and the repository documentation as structured context
to guide Codex within the project rules, scope boundaries, and MVP priorities.

All AI-assisted code and text were reviewed before integration.

## Time invested

Approximately **30 to 35 hours** across **5 working days**.

## What I would do with more time

- add a client/company area with registration, login, and a dedicated workspace
- add a fuller branding editor with logo, colors, typography, cover, metadata,
  and reusable presets
- add report history with listing by company, report type, brand, generation
  date, and source file
- support report comparison only after introducing `datasetLabel`,
  `periodStart`, and `periodEnd` so temporal evolution can be communicated
  correctly
- validate report comparability across PCF/OCF, functional unit, scope, stages,
  and portfolio context
- extend the shared engine toward OCF runtime support
- add stronger hosted hardening:
  real authentication, Xano access validation, rate limiting, abuse control,
  and access control
- persist generated PDFs as immutable artifacts when exact reproducibility is required

## Deployment note

The public Vercel demo is available at:

`https://carbon-report-builder.vercel.app/`

The application already supports sending `X-API-Key` to Xano when
`XANO_API_KEY` is configured, but the effective access validation in Xano and
the full security hardening of the hosted environment remain outside the MVP
scope and belong to later production-oriented iterations.
