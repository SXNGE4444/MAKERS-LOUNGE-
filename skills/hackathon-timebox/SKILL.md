# Skill — Hackathon Timeboxing

## Trigger
Use when planning the build day, deciding whether to add scope, handling time pressure or recovering from schedule drift.

## Principle
A smaller complete vertical slice beats a larger unfinished system.

## Time gates
### Gate 1 — Problem lock
Before serious coding: user/problem, success metric, primary demo path and architecture are explicit.

### Gate 2 — First vertical slice
Target an end-to-end thin path early: UI → contract → backend/data → visible result.

### Gate 3 — Core freeze
Once the core judged experience works, stop broad feature expansion. New work must improve judging value, reliability or clarity.

### Gate 4 — Demo freeze
Before final submission, feature work stops. Only verified bug fixes, submission packaging, deployment checks and pitch rehearsal continue.

## Scope decision test
Add a feature only if all are true:
- it materially improves the judging story;
- one owner can finish and verify it inside the remaining safe window;
- it does not destabilize the demo path;
- fallback/revert is simple.

## Recovery
When behind schedule: cut secondary features, preserve the contract, replace incomplete integrations with honest deterministic fixtures if rules permit, document limitations and protect the primary demo.
