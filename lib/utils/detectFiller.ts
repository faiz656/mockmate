const FILLER_WORDS = [
  "um", "uh", "like", "basically", "you know", "literally",
  "actually", "sort of", "kind of", "i mean", "right",
  "so yeah", "anyway", "whatever"
];

export function detectFillerWords(text: string): {
  count: number;
  words: string[];
  score: number;
} {
  const lower = text.toLowerCase();
  const found: string[] = [];

  FILLER_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches) found.push(...matches);
  });

  const wordCount = text.split(/\s+/).length;
  const fillerRatio = found.length / wordCount;
  const score = Math.max(0, Math.round((1 - fillerRatio * 10) * 100));

  return { count: found.length, words: found, score };
}
