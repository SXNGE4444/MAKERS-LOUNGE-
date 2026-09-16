# MAKERS LOUNGE — PROJECT OPERATING INSTRUCTIONS

This repository is the coordination and delivery system for **The Makers** hackathon team.

## Team ownership
- **Margaret — Team Lead:** issue/ticket ownership, scope arbitration, repository coordination, final merge gate.
- **Zoe — Backend Lead:** Python/API/database architecture, backend tests, API contract ownership.
- **Seni — Frontend Lead:** React/React Native UI, client state, mock integration, frontend tests.
- **Lathithaa — Full-stack + Presenter:** backend collaboration, integration support, demo path, pitch/slides and submission evidence.

## Non-negotiable workflow
1. Do not code directly on `main`.
2. Every meaningful change starts from a GitHub issue or an explicitly recorded hackathon task.
3. Branches use `feature/<name>`, `fix/<name>`, `docs/<name>` or `chore/<name>`.
4. Frontend and backend may build independently. Integration is governed by a written API contract and versioned mock fixtures.
5. Each feature must have an automated test where practical, otherwise an explicit repeatable manual verification path.
6. Every PR states: what changed, how to test it, evidence, contract/mock impact, known gaps.
7. CI must pass before merge. Margaret is the default merge gate unless the team explicitly delegates it.
8. During the final sprint, preserve a working demo over adding unproven scope.
9. Never commit secrets, `.env` files, signing keys, certificates, API keys or production credentials.
10. If a tool/agent changes architecture or a contract, update the relevant docs in the same PR.

## Skill routing
Read the matching file before performing substantial work:
- `skills/team-operations/SKILL.md`
- `skills/git-pr-workflow/SKILL.md`
- `skills/test-first-feature/SKILL.md`
- `skills/api-contract-mocks/SKILL.md`
- `skills/code-quality-gate/SKILL.md`
- `skills/debug-triage/SKILL.md`
- `skills/hackathon-timebox/SKILL.md`
- `skills/demo-pitch/SKILL.md`
- `skills/deployment-release/SKILL.md`
- `skills/cross-editor/SKILL.md`

## Definition of done
A feature is done only when code, verification, integration notes and demo impact are all understood. "It works on my machine" is not completion.
