import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { TranscriptEntry, InterviewConfig } from "@/types/interview";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { messages, config, systemPrompt }: {
    messages: TranscriptEntry[];
    config: InterviewConfig;
    systemPrompt: string;
  } = await req.json();

  const chatMessages = messages.map(m => ({
    role: m.role === "interviewer" ? "assistant" as const : "user" as const,
    content: m.content,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.8,
    messages: [
      { role: "system", content: systemPrompt },
      ...chatMessages,
    ],
  });

  const reply = response.choices[0].message.content || "";
  const sessionEnded = reply.toLowerCase().includes("we'll be in touch") ||
                       reply.toLowerCase().includes("end of our interview") ||
                       reply.toLowerCase().includes("brings us to the end");

  return NextResponse.json({ reply, sessionEnded });
}
