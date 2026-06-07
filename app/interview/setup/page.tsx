"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { InterviewConfig } from "@/types/interview";

const ROLES = [
  { value: "fullstack_developer", label: "Full Stack Developer", icon: "⚡" },
  { value: "frontend_developer", label: "Frontend Developer", icon: "🎨" },
  { value: "backend_developer", label: "Backend Developer", icon: "⚙️" },
  { value: "mobile_developer", label: "Mobile Developer", icon: "📱" },
  { value: "data_scientist", label: "Data Scientist", icon: "📊" },
  { value: "devops_engineer", label: "DevOps Engineer", icon: "🔧" },
];

export default function SetupPage() {
  const router = useRouter();
  const [config, setConfig] = useState<Partial<InterviewConfig>>({
    language: "mix", pressure: "friendly", type: "mixed", experience: "fresh", company: "software_house",
  });

  const update = (key: keyof InterviewConfig, value: string) =>
    setConfig(prev => ({ ...prev, [key]: value }));

  const start = () => {
    if (!config.role || !config.candidateName) return;
    localStorage.setItem("interview_config", JSON.stringify(config));
    router.push("/interview/room");
  };

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .glass { background: rgba(22,27,34,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .option-btn { background: rgba(22,27,34,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 16px; color: #b9cacb; font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; }
        .option-btn:hover { border-color: rgba(0,219,233,0.4); color: #00dbe9; }
        .option-btn.active { background: rgba(0,219,233,0.1); border-color: rgba(0,219,233,0.5); color: #00dbe9; box-shadow: 0 0 15px rgba(0,219,233,0.15); }
        .option-btn.strict.active { background: rgba(255,180,171,0.1); border-color: rgba(255,180,171,0.5); color: #ffb4ab; }
        .role-card { background: rgba(22,27,34,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
        .role-card:hover { border-color: rgba(0,219,233,0.4); }
        .role-card.active { background: rgba(0,219,233,0.08); border-color: rgba(0,219,233,0.5); box-shadow: 0 0 20px rgba(0,219,233,0.1); }
        .input-field { width: 100%; background: rgba(26,28,32,0.9); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 16px; color: #e2e2e8; font-size: 14px; font-family: Inter, sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(0,219,233,0.5); }
        .input-field::placeholder { color: #849495; }
        label { font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; text-transform: uppercase; color: #849495; display: block; margin-bottom: 10px; }
      `}</style>

      {/* Header */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(10,12,16,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00dbe9", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.08em" }}>SETUP MODE</span>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 100, paddingBottom: 60, maxWidth: 720, margin: "0 auto", padding: "100px 24px 60px" }}>
        {/* Page title */}
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Configure Session</span>
          <h1 style={{ fontSize: 36, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", marginTop: 8, marginBottom: 8 }}>Setup Your Interview</h1>
          <p style={{ color: "#849495", fontSize: 15 }}>Configure Alex to simulate your exact target interview.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Name */}
          <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
            <label>Your Name</label>
            <input className="input-field" placeholder="e.g. Faiz Ahmed" value={config.candidateName || ""}
              onChange={e => update("candidateName", e.target.value)} />
          </div>

          {/* Role */}
          <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
            <label>Target Role</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {ROLES.map(r => (
                <div key={r.value} className={`role-card${config.role === r.value ? " active" : ""}`}
                  onClick={() => update("role", r.value)}>
                  <span style={{ fontSize: 20 }}>{r.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: config.role === r.value ? "#00dbe9" : "#e2e2e8" }}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience + Language + Mode in one row of cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>

            <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
              <label>Experience</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["fresh", "Fresh Grad"], ["1_2_years", "1–2 Years"], ["3_5_years", "3–5 Years"]].map(([v, l]) => (
                  <button key={v} className={`option-btn${config.experience === v ? " active" : ""}`}
                    onClick={() => update("experience", v)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
              <label>Language</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["english", "English"], ["urdu", "Urdu"], ["mix", "Mix (Recommended)"]].map(([v, l]) => (
                  <button key={v} className={`option-btn${config.language === v ? " active" : ""}`}
                    onClick={() => update("language", v)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
              <label>Interview Mode</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className={`option-btn${config.pressure === "friendly" ? " active" : ""}`}
                  onClick={() => update("pressure", "friendly")}>Friendly</button>
                <button className={`option-btn strict${config.pressure === "strict" ? " active" : ""}`}
                  onClick={() => update("pressure", "strict")}>⚡ Strict Mode</button>
              </div>
              {config.pressure === "strict" && (
                <p style={{ fontSize: 11, color: "#ffb4ab", marginTop: 10, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.03em" }}>
                  Alex will challenge every weak answer.
                </p>
              )}
            </div>

          </div>

          {/* Start Button */}
          <button onClick={start} disabled={!config.role || !config.candidateName}
            style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", cursor: config.role && config.candidateName ? "pointer" : "not-allowed",
              background: config.role && config.candidateName ? "linear-gradient(135deg, #00dbe9, #00f0ff)" : "rgba(0,219,233,0.2)",
              color: config.role && config.candidateName ? "#002022" : "#849495",
              fontSize: 14, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "all 0.2s", boxShadow: config.role && config.candidateName ? "0 0 30px rgba(0,219,233,0.3)" : "none" }}>
            {config.role && config.candidateName ? "Start Interview →" : "Fill in details to continue"}
          </button>

        </div>
      </main>
    </div>
  );
}
