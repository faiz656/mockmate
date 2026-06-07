"use client";
import { useRef, useState, useCallback } from "react";

export type VoiceState = "idle" | "connecting" | "listening" | "speaking" | "error";

interface UseVoiceOptions {
  onTranscript: (text: string, role: "interviewer" | "candidate") => void;
  onSessionEnd: () => void;
  systemPrompt: string;
}

export function useVoice({ onTranscript, onSessionEnd, systemPrompt }: UseVoiceOptions) {
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);

  const start = useCallback(async () => {
    setState("connecting");
    setError(null);

    try {
      const tokenRes = await fetch("/api/interview/token", { method: "POST" });
      const tokenData = await tokenRes.json();

      if (!tokenRes.ok || !tokenData.client_secret) {
        throw new Error(tokenData.error || "Failed to get token");
      }

      const ephemeralKey = tokenData.client_secret.value;
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audio = new Audio();
      audio.autoplay = true;
      pc.ontrack = e => { audio.srcObject = e.streams[0]; };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onopen = () => {
        setState("listening");
        dc.send(JSON.stringify({
          type: "session.update",
          session: {
            modalities: ["audio", "text"],
            instructions: systemPrompt,
            voice: "alloy",
            input_audio_transcription: { model: "whisper-1" },
            turn_detection: { type: "server_vad", silence_duration_ms: 800 },
          }
        }));
        dc.send(JSON.stringify({ type: "response.create" }));
      };

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          switch (event.type) {
            case "response.audio.delta":
              setState("speaking");
              break;
            case "response.audio.done":
              setState("listening");
              break;
            case "conversation.item.input_audio_transcription.completed":
              if (event.transcript) onTranscript(event.transcript, "candidate");
              break;
            case "response.text.done":
              if (event.text) onTranscript(event.text, "interviewer");
              break;
          }
        } catch {}
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-realtime-2",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      if (!sdpRes.ok) throw new Error("WebRTC connection failed");

      const sdpAnswer = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: sdpAnswer });

    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Failed to connect");
    }
  }, [systemPrompt, onTranscript]);

  const stop = useCallback(() => {
    dcRef.current?.close();
    pcRef.current?.close();
    pcRef.current = null;
    dcRef.current = null;
    setState("idle");
  }, []);

  return { state, error, start, stop };
}
