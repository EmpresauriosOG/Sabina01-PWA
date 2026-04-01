# Volatility Canvas

Use this canvas to design or review any capability.
The goal is to encapsulate change and avoid functional-sequence coupling.

## 1) Capability Boundary
- Capability name:
- Primary user:
- Primary business outcome:
- Inbound interfaces (routes/events/APIs):
- Outbound interfaces (APIs/events/state):

## 2) Volatility Discovery

### Temporal Volatility (change over time)
- Which business rules are likely to change in 3 to 12 months?
- Which contracts are currently unstable?
- Which logic changes frequently in support tickets or roadmap notes?

### Spatial Volatility (change across customers/contexts)
- Which rules differ by tenant/location/role?
- Which parts vary by workflow or operational policy?
- Which fields are optional in one customer context and mandatory in another?

## 3) Encapsulation Plan
- Place each volatile rule behind one module boundary.
- Keep clients thin: no business rule branching in components when avoidable.
- Define explicit adapters for external systems (auth, APIs, realtime, AI providers).
- Prevent cross-capability leakage of volatile rules.

## 4) Duplication Scan
- Identify any logic repeated in:
  - multiple routes
  - multiple components
  - multiple hooks/utils
- Decide one canonical owner for each duplicated behavior.

## 5) Change Impact Simulation
- If rule X changes, list all files and capabilities impacted.
- If impact crosses many capabilities, boundary is wrong.
- Refine boundaries until likely changes stay local.

## 6) Testability Design
- Define test seam for each boundary:
  - contract test
  - integration test
  - smoke test
- Ensure each volatile rule can be validated without full-app end-to-end setup.

## 7) Output Artifacts (required)
- Capability boundary map
- Volatility matrix (temporal + spatial)
- Change impact analysis
- Refactor task plan with optimistic/likely/pessimistic day ranges
