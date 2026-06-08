# Data Model

## Report Types

type ReportType = 'pcf' | 'ocf';

## PCF

Input:
- product
- functional_unit
- total_emissions
- total_materials
- total_manufacturing
- total_transport
- total_distribution
- total_use
- total_end_of_life

Derived:
- percentages
- rankings
- top contributors

## OCF

Input:
- site
- total_emissions
- total_scope_1
- total_scope_2
- total_scope_3

Derived:
- scope percentages
- site rankings
