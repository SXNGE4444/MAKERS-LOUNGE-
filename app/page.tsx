import { getGitHubSnapshot, labelsOf, type Issue } from "@/lib/github";

type BoardItem = {
  title: string;
  lane: string;
  owner: string;
  href?: string;
  number?: number;
};

const team = [
  { initials: "MT", name: "Margaret", role: "Team Lead + Frontend", focus: "Repo ownership · frontend delivery · merge coordination" },
  { initials: "LS", name: "Lathithaa", role: "Backend Lead", focus: "FastAPI · data contracts · backend integration" },
  { initials: "ZO", name: "Zoe", role: "Backend + Pitch", focus: "Backend features · API endpoints · pitch lead" },
  { initials: "SI", name: "Sibongiseni", role: "Frontend Lead", focus: "Expo / React Native · screens · client integration" }
];

const prepTasks: BoardItem[] = [
  { title: "Lock challenge + success metric", lane: "todo", owner: "Team" },
  { title: "Write API contract before integration", lane: "todo", owner: "Zoe + Seni" },
  { title: "Frontend builds against mock fixtures", lane: "doing", owner: "Seni" },
  { title: "Backend health route + first tests", lane: "doing", owner: "Zoe" },
  { title: "Define 3-minute demo path", lane: "review", owner: "Lathithaa" },
  { title: "Protect main + use feature branches", lane: "review", owner: "Margaret" }
];

const laneOrder = [
  { key: "todo", name: "Queue" },
  { key: "doing", name: "Building" },
  { key: "review", name: "Review" },
  { key: "blocked", name: "Blocked" }
];

function issueLane(issue: Issue) {
  const labels = labelsOf(issue);
  for (const key of ["todo", "doing", "review", "blocked"]) {
    if (labels.includes(`status:${key}`)) return key;
  }
  return "todo";
}

function runClass(status: string, conclusion: string | null) {
  if (status !== "completed") return "wait";
  return conclusion === "success" ? "ok" : "bad";
}

