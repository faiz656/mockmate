"use client";
import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { InterviewConfig, TranscriptEntry, Session } from "@/types/interview";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  const createSession = useCallback(async (config: InterviewConfig): Promise<string> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        config,
        transcript: [],
        feedback: null,
        duration_seconds: 0,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    setSession(data);
    return data.id;
  }, []);

  const appendTranscript = useCallback(async (
    sessionId: string,
    entry: TranscriptEntry
  ) => {
    const supabase = createClient();
    const { data: current } = await supabase
      .from("sessions")
      .select("transcript")
      .eq("id", sessionId)
      .single();

    const updated = [...(current?.transcript || []), entry];
    await supabase
      .from("sessions")
      .update({ transcript: updated })
      .eq("id", sessionId);

    setSession(prev => prev ? { ...prev, transcript: updated } : prev);
  }, []);

  const completeSession = useCallback(async (
    sessionId: string,
    duration: number
  ) => {
    const supabase = createClient();
    await supabase
      .from("sessions")
      .update({ completed: true, duration_seconds: duration })
      .eq("id", sessionId);
  }, []);

  return { session, loading, createSession, appendTranscript, completeSession };
}
