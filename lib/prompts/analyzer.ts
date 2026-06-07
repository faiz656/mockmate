import type { InterviewConfig, TranscriptEntry } from "@/types/interview";

export function buildAnalyzerPrompt(
  transcript: TranscriptEntry[],
  config: InterviewConfig
): string {
  const formatted = transcript
    .map(e => `${e.role === "interviewer" ? "ALEX" : "CANDIDATE"}: ${e.content}`)
    .join("\n\n");

  return `You are an expert interview coach analyzing a completed job interview.

ROLE INTERVIEWED FOR: ${config.role}
EXPERIENCE LEVEL: ${config.experience}

FULL TRANSCRIPT:
${formatted}

ANALYZE AND PROVIDE SCORES (0-100) FOR:
1. communication_clarity — How clearly did they express ideas?
2. technical_depth — How deep and accurate was the technical knowledge?
3. star_method — Did they structure behavioral answers with Situation/Task/Action/Result?
4. confidence — Did they sound confident or hesitant?
5. filler_words — Penalize heavy use of um, uh, like, basically, you know (100 = zero fillers)
6. structure — Were answers organized and to the point?

IDENTIFY:
- 3 specific strengths (with exact examples from the transcript)
- 3 specific improvements (with exact examples from the transcript)
- The single best answer they gave (quote it briefly, max 20 words)
- The single weakest answer (quote it briefly, max 20 words)

OUTPUT — respond ONLY with valid JSON, no markdown, no explanation:
{
  "overall_score": 0-100,
  "scores": {
    "communication": 0-100,
    "technical_depth": 0-100,
    "star_method": 0-100,
    "confidence": 0-100,
    "filler_words": 0-100,
    "structure": 0-100
  },
  "strengths": ["...", "...", "..."],
  "improvements": ["...", "...", "..."],
  "best_answer": "...",
  "weakest_answer": "...",
  "overall_summary": "2-3 sentence honest, direct summary of the candidate's performance"
}`;
}
