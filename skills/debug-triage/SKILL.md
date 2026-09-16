# Skill — Debugging / Incident Triage

## Trigger
Use when a feature fails, integration breaks, CI turns red, a demo path regresses, or two teammates see different behavior.

## Triage order
1. Reproduce the failure with the smallest known input.
2. Record environment, branch/commit, command, expected result and actual result.
3. Classify the fault: frontend, backend, contract, data, environment, dependency, CI/deployment or unknown.
4. Check the boundary immediately before the visible failure: request payload, response payload, state transition, log, network call or build output.
5. Reduce the failing path until one owner can take it.
6. Fix root cause or select an explicit fallback. Do not stack speculative fixes.
7. Add a regression test or repeatable smoke test.

## Incident note
```text
SYMPTOM:
COMMIT/BRANCH:
REPRO STEPS:
EXPECTED:
ACTUAL:
FIRST BAD BOUNDARY:
OWNER:
FALLBACK:
```

## Demo emergency rule
If a new change threatens the known working demo near submission time, revert or feature-flag it first. Investigate after the stable path is restored.
