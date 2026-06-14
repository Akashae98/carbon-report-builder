# Current PCF Report Structure

This document describes the PCF preview and PDF currently implemented by the
application. It replaces the initial multi-page template proposal.

## Output

- Format: A4 PDF with 10 mm page margins.
- Length: 4 fixed pages for the bounded PCF MVP.
- Source: the server-rendered preview at `reports/[jobId]`.
- Branding: selected client preset, including logos, colors, subtitle, and
  provider identity.
- Language: Spanish.
- Pagination: explicit for the current PCF template; it is not a generic report
  pagination engine.

The web preview and exported PDF use the same report sections and persisted job
data. Interactive controls are outside the printable report.
Report timestamps are stored in UTC and rendered in `Europe/Madrid` for a
consistent reviewer-facing output.

## Page 1: Cover

Displayed content:

- Label: `Informe ejecutivo`.
- Title: `Informe de huella de carbono de producto`.
- Brand-specific subtitle.
- Client name.
- Report generation date and time.
- Source CSV filename.
- Client logo.
- Footprint Mappa provider logo.

The generation date identifies when the report was created. It is not the
reporting period represented by the source data.

## Page 2: Context and Results Overview

### 1. Introducción

Heading: `Contexto del análisis`.

The text states:

- number of products included;
- total aggregated emissions;
- purpose of the document: provide a concise view of the distribution across
  products and aggregated lifecycle stages.

### 2. Metodología

Heading: `Criterio de presentación`.

The text clarifies that:

- PCF values are already calculated in the uploaded CSV;
- the application validates, normalizes, aggregates, and presents those values;
- results are structured by aggregated lifecycle stage;
- substage-level analysis is not part of the current report.

This section does not claim that the application performs a certified PCF or
life-cycle assessment calculation.

### 3. Resumen de resultados

Heading: `Indicadores clave`.

Four indicators are displayed:

1. Products analyzed.
2. Total carbon footprint.
3. Average emissions per product.
4. Lifecycle stage with the largest contribution and its percentage share.

## Page 3: Lifecycle Breakdown

### 4. Desglose del ciclo de vida

Heading: `Distribución por etapa del ciclo de vida`.

Displayed content:

- narrative identifying the stage with the largest contribution;
- horizontal print-oriented chart;
- short reading of the three highest-contributing stages when available;
- table with lifecycle stage, percentage share, and emissions total.

The stages come from the normalized CSV dataset. The current expected structure
supports aggregated stages such as materials, manufacturing, transport,
distribution, use, and end of life.

If the dataset declares zero total emissions, the report avoids percentage
division errors and presents a specific message asking for input-data review.

## Page 4: Ranking and Actions

### 5. Clasificación de productos

Heading: `Productos con mayor huella agregada`.

The table displays up to five products, ordered by total emissions from highest
to lowest:

- ranking position;
- product name;
- functional unit;
- aggregated emissions.

### 6. Recomendaciones

Heading: `Líneas de acción prioritarias`.

Three data-driven recommendations are generated from:

- the lifecycle stage with the largest contribution;
- the products with the highest aggregated emissions;
- the value of maintaining comparable datasets over time.

These recommendations are review prompts derived from the supplied data, not
certified environmental advice.

### 7. Conclusiones

Heading: `Conclusiones principales`.

The closing text summarizes:

- the lifecycle stage with the largest contribution;
- the highest-emitting product when available;
- the total emissions represented by the dataset.

## Data and Calculation Boundaries

The report derives presentation metrics from PCF values supplied in the CSV:

- product count;
- total and average emissions;
- totals and shares by lifecycle stage;
- top-five product ranking.

The application does not calculate a PCF from activity data, certify the input
values, establish dataset comparability, or infer a reporting period.

## Future Report Types

OCF is represented in the shared type model but has no runtime report template.
Its page structure should be documented only after the OCF parser, metrics, and
renderer are implemented.
