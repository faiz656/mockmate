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

  const responseText = await response.text();
  console.log("OpenAI Realtime response status:", response.status);
  console.log("OpenAI Realtime response:", responseText);

  if (!response.ok) {
    return NextResponse.json({ error: responseText }, { status: response.status });
  }

  return new NextResponse(responseText, {
    headers: { "Content-Type": "application/sdp" },
  });
}
