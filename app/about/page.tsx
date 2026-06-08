import Link from "next/link";
export default function AboutPage() {
  return (
    <div style={{ background: "#0A0C10", color: "#e2e2e8", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
      <header style={{ padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </Link>
          <Link href="/signup" style={{ padding: "8px 20px", borderRadius: 9999, background: "#00dbe9", color: "#002022", fontSize: 12, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", textDecoration: "none" }}>Get Started →</Link>
        </div>
      </header>
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>About Us</span>
          <h1 style={{ fontSize: 48, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", margin: "16px 0 24px" }}>Built for Pakistan.</h1>
          <p style={{ fontSize: 18, color: "#849495", lineHeight: 1.8 }}>MockMate was built by university students who were tired of going into interviews unprepared. We noticed that most interview prep tools were built for the US market — generic questions, no local context, no voice practice.</p>
        </div>
        {[
          { title: "The Problem", content: "Pakistani students and professionals struggle with interview preparation. Most resources are text-based, generic, and don't reflect the actual interview experience at local companies like Systems Limited, Arbisoft, or Telenor." },
          { title: "Our Solution", content: "MockMate uses OpenAI's Realtime API to conduct actual voice interviews with an AI interviewer named Alex. Alex asks role-specific questions, follows up on your answers, challenges vague responses, and gives detailed feedback — all automatically." },
          { title: "For Companies", content: "We built a complete B2B hiring portal. Companies create roles, share interview links, and let Alex interview every candidate automatically. Proctored, scored, and shortlisted — without any human intervention until the final review." },
          { title: "Our Team", content: "MockMate was built at Capital University of Science and Technology (CUST), Islamabad. We are a team of CS students passionate about AI and solving real problems in Pakistan's tech ecosystem." },
          { title: "Our Mission", content: "To make quality interview preparation accessible to every Pakistani student, and to help companies hire smarter using AI — regardless of their size or budget." },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 16 }}>{title}</h2>
            <p style={{ fontSize: 16, color: "#849495", lineHeight: 1.8 }}>{content}</p>
          </div>
        ))}
        <div style={{ display: "flex", gap: 12, marginTop: 48 }}>
          <Link href="/signup" style={{ padding: "14px 28px", borderRadius: 9999, background: "#00dbe9", color: "#002022", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", textDecoration: "none" }}>Try MockMate Free →</Link>
          <Link href="/contact" style={{ padding: "14px 28px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.15)", color: "#e2e2e8", fontSize: 13, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", textDecoration: "none" }}>Contact Us</Link>
        </div>
      </main>
    </div>
  );
}
