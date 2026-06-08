"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  };

  const loginWithGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
  };

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes glow { 0%,100%{opacity:0.1} 50%{opacity:0.2} }
        .glass { background: rgba(22,27,34,0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .input-field { width: 100%; background: rgba(10,12,16,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; color: #e2e2e8; font-size: 14px; font-family: Inter, sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(0,219,233,0.5); box-shadow: 0 0 0 3px rgba(0,219,233,0.05); }
        .input-field::placeholder { color: #849495; }
        .btn-primary { width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #00dbe9, #00f0ff); color: #002022; font-size: 13px; font-weight: 700; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { box-shadow: 0 0 30px rgba(0,219,233,0.3); transform: translateY(-1px); }
        .btn-primary:disabled { background: rgba(0,219,233,0.2); color: #849495; cursor: not-allowed; transform: none; box-shadow: none; }
      `}</style>

      {/* Header */}
      <header style={{ padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: "0 0 20px rgba(0,219,233,0.3)" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "20%", left: "40%", width: 400, height: 400, background: "rgba(0,219,233,0.06)", borderRadius: "50%", filter: "blur(100px)", animation: "glow 4s infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "30%", width: 300, height: 300, background: "rgba(112,0,255,0.08)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>

          {/* Card */}
          <div className="glass" style={{ borderRadius: 24, padding: 40 }}>

            {/* Logo + title */}
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 auto 20px", boxShadow: "0 0 30px rgba(0,219,233,0.3)" }}>M</div>
              <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>Welcome back</h1>
              <p style={{ fontSize: 14, color: "#849495" }}>Sign in to your MockMate account</p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,180,171,0.08)", border: "1px solid rgba(255,180,171,0.2)", color: "#ffb4ab", fontSize: 13, marginBottom: 20 }}>
                {error}
              </div>
            )}

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email</label>
                <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && login()} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && login()} />
              </div>
            </div>

            <button className="btn-primary" onClick={login} disabled={loading} style={{ marginTop: 24 }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>

            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                <span style={{ fontSize: 11, color: "#849495", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.06em" }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              </div>
              <button onClick={loginWithGoogle}
                style={{ width: "100%", padding: "13px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#e2e2e8", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "Inter, sans-serif" }}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
                Continue with Google
              </button>
            </div>
            <div style={{ textAlign: "center", marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 14, color: "#849495" }}>Don't have an account? </span>
              <Link href="/signup" style={{ fontSize: 14, color: "#00dbe9", textDecoration: "none", fontWeight: 600 }}>Sign up free</Link>
            </div>

          </div>

          {/* Bottom note */}
          <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#849495", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.03em" }}>
            Pakistan's First AI Interview Simulator
          </p>
        </div>
      </main>
    </div>
  );
}
