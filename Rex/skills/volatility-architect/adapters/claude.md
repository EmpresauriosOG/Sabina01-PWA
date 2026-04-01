# Adapter: Claude

This adapter applies the volatility architect core to Claude execution style.
Use with:
- `../core/volatility-canvas.md`
- `../core/anti-patterns.md`
- `../core/estimation-rubric.md`
- `../core/output-templates.md`

## Claude Workflow
1. Build a capability-first map from routes and runtime entrypoints.
2. Classify volatility by temporal and spatial change factors.
3. Flag anti-patterns and boundary violations with file evidence.
4. Produce required artifacts in markdown:
   - capability boundary map
   - volatility matrix
   - change impact analysis
   - refactor task plan with optimistic/likely/pessimistic ranges
5. Format output for direct Notion paste (headings, tables, short bullets).

## Prompt Contract
When invoking this adapter, include:
- current route map
- target capability
- requested output artifact(s)
- constraints (timeline, team size, in/out of scope)

Expected output contract:
- no nested bullet hierarchies
- capability-first structure
- explicit assumptions section
- explicit dependency and risk section

## Claude-Specific Guardrails
- Avoid generic best-practice text without repo evidence.
- Avoid functional-sequence decomposition recommendations.
- Always separate:
  - architecture diagnosis
  - proposed boundaries
  - implementation packets

## Consistency Rule With Codex Adapter
- Boundary decisions and risk ranking must match Codex adapter when inputs are equivalent.
- Differences are allowed only in wording and formatting style, not in core architecture conclusions.
