const REPO = process.env.GITHUB_REPO || "SXNGE4444/MAKERS-LOUNGE-";
const TOKEN = process.env.GITHUB_TOKEN;

export type Issue = {
  number: number;
  title: string;
  html_url: string;
  state: string;
  assignees?: { login: string }[];
  labels?: { name?: string }[];
};

export type Pull = {
  number: number;
  title: string;
  html_url: string;
  draft: boolean;
  user?: { login: string };
  head?: { ref: string };
};

export type Run = {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  html_url: string;
  head_branch: string;
};

export type GitHubSnapshot = {
  connected: boolean;
  repo: string;
  issues: Issue[];
  pulls: Pull[];
  runs: Run[];
  branches: string[];
  error?: string;
};

async function gh<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10"
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const response = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`GitHub ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getGitHubSnapshot(): Promise<GitHubSnapshot> {
  if (!TOKEN) {
    return {
      connected: false,
      repo: REPO,
      issues: [],
      pulls: [],
      runs: [],
      branches: [],
      error: "Add GITHUB_TOKEN to enable private-repository live data."
    };
  }

  try {
    const [rawIssues, pulls, actions, branches] = await Promise.all([
      gh<(Issue & { pull_request?: unknown })[]>("/issues?state=open&per_page=30&sort=updated"),
      gh<Pull[]>("/pulls?state=open&per_page=20"),
      gh<{ workflow_runs: Run[] }>("/actions/runs?per_page=8"),
      gh<{ name: string }[]>("/branches?per_page=30")
    ]);

    return {
      connected: true,
      repo: REPO,
      issues: rawIssues.filter((issue) => !issue.pull_request),
      pulls,
      runs: actions.workflow_runs,
      branches: branches.map((branch) => branch.name)
    };
  } catch (error) {
    return {
      connected: false,
      repo: REPO,
      issues: [],
      pulls: [],
      runs: [],
      branches: [],
      error: error instanceof Error ? error.message : "GitHub connection failed."
    };
  }
}

export function labelsOf(issue: Issue): string[] {
  return (issue.labels || []).map((label) => label.name || "").filter(Boolean);
}
