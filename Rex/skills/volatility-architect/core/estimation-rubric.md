# Estimation Rubric (Volatility-Based)

Use this rubric for optimistic/likely/pessimistic day ranges.

## Inputs
- Capability boundary clarity
- Volatility intensity (temporal + spatial)
- Coupling level to shared layers
- Data contract stability
- Test coverage maturity

## Scoring Grid

| Dimension | Low | Medium | High |
|---|---|---|---|
| Boundary clarity | clear ownership and interfaces | mostly clear with minor overlap | unclear ownership and broad overlap |
| Volatility intensity | rare rule changes | regular planned changes | frequent changing requirements or tenant variance |
| Coupling | isolated within capability | moderate shared dependencies | cross-capability dependencies in many files |
| Contract stability | stable API/schema | occasional contract updates | unstable API/schema or provider drift |
| Testability | good local tests and seams | partial tests | no tests or hard-to-isolate logic |

## Range Mapping
- Mostly Low with one Medium:
  - optimistic 2 to 3
  - likely 3 to 4
  - pessimistic 4 to 6
- Mostly Medium:
  - optimistic 3 to 5
  - likely 5 to 8
  - pessimistic 8 to 12
- Any High in boundary clarity or coupling:
  - optimistic 4 to 6
  - likely 7 to 10
  - pessimistic 10 to 15

## Estimation Rules
- Always estimate by capability, never by arbitrary directory counts.
- Add explicit uncertainty notes for hidden backend dependencies.
- Do not hide risk in one average number; keep tri-range.
- Revise estimates only with a documented reason.

## Output Requirements
Each estimate must include:
- optimistic, likely, pessimistic (days)
- top 3 cost drivers
- confidence level (high, medium, low)
- dependencies blocking parallel work