export default async function Home() {
  const github = await getGitHubSnapshot();
  const boardItems: BoardItem[] = github.issues.length
    ? github.issues.map((issue) => ({
        title: issue.title,
        lane: issueLane(issue),
        owner: issue.assignees?.map((a) => a.login).join(", ") || "Unassigned",
        href: issue.html_url,
        number: issue.number
      }))
    : prepTasks;

  const repoUrl = `https://github.com/${github.repo}`;
  const travelSafeRepoUrl = "https://github.com/MargaretThomas/travel-safe";
  const healthyRuns = github.runs.filter((run) => run.conclusion === "success").length;

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">The Makers / Hackathon OS / 2026</div>
          <h1>One room. Four roles. One build.</h1>
          <p className="sub">
            Makers Lounge is the shared control room for ownership, GitHub work, API handoffs,
            build health, editor launch paths and pitch readiness. The dashboard treats GitHub as
            the source of truth so the team can work independently without losing coordination.
          </p>
        </div>
        <div className="live">
          <span className={`dot ${github.connected ? "on" : ""}`} />
          <span>{github.connected ? "GitHub live" : "GitHub setup required"}</span>
        </div>
      </header>

      <section className="grid">
        <article className="card signal">
          <div className="label" style={{ color: "#343820" }}>Hackathon start</div>
          <div className="metric">FRI 08:00</div>
          <p className="mini" style={{ color: "#343820" }}>Build day → optional sprint to midnight → Saturday return 08:30.</p>
        </article>

        <article className="card">
          <div className="label">Open work</div>
          <div className="metric">{boardItems.length}</div>
          <p className="mini">GitHub issues are the team task queue. Every feature should have one owner and one test path.</p>
        </article>

        <article className="card electric">
          <div className="label">Build signal</div>
          <div className="metric">{github.runs.length ? `${healthyRuns}/${github.runs.length}` : "—"}</div>
          <p className="mini">Recent GitHub Actions runs passing. No green build means no merge.</p>
        </article>

        <article className="card full">
          <div className="row">
            <div>
              <div className="eyebrow">Active product / Travel Safe</div>
              <h2 style={{ marginTop: 7 }}>South Africa safety intelligence backend</h2>
            </div>
            <span className="pill signal">FastAPI · Expo · SAPS data</span>
          </div>
          <p className="sub">
            Source of truth: MargaretThomas/travel-safe. Backend work follows the existing Python 3.12
            + FastAPI scaffold and frontend work follows Expo / React Native. Safety data work should
            extend the documented backend contract first, then expose verified SAPS-derived statistics
            and provider-specific provenance without bypassing team ownership.
          </p>
          <div className="actions">
            <a className="btn primary" href={travelSafeRepoUrl} target="_blank">Open Travel Safe repo</a>
            <a className="btn" href={`${travelSafeRepoUrl}/blob/main/backend/docs/architecture.md`} target="_blank">Backend contract</a>
            <a className="btn" href={`${repoUrl}/issues/1`} target="_blank">Integration research</a>
          </div>
        </article>

        <article className="card half">
          <div className="row">
            <h2>Team roles</h2>
            <span className="pill signal">4 makers</span>
          </div>
          {team.map((member) => (
            <div className="member row" key={member.name}>
              <div className="row" style={{ justifyContent: "flex-start" }}>
                <div className="avatar">{member.initials}</div>
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                </div>
              </div>
              <span className="mini" style={{ textAlign: "right", maxWidth: 230 }}>{member.focus}</span>
            </div>
          ))}
        </article>

        <article className="card half">
          <div className="row">
            <h2>Operating rule</h2>
            <span className="pill">Fast ≠ chaotic</span>
          </div>
          <div className="stack">
            <div className="command">ISSUE → feature/&lt;name&gt; → tests → PR → CI → team-lead merge</div>
            <div className="command">FRONTEND ⇄ contracts ⇄ BACKEND<br/>Mocks unblock UI before endpoints are ready.</div>
            <div className="command">EVERY PR: what changed · how to test · screenshots/logs · known gaps</div>
          </div>
          <div className="actions">
            <a className="btn primary" href={`${repoUrl}/issues/new`} target="_blank">Create task</a>
            <a className="btn" href={`${repoUrl}/pulls`} target="_blank">Open PRs</a>
          </div>
        </article>

        <article className="card full">
          <div className="row">
            <h2>Live sprint board</h2>
            <span className="pill">GitHub-backed</span>
          </div>
          <div className="board">
            {laneOrder.map((lane) => {
              const items = boardItems.filter((item) => item.lane === lane.key);
              return (
                <div className="lane" key={lane.key}>
                  <div className="lane-head"><span>{lane.name}</span><span>{items.length}</span></div>
                  <div className="stack">
                    {items.length ? items.map((item, index) => {
                      const content = (
                        <>
                          <div className="title">{item.title}</div>
                          <div className="meta"><span>{item.owner}</span>{item.number !== undefined ? <span>#{item.number}</span> : null}</div>
                        </>
                      );
                      return item.href ? <a className="task" href={item.href} target="_blank" key={`${item.title}-${index}`}>{content}</a> : <div className="task" key={`${item.title}-${index}`}>{content}</div>;
                    }) : <div className="mini">Nothing here. Keep it that way unless it is real work.</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="card wide">
          <div className="row">
            <h2>GitHub / PR / CI radar</h2>
            <span className="pill">{github.branches.length || 1} branches</span>
          </div>
          {!github.connected && <p className="mini">{github.error}</p>}
          <div className="stack">
            {github.pulls.slice(0, 4).map((pr) => (
              <a className="task" href={pr.html_url} target="_blank" key={pr.number}>
                <div className="title">PR #{pr.number} · {pr.title}</div>
                <div className="meta"><span>{pr.user?.login || "unknown"}</span><span>{pr.head?.ref}</span><span>{pr.draft ? "draft" : "ready"}</span></div>
              </a>
            ))}
            {!github.pulls.length && <div className="mini">No open PRs yet. Feature work should arrive here before main.</div>}
          </div>
          <div style={{ marginTop: 12 }}>
            {github.runs.slice(0, 4).map((run) => (
              <a className="run row" href={run.html_url} target="_blank" key={run.id}>
                <div><strong>{run.name}</strong><div className="mini">{run.head_branch}</div></div>
                <span className={`status ${runClass(run.status, run.conclusion)}`}>{run.conclusion || run.status}</span>
              </a>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Developer launch pad</h2>
          <div className="stack">
            <div><div className="label">Clone + setup</div><div className="command">git clone {repoUrl}.git<br/>cd MAKERS-LOUNGE-<br/>pnpm install</div></div>
            <div><div className="label">VS Code</div><div className="command">pnpm makers code</div></div>
            <div><div className="label">Xcode / iOS</div><div className="command">pnpm makers ios</div></div>
            <div><div className="label">GitHub status</div><div className="command">pnpm makers status</div></div>
          </div>
        </article>

        <article className="card half">
          <h2>Friday → Saturday runbook</h2>
          <div className="timeline">
            <div className="time">FRI 08:00</div><div>Challenge decode, user/problem statement, architecture, tickets.</div>
            <div className="time">FRI 10:00</div><div>Frontend on mocks. Backend on API + DB. Demo owner starts story early.</div>
            <div className="time">FRI 14:00</div><div>First vertical slice integrated and deployable.</div>
            <div className="time">FRI 18:00</div><div>Core feature freeze. Optional sprint is polish, bugs and demo safety.</div>
            <div className="time">SAT 08:30</div><div>Reconnect, smoke test production, pitch rehearsal.</div>
            <div className="time">SAT 12:00</div><div>Stop feature work. Submission, demo backup, final rehearsal.</div>
          </div>
        </article>

        <article className="card half">
          <h2>Definition of done</h2>
          <div>
            {["Feature has a GitHub issue + owner", "Code lives on a feature/fix branch", "Automated test or explicit manual test path exists", "PR explains what changed and how to verify it", "CI is green before merge", "API changes update the contract + mock", "Demo path still works after merge", "Known gaps are documented, not hidden"].map((item) => (
              <div className="check" key={item}><span className="box"/><span>{item}</span></div>
            ))}
          </div>
        </article>

        <article className="card full">
          <div className="row">
            <div><div className="eyebrow">Submission gate</div><h2 style={{ marginTop: 7 }}>Can we explain it, run it, recover it and prove each person’s contribution?</h2></div>
            <a className="btn primary" href={`${repoUrl}/tree/main/skills`} target="_blank">Open project skills</a>
          </div>
          <p className="sub">Final delivery should include a hosted URL when required, repository link, README/run instructions, architecture/API notes, test evidence, a short demo path, fallback screenshots/video, and clear contributor ownership.</p>
        </article>
      </section>
    </main>
  );
}
