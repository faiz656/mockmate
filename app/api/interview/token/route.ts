import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-realtime-2",
        voice: "alloy",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI error:", err);
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const session = await res.json();
    console.log("Session created:", JSON.stringify(session));
    return NextResponse.json(session);
  } catch (err) {
    console.error("Token error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
