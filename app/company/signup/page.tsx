"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CompanySignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", industry: "" });
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const verify = async () => {
    if (!otp) { setError("Enter the code"); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: form.email,
      token: otp,
      type: "signup",
    });
    if (verifyError) { setError("Invalid or expired code."); setLoading(false); return; }
    router.push("/company/dashboard");
  };

  const resendOtp = async () => {
    const supabase = createClient();
    await supabase.auth.resend({ type: "signup", email: form.email });
    setError("New code sent!");
  };

  const signup = async () => {
    if (!form.name || !form.email || !form.password) { setError("All fields required"); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();

    // Step 1: Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, account_type: "company" } }
    });

    if (authError) { setError(authError.message); setLoading(false); return; }
    if (!authData.user) { setError("Signup failed. Try again."); setLoading(false); return; }

    // Step 2: Sign in immediately to get valid session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (signInError) { setError(signInError.message); setLoading(false); return; }

    // Step 3: Now create company record with valid session
    const { error: companyError } = await supabase.from("companies").insert({
      id: authData.user.id,
      name: form.name,
      email: form.email,
      industry: form.industry,
      plan: "trial",
      interview_limit: 20,
      interviews_used: 0,
    });

    if (companyError) {
      console.error("Company insert error:", companyError);
      setError("Account created but company setup failed: " + companyError.message);
      setLoading(false);
      return;
    }

    setStep("verify");
    setLoading(false);
    return;
  };

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .glass { background: rgba(22,27,34,0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .input-field { width: 100%; background: rgba(10,12,16,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; color: #e2e2e8; font-size: 14px; font-family: Inter, sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(0,219,233,0.5); }
        .input-field::placeholder { color: #849495; }
        label { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #849495; letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 8px; }
      `}</style>

      <header style={{ padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </Link>
          <Link href="/company/login" style={{ fontSize: 13, color: "#849495", textDecoration: "none", fontFamily: "JetBrains Mono, monospace" }}>
            Already have an account? Sign in →
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 400, background: "rgba(0,219,233,0.05)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />

        {step === "verify" ? (
          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
            <div className="glass" style={{ borderRadius: 24, padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 8 }}>Check your email</h1>
              <p style={{ fontSize: 14, color: "#849495", lineHeight: 1.6, marginBottom: 24 }}>
                We sent a 6-digit code to<br />
                <span style={{ color: "#00dbe9", fontFamily: "JetBrains Mono, monospace" }}>{form.email}</span>
              </p>
              {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: error === "New code sent!" ? "rgba(0,219,233,0.08)" : "rgba(255,180,171,0.08)", border: "1px solid rgba(255,180,171,0.2)", color: error === "New code sent!" ? "#00dbe9" : "#ffb4ab", fontSize: 13, marginBottom: 20 }}>{error}</div>}
              <input
                placeholder="000000" maxLength={6} value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={e => e.key === "Enter" && verify()}
                style={{ width: "100%", background: "rgba(10,12,16,0.8)", border: "2px solid rgba(0,219,233,0.3)", borderRadius: 14, padding: "20px 16px", color: "#00dbe9", fontSize: 32, fontFamily: "JetBrains Mono, monospace", outline: "none", boxSizing: "border-box", textAlign: "center", letterSpacing: 12, marginBottom: 20 }} />
              <button onClick={verify} disabled={loading || otp.length < 6}
                style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: otp.length === 6 ? "linear-gradient(135deg, #00dbe9, #00f0ff)" : "rgba(0,219,233,0.2)", color: otp.length === 6 ? "#002022" : "#849495", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase", cursor: otp.length === 6 ? "pointer" : "not-allowed" }}>
                {loading ? "Verifying..." : "Verify & Continue →"}
              </button>
              <div style={{ marginTop: 16 }}>
                <button onClick={resendOtp} style={{ fontSize: 13, color: "#00dbe9", background: "none", border: "none", cursor: "pointer" }}>Resend code</button>
                {" · "}
                <button onClick={() => setStep("signup")} style={{ fontSize: 13, color: "#849495", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
              </div>
            </div>
          </div>
        ) : (
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 900, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>

          <div>
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>For Companies</span>
            <h1 style={{ fontSize: 36, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", margin: "12px 0 16px", lineHeight: 1.2 }}>
              Screen 200 candidates.<br />
              <span style={{ background: "linear-gradient(135deg, #00dbe9, #7df4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>In 24 hours.</span>
            </h1>
            <p style={{ fontSize: 15, color: "#849495", lineHeight: 1.6, marginBottom: 32 }}>
              AI interviews every candidate automatically. You just review the shortlist.
            </p>
            {[
              { icon: "🎤", text: "AI conducts real voice interviews" },
              { icon: "📊", text: "Detailed scores for every candidate" },
              { icon: "🔒", text: "Built-in proctoring and cheat detection" },
              { icon: "⚡", text: "Shortlist in one click" },
              { icon: "📤", text: "Export data to CSV or your ATS" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 14, color: "#b9cacb" }}>{text}</span>
                <span style={{ marginLeft: "auto", color: "#00dbe9" }}>✓</span>
              </div>
            ))}
            <div style={{ marginTop: 24, padding: "16px", background: "rgba(0,219,233,0.06)", border: "1px solid rgba(0,219,233,0.15)", borderRadius: 12 }}>
              <p style={{ fontSize: 13, color: "#00dbe9", fontFamily: "JetBrains Mono, monospace" }}>
                🎉 Trial includes 20 free interviews. No credit card required.
              </p>
            </div>
          </div>

          <div className="glass" style={{ borderRadius: 24, padding: 36 }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 6 }}>Create company account</h2>
              <p style={{ fontSize: 13, color: "#849495" }}>Start your free 20-interview trial today.</p>
            </div>

            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,180,171,0.08)", border: "1px solid rgba(255,180,171,0.2)", color: "#ffb4ab", fontSize: 13, marginBottom: 20 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label>Company Name</label>
                <input className="input-field" placeholder="Home Implements Ltd." value={form.name} onChange={e => update("name", e.target.value)} />
              </div>
              <div>
                <label>Industry</label>
                <select className="input-field" value={form.industry} onChange={e => update("industry", e.target.value)}>
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="retail">Retail / E-commerce</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="finance">Finance / Banking</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label>Work Email</label>
                <input className="input-field" type="email" placeholder="hr@company.com" value={form.email} onChange={e => update("email", e.target.value)} />
              </div>
              <div>
                <label>Password</label>
                <input className="input-field" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => update("password", e.target.value)}
                  onKeyDown={e => e.key === "Enter" && signup()} />
              </div>
            </div>

            <button onClick={signup} disabled={loading}
              style={{ width: "100%", marginTop: 24, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #00dbe9, #00f0ff)", color: "#002022", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
              {loading ? "Creating account..." : "Start Free Trial →"}
            </button>

            <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#849495" }}>
              Looking to practice interviews?{" "}
              <Link href="/signup" style={{ color: "#00dbe9", textDecoration: "none" }}>Candidate signup →</Link>
            </p>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}
