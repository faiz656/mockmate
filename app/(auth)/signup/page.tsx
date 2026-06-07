"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/onboarding");
  };

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes glow { 0%,100%{opacity:0.1} 50%{opacity:0.2} }
        .glass { background: rgba(22,27,34,0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .input-field { width: 100%; background: rgba(10,12,16,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; color: #e2e2e8; font-size: 14px; font-family: Inter, sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(0,219,233,0.5); box-shadow: 0 0 0 3px rgba(0,219,233,0.05); }
        .input-field::placeholder { color: #849495; }
        .btn-primary { width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #00dbe9, #00f0ff); color: #002022; font-size: 13px; font-weight: 700; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { box-shadow: 0 0 30px rgba(0,219,233,0.3); transform: translateY(-1px); }
        .btn-primary:disabled { background: rgba(0,219,233,0.2); color: #849495; cursor: not-allowed; transform: none; box-shadow: none; }
        .feature-item { display: flex; align-items: center; gap: 10; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
      `}</style>

      {/* Header */}
      <header style={{ padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </Link>
          <Link href="/login" style={{ fontSize: 13, color: "#849495", textDecoration: "none", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em" }}>
            Already have an account? Sign in →
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: "10%", left: "35%", width: 500, height: 500, background: "rgba(0,219,233,0.05)", borderRadius: "50%", filter: "blur(120px)", animation: "glow 5s infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "25%", width: 300, height: 300, background: "rgba(112,0,255,0.07)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 900, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>

          {/* Left: Features */}
          <div>
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Free to start</span>
            <h1 style={{ fontSize: 36, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", margin: "12px 0 16px", lineHeight: 1.2 }}>
              Practice smarter.<br />
              <span style={{ background: "linear-gradient(135deg, #00dbe9, #7df4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Get hired faster.</span>
            </h1>
            <p style={{ fontSize: 15, color: "#849495", lineHeight: 1.6, marginBottom: 32 }}>
              Join Pakistani students preparing for interviews at top software houses and startups.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { icon: "🎤", text: "Real-time voice AI interview" },
                { icon: "🧠", text: "Adaptive follow-up questions" },
                { icon: "⚡", text: "Pressure mode simulation" },
                { icon: "🇵🇰", text: "Pakistan-focused question bank" },
                { icon: "📊", text: "Detailed performance report" },
              ].map(({ icon, text }) => (
                <div key={text} className="feature-item">
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ fontSize: 14, color: "#b9cacb" }}>{text}</span>
                  <span style={{ marginLeft: "auto", color: "#00dbe9", fontSize: 14 }}>✓</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="glass" style={{ borderRadius: 24, padding: 36 }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.01em", marginBottom: 6 }}>Create your account</h2>
              <p style={{ fontSize: 13, color: "#849495" }}>Free forever. No credit card required.</p>
            </div>

            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,180,171,0.08)", border: "1px solid rgba(255,180,171,0.2)", color: "#ffb4ab", fontSize: 13, marginBottom: 20 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Full Name</label>
                <input className="input-field" placeholder="Faiz Ahmed" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email</label>
                <input className="input-field" type="email" placeholder="faiz@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Password</label>
                <input className="input-field" type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && signup()} />
              </div>
            </div>

            <button className="btn-primary" onClick={signup} disabled={loading} style={{ marginTop: 24 }}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#849495" }}>
              By signing up you agree to our{" "}
              <span style={{ color: "#00dbe9", cursor: "pointer" }}>Terms of Service</span>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
