// Rough token estimator (1 token ≈ 4 chars for English)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function isNearContextLimit(
  transcript: Array<{ content: string }>,
  limit = 8000
): boolean {
  const total = transcript.reduce((sum, e) => sum + estimateTokens(e.content), 0);
  return total > limit;
}

export function trimTranscriptForContext(
  transcript: Array<{ content: string; role: string }>,
  keepLast = 6
): { summary: string; recent: typeof transcript } {
  if (transcript.length <= keepLast) {
    return { summary: "", recent: transcript };
  }
  const old = transcript.slice(0, -keepLast);
  const recent = transcript.slice(-keepLast);
  const summary = `[Earlier in the interview: ${old.length} exchanges occurred covering introductions and initial technical questions.]`;
  return { summary, recent };
}
