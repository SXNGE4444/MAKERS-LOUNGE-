# Skill — Test-First Feature Delivery

## Trigger
Use when implementing any user-facing feature, API route, integration, bug fix or risky refactor.

## Goal
Make every contribution independently verifiable so the team can merge quickly without four people manually rechecking everything.

## Method
1. State the behavior in one sentence.
2. Define the smallest success case and one meaningful failure case.
3. Add or update an automated test before declaring the feature complete.
4. If automation is impractical during the hackathon, document a deterministic manual test with inputs and expected outputs.
5. Implement the smallest code path that satisfies the behavior.
6. Run the relevant focused tests, then the repository quality gate.
7. Attach evidence to the PR.

## Minimum evidence
- Frontend: component/unit test, screenshot or short recording, and steps to reproduce.
- Backend: route/service test plus sample request/response.
- Integration: one end-to-end happy path or a documented smoke test.

## Rule
A feature is not complete because it compiles. It is complete when another teammate can verify it from the PR without guessing.
