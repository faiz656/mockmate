"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateRolePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", department: "", experience: "fresh",
    language: "english", pressure: "friendly", type: "mixed",
    custom_instructions: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const create = async () => {
    if (!form.title) { setError("Role title is required"); return; }
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/company/login"); return; }

    const { data, error: err } = await supabase.from("roles").insert({
      company_id: user.id,
      title: form.title,
      department: form.department,
      experience: form.experience,
      language: form.language,
      pressure: form.pressure,
      type: form.type,
      custom_instructions: form.custom_instructions,
      active: true,
    }).select().single();

    if (err) { setError(err.message); setLoading(false); return; }
    router.push(`/company/roles/${data.id}`);
  };

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .glass { background: rgba(22,27,34,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .input-field { width: 100%; background: rgba(10,12,16,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 16px; color: #e2e2e8; font-size: 14px; font-family: Inter, sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(0,219,233,0.5); }
        .input-field::placeholder { color: #849495; }
        .opt { background: rgba(22,27,34,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 9px 16px; color: #b9cacb; font-size: 12px; font-family: 'JetBrains Mono', monospace; cursor: pointer; transition: all 0.2s; }
        .opt.active { background: rgba(0,219,233,0.1); border-color: rgba(0,219,233,0.4); color: #00dbe9; }
        label { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #849495; letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 8px; }
      `}</style>

      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(10,12,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <button onClick={() => router.push("/company/dashboard")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </button>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>CREATE ROLE</span>
        </div>
      </header>

      <main style={{ paddingTop: 88, maxWidth: 680, margin: "0 auto", padding: "88px 24px 60px" }}>
        <div style={{ marginBottom: 36 }}>
          <button onClick={() => router.push("/company/dashboard")} style={{ fontSize: 12, color: "#849495", background: "none", border: "none", cursor: "pointer", fontFamily: "JetBrains Mono, monospace", marginBottom: 16 }}>← Back to Dashboard</button>
          <h1 style={{ fontSize: 32, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 8 }}>Create Interview Role</h1>
          <p style={{ color: "#849495", fontSize: 15 }}>Configure how Alex will interview candidates for this position.</p>
        </div>

        {error && <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,180,171,0.08)", border: "1px solid rgba(255,180,171,0.2)", color: "#ffb4ab", fontSize: 13, marginBottom: 20 }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#dbfcff", marginBottom: 16, fontFamily: "Geist, sans-serif" }}>Role Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label>Job Title</label>
                <input className="input-field" placeholder="e.g. Sales Executive, Software Engineer" value={form.title} onChange={e => update("title", e.target.value)} />
              </div>
              <div>
                <label>Department</label>
                <input className="input-field" placeholder="e.g. Sales, Engineering, HR" value={form.department} onChange={e => update("department", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#dbfcff", marginBottom: 16, fontFamily: "Geist, sans-serif" }}>Interview Configuration</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label>Experience Level</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["fresh", "Fresh Grad"], ["1_2_years", "1-2 Years"], ["3_5_years", "3-5 Years"]].map(([v, l]) => (
                    <button key={v} className={`opt${form.experience === v ? " active" : ""}`} onClick={() => update("experience", v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label>Interview Language</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["english", "English"], ["urdu", "Urdu"], ["mix", "Mix"]].map(([v, l]) => (
                    <button key={v} className={`opt${form.language === v ? " active" : ""}`} onClick={() => update("language", v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label>Interview Mode</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["friendly", "Friendly"], ["strict", "Strict"]].map(([v, l]) => (
                    <button key={v} className={`opt${form.pressure === v ? " active" : ""}`} onClick={() => update("pressure", v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label>Interview Type</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[["mixed", "Mixed"], ["technical", "Technical"], ["hr", "HR"], ["behavioral", "Behavioral"]].map(([v, l]) => (
                    <button key={v} className={`opt${form.type === v ? " active" : ""}`} onClick={() => update("type", v)}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#dbfcff", marginBottom: 8, fontFamily: "Geist, sans-serif" }}>Custom Instructions (Optional)</h3>
            <p style={{ fontSize: 12, color: "#849495", marginBottom: 12 }}>Tell Alex anything specific about this role — key skills, company culture, deal-breakers.</p>
            <textarea className="input-field" rows={4} placeholder="e.g. Focus on sales experience and cold calling. Ask about handling rejection. Must be willing to travel to Karachi monthly."
              value={form.custom_instructions} onChange={e => update("custom_instructions", e.target.value)}
              style={{ resize: "vertical" }} />
          </div>

          <button onClick={create} disabled={loading}
            style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #00dbe9, #00f0ff)", color: "#002022", fontSize: 14, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
            {loading ? "Creating..." : "Create Role & Get Interview Link →"}
          </button>
        </div>
      </main>
    </div>
  );
}
