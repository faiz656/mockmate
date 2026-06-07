"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div style={{ background: "#0A0C10", minHeight: "100vh", color: "#e2e2e8", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes glow { 0%,100%{opacity:0.1} 50%{opacity:0.25} }
        .glass { background: rgba(22,27,34,0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .step-card { background: rgba(22,27,34,0.6); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 20px; transition: all 0.3s; }
        .step-card:hover { border-color: rgba(0,219,233,0.3); }
      `}</style>

      {/* Glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "rgba(0,219,233,0.07)", borderRadius: "50%", filter: "blur(100px)", animation: "glow 4s infinite", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 560, width: "100%", textAlign: "center" }}>

        {/* Logo */}
        <div style={{ marginBottom: 32, animation: "float 3s ease-in-out infinite" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#fff", margin: "0 auto", boxShadow: "0 0 40px rgba(0,219,233,0.4)" }}>M</div>
        </div>

        {/* Title */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 9999, background: "rgba(0,219,233,0.08)", border: "1px solid rgba(0,219,233,0.2)", marginBottom: 20 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00dbe9", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Account Created Successfully</span>
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", marginBottom: 12 }}>
          Welcome to MockMate!
        </h1>
        <p style={{ fontSize: 16, color: "#849495", lineHeight: 1.6, marginBottom: 40 }}>
          You're all set. Here's how it works — then let's start your first interview.
        </p>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 36 }}>
          {[
            { num: "01", icon: "⚙️", title: "Configure", desc: "Choose your role, experience level, and interview mode." },
            { num: "02", icon: "🎤", title: "Interview", desc: "Alex asks real questions. You answer. It adapts to your responses." },
            { num: "03", icon: "📊", title: "Improve", desc: "Get a detailed score report with specific feedback." },
          ].map(({ num, icon, title, desc }) => (
            <div key={num} className="step-card">
              <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", marginBottom: 10 }}>{num}</div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 600, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 12, color: "#849495", lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => router.push("/interview/setup")}
            style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #00dbe9, #00f0ff)", color: "#002022", fontSize: 14, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 0 30px rgba(0,219,233,0.3)", transition: "all 0.2s" }}>
            Start First Interview →
          </button>
          <button onClick={() => router.push("/dashboard")}
            style={{ width: "100%", padding: "14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#849495", fontSize: 13, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s" }}>
            Go to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
