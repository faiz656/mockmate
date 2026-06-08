import Link from "next/link";
export default function PrivacyPage() {
  const sections = [
    { title: "Information We Collect", content: "We collect information you provide when creating an account (name, email, password), interview session data (audio transcripts, responses, scores), and usage data (pages visited, features used). For company accounts, we also collect company name and industry." },
    { title: "How We Use Your Information", content: "We use your information to provide and improve MockMate services, generate AI-powered interview feedback, allow companies to review candidate performance, send important account notifications, and improve our AI models." },
    { title: "Interview Data", content: "Interview sessions are processed in real-time using OpenAI's API. Audio is transcribed and analyzed to generate feedback. We store transcripts, scores, and proctoring data (face detection results, tab switches) associated with your account. Video is analyzed locally in your browser and is not stored on our servers." },
    { title: "Data Sharing", content: "We do not sell your personal data. Interview results are shared with the company whose interview link you used. We use OpenAI for AI processing and Supabase for data storage. Both are bound by strict data protection agreements." },
    { title: "Data Security", content: "We use industry-standard encryption for data in transit and at rest. Access to your data is restricted to authorized personnel only. You can request deletion of your account and associated data at any time." },
    { title: "Your Rights", content: "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at contact@mockmate.pk. We will respond within 30 days." },
    { title: "Cookies", content: "We use essential cookies for authentication and session management. We do not use tracking or advertising cookies." },
    { title: "Contact", content: "For privacy-related questions, contact us at contact@mockmate.pk or through our contact page." },
  ];
  return (
    <div style={{ background: "#0A0C10", color: "#e2e2e8", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&display=swap');`}</style>
      <header style={{ padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </Link>
        </div>
      </header>
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Legal</span>
        <h1 style={{ fontSize: 42, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", margin: "16px 0 8px" }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: "#849495", marginBottom: 48, fontFamily: "JetBrains Mono, monospace" }}>Last updated: June 2026</p>
        {sections.map(({ title, content }) => (
          <div key={title} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#dbfcff", marginBottom: 12 }}>{title}</h2>
            <p style={{ fontSize: 15, color: "#849495", lineHeight: 1.8 }}>{content}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
