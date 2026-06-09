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
  const isLookingAway = useRef(false);

  useEffect(() => {
    let running = true;
    let detector: any = null;

    const init = async () => {
      try {
        const tf = await import("@tensorflow/tfjs");
        await tf.ready();

        const faceLandmarksDetection = await import("@tensorflow-models/face-landmarks-detection");
        detector = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: "tfjs",
            refineLandmarks: true,
            maxFaces: 1,
          }
        );

        const detect = async () => {
          if (!running) return;
          const video = document.getElementById(videoId) as HTMLVideoElement;
          const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
          
          if (!video || video.readyState < 2 || !detector) {
            requestAnimationFrame(detect);
            return;
          }

          try {
            const faces = await detector.estimateFaces(video, { flipHorizontal: true });
            const ctx = canvas?.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (faces.length === 0) {
              requestAnimationFrame(detect);
              return;
            }

            const face = faces[0];
            const keypoints = face.keypoints;

            // Get iris keypoints (refined landmarks)
            // Left iris center: index 468, Right iris center: 473
            // Left eye corners: 33 (left), 133 (right)
            // Right eye corners: 362 (left), 263 (right)
            const leftIris = keypoints.find((k: any) => k.name === "leftEyeIris");
            const rightIris = keypoints.find((k: any) => k.name === "rightEyeIris");
            
            // Fallback to index-based
            const lIris = leftIris || keypoints[468];
            const rIris = rightIris || keypoints[473];

            // Eye corners
            const lEyeOuter = keypoints[33];
            const lEyeInner = keypoints[133];
            const rEyeOuter = keypoints[263];
            const rEyeInner = keypoints[362];

            let lookingAway = false;

            if (lIris && rIris && lEyeOuter && lEyeInner) {
              // Gaze ratio: 0=far left, 0.5=center, 1=far right
              const lWidth = Math.abs(lEyeInner.x - lEyeOuter.x);
              const rWidth = Math.abs(rEyeInner.x - rEyeOuter.x);
              
              const lRatio = lWidth > 0 ? (lIris.x - lEyeOuter.x) / lWidth : 0.5;
              const rRatio = rWidth > 0 ? (rIris.x - rEyeOuter.x) / rWidth : 0.5;
              const avgRatio = (lRatio + rRatio) / 2;

              // Vertical gaze
              const lEyeTop = keypoints[159];
              const lEyeBot = keypoints[145];
              const lHeight = lEyeTop && lEyeBot ? Math.abs(lEyeBot.y - lEyeTop.y) : 20;
              const lVRatio = lEyeTop ? (lIris.y - lEyeTop.y) / lHeight : 0.5;

              // Looking away if gaze too far left/right/up/down
              lookingAway = avgRatio < 0.25 || avgRatio > 0.75 || lVRatio < 0.1 || lVRatio > 0.9;

              // Draw iris dots
              if (ctx) {
                const color = lookingAway ? "#ff4444" : "#00dbe9";
                [lIris, rIris].forEach(iris => {
                  ctx.beginPath();
                  ctx.arc(iris.x, iris.y, 5, 0, Math.PI * 2);
                  ctx.fillStyle = color;
                  ctx.fill();
                  ctx.beginPath();
                  ctx.arc(iris.x, iris.y, 10, 0, Math.PI * 2);
                  ctx.strokeStyle = color;
                  ctx.lineWidth = 1.5;
                  ctx.stroke();
                });
                
                // Gaze direction indicator
                ctx.fillStyle = color;
                ctx.font = "12px JetBrains Mono";
                ctx.fillText(lookingAway ? "LOOK AT SCREEN" : "GAZE OK", 10, 20);
              }
            }

            if (lookingAway && !isLookingAway.current) {
              lookAwayTimer.current = setTimeout(() => {
                isLookingAway.current = true;
                onLookAway();
              }, 2000);
            } else if (!lookingAway && isLookingAway.current) {
              clearTimeout(lookAwayTimer.current);
              isLookingAway.current = false;
              onLookBack();
            } else if (!lookingAway) {
              clearTimeout(lookAwayTimer.current);
            }

          } catch {}
          
          requestAnimationFrame(detect);
        };

        detect();
      } catch (e) {
        console.error("Gaze detection init failed:", e);
      }
    };

    init();
    return () => { 
      running = false; 
      clearTimeout(lookAwayTimer.current);
      if (detector) detector.dispose?.();
    };
  }, [videoId, canvasId, onLookAway, onLookBack]);

  return null;
}
