import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { sdp, systemPrompt } = await req.json();

  const sessionConfig = JSON.stringify({
    type: "realtime",
    model: "gpt-realtime-2",
    audio: {
      output: { voice: "nova" }
    },
    instructions: systemPrompt,
  });

  const fd = new FormData();
  fd.set("sdp", sdp);
  fd.set("session", sessionConfig);

  const response = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: fd,
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Realtime error:", err);
    return NextResponse.json({ error: err }, { status: response.status });
  }

  const sdpAnswer = await response.text();
  return new NextResponse(sdpAnswer, {
    headers: { "Content-Type": "application/sdp" },
  });
}
