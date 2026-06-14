import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use OpenAI to extract text from PDF
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Convert to base64
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "application/pdf";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all text content from this resume/CV. Return only the extracted text, nothing else. Include all sections: personal info, education, experience, skills, projects, certifications."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
    });

    const text = response.choices[0].message.content || "";
    return NextResponse.json({ text });
  } catch (e: any) {
    console.error("Resume extract error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
