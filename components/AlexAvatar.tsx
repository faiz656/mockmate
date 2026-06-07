"use client";
import { useEffect, useRef } from "react";

interface AlexAvatarProps {
  status: "connecting" | "listening" | "thinking" | "speaking";
  isUserSpeaking: boolean;
}

export default function AlexAvatar({ status, isUserSpeaking }: AlexAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>();
  const timeRef = useRef(0);
  const blinkRef = useRef(0);
  const nextBlinkRef = useRef(3000);
  const mouthRef = useRef(0);
  const browRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (timestamp: number) => {
      const dt = timestamp - timeRef.current;
      timeRef.current = timestamp;
      ctx.clearRect(0, 0, 160, 160);

      blinkRef.current += dt;
      if (blinkRef.current > nextBlinkRef.current) {
        blinkRef.current = 0;
        nextBlinkRef.current = 2000 + Math.random() * 3000;
      }
      const blinkProgress = blinkRef.current < 150 ? Math.sin((blinkRef.current / 150) * Math.PI) : 0;

      const targetMouth = status === "speaking" ? Math.sin(timestamp / 120) * 0.5 + 0.5 : 0;
      mouthRef.current += (targetMouth - mouthRef.current) * 0.15;

      const targetBrow = status === "thinking" ? -4 : status === "speaking" ? 2 : 0;
      browRef.current += (targetBrow - browRef.current) * 0.08;

      const headBob = status === "speaking" ? Math.sin(timestamp / 400) * 1.5 : 0;
      const cx = 80;
      const cy = 80 + headBob;

      // Glow ring
      ctx.beginPath();
      ctx.arc(cx, cy, 68, 0, Math.PI * 2);
      ctx.strokeStyle = status === "speaking" ? "rgba(0,219,233,0.2)" : isUserSpeaking ? "rgba(249,94,20,0.2)" : "rgba(0,219,233,0.08)";
      ctx.lineWidth = status === "speaking" ? 3 : 1.5;
      ctx.stroke();

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, 62, 0, Math.PI * 2);
      ctx.strokeStyle = status === "speaking" ? "rgba(0,219,233,0.6)" : isUserSpeaking ? "rgba(249,94,20,0.5)" : "rgba(0,219,233,0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Face background
      ctx.beginPath();
      ctx.arc(cx, cy, 58, 0, Math.PI * 2);
      ctx.fillStyle = "#0d1117";
      ctx.fill();

      // Skin
      ctx.beginPath();
      ctx.arc(cx, cy, 52, 0, Math.PI * 2);
      ctx.fillStyle = "#c8956c";
      ctx.fill();

      // Hair top
      ctx.beginPath();
      ctx.arc(cx, cy - 8, 52, Math.PI, 0);
      ctx.fillStyle = "#1a0a00";
      ctx.fill();

      // Hair sides
      ctx.fillStyle = "#1a0a00";
      ctx.fillRect(cx - 52, cy - 20, 12, 30);
      ctx.fillRect(cx + 40, cy - 20, 12, 30);

      // Face oval
      ctx.beginPath();
      ctx.ellipse(cx, cy + 8, 36, 42, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#c8956c";
      ctx.fill();

      // Neck
      ctx.fillStyle = "#c8956c";
      ctx.fillRect(cx - 12, cy + 44, 24, 20);

      // Shirt
      ctx.beginPath();
      ctx.moveTo(cx - 35, cy + 62);
      ctx.lineTo(cx - 20, cy + 55);
      ctx.lineTo(cx + 20, cy + 55);
      ctx.lineTo(cx + 35, cy + 62);
      ctx.fillStyle = "#1a3a5c";
      ctx.fill();

      // Eyes
      const eyeH = 7 * (1 - blinkProgress);
      [[cx - 14, cx + 14]].flat().forEach((ex, idx) => {
        const ey = cy + 2 + browRef.current;
        ctx.beginPath();
        ctx.ellipse(ex, ey, 8, Math.max(0.5, eyeH), 0, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        if (eyeH > 2) {
          ctx.beginPath();
          ctx.arc(ex + 1, ey, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#3d2b1f";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ex + 2, ey - 1, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#000";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ex + 3, ey - 2, 1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.fill();
        }
      });

      // Eyebrows
      ctx.strokeStyle = "#1a0a00";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      const browY = cy - 10 + browRef.current;
      [[cx - 14, cx + 14]].flat().forEach(ex => {
        ctx.beginPath();
        ctx.moveTo(ex - 9, browY + (status === "thinking" ? 2 : 0));
        ctx.quadraticCurveTo(ex, browY - 3, ex + 9, browY + (status === "thinking" ? 2 : 0));
        ctx.stroke();
      });

      // Nose
      ctx.strokeStyle = "#a07050";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 8);
      ctx.lineTo(cx - 4, cy + 16);
      ctx.lineTo(cx - 2, cy + 17);
      ctx.moveTo(cx, cy + 8);
      ctx.lineTo(cx + 4, cy + 16);
      ctx.lineTo(cx + 2, cy + 17);
      ctx.stroke();

      // Mouth
      const mouthY = cy + 28;
      const mouthOpen = mouthRef.current * 8;
      ctx.fillStyle = "#8b1a2f";
      ctx.beginPath();
      ctx.moveTo(cx - 12, mouthY);
      ctx.quadraticCurveTo(cx, mouthY + 6 + mouthOpen, cx + 12, mouthY);
      if (mouthOpen > 1) ctx.quadraticCurveTo(cx, mouthY + 2, cx - 12, mouthY);
      ctx.fill();

      if (mouthOpen > 2) {
        ctx.fillStyle = "white";
        ctx.fillRect(cx - 10, mouthY + 1, 20, mouthOpen * 0.4);
      }

      // Status dot
      ctx.beginPath();
      ctx.arc(cx + 44, cy - 44, 5, 0, Math.PI * 2);
      ctx.fillStyle = status === "speaking" ? "#00dbe9" : isUserSpeaking ? "#f95e14" : status === "thinking" ? "#d1bcff" : "rgba(0,219,233,0.4)";
      ctx.fill();

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [status, isUserSpeaking]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <canvas ref={canvasRef} width={160} height={160} style={{ borderRadius: "50%" }} />
      <div style={{
        fontSize: 10, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em",
        color: status === "speaking" ? "#00dbe9" : isUserSpeaking ? "#f95e14" : "#849495",
        padding: "3px 10px", borderRadius: 9999,
        background: status === "speaking" ? "rgba(0,219,233,0.08)" : isUserSpeaking ? "rgba(249,94,20,0.08)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${status === "speaking" ? "rgba(0,219,233,0.2)" : isUserSpeaking ? "rgba(249,94,20,0.2)" : "rgba(255,255,255,0.06)"}`,
      }}>
        {status === "speaking" ? "ALEX SPEAKING" : isUserSpeaking ? "LISTENING" : status === "thinking" ? "THINKING..." : "ALEX — AI INTERVIEWER"}
      </div>
    </div>
  );
}
