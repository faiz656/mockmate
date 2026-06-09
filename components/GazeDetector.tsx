"use client";
import { useEffect, useRef } from "react";

interface GazeDetectorProps {
  videoId: string;
  canvasId: string;
  onLookAway: () => void;
  onLookBack: () => void;
}

export default function GazeDetector({ videoId, canvasId, onLookAway, onLookBack }: GazeDetectorProps) {
  const lookAwayTimer = useRef<NodeJS.Timeout>();
  const isLookingAwayRef = useRef(false);

  useEffect(() => {
    let running = true;
    let model: any = null;

    const init = async () => {
      try {
        const tf = await import("@tensorflow/tfjs");
        await tf.ready();
        const blazeface = await import("@tensorflow-models/blazeface");
        model = await blazeface.load();

        const detect = async () => {
          if (!running) return;
          const video = document.getElementById(videoId) as HTMLVideoElement;
          const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

          if (!video || video.readyState < 2 || !model) {
            requestAnimationFrame(detect);
            return;
          }

          try {
            const predictions = await model.estimateFaces(video, false);
            const ctx = canvas?.getContext("2d");

            if (predictions.length === 0) {
              requestAnimationFrame(detect);
              return;
            }

            const face = predictions[0];
            // BlazeFace landmarks: [rightEye, leftEye, nose, mouth, rightEar, leftEar]
            const landmarks = face.landmarks as number[][];
            const rightEye = landmarks[0]; // [x, y]
            const leftEye = landmarks[1];  // [x, y]

            const videoW = video.videoWidth || 640;
            const videoH = video.videoHeight || 480;

            // Face bounding box
            const topLeft = face.topLeft as number[];
            const bottomRight = face.bottomRight as number[];
            const faceW = bottomRight[0] - topLeft[0];
            const faceCenterX = (topLeft[0] + bottomRight[0]) / 2 / videoW;
            const faceCenterY = (topLeft[1] + bottomRight[1]) / 2 / videoH;
            const faceSize = faceW / videoW;

            // Eye positions relative to face
            const eyeCenterX = ((rightEye[0] + leftEye[0]) / 2) / videoW;

            // Gaze logic:
            // Face must be centered (0.25 - 0.75 range)
            // Eyes must be in upper portion of frame
            // Face must be large enough (not too far away)
            const lookingAway = 
              faceCenterX < 0.2 || faceCenterX > 0.8 ||  // too far left/right
              faceCenterY < 0.15 || faceCenterY > 0.8 ||  // too far up/down
              faceSize < 0.12 ||                           // too far from camera
              Math.abs(eyeCenterX - faceCenterX) > 0.15;  // eyes not centered on face

            // Draw on canvas
            if (ctx) {
              const scaleX = canvas.width / videoW;
              const scaleY = canvas.height / videoH;
              const color = lookingAway ? "#ff4444" : "#00dbe9";

              // Draw eye dots
              [rightEye, leftEye].forEach(eye => {
                ctx.beginPath();
                ctx.arc(eye[0] * scaleX, eye[1] * scaleY, 5, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(eye[0] * scaleX, eye[1] * scaleY, 12, 0, Math.PI * 2);
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                ctx.stroke();
              });

              // Status text
              ctx.fillStyle = color;
              ctx.font = "bold 11px monospace";
              ctx.fillText(lookingAway ? "⚠ LOOK AT SCREEN" : "✓ GAZE OK", 8, 20);
            }

            if (lookingAway && !isLookingAwayRef.current) {
              if (!lookAwayTimer.current) {
                lookAwayTimer.current = setTimeout(() => {
                  isLookingAwayRef.current = true;
                  onLookAway();
                  lookAwayTimer.current = undefined;
                }, 2500);
              }
            } else if (!lookingAway) {
              clearTimeout(lookAwayTimer.current);
              lookAwayTimer.current = undefined;
              if (isLookingAwayRef.current) {
                isLookingAwayRef.current = false;
                onLookBack();
              }
            }
          } catch {}

          requestAnimationFrame(detect);
        };

        detect();
      } catch (e) {
        console.error("Gaze detection failed:", e);
      }
    };

    init();
    return () => {
      running = false;
      clearTimeout(lookAwayTimer.current);
    };
  }, [videoId, canvasId, onLookAway, onLookBack]);

  return null;
}
