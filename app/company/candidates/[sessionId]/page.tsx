"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function scoreToColor(s: number) {
  if (s >= 85) return "#00dbe9";
  if (s >= 70) return "#7df4ff";
  if (s >= 55) return "#d1bcff";
  return "#ffb4ab";
}

function scoreToGrade(s: number) {
  if (s >= 85) return "Excellent";
  if (s >= 70) return "Good";
  if (s >= 55) return "Average";
  if (s >= 40) return "Needs Work";
  return "Poor";
}

export default function CandidateReportPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("sessions").select("*").eq("id", sessionId).single()
      .then(({ data }) => { setSession(data); setLoading(false); });
  }, [sessionId]);

  const updateStatus = async (status: "shortlisted" | "rejected" | null) => {
    setUpdating(true);
    const supabase = createClient();
    await supabase.from("sessions").update({ shortlist_status: status }).eq("id", sessionId);
    setSession((prev: any) => ({ ...prev, shortlist_status: status }));
    setUpdating(false);
  };

  const exportPDF = () => {
    window.print();
  };

  if (loading) return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(0,219,233,0.3)", borderTop: "3px solid #00dbe9", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!session) return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#849495" }}>
      Session not found.
    </div>
  );

  const name = session.candidate_name || session.config?.candidateName || "Anonymous";
  const feedback = session.feedback;
  const proctoring = session.proctoring;
  const overall = feedback?.scores?.overall ?? 0;
  const ringCircumference = 2 * Math.PI * 60;
  const ringOffset = ringCircumference - (overall / 100) * ringCircumference;
  const proctoringScore = proctoring ? Math.max(0, 100 - (proctoring.tab_switches * 15) - ((proctoring.total_flags || 0) * 10)) : 100;

  const scoreItems = [
    { key: "communication", label: "Communication" },
    { key: "technical_depth", label: "Technical Depth" },
    { key: "star_method", label: "STAR Method" },
    { key: "confidence", label: "Confidence" },
    { key: "filler_words", label: "Filler Words" },
    { key: "structure", label: "Structure" },
  ];

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .glass { background: rgba(22,27,34,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .btn { padding: 8px 20px; border-radius: 9999px; font-size: 12px; font-family: 'JetBrains Mono', monospace; cursor: pointer; border: 1px solid; transition: all 0.15s; font-weight: 600; }
        @media print {
          header, .no-print { display: none !important; }
          .glass { background: #fff !important; border: 1px solid #eee !important; }
          body { background: #fff !important; color: #000 !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(10,12,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1100, margin: "0 auto", height: 64 }}>
          <button onClick={() => router.back()} style={{ fontSize: 13, color: "#849495", background: "none", border: "none", cursor: "pointer", fontFamily: "JetBrains Mono, monospace" }}>← Back</button>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#dbfcff", fontFamily: "Geist, sans-serif" }}>Candidate Report</span>
          <div style={{ display: "flex", gap: 8 }} className="no-print">
            <button onClick={exportPDF} style={{ padding: "7px 16px", borderRadius: 9999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e2e8", fontSize: 12, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
              Print / PDF
            </button>
            {session.shortlist_status === "shortlisted" ? (
              <span style={{ padding: "7px 16px", borderRadius: 9999, fontSize: 12, fontFamily: "JetBrains Mono, monospace", background: "rgba(0,255,100,0.1)", color: "#00ff64", border: "1px solid rgba(0,255,100,0.2)" }}>✓ Shortlisted</span>
            ) : session.shortlist_status === "rejected" ? (
              <span style={{ padding: "7px 16px", borderRadius: 9999, fontSize: 12, fontFamily: "JetBrains Mono, monospace", background: "rgba(255,180,171,0.1)", color: "#ffb4ab", border: "1px solid rgba(255,180,171,0.2)" }}>✗ Rejected</span>
            ) : null}
            {session.shortlist_status !== "shortlisted" && (
              <button disabled={updating} onClick={() => updateStatus("shortlisted")}
                style={{ padding: "7px 16px", borderRadius: 9999, background: "rgba(0,255,100,0.08)", border: "1px solid rgba(0,255,100,0.25)", color: "#00ff64", fontSize: 12, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
                ✓ Shortlist
              </button>
            )}
            {session.shortlist_status !== "rejected" && (
              <button disabled={updating} onClick={() => updateStatus("rejected")}
                style={{ padding: "7px 16px", borderRadius: 9999, background: "rgba(255,180,171,0.08)", border: "1px solid rgba(255,180,171,0.25)", color: "#ffb4ab", fontSize: 12, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
                ✗ Reject
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 88, maxWidth: 1100, margin: "0 auto", padding: "88px 24px 60px" }}>

        {/* Candidate header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginBottom: 20 }}>
          <div className="glass" style={{ borderRadius: 20, padding: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: "rgba(0,219,233,0.06)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(249,94,20,0.12)", border: "1px solid rgba(249,94,20,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#f95e14", flexShrink: 0 }}>
                  {name[0]?.toUpperCase()}
                </div>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 4 }}>{name}</h1>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {session.candidate_email && <span style={{ fontSize: 12, color: "#849495", fontFamily: "JetBrains Mono, monospace" }}>{session.candidate_email}</span>}
                    <span style={{ fontSize: 12, color: "#849495", fontFamily: "JetBrains Mono, monospace", textTransform: "capitalize" }}>{session.config?.role?.replace(/_/g, " ")}</span>
                    <span style={{ fontSize: 12, color: "#849495", fontFamily: "JetBrains Mono, monospace" }}>{new Date(session.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    {session.duration_seconds > 0 && <span style={{ fontSize: 12, color: "#849495", fontFamily: "JetBrains Mono, monospace" }}>· {Math.floor(session.duration_seconds / 60)}m {session.duration_seconds % 60}s</span>}
                  </div>
                </div>
              </div>
              {feedback?.overall_summary && (
                <p style={{ fontSize: 14, color: "#b9cacb", lineHeight: 1.7, padding: "14px 16px", background: "rgba(0,219,233,0.04)", borderRadius: 10, border: "1px solid rgba(0,219,233,0.1)" }}>
                  {feedback.overall_summary}
                </p>
              )}
            </div>
          </div>

          {/* Score ring */}
          <div className="glass" style={{ borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 160 }}>
            <div style={{ position: "relative", width: 130, height: 130, marginBottom: 12 }}>
              <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="65" cy="65" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                <circle cx="65" cy="65" r="60" fill="none" stroke={scoreToColor(overall)} strokeWidth="7"
                  strokeDasharray={String(ringCircumference)} strokeDashoffset={String(ringOffset)}
                  strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${scoreToColor(overall)})` }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 36, fontWeight: 700, fontFamily: "Geist, sans-serif", color: scoreToColor(overall) }}>{overall}</span>
                <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>{scoreToGrade(overall).toUpperCase()}</span>
              </div>
            </div>
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.06em" }}>OVERALL SCORE</span>
          </div>
        </div>

        {/* Quick metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 16 }}>
          {scoreItems.map(({ key, label }) => {
            const score = feedback?.scores?.[key] ?? 0;
            return (
              <div key={key} className="glass" style={{ borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 8, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.06em", marginBottom: 6 }}>{label.toUpperCase()}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Geist, sans-serif", color: scoreToColor(score) }}>{score}</div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 9999, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${score}%`, background: scoreToColor(score), borderRadius: 9999 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Proctoring + Strengths/Improvements */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>

          {/* Proctoring */}
          <div className="glass" style={{ borderRadius: 16, padding: 22, borderLeft: `3px solid ${proctoringScore >= 80 ? "#00dbe9" : "#ffb4ab"}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              🔒 Proctoring
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 9999, background: proctoringScore >= 80 ? "rgba(0,219,233,0.1)" : "rgba(255,180,171,0.1)", color: proctoringScore >= 80 ? "#00dbe9" : "#ffb4ab", fontFamily: "JetBrains Mono, monospace" }}>
                {proctoringScore}/100
              </span>
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Tab Switches", value: proctoring?.tab_switches ?? 0, bad: (proctoring?.tab_switches ?? 0) > 0 },
                { label: "Total Flags", value: proctoring?.total_flags ?? 0, bad: (proctoring?.total_flags ?? 0) > 2 },
                { label: "Integrity", value: proctoringScore >= 80 ? "Clean ✓" : "Flagged ⚠", bad: proctoringScore < 80 },
              ].map(({ label, value, bad }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: bad ? "rgba(255,180,171,0.05)" : "rgba(0,219,233,0.04)", borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: "#849495", fontFamily: "JetBrains Mono, monospace" }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: bad ? "#ffb4ab" : "#00dbe9" }}>{value}</span>
                </div>
              ))}
            </div>
            {proctoring?.flags?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#ff6b6b", marginBottom: 6, letterSpacing: "0.06em" }}>FLAGS</div>
                {proctoring.flags.slice(0, 5).map((f: any, i: number) => (
                  <div key={i} style={{ fontSize: 10, color: "#849495", marginBottom: 4, fontFamily: "JetBrains Mono, monospace" }}>
                    <span style={{ color: "#ff6b6b" }}>• </span>{f.message}
                    <span style={{ color: "#3a4855" }}> — {new Date(f.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Strengths */}
          <div className="glass" style={{ borderRadius: 16, padding: 22 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 14 }}>✅ Strengths</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(feedback?.strengths || []).map((s: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "8px 10px", background: "rgba(0,219,233,0.04)", border: "1px solid rgba(0,219,233,0.1)", borderRadius: 8 }}>
                  <span style={{ color: "#00dbe9", flexShrink: 0, fontSize: 12 }}>✓</span>
                  <p style={{ fontSize: 12, color: "#b9cacb", lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="glass" style={{ borderRadius: 16, padding: 22 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 14 }}>🎯 Areas to Improve</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(feedback?.improvements || []).map((s: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "8px 10px", background: "rgba(255,180,171,0.04)", border: "1px solid rgba(255,180,171,0.1)", borderRadius: 8 }}>
                  <span style={{ color: "#ffb4ab", flexShrink: 0, fontSize: 12 }}>→</span>
                  <p style={{ fontSize: 12, color: "#b9cacb", lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best/Worst answer */}
        {feedback?.best_answer && (
          <div className="glass" style={{ borderRadius: 16, padding: 22, marginBottom: 14, borderLeft: "3px solid rgba(0,219,233,0.4)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 10 }}>⭐ Best Answer</h3>
            <p style={{ fontSize: 14, color: "#00dbe9", fontStyle: "italic", lineHeight: 1.7 }}>"{feedback.best_answer}"</p>
            {feedback?.weakest_answer && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.06em" }}>WEAKEST ANSWER</span>
                <p style={{ fontSize: 13, color: "#ffb4ab", fontStyle: "italic", marginTop: 6, lineHeight: 1.6 }}>"{feedback.weakest_answer}"</p>
              </div>
            )}
          </div>
        )}

        {/* Full transcript */}
        {session.transcript && session.transcript.length > 0 && (
          <div className="glass" style={{ borderRadius: 16, padding: 22, marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 16 }}>📝 Full Transcript</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
              {session.transcript.map((entry: any, i: number) => (
                <div key={i} style={{ display: "flex", gap: 10, flexDirection: entry.role === "candidate" ? "row-reverse" : "row" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, background: entry.role === "interviewer" ? "linear-gradient(135deg,#00dbe9,#7000ff)" : "#f95e14", color: "#fff" }}>
                    {entry.role === "interviewer" ? "AL" : name[0]?.toUpperCase()}
                  </div>
                  <div style={{ maxWidth: "75%", padding: "8px 12px", borderRadius: entry.role === "interviewer" ? "3px 12px 12px 12px" : "12px 3px 12px 12px", fontSize: 13, lineHeight: 1.6, background: entry.role === "interviewer" ? "rgba(22,27,34,0.9)" : "rgba(249,94,20,0.08)", border: `1px solid ${entry.role === "interviewer" ? "rgba(255,255,255,0.06)" : "rgba(249,94,20,0.15)"}`, color: entry.role === "interviewer" ? "#dde8f0" : "#ffb59a" }}>
                    {entry.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Candidate's own feedback */}
        {session.candidate_feedback && (
          <div className="glass" style={{ borderRadius: 16, padding: 22, marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 12 }}>💬 Candidate's Feedback on Interview</h3>
            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 20, opacity: s <= (session.candidate_feedback.rating || 0) ? 1 : 0.2 }}>⭐</span>
              ))}
              <span style={{ fontSize: 13, color: "#849495", marginLeft: 8, alignSelf: "center" }}>
                {["","Poor","Fair","Good","Great","Excellent"][session.candidate_feedback.rating || 0]}
              </span>
            </div>
            {session.candidate_feedback.comment && (
              <p style={{ fontSize: 14, color: "#b9cacb", lineHeight: 1.6, fontStyle: "italic" }}>"{session.candidate_feedback.comment}"</p>
            )}
          </div>
        )}

        {/* Decision buttons */}
        <div className="glass no-print" style={{ borderRadius: 16, padding: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 4 }}>Make a Decision</h3>
            <p style={{ fontSize: 12, color: "#849495" }}>Your decision is saved and visible to your whole team.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {session.shortlist_status && (
              <button onClick={() => updateStatus(null)} disabled={updating}
                style={{ padding: "10px 20px", borderRadius: 9999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#849495", fontSize: 12, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
                Undo
              </button>
            )}
            <button onClick={() => updateStatus("rejected")} disabled={updating || session.shortlist_status === "rejected"}
              style={{ padding: "10px 24px", borderRadius: 9999, background: session.shortlist_status === "rejected" ? "rgba(255,180,171,0.1)" : "transparent", border: "1px solid rgba(255,180,171,0.3)", color: "#ffb4ab", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
              ✗ {session.shortlist_status === "rejected" ? "Rejected" : "Reject"}
            </button>
            <button onClick={() => updateStatus("shortlisted")} disabled={updating || session.shortlist_status === "shortlisted"}
              style={{ padding: "10px 24px", borderRadius: 9999, background: session.shortlist_status === "shortlisted" ? "rgba(0,255,100,0.15)" : "linear-gradient(135deg, #00dbe9, #00f0ff)", border: "none", color: session.shortlist_status === "shortlisted" ? "#00ff64" : "#002022", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
              ✓ {session.shortlist_status === "shortlisted" ? "Shortlisted" : "Shortlist"}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
