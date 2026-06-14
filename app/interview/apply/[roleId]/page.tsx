"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CandidateApplyPage() {
  const router = useRouter();
  const params = useParams();
  const roleId = params.roleId as string;
  const [role, setRole] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("roles").select("*, companies(name, industry)").eq("id", roleId).single()
      .then(({ data }) => {
        if (data) {
          setRole(data);
          setCompany(data.companies);
        }
        setPageLoading(false);
      });
  }, [roleId]);

  const extractResume = async (file: File) => {
    setResumeLoading(true);
    setResumeFile(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/interview/resume", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { text } = await res.json();
        setResumeText(text);
      }
    } catch (e) { console.error("Resume extract error:", e); }
    setResumeLoading(false);
  };

  const start = async () => {
    if (!form.name) { setError("Please enter your name"); return; }
    setLoading(true);
    setError("");

    // Check interview limit
    const supabase = createClient();
    const { data: companyData } = await supabase
      .from("companies")
      .select("interview_limit, interviews_used, plan")
      .eq("id", role.company_id)
      .single();

    if (companyData) {
      const used = companyData.interviews_used || 0;
      const limit = companyData.interview_limit || 20;
      if (used >= limit) {
        setError(`This company has reached their interview limit (${limit} interviews). Please contact them directly.`);
        setLoading(false);
        return;
      }
    }

    // Build interview config from role
    const config = {
      role: role.title.toLowerCase().replace(/\s+/g, "_"),
      experience: role.experience,
      language: role.language,
      pressure: role.pressure,
      type: role.type,
      company: company?.industry || "software_house",
      candidateName: form.name,
      customInstructions: role.custom_instructions,
      roleId: roleId,
      companyId: role.company_id,
      candidateEmail: form.email,
      resumeText: resumeText || undefined,
    };

    localStorage.setItem("interview_config", JSON.stringify(config));
    localStorage.setItem("candidate_name", form.name);
    localStorage.setItem("candidate_email", form.email);
    localStorage.setItem("applying_role_id", roleId);
    localStorage.setItem("applying_company_id", role.company_id);

    // Increment interviews_used
    const supabase2 = createClient();
    await supabase2.from("companies").update({
      interviews_used: (companyData?.interviews_used || 0) + 1
    }).eq("id", role.company_id);

    router.push("/interview/room");
  };

  if (pageLoading) return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(0,219,233,0.3)", borderTop: "3px solid #00dbe9", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!role) return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#849495", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <p>Interview link not found or expired.</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes glow { 0%,100%{opacity:0.08} 50%{opacity:0.18} }
        .glass { background: rgba(22,27,34,0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .input-field { width: 100%; background: rgba(10,12,16,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; color: #e2e2e8; font-size: 14px; font-family: Inter, sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(0,219,233,0.5); }
        .input-field::placeholder { color: #849495; }
        label { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #849495; letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 8px; }
      `}</style>

      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 400, background: "rgba(0,219,233,0.06)", borderRadius: "50%", filter: "blur(100px)", animation: "glow 4s infinite", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, width: "100%" }}>

        {/* Company + Role info */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 auto 20px", boxShadow: "0 0 30px rgba(0,219,233,0.3)" }}>
            {company?.name?.[0] || "C"}
          </div>
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 9999, background: "rgba(0,219,233,0.08)", border: "1px solid rgba(0,219,233,0.2)", fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.08em", marginBottom: 16 }}>
            {company?.name?.toUpperCase()}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>
            {role.title}
          </h1>
          <p style={{ fontSize: 14, color: "#849495", lineHeight: 1.6 }}>
            You're about to start an AI-powered interview with Alex. The interview takes about 15-20 minutes. Make sure you're in a quiet place.
          </p>
        </div>

        {/* What to expect */}
        <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.1em", marginBottom: 14 }}>WHAT TO EXPECT</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "🎤", text: "Voice interview — Alex will speak and you respond" },
              { icon: "⏱️", text: "About 15-20 minutes, 7-8 questions" },
              { icon: "🧠", text: "Questions adapt based on your answers" },
              { icon: "📊", text: "Your results are shared with the company" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#b9cacb" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="glass" style={{ borderRadius: 20, padding: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 20 }}>Enter your details</h2>

          {error && <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,180,171,0.08)", border: "1px solid rgba(255,180,171,0.2)", color: "#ffb4ab", fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label>Full Name</label>
              <input className="input-field" placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label>Email (Optional)</label>
              <input className="input-field" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label>Resume / CV (Optional — Alex will ask questions based on it)</label>
              <div
                onClick={() => document.getElementById("resume-upload")?.click()}
                style={{ width: "100%", padding: "16px", borderRadius: 12, border: `2px dashed ${resumeFile ? "rgba(0,219,233,0.5)" : "rgba(255,255,255,0.1)"}`, background: resumeFile ? "rgba(0,219,233,0.04)" : "transparent", cursor: "pointer", textAlign: "center", boxSizing: "border-box" }}>
                <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
                  onChange={e => e.target.files?.[0] && extractResume(e.target.files[0])} />
                {resumeLoading ? (
                  <p style={{ fontSize: 13, color: "#00dbe9" }}>Reading your CV...</p>
                ) : resumeFile ? (
                  <p style={{ fontSize: 13, color: "#00dbe9" }}>✓ {resumeFile.name}</p>
                ) : (
                  <p style={{ fontSize: 13, color: "#849495" }}>📄 Upload your CV (PDF) — optional</p>
                )}
              </div>
            </div>
          </div>

          <button onClick={start} disabled={loading || !form.name}
            style={{ width: "100%", marginTop: 20, padding: "15px", borderRadius: 13, border: "none",
              background: form.name && !loading ? "linear-gradient(135deg, #00dbe9, #00f0ff)" : "rgba(0,219,233,0.2)",
              color: form.name && !loading ? "#002022" : "#849495",
              fontSize: 14, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase", cursor: form.name && !loading ? "pointer" : "not-allowed",
              boxShadow: form.name && !loading ? "0 0 30px rgba(0,219,233,0.25)" : "none" }}>
            {loading ? "Starting..." : "Start Interview →"}
          </button>

          <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#849495", fontFamily: "JetBrains Mono, monospace" }}>
            By starting you agree to be recorded and evaluated by AI
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#849495", fontFamily: "JetBrains Mono, monospace" }}>
          Powered by MockMate AI · mockmate.io
        </p>
      </div>
    </div>
  );
}
