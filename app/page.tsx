import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ background: "#0A0C10", color: "#e2e2e8", minHeight: "100vh", fontFamily: "Inter, sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes glow { 0%,100%{opacity:0.06} 50%{opacity:0.14} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .glass { background: rgba(22,27,34,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .glass:hover { border-color: rgba(0,219,233,0.35); }
        .btn-primary { background: #00dbe9; color: #002022; padding: 14px 32px; border-radius: 9999px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,219,233,0.35); }
        .btn-ghost { background: transparent; color: #dbfcff; padding: 14px 32px; border-radius: 9999px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .btn-ghost:hover { border-color: rgba(0,219,233,0.5); color: #00dbe9; }
        .feature-card { background: rgba(22,27,34,0.6); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; transition: all 0.3s; }
        .feature-card:hover { border-color: rgba(0,219,233,0.3); transform: translateY(-4px); }
        .pricing-card { background: rgba(22,27,34,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 32px; transition: all 0.3s; }
        .pricing-card.popular { border-color: rgba(0,219,233,0.5); background: rgba(0,219,233,0.04); }
        .step-card { background: rgba(22,27,34,0.6); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 24px; }
      `}</style>

      {/* Header */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(10,12,16,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", boxShadow: "0 0 20px rgba(0,219,233,0.3)" }}>M</div>
            <span style={{ fontSize: 21, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <a href="#features" style={{ fontSize: 13, color: "#849495", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>Features</a>
            <a href="#how" style={{ fontSize: 13, color: "#849495", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>How it works</a>
            <a href="#pricing" style={{ fontSize: 13, color: "#849495", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>Pricing</a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/company/login" style={{ fontSize: 12, color: "#00dbe9", textDecoration: "none", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", padding: "7px 16px", borderRadius: 9999, border: "1px solid rgba(0,219,233,0.3)", background: "rgba(0,219,233,0.06)" }}>
              For Companies
            </Link>
            <Link href="/login" style={{ fontSize: 13, color: "#849495", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>Sign In</Link>
            <Link href="/signup" className="btn-primary" style={{ padding: "9px 22px", fontSize: 12 }}>Get Started →</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: 800, height: 600, background: "rgba(0,219,233,0.07)", borderRadius: "50%", filter: "blur(120px)", animation: "glow 5s infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", left: "20%", width: 400, height: 400, background: "rgba(112,0,255,0.08)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "20%", width: 300, height: 300, background: "rgba(0,219,233,0.06)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 9999, background: "rgba(0,219,233,0.08)", border: "1px solid rgba(0,219,233,0.2)", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00dbe9", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Pakistan's First AI Interview Platform</span>
          </div>

          <h1 style={{ fontSize: "clamp(42px,6vw,76px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", fontFamily: "Geist, sans-serif", marginBottom: 28, color: "#fff" }}>
            Stop Practicing.<br />
            <span style={{ background: "linear-gradient(135deg, #00dbe9, #7df4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Start Interviewing.</span>
          </h1>

          <p style={{ fontSize: 19, lineHeight: 1.7, color: "#849495", maxWidth: 600, margin: "0 auto 48px" }}>
            Real-time AI voice interviews with a talking avatar. Adaptive questions, honest feedback, and proctoring built in. Used by companies across Pakistan to screen candidates automatically.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
            <Link href="/signup" className="btn-primary">Start Free Interview</Link>
            <Link href="/company/signup" className="btn-ghost">For Companies →</Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", background: "rgba(22,27,34,0.5)", backdropFilter: "blur(20px)" }}>
            {[
              ["Pakistan's First", "AI Interview Platform"],
              ["6 Dimensions", "Interview Scoring"],
              ["Real-time", "Voice + Proctoring"],
              ["B2B Ready", "Company Dashboard"],
            ].map(([num, label], i) => (
              <div key={label} style={{ flex: 1, minWidth: 160, padding: "24px 20px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#00dbe9", fontFamily: "Geist, sans-serif", marginBottom: 4 }}>{num}</div>
                <div style={{ fontSize: 11, color: "#849495", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.06em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: "100px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Simple Process</span>
          <h2 style={{ fontSize: 42, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", marginTop: 12, marginBottom: 16 }}>How MockMate works</h2>
          <p style={{ fontSize: 16, color: "#849495", maxWidth: 500, margin: "0 auto" }}>For candidates and companies — the entire process in minutes, not weeks.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 0, alignItems: "start", marginBottom: 60 }}>
          {/* Candidate flow */}
          <div>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#f95e14", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 9999, background: "rgba(249,94,20,0.08)", border: "1px solid rgba(249,94,20,0.2)" }}>For Candidates</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { n: "01", t: "Sign up free", d: "Create your account in 30 seconds. No credit card." },
                { n: "02", t: "Choose your role", d: "Pick your target role, experience level, and pressure mode." },
                { n: "03", t: "Interview with Alex", d: "Alex the AI interviews you by voice. Real questions, real pressure." },
                { n: "04", t: "Get honest feedback", d: "Scores across 6 dimensions with specific improvements." },
              ].map(({ n, t, d }) => (
                <div key={n} className="step-card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#f95e14", fontWeight: 700, minWidth: 28 }}>{n}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e2e8", marginBottom: 4 }}>{t}</div>
                    <div style={{ fontSize: 13, color: "#849495", lineHeight: 1.5 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ background: "rgba(255,255,255,0.08)", margin: "0 40px" }} />

          {/* Company flow */}
          <div>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 9999, background: "rgba(0,219,233,0.08)", border: "1px solid rgba(0,219,233,0.2)" }}>For Companies</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { n: "01", t: "Create a role", d: "Set up a job role with custom instructions for Alex." },
                { n: "02", t: "Share the link", d: "Send the interview link to all candidates. They click and go." },
                { n: "03", t: "AI screens everyone", d: "Alex interviews all candidates automatically. Proctored." },
                { n: "04", t: "Shortlist the best", d: "Review scores and reports. Shortlist with one click." },
              ].map(({ n, t, d }) => (
                <div key={n} className="step-card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", fontWeight: 700, minWidth: 28 }}>{n}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e2e8", marginBottom: 4 }}>{t}</div>
                    <div style={{ fontSize: 13, color: "#849495", lineHeight: 1.5 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "100px 24px", background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Everything you need</span>
            <h2 style={{ fontSize: 42, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", marginTop: 12 }}>Built different.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {[
              { icon: "🎤", title: "OpenAI Realtime Voice", desc: "Powered by OpenAI Realtime API — true voice conversation with sub-second response. No buttons, no typing. Just talk.", tag: "NEW" },
              { icon: "🧑‍💼", title: "Animated AI Interviewer", desc: "Alex is a realistic animated interviewer with lip sync, blinking, and emotional expressions. Feels like a real interview.", tag: null },
              { icon: "🧠", title: "Adaptive Questions", desc: "Mention React? Alex asks why you chose it over Vue. Every answer leads somewhere deeper and more challenging.", tag: null },
              { icon: "🔒", title: "Enterprise Proctoring", desc: "MediaPipe face detection, tab switch alerts, multi-person detection. Every session has a full integrity report.", tag: null },
              { icon: "📊", title: "6-Dimension Scoring", desc: "Communication, technical depth, STAR method, confidence, filler words, structure. Detailed and actionable.", tag: null },
              { icon: "🏢", title: "Company Dashboard", desc: "Full hiring portal. Create roles, share links, view reports, shortlist candidates, export to CSV.", tag: null },
              { icon: "⚡", title: "Strict Mode", desc: "Enable pressure mode for a challenging interviewer who pushes back on vague answers and demands specifics.", tag: null },
              { icon: "🇵🇰", title: "Pakistan-Focused", desc: "Built for Pakistani job market. Questions for FAST, NUST grads. Local companies, local context, Urdu/English mix.", tag: null },
              { icon: "📋", title: "Full Transcripts", desc: "Every interview is recorded with full transcript, proctoring report, and AI feedback stored securely.", tag: null },
            ].map(({ icon, title, desc, tag }) => (
              <div key={title} className="feature-card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 28 }}>{icon}</span>
                  {tag && <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", padding: "2px 8px", borderRadius: 9999, background: "rgba(0,219,233,0.1)", border: "1px solid rgba(0,219,233,0.2)", letterSpacing: "0.08em" }}>{tag}</span>}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#849495", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "100px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Simple pricing</span>
          <h2 style={{ fontSize: 42, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", marginTop: 12, marginBottom: 16 }}>For companies of all sizes</h2>
          <p style={{ fontSize: 16, color: "#849495" }}>Start free. Upgrade when you're ready to scale.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, maxWidth: 1000, margin: "0 auto" }}>
          {[
            { name: "Trial", price: "Free", period: "", interviews: "20 interviews", features: ["Full voice interviews", "AI scoring", "Proctoring", "Company dashboard", "CSV export"], cta: "Start Free", href: "/company/signup", popular: false },
            { name: "Starter", price: "$99", period: "/month", interviews: "50 interviews", features: ["Everything in Trial", "Priority support", "Custom role instructions", "Unlimited team members", "Advanced analytics"], cta: "Get Started", href: "/company/signup", popular: false },
            { name: "Growth", price: "$299", period: "/month", interviews: "200 interviews", features: ["Everything in Starter", "Bulk interview links", "ATS integration", "White-label option", "Dedicated support"], cta: "Get Started", href: "/company/signup", popular: true },
            { name: "Enterprise", price: "Custom", period: "", interviews: "Unlimited", features: ["Everything in Growth", "Custom AI training", "SLA guarantee", "On-premise option", "API access"], cta: "Contact Us", href: "/company/signup", popular: false },
          ].map(({ name, price, period, interviews, features, cta, href, popular }) => (
            <div key={name} className={`pricing-card${popular ? " popular" : ""}`} style={{ position: "relative" }}>
              {popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#002022", background: "#00dbe9", padding: "3px 14px", borderRadius: 9999, letterSpacing: "0.08em", fontWeight: 700, whiteSpace: "nowrap" }}>MOST POPULAR</div>
              )}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>{name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, fontFamily: "Geist, sans-serif", color: popular ? "#00dbe9" : "#fff" }}>{price}</span>
                  <span style={{ fontSize: 14, color: "#849495" }}>{period}</span>
                </div>
                <div style={{ fontSize: 12, color: "#849495", marginTop: 6, fontFamily: "JetBrains Mono, monospace" }}>{interviews}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: popular ? "#00dbe9" : "#849495", fontSize: 14 }}>✓</span>
                    <span style={{ fontSize: 13, color: "#b9cacb" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href={href} style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 10, background: popular ? "linear-gradient(135deg, #00dbe9, #00f0ff)" : "rgba(255,255,255,0.06)", border: popular ? "none" : "1px solid rgba(255,255,255,0.1)", color: popular ? "#002022" : "#e2e2e8", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", textDecoration: "none", letterSpacing: "0.05em" }}>
                {cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ borderRadius: 24, padding: "64px 48px", textAlign: "center", background: "linear-gradient(135deg, rgba(0,219,233,0.08), rgba(112,0,255,0.08))", border: "1px solid rgba(0,219,233,0.2)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: "rgba(0,219,233,0.06)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Get started today</span>
            <h2 style={{ fontSize: 48, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", margin: "16px 0 16px" }}>
              Ready to hire smarter?
            </h2>
            <p style={{ fontSize: 17, color: "#849495", marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
              Join companies already using MockMate to screen candidates 10x faster. Free trial — no credit card required.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/company/signup" className="btn-primary">Start Free Trial →</Link>
              <Link href="/signup" className="btn-ghost">Try as Candidate</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "60px 24px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48, flexWrap: "wrap" }}>
            
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#dbfcff", fontFamily: "Geist, sans-serif" }}>MockMate</span>
              </div>
              <p style={{ fontSize: 14, color: "#849495", lineHeight: 1.7, maxWidth: 280 }}>Pakistan's first AI-powered interview simulator. Practice interviews, screen candidates, and hire smarter.</p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <a href="mailto:contact@mockmate.pk" style={{ fontSize: 12, color: "#00dbe9", textDecoration: "none", fontFamily: "JetBrains Mono, monospace" }}>contact@mockmate.pk</a>
              </div>
            </div>

            {/* Product */}
            <div>
              <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Product</div>
              {[
                { label: "For Candidates", href: "/signup" },
                { label: "For Companies", href: "/company/signup" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Features", href: "/#features" },
                { label: "How it works", href: "/#how" },
              ].map(({ label, href }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <Link href={href} style={{ fontSize: 14, color: "#849495", textDecoration: "none" }}>{label}</Link>
                </div>
              ))}
            </div>

            {/* Company */}
            <div>
              <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Company</div>
              {[
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Blog", href: "/blog" },
              ].map(({ label, href }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <Link href={href} style={{ fontSize: 14, color: "#849495", textDecoration: "none" }}>{label}</Link>
                </div>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Legal</div>
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map(({ label, href }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <Link href={href} style={{ fontSize: 14, color: "#849495", textDecoration: "none" }}>{label}</Link>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#5a6870", fontFamily: "JetBrains Mono, monospace" }}>© 2026 MockMate · Pakistan's First AI Interview Platform</span>
            <div style={{ display: "flex", gap: 20 }}>
              <Link href="/privacy" style={{ fontSize: 12, color: "#5a6870", textDecoration: "none" }}>Privacy</Link>
              <Link href="/terms" style={{ fontSize: 12, color: "#5a6870", textDecoration: "none" }}>Terms</Link>
              <Link href="/contact" style={{ fontSize: 12, color: "#5a6870", textDecoration: "none" }}>Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
