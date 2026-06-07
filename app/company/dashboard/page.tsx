"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Role {
  id: string;
  title: string;
  department: string;
  experience: string;
  active: boolean;
  created_at: string;
  candidate_count?: number;
}

interface Company {
  name: string;
  plan: string;
  interview_limit: number;
  interviews_used: number;
}

function scoreToColor(s: number) {
  if (s >= 85) return "#00dbe9";
  if (s >= 70) return "#7df4ff";
  if (s >= 55) return "#d1bcff";
  return "#ffb4ab";
}

export default function CompanyDashboardPage() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/company/login"); return; }

      // Get company data
      const { data: co } = await supabase.from("companies").select("*").eq("id", user.id).single();
      if (co) setCompany(co);

      // Get roles
      const { data: rolesData } = await supabase.from("roles").select("*").eq("company_id", user.id).order("created_at", { ascending: false });
      setRoles(rolesData || []);

      // Get recent candidates
      const { data: candidates } = await supabase.from("sessions")
        .select("*").eq("company_id", user.id)
        .order("created_at", { ascending: false }).limit(10);
      setRecentCandidates(candidates || []);

      setLoading(false);
    });
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const usagePercent = company ? Math.round((company.interviews_used / company.interview_limit) * 100) : 0;

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .glass { background: rgba(22,27,34,0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s; }
        .glass:hover { border-color: rgba(0,219,233,0.25); }
        .row { background: rgba(22,27,34,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: all 0.2s; cursor: pointer; }
        .row:hover { border-color: rgba(0,219,233,0.3); transform: translateY(-1px); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333539; border-radius: 10px; }
      `}</style>

      {/* Header */}
      <header style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(10,12,16,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", letterSpacing: "-0.02em", fontFamily: "Geist, sans-serif" }}>MockMate</span>
            </Link>
            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495", padding: "3px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 6, letterSpacing: "0.06em" }}>COMPANY PORTAL</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#849495" }}>{company?.name}</span>
            <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontFamily: "JetBrains Mono, monospace", background: "rgba(0,219,233,0.1)", color: "#00dbe9", border: "1px solid rgba(0,219,233,0.2)", textTransform: "uppercase" }}>
              {company?.plan}
            </span>
            <button onClick={signOut} style={{ fontSize: 12, color: "#849495", background: "none", border: "none", cursor: "pointer", fontFamily: "JetBrains Mono, monospace" }}>Sign Out</button>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 88, maxWidth: 1200, margin: "0 auto", padding: "88px 24px 60px" }}>

        {/* Welcome */}
        <div style={{ marginBottom: 36 }}>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Company Dashboard</span>
          <h1 style={{ fontSize: 36, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", marginTop: 8, marginBottom: 4 }}>
            {company?.name || "Loading..."}
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16, marginBottom: 32 }}>

          {/* Usage card */}
          <div className="glass" style={{ gridColumn: "span 5", borderRadius: 20, padding: 28 }}>
            <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em", marginBottom: 16 }}>TRIAL USAGE</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
              <span style={{ fontSize: 40, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#00dbe9" }}>{company?.interviews_used || 0}</span>
              <span style={{ fontSize: 16, color: "#849495" }}>/ {company?.interview_limit || 20} interviews</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 9999, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${usagePercent}%`, background: usagePercent > 80 ? "#ffb4ab" : "#00dbe9", borderRadius: 9999, transition: "width 0.5s" }} />
            </div>
            <p style={{ fontSize: 12, color: "#849495" }}>{(company?.interview_limit ?? 20) - (company?.interviews_used || 0)} interviews remaining</p>
            <button onClick={() => router.push("/company/billing")}
              style={{ marginTop: 16, padding: "8px 20px", borderRadius: 9999, background: "linear-gradient(135deg, #00dbe9, #00f0ff)", border: "none", color: "#002022", fontSize: 12, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
              Upgrade Plan →
            </button>
          </div>

          {/* Quick stats */}
          <div className="glass" style={{ gridColumn: "span 7", borderRadius: 20, padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
              {[
                { label: "Open Roles", value: roles.filter(r => r.active).length, color: "#00dbe9" },
                { label: "Total Candidates", value: recentCandidates.length, color: "#7df4ff" },
                { label: "Completed", value: recentCandidates.filter(c => c.completed).length, color: "#d1bcff" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495", letterSpacing: "0.08em", marginBottom: 8 }}>{label.toUpperCase()}</div>
                  <div style={{ fontSize: 40, fontWeight: 700, fontFamily: "Geist, sans-serif", color, lineHeight: 1 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roles section */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff" }}>Active Roles</h2>
            <button onClick={() => router.push("/company/roles/new")}
              style={{ padding: "8px 20px", borderRadius: 9999, background: "linear-gradient(135deg, #00dbe9, #00f0ff)", border: "none", color: "#002022", fontSize: 12, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
              + Create Role
            </button>
          </div>

          {roles.length === 0 && (
            <div className="glass" style={{ borderRadius: 20, padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#fff", marginBottom: 8 }}>No roles yet</h3>
              <p style={{ color: "#849495", marginBottom: 20 }}>Create your first role to start interviewing candidates.</p>
              <button onClick={() => router.push("/company/roles/new")}
                style={{ padding: "10px 24px", borderRadius: 9999, background: "#00dbe9", border: "none", color: "#002022", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Create First Role
              </button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {roles.map(role => (
              <div key={role.id} className="row" onClick={() => router.push(`/company/roles/${role.id}`)}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,219,233,0.08)", border: "1px solid rgba(0,219,233,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💼</div>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 600, color: "#e2e2e8", marginBottom: 3 }}>{role.title}</h4>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>{role.department}</span>
                      <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>· {role.experience}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  {/* Copy interview link */}
                  <button onClick={e => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/interview/apply/${role.id}`);
                    alert("Interview link copied!");
                  }} style={{ padding: "6px 14px", borderRadius: 9999, background: "rgba(0,219,233,0.1)", border: "1px solid rgba(0,219,233,0.3)", color: "#00dbe9", fontSize: 11, fontFamily: "JetBrains Mono, monospace", cursor: "pointer" }}>
                    Copy Link
                  </button>
                  <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 10, fontFamily: "JetBrains Mono, monospace", background: role.active ? "rgba(0,219,233,0.1)" : "rgba(255,255,255,0.05)", color: role.active ? "#00dbe9" : "#849495", border: `1px solid ${role.active ? "rgba(0,219,233,0.2)" : "rgba(255,255,255,0.08)"}` }}>
                    {role.active ? "ACTIVE" : "CLOSED"}
                  </span>
                  <span style={{ color: "#849495", fontSize: 18 }}>›</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent candidates */}
        {recentCandidates.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff" }}>Recent Candidates</h2>
              <button onClick={() => router.push("/company/candidates")}
                style={{ fontSize: 12, color: "#00dbe9", background: "none", border: "none", cursor: "pointer", fontFamily: "JetBrains Mono, monospace" }}>
                View All →
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentCandidates.slice(0, 5).map(c => (
                <div key={c.id} className="row">
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(249,94,20,0.1)", border: "1px solid rgba(249,94,20,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#f95e14" }}>
                      {(c.candidate_name || c.config?.candidateName || "?")?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: "#e2e2e8", marginBottom: 2 }}>
                        {c.candidate_name || c.config?.candidateName || "Anonymous"}
                      </h4>
                      <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#849495" }}>
                        {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {c.config?.role?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {c.feedback?.scores?.overall ? (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#849495", marginBottom: 2 }}>SCORE</div>
                        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Geist, sans-serif", color: scoreToColor(c.feedback.scores.overall) }}>
                          {c.feedback.scores.overall}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: "#849495", padding: "3px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 9999 }}>
                        {c.completed ? "No score" : "In progress"}
                      </span>
                    )}
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "5px 12px", borderRadius: 9999, background: "rgba(0,219,233,0.1)", border: "1px solid rgba(0,219,233,0.2)", color: "#00dbe9", fontSize: 11, cursor: "pointer" }}>
                        View
                      </button>
                      <button style={{ padding: "5px 12px", borderRadius: 9999, background: "rgba(0,255,100,0.08)", border: "1px solid rgba(0,255,100,0.2)", color: "#00ff64", fontSize: 11, cursor: "pointer" }}>
                        Shortlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
