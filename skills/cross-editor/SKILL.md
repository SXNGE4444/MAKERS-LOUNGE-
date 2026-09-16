# Skill — VS Code / Xcode / GitHub Cross-Editor Workflow

## Trigger
Use when onboarding a teammate, switching machines/editors, opening the iOS project, or reconciling local work with GitHub.

## Shared truth
The repository, issue, branch, PR and CI status are authoritative. VS Code and Xcode are local interfaces onto that shared state; neither editor owns project truth.

## Onboarding
```bash
git clone https://github.com/SXNGE4444/MAKERS-LOUNGE-.git
cd MAKERS-LOUNGE-
pnpm makers setup
```

## VS Code
```bash
pnpm makers code
```
Use the shared tasks under `.vscode/tasks.json` for dev, quality gate, GitHub status, Xcode opening and branch sync.

## Xcode
On macOS:
```bash
pnpm makers ios
```
The script searches the repo for the first `.xcworkspace` and then `.xcodeproj`. If the product is Expo/React Native and no native project exists yet, generate/run the native iOS project using the chosen Expo workflow first.

## GitHub
```bash
pnpm makers status
```
This shows local git state and, when `gh` is installed/authenticated, PR and GitHub Actions status.

## Before switching editors or machines
1. Commit or intentionally stash local work.
2. Push the feature branch when another teammate needs access.
3. Record handoff notes in the issue/PR.
4. Never copy uncommitted source manually between machines when Git can carry it.

## Rule
Editor-specific project settings must not override repository-wide architecture, contracts, formatting or test behavior without a reviewed change.
