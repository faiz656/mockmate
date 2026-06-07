"use client";
import { useState, useCallback } from "react";
import type { SessionFeedback, TranscriptEntry, InterviewConfig } from "@/types/interview";

export function useFeedback() {
  const [feedback, setFeedback] = useState<SessionFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (
    transcript: TranscriptEntry[],
    config: InterviewConfig
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, config }),
      });
      const data = await res.json();
      setFeedback(data);
      return data as SessionFeedback;
    } catch (err) {
      setError("Failed to generate feedback");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { feedback, loading, error, analyze };
}
