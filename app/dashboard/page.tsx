"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "@/types/interview";

function scoreToColor(s: number) {
  if (s >= 85) return "#00dbe9";
  if (s >= 70) return "#7df4ff";
  if (s >= 55) return "#d1bcff";
  return "#ffb4ab";
}

function formatDuration(s: number) {
  if (s === 0) return "—";
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserName(user.user_metadata?.full_name || "");
    });
    supabase.from("sessions").select("*").order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => { setSessions(data || []); setLoading(false); });
  }, []);

  const completedSessions = sessions.filter(s => s.feedback);
  const avgScore = completedSessions.length
    ? Math.round(completedSessions.reduce((sum, s) => sum + (s.feedback?.scores.overall || 0), 0) / completedSessions.length)
    : 0;
  const bestScore = completedSessions.length
    ? Math.max(...completedSessions.map(s => s.feedback?.scores.overall || 0))
    : 0;

  const roleIcons: Record<string, string> = {
    fullstack_developer: "⚡", frontend_developer: "🎨", backend_developer: "⚙️",
    mobile_developer: "📱", data_scientist: "📊", devops_engineer: "🔧",
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .glass { background: rgba(22,27,34,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s; }
        .glass:hover { border-color: rgba(0,219,233,0.3); }
        .session-row { background: rgba(22,27,34,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: all 0.2s; }
        .session-row:hover { border-color: rgba(0,219,233,0.3); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333539; border-radius: 10px; }
      `}</style>

      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(10,12,16,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={signOut} style={{ fontSize: 12, color: "#849495", background: "none", border: "none", cursor: "pointer", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em" }}>Sign Out</button>
            <Link href="/interview/setup" style={{ padding: "8px 20px", borderRadius: 9999, background: "linear-gradient(135deg, #00dbe9, #00f0ff)", color: "#002022", fontSize: 12, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
              New Interview
            </Link>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 88, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 60px" }}>

        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Welcome back</span>
          <h1 style={{ fontSize: 40, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", marginTop: 8, marginBottom: 4 }}>
            {userName ? `Hey ${userName.split(" ")[0]} 👋` : "Dashboard"}
          </h1>
          <p style={{ color: "#849495", fontSize: 15 }}>Track your interview performance and progress.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16, marginBottom: 32 }}>
          <div className="glass" style={{ gridColumn: "span 8", borderRadius: 20, padding: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "rgba(0,219,233,0.06)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[
                { label: "Total Sessions", value: sessions.length, color: "#00dbe9" },
                { label: "Average Score", value: avgScore || "—", color: "#7df4ff" },
                { label: "Best Score", value: bestScore || "—", color: "#d1bcff" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: 48, fontWeight: 700, fontFamily: "Geist, sans-serif", color, letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass" style={{ gridColumn: "span 4", borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between", borderColor: "rgba(0,219,233,0.15)" }}>
            <div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0,219,233,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>🎤</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 8 }}>Ready to practice?</h3>
              <p style={{ fontSize: 13, color: "#849495", lineHeight: 1.5 }}>Start a new AI interview session.</p>
            </div>
            <Link href="/interview/setup" style={{ display: "block", textAlign: "center", padding: "12px", borderRadius: 12, background: "linear-gradient(135deg, #00dbe9, #00f0ff)", color: "#002022", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", textDecoration: "none", marginTop: 20 }}>
              Start Interview →
            </Link>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff" }}>Recent Sessions</h2>
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>{sessions.length} total</span>
          </div>

          {loading && <div style={{ textAlign: "center", padding: 40, color: "#849495" }}>Loading sessions...</div>}

          {!loading && sessions.length === 0 && (
            <div className="glass" style={{ borderRadius: 20, padding: 48, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🎤</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 8 }}>No interviews yet</h3>
              <p style={{ color: "#849495", marginBottom: 24 }}>Start your first AI mock interview now.</p>
              <Link href="/interview/setup" style={{ padding: "12px 28px", borderRadius: 9999, background: "#00dbe9", color: "#002022", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", textDecoration: "none" }}>
                Start First Interview
              </Link>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sessions.map(s => (
              <div key={s.id} className="session-row">
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,219,233,0.08)", border: "1px solid rgba(0,219,233,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {roleIcons[s.config?.role] || "🎤"}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 600, color: "#e2e2e8", textTransform: "capitalize", marginBottom: 3 }}>
                      {s.config?.role?.replace(/_/g, " ")}
                    </h4>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>
                        {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>· {formatDuration(s.duration_seconds)}</span>
                      <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", textTransform: "capitalize" }}>· {s.config?.pressure} mode</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  {s.feedback ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495", marginBottom: 4 }}>SCORE</div>
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "Geist, sans-serif", color: scoreToColor(s.feedback.scores.overall) }}>
                        {s.feedback.scores.overall}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", padding: "4px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 9999 }}>
                      {s.completed ? "No feedback" : "In progress"}
                    </span>
                  )}
                  <span style={{ color: "#849495", fontSize: 18 }}>›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
