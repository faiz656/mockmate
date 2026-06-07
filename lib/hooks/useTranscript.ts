"use client";
import { useState, useCallback } from "react";
import type { TranscriptEntry } from "@/types/interview";

export function useTranscript() {
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);

  const add = useCallback((content: string, role: "interviewer" | "candidate") => {
    const entry: TranscriptEntry = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: Date.now(),
    };
    setEntries(prev => [...prev, entry]);
    return entry;
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  return { entries, add, clear };
}
