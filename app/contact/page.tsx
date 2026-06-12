"use client";
import { useState } from "react";
import Link from "next/link";
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const submit = () => { setSent(true); };
  return (
    <div style={{ background: "#0A0C10", color: "#e2e2e8", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .input-field { width: 100%; background: rgba(10,12,16,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 16px; color: #e2e2e8; font-size: 14px; font-family: Inter, sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(0,219,233,0.5); }
        .input-field::placeholder { color: #849495; }
        label { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #849495; letter-spacing: 0.08em; text-transform: uppercase; display: block; margin-bottom: 8px; }
      `}</style>
      <header style={{ padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1280, margin: "0 auto", height: 64 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00dbe9, #7000ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#dbfcff", fontFamily: "Geist, sans-serif" }}>MockMate</span>
          </Link>
        </div>
      </header>
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: "#00dbe9", letterSpacing: "0.1em", textTransform: "uppercase" }}>Get in Touch</span>
          <h1 style={{ fontSize: 42, fontWeight: 700, fontFamily: "Geist, sans-serif", color: "#fff", letterSpacing: "-0.02em", margin: "16px 0 16px" }}>Contact Us</h1>
          <p style={{ fontSize: 16, color: "#849495" }}>Have a question, partnership inquiry, or feedback? We'd love to hear from you.</p>
        </div>
        {sent ? (
          <div style={{ padding: 32, borderRadius: 16, background: "rgba(0,219,233,0.06)", border: "1px solid rgba(0,219,233,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Message sent!</h2>
            <p style={{ color: "#849495" }}>We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <div style={{ background: "rgba(22,27,34,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div><label>Your Name</label><input className="input-field" placeholder="Faiz Ahmed" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><label>Email</label><input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div><label>Subject</label><input className="input-field" placeholder="Partnership / Bug / Question" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
              <div><label>Message</label><textarea className="input-field" placeholder="Your message..." rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ resize: "vertical" }} /></div>
            </div>
            <button onClick={submit} style={{ width: "100%", marginTop: 24, padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #00dbe9, #00f0ff)", color: "#002022", fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}>
              Send Message →
            </button>
            <div style={{ marginTop: 24, padding: 16, borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 13, color: "#849495", marginBottom: 8 }}>Or reach us directly:</p>
              <a href="mailto:mockmatepk@gmail.com" style={{ fontSize: 14, color: "#00dbe9", textDecoration: "none", fontFamily: "JetBrains Mono, monospace" }}>mockmatepk@gmail.com</a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
