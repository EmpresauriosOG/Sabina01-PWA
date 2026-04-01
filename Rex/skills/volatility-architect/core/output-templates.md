# Output Templates

Use these templates to produce consistent architecture outputs.

## Template 1: Capability Boundary Map

```md
## Capability: <name>

- Goal:
- Primary routes:
- Primary components:
- Hooks/utils:
- External systems:
- Owner:
- Status:
```

## Template 2: Volatility Matrix

```md
## Volatility Matrix: <capability>

| Volatile Element | Temporal Volatility | Spatial Volatility | Encapsulation Target |
|---|---|---|---|
| <rule or contract> | low/med/high | low/med/high | <module> |
```

## Template 3: Change Impact Analysis

```md
## Change Impact: <scenario>

- Triggered change:
- Expected impacted capability:
- Impacted files:
- Non-impacted capabilities:
- Why boundary contains or fails to contain the change:
- Proposed boundary adjustment:
```

## Template 4: Refactor Task Plan With Day Ranges

```md
## Refactor Plan: <capability>

| Task | Optimistic | Likely | Pessimistic | Dependency |
|---|---:|---:|---:|---|
| <task> |  |  |  |  |

### Acceptance Criteria
- ...
- ...
```

## Template 5: Team Decision Log

```md
## Decision Log

| Date | Decision | Reason | Impact | Owner |
|---|---|---|---|---|
| YYYY-MM-DD | ... | ... | ... | ... |
```
