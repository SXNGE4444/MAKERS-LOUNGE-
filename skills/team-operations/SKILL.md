# Skill — Team Operations

## Trigger
Use this skill when assigning work, resolving ownership, planning a sprint, handling blockers, or deciding who reviews/merges.

## Goal
Keep four contributors parallel without creating duplicate work or approval bottlenecks.

## Protocol
1. Convert the outcome into the smallest demonstrable vertical slices.
2. Give each slice exactly one accountable owner; collaborators may assist but ownership stays singular.
3. Record dependencies explicitly. Prefer contract/mock boundaries over waiting for another teammate.
4. Margaret owns scope arbitration and the default merge gate.
5. Zoe owns backend contract correctness. Seni owns frontend integration correctness. Lathithaa owns demo continuity and presentation evidence.
6. Blockers are surfaced immediately with: blocker, owner, needed decision, latest safe fallback.
7. No meeting should exist only to report status; the dashboard/GitHub should already contain status.

## Handoff format
- Outcome:
- Owner:
- Inputs/dependencies:
- Branch / issue:
- How to verify:
- What the next person needs:
- Known risk:

## Anti-patterns
Avoid four-person approval on every commit, hidden work in DMs, duplicate branches for the same task, vague ownership, and waiting for backend endpoints when a mock contract can unblock frontend work.
