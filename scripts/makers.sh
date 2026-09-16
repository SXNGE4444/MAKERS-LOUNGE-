#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

say() { printf "\n\033[1;32mMAKERS ›\033[0m %s\n" "$1"; }
warn() { printf "\n\033[1;33mMAKERS !\033[0m %s\n" "$1"; }

cmd="${1:-help}"

case "$cmd" in
  setup)
    say "Checking team workstation"
    command -v git >/dev/null || { echo "git is required"; exit 1; }
    command -v node >/dev/null || { echo "Node.js is required"; exit 1; }
    command -v pnpm >/dev/null || { echo "pnpm is required: npm i -g pnpm"; exit 1; }
    command -v gh >/dev/null || warn "GitHub CLI missing. Install it for PR/status shortcuts."
    command -v code >/dev/null || warn "VS Code CLI missing. In VS Code run: Shell Command: Install 'code' command in PATH"
    if [[ "$(uname -s)" == "Darwin" ]]; then
      command -v xcodebuild >/dev/null || warn "Xcode command line tools are not available."
    fi
    pnpm install
    say "Ready. Run: pnpm dev"
    ;;

  code)
    if command -v code >/dev/null; then
      say "Opening Makers Lounge in VS Code"
      code "$ROOT"
    else
      echo "VS Code CLI not found. Install the 'code' shell command first."
      exit 1
    fi
    ;;

  ios)
    if [[ "$(uname -s)" != "Darwin" ]]; then
      echo "Xcode/iOS workflows require macOS."
      exit 1
    fi
    workspace="$(find "$ROOT" -maxdepth 5 -name '*.xcworkspace' -not -path '*/node_modules/*' | head -n 1 || true)"
    project="$(find "$ROOT" -maxdepth 5 -name '*.xcodeproj' -not -path '*/node_modules/*' | head -n 1 || true)"
    if [[ -n "$workspace" ]]; then
      say "Opening Xcode workspace: $workspace"
      open "$workspace"
    elif [[ -n "$project" ]]; then
      say "Opening Xcode project: $project"
      open "$project"
    else
      warn "No native iOS project exists yet. When the hackathon frontend creates ios/, this command will open it automatically."
      echo "For Expo projects, add an ios script and run your Expo prebuild/run workflow first."
    fi
    ;;

  status)
    say "Local git status"
    git status --short --branch
    if command -v gh >/dev/null; then
      say "GitHub PR status"
      gh pr status || true
      say "Latest workflow runs"
      gh run list --limit 5 || true
    else
      warn "Install GitHub CLI to show PR and Actions state here."
    fi
    ;;

  sync)
    branch="$(git branch --show-current)"
    [[ "$branch" == "main" ]] && { echo "Do not develop directly on main. Create a feature branch."; exit 1; }
    say "Fetching origin"
    git fetch origin
    say "Rebasing $branch on origin/main"
    git rebase origin/main
    ;;

  check)
    say "Running local merge gate"
    pnpm typecheck
    pnpm build
    ;;

  help|*)
    cat <<'EOF'
Makers Lounge CLI

  pnpm makers setup   Check workstation + install dependencies
  pnpm makers code    Open this repo in VS Code
  pnpm makers ios     Open the first Xcode workspace/project found
  pnpm makers status  Show git, PR and GitHub Actions status
  pnpm makers sync    Rebase your feature branch on origin/main
  pnpm makers check   Run the local merge gate
EOF
    ;;
esac
