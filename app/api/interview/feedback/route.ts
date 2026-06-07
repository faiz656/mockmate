import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildAnalyzerPrompt } from "@/lib/prompts/analyzer";
import type { TranscriptEntry, InterviewConfig } from "@/types/interview";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { transcript, config, sessionId }: {
    transcript: TranscriptEntry[];
    config: InterviewConfig;
    sessionId?: string;
  } = await req.json();

  const prompt = buildAnalyzerPrompt(transcript, config);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.choices[0].message.content || "{}";
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    const feedback = JSON.parse(clean);

    // Save feedback to Supabase
    if (sessionId) {
      try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        await supabase.from("sessions")
          .update({ feedback, completed: true })
          .eq("id", sessionId);
      } catch (e) {
        console.error("Supabase save error:", e);
      }
    }

    return NextResponse.json(feedback);
  } catch {
    return NextResponse.json({ error: "Failed to parse feedback" }, { status: 500 });
  }
}
