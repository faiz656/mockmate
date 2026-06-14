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

export default function RoleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roleId = params.id as string;
  const [role, setRole] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{sent:number,failed:number}|null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("roles").select("*").eq("id", roleId).single(),
      supabase.from("sessions").select("*").eq("role_id", roleId).order("created_at", { ascending: false }),
    ]).then(([{ data: roleData }, { data: candidateData }]) => {
      setRole(roleData);
      setCandidates(candidateData || []);
      setLoading(false);
    });
  }, [roleId]);

  const updateStatus = async (sessionId: string, status: "shortlisted" | "rejected" | null) => {
    setUpdating(sessionId);
    const supabase = createClient();
    await supabase.from("sessions").update({ shortlist_status: status }).eq("id", sessionId);
    setCandidates(prev => prev.map(c => c.id === sessionId ? { ...c, shortlist_status: status } : c));
    setUpdating(null);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/interview/apply/${roleId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Date", "Duration", "Score", "Communication", "Technical", "Confidence", "Tab Switches", "Flags", "Status"],
      ...candidates.map(c => [
        c.candidate_name || c.config?.candidateName || "Anonymous",
        c.candidate_email || "",
        new Date(c.created_at).toLocaleDateString(),
        c.duration_seconds ? `${Math.floor(c.duration_seconds/60)}m` : "",
        c.feedback?.scores?.overall || "",
        c.feedback?.scores?.communication || "",
        c.feedback?.scores?.technical_depth || "",
        c.feedback?.scores?.confidence || "",
        c.proctoring?.tab_switches || 0,
        c.proctoring?.total_flags || 0,
        c.shortlist_status || "pending",
      ])
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${role?.title}-candidates.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(0,219,233,0.3)", borderTop: "3px solid #00dbe9", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const interviewLink = `${typeof window !== "undefined" ? window.location.origin : ""}/interview/apply/${roleId}`;
  const shortlisted = candidates.filter(c => c.shortlist_status === "shortlisted").length;
  const rejected = candidates.filter(c => c.shortlist_status === "rejected").length;
  const avgScore = candidates.filter(c => c.feedback?.scores?.overall).length
    ? Math.round(candidates.filter(c => c.feedback?.scores?.overall).reduce((s, c) => s + c.feedback.scores.overall, 0) / candidates.filter(c => c.feedback?.scores?.overall).length)
    : 0;

  const sendBulkInvite = async () => {
    setInviting(true);
    const emails = inviteEmails.split(/[\r\n,]+/).map((e: string) => e.trim()).filter((e: string) => e.includes("@"));
    if (!emails.length) { setInviting(false); return; }
    const interviewUrl = `${window.location.origin}/interview/apply/${roleId}`;
    const res = await fetch("/api/company/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails, roleId, roleName: role?.title, companyName: "Your Company", interviewUrl }),
    });
    const data = await res.json();
    setInviteResult(data);
    setInviting(false);
  };

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .glass { background: rgba(22,27,34,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .row { background: rgba(22,27,34,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 20px; transition: all 0.2s; }
        .row:hover { border-color: rgba(0,219,233,0.25); }
      `}</style>

      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(10,12,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <button onClick={() => router.push("/company/dashboard")} style={{ fontSize: 13, color: "#849495", background: "none", border: "none", cursor: "pointer", fontFamily: "JetBrains Mono, monospace" }}>← Dashboard</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={exportCSV} style={{ padding: "8px 16px", borderRadius: 9999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e2e8", fontSize: 12, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>Export CSV</button>
            <button onClick={() => setShowInvite(!showInvite)} style={{ padding: "8px 16px", borderRadius: 9999, background: "rgba(112,0,255,0.1)", border: "1px solid rgba(112,0,255,0.3)", color: "#d1bcff", fontSize: 12, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>📧 Bulk Invite</button>
            <button onClick={copyLink} style={{ padding: "8px 20px", borderRadius: 9999, border: "none", color: copied?"#00ff64":"#002022", fontSize: 12, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", cursor: "pointer", background: copied?"rgba(0,255,100,0.1)":"linear-gradient(135deg,#00dbe9,#00f0ff)" }}>
              {copied ? "✓ Copied!" : "Copy Interview Link"}
            </button>
          </div>
        </div>
      </header>

      {showInvite && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "Geist, sans-serif", marginBottom: 8 }}>Bulk Invite Candidates</h2>
            <p style={{ fontSize: 13, color: "#849495", marginBottom: 20 }}>Enter emails separated by commas or new lines. Each person will receive an interview invitation.</p>
            {inviteResult ? (
              <div style={{ padding: 20, borderRadius: 12, background: "rgba(0,219,233,0.06)", border: "1px solid rgba(0,219,233,0.2)", textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <p style={{ color: "#00dbe9", fontWeight: 600 }}>{inviteResult.sent} invitations sent!</p>
                {inviteResult.failed > 0 && <p style={{ color: "#ffb4ab", fontSize: 13, marginTop: 4 }}>{inviteResult.failed} failed</p>}
              </div>
            ) : (
              <textarea value={inviteEmails} onChange={e => setInviteEmails(e.target.value)}
                placeholder="candidate1@email.com, candidate2@email.com, candidate3@email.com"
                rows={6}
                style={{ width: "100%", background: "rgba(10,12,16,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 14, color: "#e2e2e8", fontSize: 13, fontFamily: "JetBrains Mono, monospace", outline: "none", boxSizing: "border-box", resize: "vertical", marginBottom: 16 }} />
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowInvite(false); setInviteResult(null); setInviteEmails(""); }}
                style={{ flex: 1, padding: "12px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e2e8", fontSize: 13, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
                Close
              </button>
              {!inviteResult && (
                <button onClick={sendBulkInvite} disabled={inviting || !inviteEmails.trim()}
                  style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #7000ff, #9d4edd)", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
                  {inviting ? "Sending..." : `Send Invitations →`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <main style={{ paddingTop: 88, maxWidth: 1100, margin: "0 auto", padding: "88px 24px 60px" }}>

        <div style={{ marginBottom: 28 }}>
          <span style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Role</span>
          <h1 style={{ fontSize: 32, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", margin: "8px 0 4px" }}>{role?.title}</h1>
          <span style={{ fontSize: 13, color: "#849495" }}>{role?.department} · {role?.experience?.replace(/_/g," ")}</span>
        </div>

        {/* Interview link */}
        <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 20, borderLeft: "3px solid rgba(0,219,233,0.5)" }}>
          <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", marginBottom: 10 }}>CANDIDATE INTERVIEW LINK — share this link with candidates</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ flex: 1, background: "rgba(10,12,16,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#849495", fontFamily: "JetBrains Mono, monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {interviewLink}
            </div>
            <button onClick={copyLink} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(0,219,233,0.1)", border: "1px solid rgba(0,219,233,0.3)", color: "#00dbe9", fontSize: 12, fontFamily: "JetBrains Mono, monospace", cursor: "pointer", whiteSpace: "nowrap" }}>
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total", value: candidates.length },
            { label: "Completed", value: candidates.filter(c => c.completed).length },
            { label: "Avg Score", value: avgScore || "—" },
            { label: "Shortlisted", value: shortlisted },
            { label: "Rejected", value: rejected },
          ].map(({ label, value }) => (
            <div key={label} className="glass" style={{ borderRadius: 14, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495", marginBottom: 6 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#00dbe9" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Candidates */}
        <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 16 }}>
          Candidates ({candidates.length})
        </h2>

        {candidates.length === 0 && (
          <div className="glass" style={{ borderRadius: 20, padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎤</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8 }}>No candidates yet</h3>
            <p style={{ color: "#849495" }}>Share the interview link above to start receiving applications.</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {candidates.map(c => {
            const name = c.candidate_name || c.config?.candidateName || "Anonymous";
            const score = c.feedback?.scores?.overall;
            const status = c.shortlist_status;
            const flagged = c.proctoring?.total_flags > 0 || c.proctoring?.tab_switches > 0;

            return (
              <div key={c.id} className="row">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

                  {/* Candidate info */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(249,94,20,0.1)", border: "1px solid rgba(249,94,20,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#f95e14", flexShrink: 0 }}>
                      {name[0]?.toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: "#e2e2e8", marginBottom: 3 }}>{name}</h4>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>
                          {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        {c.duration_seconds > 0 && <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>· {Math.floor(c.duration_seconds/60)}m</span>}
                        {flagged && <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#ffb4ab" }}>· ⚠ Flagged</span>}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                    {score ? (
                      <>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 9, fontFamily: "JetBrains Mono, monospace", color: "#849495", marginBottom: 2 }}>SCORE</div>
                          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "Geist, sans-serif", color: scoreToColor(score) }}>{score}</div>
                        </div>
                        <div style={{ padding: "3px 8px", borderRadius: 9999, fontSize: 9, fontFamily: "JetBrains Mono, monospace", background: !flagged ? "rgba(0,219,233,0.08)" : "rgba(255,180,171,0.08)", color: !flagged ? "#00dbe9" : "#ffb4ab", border: `1px solid ${!flagged ? "rgba(0,219,233,0.2)" : "rgba(255,180,171,0.2)"}` }}>
                          {!flagged ? "✓ CLEAN" : "⚠ FLAGGED"}
                        </div>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, color: "#849495", padding: "3px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 9999 }}>
                        {c.completed ? "No score" : "In progress"}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {/* VIEW FULL REPORT */}
                    <button
                      onClick={() => router.push(`/company/candidates/${c.id}`)}
                      style={{ padding: "7px 16px", borderRadius: 9999, background: "rgba(0,219,233,0.1)", border: "1px solid rgba(0,219,233,0.3)", color: "#00dbe9", fontSize: 12, fontFamily: "JetBrains Mono, monospace", cursor: "pointer", fontWeight: 600 }}>
                      View Report →
                    </button>

                    {/* Shortlist / Reject */}
                    {status === "shortlisted" ? (
                      <span style={{ padding: "7px 14px", borderRadius: 9999, fontSize: 11, fontFamily: "JetBrains Mono, monospace", background: "rgba(0,255,100,0.1)", color: "#00ff64", border: "1px solid rgba(0,255,100,0.2)" }}>✓ Shortlisted</span>
                    ) : status === "rejected" ? (
                      <span style={{ padding: "7px 14px", borderRadius: 9999, fontSize: 11, fontFamily: "JetBrains Mono, monospace", background: "rgba(255,180,171,0.1)", color: "#ffb4ab", border: "1px solid rgba(255,180,171,0.2)" }}>✗ Rejected</span>
                    ) : (
                      <>
                        <button disabled={updating === c.id} onClick={() => updateStatus(c.id, "shortlisted")}
                          style={{ padding: "7px 14px", borderRadius: 9999, background: "rgba(0,255,100,0.06)", border: "1px solid rgba(0,255,100,0.2)", color: "#00ff64", fontSize: 11, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
                          ✓ Shortlist
                        </button>
                        <button disabled={updating === c.id} onClick={() => updateStatus(c.id, "rejected")}
                          style={{ padding: "7px 14px", borderRadius: 9999, background: "rgba(255,180,171,0.06)", border: "1px solid rgba(255,180,171,0.2)", color: "#ffb4ab", fontSize: 11, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
                          ✗ Reject
                        </button>
                      </>
                    )}
                    {status && (
                      <button onClick={() => updateStatus(c.id, null)}
                        style={{ padding: "7px 12px", borderRadius: 9999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#849495", fontSize: 11, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
                        Undo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
