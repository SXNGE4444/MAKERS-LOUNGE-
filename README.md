# MAKERS LOUNGE

**Hackathon control room for The Makers.**

Makers Lounge is not the hackathon product itself. It is the shared operating system that keeps the team coordinated while the product is being built: roles, work queue, GitHub PRs, CI health, frontend/backend handoffs, editor workflows, demo readiness and project-specific AI/human skills.

## Design direction

**Technical Minimalist × Bold Editorial Studio**

Why: this is a developer control room, so density and state visibility matter more than decorative dashboard widgets. The visual system uses a dark technical shell, editorial-scale hierarchy, signal-lime for active/ready states and restrained electric accents for build information. The goal is fast scanning under hackathon pressure.

## Team lanes

| Person | Primary role | Default ownership |
| --- | --- | --- |
| Margaret | Team Lead | Tasks, scope, repo coordination, final merge gate |
| Zoe | Backend Lead | Python/API/database, backend tests, API contract |
| Seni | Frontend Lead | React/React Native, client integration, UI verification |
| Lathithaa | Full-stack + Presenter | Backend support, integration, demo, pitch/slides |

## Core workflow

```text
GitHub issue
   ↓
feature/<name>
   ↓
code + tests
   ↓
PR + verification evidence
   ↓
GitHub Actions quality gate
   ↓
Margaret merge gate
   ↓
main remains demo-capable
```

Frontend and backend do **not** need to wait for each other. Write the API contract, build frontend fixtures against it, build the backend against the same shape, then swap the mock transport for the real endpoint.

## Start in 5 commands

```bash
git clone https://github.com/SXNGE4444/MAKERS-LOUNGE-.git
cd MAKERS-LOUNGE-
npm install -g pnpm
pnpm makers setup
pnpm dev
```

Open `http://localhost:3000`.

## Connect live GitHub data

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set:

```text
GITHUB_REPO=SXNGE4444/MAKERS-LOUNGE-
GITHUB_TOKEN=<fine-grained token>
DASHBOARD_ACCESS_KEY=<shared dashboard passphrase>
```

For the private repo dashboard, give the token only the repository permissions actually needed. Read access to repository metadata, issues, pull requests and Actions is enough for the current dashboard. Keep the token server-side; never prefix it with `NEXT_PUBLIC_`.

If `DASHBOARD_ACCESS_KEY` is set, the dashboard requires that shared key and stores only a secure HTTP-only session hash in the browser. If the variable is omitted, access protection is disabled for local development.

## Developer bridge

```bash
pnpm makers setup   # workstation check + install
pnpm makers code    # open repository in VS Code
pnpm makers ios     # macOS: open discovered Xcode workspace/project
pnpm makers status  # local git + GitHub PR/Actions state
pnpm makers sync    # rebase feature branch onto origin/main
pnpm makers check   # local merge gate
```

VS Code users also get shared tasks under **Terminal → Run Task**.

The Xcode command is intentionally adaptive. When the hackathon frontend creates a native iOS workspace/project, the same command will discover it. Until then it reports that native iOS has not been generated instead of pretending an Xcode target exists.

## GitHub conventions

- Never develop directly on `main`.
- Use `feature/*`, `fix/*`, `docs/*`, `chore/*`.
- Every meaningful feature should have one accountable owner.
- Every PR explains what changed and how to test it.
- Tests or a repeatable manual verification path are required.
- CI must be green before merge.
- Secrets/signing files never enter source control.

## Project skills

The repository contains reusable operating skills that humans and coding agents should read before acting:

1. `skills/team-operations/SKILL.md`
2. `skills/git-pr-workflow/SKILL.md`
3. `skills/test-first-feature/SKILL.md`
4. `skills/api-contract-mocks/SKILL.md`
5. `skills/code-quality-gate/SKILL.md`
6. `skills/debug-triage/SKILL.md`
7. `skills/hackathon-timebox/SKILL.md`
8. `skills/demo-pitch/SKILL.md`
9. `skills/deployment-release/SKILL.md`
10. `skills/cross-editor/SKILL.md`

`AGENTS.md` is the short project law and routes AI tools to the right skill.

## Dashboard panels

- Team roles and ownership
- Sprint board sourced from GitHub issues when connected
- Pull-request and CI radar
- Branch count / repository status
- Developer launch commands
- Frontend ↔ API contract operating rule
- Friday/Saturday hackathon runbook
- Definition of done
- Submission gate

## Suggested labels

Create these GitHub labels so issues automatically move into dashboard lanes:

```text
status:todo
status:doing
status:review
status:blocked
owner:margaret
owner:zoe
owner:seni
owner:lathithaa
area:frontend
area:backend
area:integration
area:demo
```

Without status labels, live GitHub issues appear in **Queue** by default.

## Hackathon product code

Once the challenge is announced, keep the product in this same repository unless the organizer explicitly requires another structure. A recommended layout is:

```text
apps/
  dashboard/ or web/      # product frontend when needed
  mobile/                 # Expo/React Native when needed
services/
  api/                    # Python API
contracts/                # shared API schemas/examples
skills/                   # team operating skills
docs/                     # architecture + demo + submission notes
```

Do not create empty complexity before the challenge requires it. The current repository starts with the control room and workflow; product architecture should be selected from the actual problem.

## Deployment

The control room is compatible with Vercel as a standard Next.js application. Configure `GITHUB_TOKEN`, `GITHUB_REPO` and `DASHBOARD_ACCESS_KEY` as server-side environment variables in the deployment. After each final merge, smoke-test the deployed dashboard rather than assuming a successful deployment equals a working system.
