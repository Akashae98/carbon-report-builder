# Data Model

This document describes the current PCF runtime model and the minimal OCF type
placeholders reserved for future work.

## Report Job

The application persists a complete `PcfReportJobRecord`:

- `jobId`: report identifier used by preview and PDF routes.
- `brandId`: visual preset (`relats` or `demo-industrial`).
- `reportType`: currently `pcf`.
- `status`: `draft` or `ready`.
- `createdAt`: report generation timestamp.
- `upload`: source filename, content type, size, and reception timestamp.
- `schemaValidation`: CSV validation result and row-level issues.
- `normalizedDataset`: normalized products and lifecycle values.
- `derivedMetrics`: aggregates used by the report.
- `reportDefinition`: title and ordered report sections.

`createdAt` is not a reporting period and must not be used for temporal
comparison.

## PCF CSV Input

Required headers:

- `product`
- `functional_unit`
- `total_emissions`
- `total_materials`
- `total_manufacturing`
- `total_transport`
- `total_distribution`
- `total_use`
- `total_end_of_life`

Product and functional-unit values are required strings. Emission values must be
finite, non-negative numbers. Decimal commas or decimal points are accepted,
but mixed separators are rejected.

The application receives PCF values that have already been calculated. It does
not calculate or certify a product carbon footprint from activity data.

## Validation Result

The validation model records:

- required and received headers;
- missing headers;
- parsed and valid row counts;
- overall validity;
- bounded row-level validation issues;
- errors and warnings.

## Normalized PCF Dataset

Each normalized product contains:

- `productName`
- `functionalUnit`
- `totalEmissions`
- `lifecycleTotals`

The current aggregated lifecycle stages are:

- Materials
- Manufacturing
- Transport
- Distribution
- Use
- End of life

The dataset also records the source filename, source row count, lifecycle-stage
order, and the display label `kgCO2e per functional unit`.

## Derived PCF Metrics

The application derives:

- total product count;
- total emissions;
- average emissions per product;
- totals by lifecycle stage;
- lifecycle stage with the largest contribution;
- contribution share of that stage;
- highest-emitting products.

The report preview independently builds a top-five display ranking from the
normalized products. The persisted `derivedMetrics.topProducts` summary contains
the top three products.

## Comparability Assumption

The MVP assumes that the PCF values supplied in the CSV are methodologically
comparable and use compatible units, scopes, lifecycle boundaries, and reporting
criteria.

The application validates file structure, required values, and numeric
consistency. It cannot verify or certify the underlying PCF methodology from the
available input data. Aggregated totals, averages, percentages, and rankings
should therefore be interpreted under this input-data assumption.

## Persistence

Both persistence drivers store the full report job:

- `filesystem`: JSON files under `.tmp/reports`.
- `xano`: summary columns plus the complete serialized job in `payload_json`.

Changing drivers does not migrate existing jobs.

The Xano summary row includes:

- `id`
- `brand_id`
- `report_type`
- `status`
- `source_file_name`
- `total_emissions`
- `dominant_stage`
- `payload_json`
- `created_at`

The persisted payload may contain confidential business data derived from the
uploaded CSV and should be protected with appropriate access and retention
controls.

## OCF Status

OCF is not implemented at runtime. The current type placeholders only reserve:

- report type `ocf`;
- source filename in the validation result;
- an empty normalized dataset shape;
- `totalEntities` as a future derived metric.

No OCF CSV schema, normalization flow, report definition, or PDF template should
be considered delivered.
