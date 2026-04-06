---
name: volatility-architect
description: Volatility-based system design and architecture mapping for existing codebases. Use when you need capability-first decomposition, change impact isolation, anti-pattern detection, refactor task slicing, and optimistic/likely/pessimistic day estimates for team planning.
---

# Volatility Architect

Use this skill to map architecture by capability, not by directory or step sequence.

## Required Outputs
- capability boundary map
- volatility matrix
- change impact analysis
- refactor task plan with day ranges

## Core Method
1. Read and apply `core/volatility-canvas.md`.
2. Validate against `core/anti-patterns.md`.
3. Estimate with `core/estimation-rubric.md`.
4. Format with `core/output-templates.md`.

## Adapter Selection
- For Codex workflows: use `adapters/codex.md`.
- For Claude workflows: use `adapters/claude.md`.

## Non-Negotiable Rules
- Decompose by volatility, not by functional sequence.
- Keep clients thin and avoid business rule leakage in UI.
- Eliminate duplicated transport/business rules by assigning one owner module.
- When recommending changes, include concrete file-level evidence.
