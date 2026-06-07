"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { InterviewConfig, SessionFeedback } from "@/types/interview";

function scoreToGrade(s: number) {
  if (s >= 85) return "Excellent";
  if (s >= 70) return "Good";
  if (s >= 55) return "Average";
  if (s >= 40) return "Needs Work";
  return "Poor";
}

function scoreToColor(s: number) {
  if (s >= 85) return "#00dbe9";
  if (s >= 70) return "#7df4ff";
  if (s >= 55) return "#d1bcff";
  return "#ffb4ab";
}

export default function ResultsPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<SessionFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [proctoring, setProctoring] = useState<any>(null);
  const [candidateRating, setCandidateRating] = useState(0);
  const [candidateFeedback, setCandidateFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    // Stop all media tracks
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => stream.getTracks().forEach(t => t.stop()))
      .catch(() => {});

    // Stop any audio
    document.querySelectorAll("audio, video").forEach((el: any) => {
      el.pause(); el.srcObject = null; el.src = "";
    });

    // Stop speech recognition
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) { const r = new SR(); r.abort(); }
    } catch {}

    const transcript = localStorage.getItem("interview_transcript");
    const cfg = localStorage.getItem("interview_config_done");
    const sessionId = localStorage.getItem("last_session_id");

    if (!transcript || !cfg) { router.push("/interview/setup"); return; }

    const parsedConfig = JSON.parse(cfg);
    setConfig(parsedConfig);

    // Get proctoring data from Supabase
    if (sessionId) {
      import("@/lib/supabase/client").then(({ createClient }) => {
        const supabase = createClient();
        supabase.from("sessions").select("proctoring").eq("id", sessionId).single()
          .then(({ data }) => { if (data?.proctoring) setProctoring(data.proctoring); });
      });
    }

    fetch("/api/interview/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: JSON.parse(transcript),
        config: parsedConfig,
        sessionId: sessionId || undefined,
      }),
    }).then(r => r.json())
      .then(data => { setFeedback(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const submitCandidateFeedback = async () => {
    const sessionId = localStorage.getItem("last_session_id");
    if (!sessionId) return;
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.from("sessions").update({
        candidate_feedback: { rating: candidateRating, comment: candidateFeedback, submitted_at: new Date().toISOString() }
      }).eq("id", sessionId);
      setFeedbackSubmitted(true);
    } catch (e) { console.error(e); }
  };

  const scoreItems = [
    { key: "communication", label: "Communication" },
    { key: "technical_depth", label: "Technical Depth" },
    { key: "star_method", label: "STAR Method" },
    { key: "confidence", label: "Confidence" },
    { key: "filler_words", label: "Filler Words" },
    { key: "structure", label: "Structure" },
  ];

  if (loading) return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 56, height: 56, border: "3px solid rgba(0,219,233,0.3)", borderTop: "3px solid #00dbe9", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#00dbe9", fontFamily: "JetBrains Mono, monospace", fontSize: 12, letterSpacing: "0.1em" }}>ANALYZING YOUR INTERVIEW...</p>
        <p style={{ color: "#849495", fontSize: 13, marginTop: 8 }}>This takes about 15 seconds</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!feedback) return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#849495" }}>Could not generate feedback.</p>
        <button onClick={() => router.push("/interview/setup")} style={{ marginTop: 16, padding: "10px 24px", background: "#00dbe9", color: "#002022", border: "none", borderRadius: 9999, cursor: "pointer", fontWeight: 700 }}>Try Again</button>
      </div>
    </div>
  );

  const overall = feedback?.scores?.overall ?? 0;
  const ringCircumference = 2 * Math.PI * 70;
  const ringOffset = ringCircumference - (overall / 100) * ringCircumference;
  const proctoringScore = proctoring ? Math.max(0, 100 - (proctoring.tab_switches * 15) - (proctoring.total_flags * 10)) : null;

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .glass { background: rgba(22,27,34,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s; }
        .glass:hover { border-color: rgba(0,219,233,0.3); }
        .star { cursor: pointer; font-size: 28px; transition: transform 0.1s; }
        .star:hover { transform: scale(1.2); }
      `}</style>

      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(10,12,16,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <button onClick={() => router.push("/dashboard")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </button>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em" }}>INTERVIEW COMPLETE</span>
        </div>
      </header>

      <main style={{ paddingTop: 88, paddingBottom: 60, maxWidth: 1100, margin: "0 auto", padding: "88px 24px 60px" }}>

        {/* Hero scores */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16, marginBottom: 16 }}>
          <div className="glass" style={{ gridColumn: "span 8", borderRadius: 20, padding: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, background: "rgba(0,219,233,0.06)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Interview Complete</span>
              <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", margin: "8px 0 12px", textTransform: "capitalize" }}>
                {config?.role?.replace(/_/g, " ")}
              </h1>
              <p style={{ fontSize: 15, color: "#b9cacb", lineHeight: 1.6, maxWidth: 500 }}>{feedback.summary}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24 }}>
                {[
                  { label: "Communication", val: feedback.scores?.communication ?? 0 },
                  { label: "Confidence", val: feedback.scores?.confidence ?? 0 },
                  { label: "Technical", val: feedback.scores?.technical_depth ?? 0 },
                ].map(({ label, val }) => (
                  <div key={label} className="glass" style={{ borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em", marginBottom: 6 }}>{label.toUpperCase()}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "Geist, sans-serif", color: scoreToColor(val) }}>{val}%</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button onClick={() => router.push("/interview/setup")}
                  style={{ padding: "10px 24px", borderRadius: 9999, background: "#00dbe9", color: "#002022", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                  Practice Again
                </button>
                <button onClick={() => router.push("/dashboard")}
                  style={{ padding: "10px 24px", borderRadius: 9999, background: "transparent", color: "#00dbe9", border: "1px solid rgba(0,219,233,0.3)", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                  Dashboard
                </button>
              </div>
            </div>
          </div>

          <div className="glass" style={{ gridColumn: "span 4", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 160, height: 160, marginBottom: 16 }}>
              <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="80" cy="80" r="70" fill="none" stroke={scoreToColor(overall)} strokeWidth="8"
                  strokeDasharray={String(ringCircumference)} strokeDashoffset={String(ringOffset)}
                  strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${scoreToColor(overall)})` }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 42, fontWeight: 700, fontFamily: "Geist, sans-serif", color: scoreToColor(overall) }}>{overall}</span>
                <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>{scoreToGrade(overall).toUpperCase()}</span>
              </div>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 6 }}>Overall Score</h3>
          </div>
        </div>

        {/* Proctoring report */}
        {proctoring && (
          <div className="glass" style={{ borderRadius: 20, padding: 28, marginBottom: 16, borderLeft: `3px solid ${proctoringScore && proctoringScore >= 80 ? "#00dbe9" : "#ffb4ab"}` }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              🔒 Proctoring Report
              <span style={{ fontSize: 12, padding: "2px 10px", borderRadius: 9999, background: proctoringScore && proctoringScore >= 80 ? "rgba(0,219,233,0.1)" : "rgba(255,180,171,0.1)", color: proctoringScore && proctoringScore >= 80 ? "#00dbe9" : "#ffb4ab", fontFamily: "JetBrains Mono, monospace" }}>
                Integrity Score: {proctoringScore}/100
              </span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Tab Switches", value: proctoring.tab_switches, bad: proctoring.tab_switches > 0, icon: "🖥️" },
                { label: "Total Flags", value: proctoring.total_flags || 0, bad: (proctoring.total_flags || 0) > 2, icon: "⚠️" },
                { label: "Integrity", value: proctoringScore && proctoringScore >= 80 ? "Clean" : "Flagged", bad: proctoringScore ? proctoringScore < 80 : false, icon: "🔍" },
              ].map(({ label, value, bad, icon }) => (
                <div key={label} style={{ padding: 16, borderRadius: 12, background: bad ? "rgba(255,180,171,0.06)" : "rgba(0,219,233,0.05)", border: `1px solid ${bad ? "rgba(255,180,171,0.2)" : "rgba(0,219,233,0.15)"}` }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495", marginBottom: 4 }}>{label.toUpperCase()}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Geist, sans-serif", color: bad ? "#ffb4ab" : "#00dbe9" }}>{value}</div>
                </div>
              ))}
            </div>
            {proctoring.flags && proctoring.flags.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", marginBottom: 10, letterSpacing: "0.06em" }}>FLAG TIMELINE</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {proctoring.flags.map((f: any, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 12px", borderRadius: 8, background: "rgba(255,70,70,0.06)", border: "1px solid rgba(255,70,70,0.12)" }}>
                      <span style={{ fontSize: 12, color: "#ff6b6b", flexShrink: 0 }}>⚠</span>
                      <span style={{ fontSize: 13, color: "#b9cacb", flex: 1 }}>{f.message}</span>
                      <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>{new Date(f.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Score breakdown + Strengths + Improvements */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 16 }}>
          <div className="glass" style={{ borderRadius: 20, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 24 }}>📈 Score Breakdown</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {scoreItems.map(({ key, label }) => {
                const score = (feedback.scores as unknown as Record<string, number>)[key] ?? 0;
                return (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", textTransform: "uppercase" }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: scoreToColor(score) }}>{score}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 9999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${score}%`, background: scoreToColor(score), borderRadius: 9999, transition: "width 1s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass" style={{ borderRadius: 20, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 20 }}>✅ Strengths</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(feedback.strengths || []).map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "rgba(0,219,233,0.05)", border: "1px solid rgba(0,219,233,0.1)", borderRadius: 10 }}>
                  <span style={{ color: "#00dbe9", flexShrink: 0 }}>✓</span>
                  <p style={{ fontSize: 14, color: "#b9cacb", lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass" style={{ borderRadius: 20, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 20 }}>🎯 Areas to Improve</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(feedback.improvements || []).map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "rgba(255,180,171,0.05)", border: "1px solid rgba(255,180,171,0.1)", borderRadius: 10 }}>
                  <span style={{ color: "#ffb4ab", flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 14, color: "#b9cacb", lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best/Worst answer */}
        {feedback.best_answer && (
          <div className="glass" style={{ borderRadius: 20, padding: 28, marginBottom: 16, borderLeft: "3px solid rgba(0,219,233,0.5)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 12 }}>⭐ Best Answer</h2>
            <p style={{ fontSize: 15, color: "#00dbe9", fontStyle: "italic", lineHeight: 1.7 }}>"{feedback.best_answer}"</p>
            {feedback.weakest_answer && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em" }}>WEAKEST ANSWER</span>
                <p style={{ fontSize: 14, color: "#ffb4ab", fontStyle: "italic", marginTop: 6, lineHeight: 1.6 }}>"{feedback.weakest_answer}"</p>
              </div>
            )}
          </div>
        )}

        {/* Candidate feedback form */}
        <div className="glass" style={{ borderRadius: 20, padding: 28, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 8 }}>💬 How was your interview experience?</h2>
          <p style={{ fontSize: 13, color: "#849495", marginBottom: 20 }}>Your feedback helps us improve MockMate.</p>

          {feedbackSubmitted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🙏</div>
              <p style={{ color: "#00dbe9", fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}>Thank you for your feedback!</p>
            </div>
          ) : (
            <>
              {/* Star rating */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="star" onClick={() => setCandidateRating(star)}
                    style={{ opacity: star <= candidateRating ? 1 : 0.3 }}>
                    ⭐
                  </span>
                ))}
                {candidateRating > 0 && (
                  <span style={{ fontSize: 13, color: "#849495", marginLeft: 8, alignSelf: "center" }}>
                    {["", "Poor", "Fair", "Good", "Great", "Excellent"][candidateRating]}
                  </span>
                )}
              </div>

              <textarea
                value={candidateFeedback}
                onChange={e => setCandidateFeedback(e.target.value)}
                placeholder="What did you think of Alex? Was the interview realistic? Any suggestions?"
                rows={3}
                style={{ width: "100%", background: "rgba(10,12,16,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#e2e2e8", fontSize: 14, fontFamily: "Inter, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "rgba(0,219,233,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />

              <button onClick={submitCandidateFeedback} disabled={candidateRating === 0}
                style={{ marginTop: 12, padding: "10px 24px", borderRadius: 9999, border: "none", cursor: candidateRating > 0 ? "pointer" : "not-allowed",
                  background: candidateRating > 0 ? "linear-gradient(135deg, #00dbe9, #00f0ff)" : "rgba(0,219,233,0.2)",
                  color: candidateRating > 0 ? "#002022" : "#849495", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                Submit Feedback
              </button>
            </>
          )}
        </div>

      </main>
    </div>
  );
}
