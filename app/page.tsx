import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ background: "#0A0C10", color: "#e2e2e8", minHeight: "100vh", fontFamily: "Inter, sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes glow { 0%,100%{opacity:0.1} 50%{opacity:0.2} }
        .glass { background: rgba(22,27,34,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .glass:hover { border-color: rgba(0,219,233,0.4); box-shadow: 0 0 25px rgba(0,219,233,0.15); }
        .btn-primary { background: #00dbe9; color: #002022; padding: 14px 32px; border-radius: 9999px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-primary:hover { box-shadow: 0 0 30px rgba(0,219,233,0.4); transform: translateY(-1px); }
        .btn-ghost { background: transparent; color: #dbfcff; padding: 14px 32px; border-radius: 9999px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-ghost:hover { border-color: rgba(0,219,233,0.5); color: #00dbe9; }
      `}</style>

      {/* Header */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(10,12,16,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link href="/company/login" style={{ fontSize: 12, color: "#00dbe9", textDecoration: "none", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", padding: "6px 14px", borderRadius: 9999, border: "1px solid rgba(0,219,233,0.3)", background: "rgba(0,219,233,0.06)" }}>
              For Companies →
            </Link>
            <Link href="/login" style={{ fontSize: 13, color: "#849495", textDecoration: "none", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em" }}>
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary" style={{ padding: "8px 20px", fontSize: 12 }}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "rgba(0,219,233,0.08)", borderRadius: "50%", filter: "blur(100px)", animation: "glow 4s infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "30%", width: 300, height: 300, background: "rgba(112,0,255,0.1)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 9999, background: "rgba(0,219,233,0.08)", border: "1px solid rgba(0,219,233,0.2)", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00dbe9", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Pakistan's First AI Interview Simulator</span>
          </div>

          <h1 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", fontFamily: "Geist, sans-serif", marginBottom: 24, color: "#fff" }}>
            Practice interviews.<br />
            <span style={{ background: "linear-gradient(135deg, #00dbe9, #7df4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Get hired.</span>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.7, color: "#b9cacb", maxWidth: 580, margin: "0 auto 48px" }}>
            Real-time AI voice interviews that adapt to your answers, challenge vague responses, and give brutally honest feedback. Built for Pakistani students.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" className="btn-primary">Start Free Interview</Link>
            <Link href="/login" className="btn-ghost">Sign In</Link>
          </div>

          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
            {[["10k+", "Interviews Done"], ["94%", "Satisfaction Rate"], ["3x", "Interview Success"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#00dbe9", fontFamily: "Geist, sans-serif", letterSpacing: "-0.02em" }}>{num}</div>
                <div style={{ fontSize: 12, color: "#849495", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Why MockMate</span>
          <h2 style={{ fontSize: 40, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", marginTop: 12 }}>Built different.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { icon: "🎤", title: "Voice AI Interview", desc: "Real conversation with an AI that listens, reacts, and adapts — just like a human interviewer." },
            { icon: "🧠", title: "Adaptive Follow-ups", desc: "Mention React? Alex asks why you chose it over Vue. Every answer leads somewhere real." },
            { icon: "⚡", title: "Pressure Mode", desc: "Enable strict mode and face a challenging, impatient interviewer who won't accept vague answers." },
            { icon: "🇵🇰", title: "Pakistan-Focused", desc: "Questions tailored for FAST, NUST, Systems Limited, Arbisoft, and local software house culture." },
            { icon: "📊", title: "Honest Feedback", desc: "Detailed scores on communication, technical depth, STAR method, and filler word usage." },
            { icon: "🔒", title: "Proctored for Companies", desc: "Face detection, tab switching alerts, multi-person detection — enterprise-grade integrity." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="glass" style={{ borderRadius: 16, padding: 24, transition: "all 0.3s" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#849495", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Company CTA */}
      <section style={{ padding: "40px 24px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="glass" style={{ borderRadius: 24, padding: "48px 40px", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center", borderColor: "rgba(0,219,233,0.2)" }}>
          <div>
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>For Companies</span>
            <h2 style={{ fontSize: 28, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", marginTop: 8, marginBottom: 8 }}>Screen 200 candidates in 24 hours</h2>
            <p style={{ color: "#849495", fontSize: 15 }}>AI interviews every candidate automatically. Proctored. Scored. Shortlisted.</p>
          </div>
          <Link href="/company/signup" style={{ padding: "14px 28px", borderRadius: 9999, background: "linear-gradient(135deg, #00dbe9, #00f0ff)", color: "#002022", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", textDecoration: "none", whiteSpace: "nowrap", textTransform: "uppercase" }}>
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize: 12, color: "#849495", fontFamily: "JetBrains Mono, monospace" }}>© 2026 MockMate — Built for Pakistani Students & Companies</span>
      </footer>
    </div>
  );
}
