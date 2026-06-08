"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!name || !email || !password) { setError("All fields required"); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: undefined,
      }
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setLoading(false);
    setStep("verify");
  };

  const verify = async () => {
    if (!otp) { setError("Enter the code"); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });
    if (error) { setError("Invalid or expired code. Try again."); setLoading(false); return; }
    router.push("/onboarding");
  };

  const signupWithGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
  };

  const resend = async () => {
    const supabase = createClient();
    await supabase.auth.resend({ type: "signup", email });
    setError("New code sent!");
  };

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .glass { background: rgba(22,27,34,0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .input-field { width: 100%; background: rgba(10,12,16,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; color: #e2e2e8; font-size: 14px; font-family: Inter, sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(0,219,233,0.5); }
        .input-field::placeholder { color: #849495; }
        .otp-input { width: 100%; background: rgba(10,12,16,0.8); border: 2px solid rgba(0,219,233,0.3); border-radius: 14px; padding: 20px 16px; color: #00dbe9; font-size: 32px; font-family: 'JetBrains Mono', monospace; outline: none; box-sizing: border-box; text-align: center; letter-spacing: 8px; transition: border-color 0.2s; }
        .otp-input:focus { border-color: rgba(0,219,233,0.7); box-shadow: 0 0 20px rgba(0,219,233,0.1); }
        label { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #849495; letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 8px; }
      `}</style>

      <header style={{ padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div className="glass" style={{ borderRadius: 24, padding: 40 }}>

            {step === "signup" ? (
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 auto 16px", boxShadow: "0 0 30px rgba(0,219,233,0.3)" }}>M</div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 8 }}>Create account</h1>
                  <p style={{ fontSize: 14, color: "#849495" }}>Start practicing interviews for free</p>
                </div>

                {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,180,171,0.08)", border: "1px solid rgba(255,180,171,0.2)", color: "#ffb4ab", fontSize: 13, marginBottom: 20 }}>{error}</div>}

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label>Full Name</label>
                    <input className="input-field" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div>
                    <label>Email</label>
                    <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label>Password</label>
                    <input className="input-field" type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && signup()} />
                  </div>
                </div>

                <button onClick={signup} disabled={loading}
                  style={{ width: "100%", marginTop: 24, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #00dbe9, #00f0ff)", color: "#002022", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
                  {loading ? "Creating account..." : "Create Account →"}
                </button>

                <div style={{ marginTop: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                    <span style={{ fontSize: 11, color: "#849495", fontFamily: "JetBrains Mono, monospace" }}>OR</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                  </div>
                  <button onClick={signupWithGoogle}
                    style={{ width: "100%", padding: "13px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#e2e2e8", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
                    Continue with Google
                  </button>
                </div>

                <div style={{ textAlign: "center", marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 14, color: "#849495" }}>Already have an account? </span>
                  <Link href="/login" style={{ fontSize: 14, color: "#00dbe9", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 8 }}>Check your email</h1>
                  <p style={{ fontSize: 14, color: "#849495", lineHeight: 1.6 }}>
                    We sent a 6-digit code to<br />
                    <span style={{ color: "#00dbe9", fontFamily: "JetBrains Mono, monospace" }}>{email}</span>
                  </p>
                </div>

                {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: error === "New code sent!" ? "rgba(0,219,233,0.08)" : "rgba(255,180,171,0.08)", border: `1px solid ${error === "New code sent!" ? "rgba(0,219,233,0.2)" : "rgba(255,180,171,0.2)"}`, color: error === "New code sent!" ? "#00dbe9" : "#ffb4ab", fontSize: 13, marginBottom: 20 }}>{error}</div>}

                <div style={{ marginBottom: 24 }}>
                  <label>Verification Code</label>
                  <input className="otp-input" placeholder="00000000" maxLength={8} value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={e => e.key === "Enter" && verify()} />
                </div>

                <button onClick={verify} disabled={loading || otp.length < 8}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none",
                    background: otp.length >= 6 ? "linear-gradient(135deg, #00dbe9, #00f0ff)" : "rgba(0,219,233,0.2)",
                    color: otp.length >= 6 ? "#002022" : "#849495",
                    fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase", cursor: otp.length >= 6 ? "pointer" : "not-allowed" }}>
                  {loading ? "Verifying..." : "Verify & Continue →"}
                </button>

                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <span style={{ fontSize: 13, color: "#849495" }}>Didn't receive it? </span>
                  <button onClick={resend} style={{ fontSize: 13, color: "#00dbe9", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Resend code</button>
                </div>

                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <button onClick={() => setStep("signup")} style={{ fontSize: 13, color: "#849495", background: "none", border: "none", cursor: "pointer" }}>← Back</button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
