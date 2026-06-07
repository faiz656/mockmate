"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CompanyLoginPage() {
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
    router.push("/company/dashboard");
  };

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .glass { background: rgba(22,27,34,0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .input-field { width: 100%; background: rgba(10,12,16,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; color: #e2e2e8; font-size: 14px; font-family: Inter, sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(0,219,233,0.5); }
        .input-field::placeholder { color: #849495; }
        label { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #849495; letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 8px; }
      `}</style>

      <div style={{ maxWidth: 400, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 8 }}>Company Sign In</h1>
          <p style={{ fontSize: 14, color: "#849495" }}>Access your hiring dashboard</p>
        </div>

        <div className="glass" style={{ borderRadius: 20, padding: 32 }}>
          {error && <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,180,171,0.08)", border: "1px solid rgba(255,180,171,0.2)", color: "#ffb4ab", fontSize: 13, marginBottom: 20 }}>{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label>Work Email</label>
              <input className="input-field" type="email" placeholder="hr@company.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
            </div>
          </div>

          <button onClick={login} disabled={loading}
            style={{ width: "100%", marginTop: 20, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #00dbe9, #00f0ff)", color: "#002022", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#849495" }}>
            No account?{" "}
            <Link href="/company/signup" style={{ color: "#00dbe9", textDecoration: "none", fontWeight: 600 }}>Start free trial →</Link>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#849495" }}>
          Candidate?{" "}
          <Link href="/login" style={{ color: "#849495", textDecoration: "underline" }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
