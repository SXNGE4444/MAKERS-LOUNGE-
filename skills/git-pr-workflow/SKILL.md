# Skill — Git / Branch / Pull Request Workflow

## Trigger
Use before starting code, opening a PR, resolving conflicts, or merging.

## Branch model
`main` is always demo-capable. Never develop directly on it.

Branch names:
- `feature/<short-name>`
- `fix/<short-name>`
- `docs/<short-name>`
- `chore/<short-name>`

## Start work
```bash
git fetch origin
git switch main
git pull --ff-only
git switch -c feature/<name>
```

## Commit rule
Prefer small outcome-based commits. Good examples:
- `feat: add incident creation endpoint`
- `test: cover invalid incident payload`
- `fix: handle expired auth session`

## Before PR
```bash
pnpm makers check
pnpm makers sync
git push -u origin HEAD
```

## PR requirements
Every PR includes:
- linked issue/task;
- what changed;
- exact test instructions;
- screenshot/log/API evidence where relevant;
- API contract or mock impact;
- known limitations;
- confirmation that the demo path still works.

## Merge rule
CI must be green. Margaret is the default final merge gate. Prefer squash merge for hackathon feature branches unless preserving multiple commits adds real diagnostic value.

## Conflict rule
The feature owner resolves conflicts on their own branch after syncing with `origin/main`. Never resolve a conflict by blindly choosing one side when both branches altered behavior.
