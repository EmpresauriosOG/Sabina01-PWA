# Adapter: Codex

This adapter applies the volatility architect core to Codex execution style.
Use with:
- `../core/volatility-canvas.md`
- `../core/anti-patterns.md`
- `../core/estimation-rubric.md`
- `../core/output-templates.md`

## Codex Workflow
1. Scan route tree, capability entry components, hooks, and utils.
2. Build capability boundary map first, then directory mapping.
3. Flag anti-patterns with concrete file references.
4. Produce required artifacts:
   - capability boundary map
   - volatility matrix
   - change impact analysis
   - refactor task plan with day ranges
5. Keep output concise and Notion-ready.

## Evidence Extraction Rules
- Prefer repo evidence over assumptions.
- For each claim, include at least one file path.
- Always identify:
  - hardcoded IDs/hosts/credentials
  - duplicate transport modules
  - provider drift
  - monolithic components

## Implementation Handoff Format
When handing work to implementation agents, provide:
- capability owner
- file ownership boundaries
- no-overlap rule for parallel workers
- acceptance criteria copied from capability docs

## Codex-Specific Guardrails
- Do not recommend architecture changes without identifying exact impacted modules.
- Do not mix feature implementation with architecture mapping unless explicitly requested.
- Keep business logic out of shared UI primitives unless proven stable and cross-capability.
