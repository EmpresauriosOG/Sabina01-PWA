# Volatility Anti-Patterns

Use this as a hard filter during design and review.
If any anti-pattern appears, flag it and produce a safer alternative.

## 1) Functional Sequence Decomposition
Symptom:
- Architecture split by step order only (`step1`, `step2`, `step3`) with shared business rules duplicated.

Risk:
- Reuse fails outside original sequence.
- Any new flow duplicates rule logic.

Correction:
- Decompose by volatility and domain meaning, not chronological sequence.

## 2) Client Logic Pollution
Symptom:
- Business rules embedded in UI components/pages.

Risk:
- Every backend rule change forces frontend rewrites.
- Cross-capability regressions become common.

Correction:
- Move business rules into domain services/adapters.
- Keep UI focused on rendering and interaction.

## 3) Hidden Hardcoded Context
Symptom:
- Hardcoded tenant IDs, ticket IDs, endpoint hosts, or credentials in client code.

Risk:
- Multi-customer behavior breaks silently.
- Security and compliance exposure.

Correction:
- Resolve context at runtime from authenticated state or config boundaries.
- Keep secrets out of client source.

## 4) Provider Drift
Symptom:
- Multiple auth or transport providers active in the same runtime without clear ownership.

Risk:
- Inconsistent sessions and difficult migrations.

Correction:
- Define one runtime provider strategy and encapsulate provider-specific APIs behind adapters.

## 5) Duplicate Transport Surfaces
Symptom:
- Two modules call the same endpoint family with different payload assumptions.

Risk:
- Contract drift and hard-to-debug side effects.

Correction:
- One canonical transport service per endpoint family.

## 6) Global Boolean Side-Effect Signaling
Symptom:
- Cross-feature boolean flags used to trigger refetch/reload behavior.

Risk:
- Hidden coupling and non-deterministic refresh behavior.

Correction:
- Use explicit mutation callbacks and query invalidation per domain.

## 7) Monolithic Capability Component
Symptom:
- One component contains orchestration, transport, business logic, and rendering.

Risk:
- Any change has broad impact and low testability.

Correction:
- Split by volatility and ownership: route container, domain logic, presentation components.
