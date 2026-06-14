import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { emails, roleId, roleName, companyName, interviewUrl } = await req.json();
    if (!emails?.length) return NextResponse.json({ error: "No emails" }, { status: 400 });

    const results = { sent: 0, failed: 0, errors: [] as string[] };

    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: `MockMate <${process.env.SMTP_EMAIL}>`,
          to: email.trim(),
          subject: `Interview Invitation — ${roleName} at ${companyName}`,
          html: `
            <div style="background:#ffffff;padding:40px 24px;font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
              <div style="text-align:center;margin-bottom:32px">
                <div style="width:48px;height:48px;border-radius:50%;background:#00dbe9;display:inline-flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#002022">M</div>
                <div style="font-size:22px;font-weight:700;color:#0A0C10;margin-top:8px">MockMate</div>
              </div>
              <div style="border:1px solid #e5e7eb;border-radius:16px;padding:36px">
                <h2 style="font-size:20px;font-weight:700;color:#0A0C10;margin-bottom:8px">You've been invited to interview</h2>
                <p style="font-size:15px;color:#6b7280;margin-bottom:8px">
                  <strong>${companyName}</strong> has invited you to complete an AI-powered interview for the position of <strong>${roleName}</strong>.
                </p>
                <p style="font-size:14px;color:#6b7280;margin-bottom:28px">
                  The interview is conducted by Alex, an AI interviewer. It takes about 15-20 minutes and can be done from your browser — no app needed.
                </p>
                <div style="text-align:center;margin-bottom:24px">
                  <a href="${interviewUrl}" style="display:inline-block;padding:14px 32px;border-radius:9999px;background:#00dbe9;color:#002022;font-size:14px;font-weight:700;text-decoration:none">
                    Start Your Interview →
                  </a>
                </div>
                <p style="font-size:12px;color:#9ca3af;text-align:center">This link is valid for 7 days. Make sure you're in a quiet place with good lighting before starting.</p>
              </div>
              <div style="text-align:center;margin-top:24px">
                <p style="font-size:12px;color:#9ca3af">Powered by MockMate · Pakistan's First AI Interview Platform</p>
                <p style="font-size:12px;color:#9ca3af">mockmatepk@gmail.com</p>
              </div>
            </div>
          `,
        });
        results.sent++;
      } catch (e: any) {
        results.failed++;
        results.errors.push(`${email}: ${e.message}`);
      }
    }

    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
