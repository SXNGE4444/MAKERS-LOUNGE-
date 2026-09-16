export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <main className="shell" style={{ maxWidth: 720, minHeight: "100vh", display: "grid", alignItems: "center" }}>
      <section className="card full" style={{ padding: 28 }}>
        <div className="eyebrow">The Makers / Private Control Room</div>
        <h1 style={{ fontSize: "clamp(44px, 9vw, 82px)" }}>Enter the room.</h1>
        <p className="sub">Use the shared dashboard access key. GitHub credentials stay server-side and are never entered here.</p>
        <form method="post" action="/api/session" className="stack" style={{ marginTop: 24 }}>
          <label className="label" htmlFor="key">Team access key</label>
          <input id="key" name="key" type="password" required autoFocus style={{ minHeight: 48, borderRadius: 12, border: "1px solid var(--line)", background: "#090a0c", color: "var(--paper)", padding: "0 14px" }} />
          <button className="btn primary" type="submit">Enter Makers Lounge</button>
        </form>
      </section>
    </main>
  );
}
