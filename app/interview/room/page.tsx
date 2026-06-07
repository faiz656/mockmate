"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { buildInterviewerPrompt } from "@/lib/prompts/interviewer";
import { createClient } from "@/lib/supabase/client";
import type { InterviewConfig, TranscriptEntry } from "@/types/interview";

interface ProctoringFlag {
  type: "tab_switch" | "no_face" | "multiple_faces";
  timestamp: number;
  message: string;
}

type PermissionState = "pending" | "requesting" | "granted" | "denied";

export default function InterviewRoomPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<TranscriptEntry[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const animationRef = useRef<number>();
  const [status, setStatus] = useState<"connecting"|"listening"|"thinking"|"speaking">("connecting");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [permission, setPermission] = useState<PermissionState>("pending");
  const [permError, setPermError] = useState("");
  const [faceCount, setFaceCount] = useState(1);
  const [proctoringFlags, setProctoringFlags] = useState<ProctoringFlag[]>([]);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [proctoringWarning, setProctoringWarning] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const startRef = useRef(Date.now());
  const barsRef = useRef<HTMLDivElement[]>([]);
  const sessionIdRef = useRef<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const isBusyRef = useRef(false);
  const configRef = useRef<InterviewConfig | null>(null);
  const messagesRef = useRef<TranscriptEntry[]>([]);
  const startedRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const flagsRef = useRef<ProctoringFlag[]>([]);
  const noFaceTimerRef = useRef<NodeJS.Timeout>();
  const interruptedRef = useRef(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { flagsRef.current = proctoringFlags; }, [proctoringFlags]);

  const addFlag = useCallback((type: ProctoringFlag["type"], message: string) => {
    const flag: ProctoringFlag = { type, timestamp: Date.now(), message };
    setProctoringFlags(prev => [...prev, flag]);
    flagsRef.current = [...flagsRef.current, flag];
    setProctoringWarning(message);
    setTimeout(() => setProctoringWarning(""), 4000);
  }, []);

  // Interrupt Alex immediately
  const interruptAlex = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    isPlayingRef.current = false;
    interruptedRef.current = true;
    setStatus("listening");
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && permission === "granted") {
        setTabSwitches(prev => prev + 1);
        addFlag("tab_switch", "Tab switch detected");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [addFlag, permission]);

  const requestPermissions = async () => {
    setPermission("requesting");
    setPermError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      setPermission("granted");
    } catch (e: any) {
      setPermission("denied");
      setPermError(e.name === "NotAllowedError"
        ? "Access denied. Click the camera icon in your browser address bar and allow access."
        : "Could not access camera/microphone: " + e.message);
    }
  };

  useEffect(() => {
    if (permission !== "granted" || !streamRef.current) return;
    setTimeout(() => {
      const video = document.getElementById("mockmate-webcam") as HTMLVideoElement;
      if (video && streamRef.current) {
        video.srcObject = streamRef.current;
        video.play().catch(console.error);
      }
      initFaceDetection();
    }, 500);
  }, [permission]);

  const initFaceDetection = async () => {
    try {
      const { FaceDetection } = await import("@mediapipe/face_detection");
      const fd = new FaceDetection({
        locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${f}`,
      });
      fd.setOptions({ model: "short", minDetectionConfidence: 0.5 });
      fd.onResults((results: any) => {
        const count = results.detections?.length || 0;
        setFaceCount(count);
        if (count === 0) {
          if (!noFaceTimerRef.current) {
            noFaceTimerRef.current = setTimeout(() => {
              addFlag("no_face", "Face not visible — stay in frame");
              noFaceTimerRef.current = undefined;
            }, 3000);
          }
        } else {
          clearTimeout(noFaceTimerRef.current);
          noFaceTimerRef.current = undefined;
        }
        if (count > 1) addFlag("multiple_faces", `Multiple people detected`);
        const canvas = document.getElementById("mockmate-canvas") as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, 640, 480);
            results.detections?.forEach((det: any) => {
              const b = det.boundingBox;
              ctx.strokeStyle = count > 1 ? "#ff4444" : "#00dbe9";
              ctx.lineWidth = 3;
              ctx.strokeRect(b.xCenter*640-(b.width*640)/2, b.yCenter*480-(b.height*480)/2, b.width*640, b.height*480);
            });
          }
        }
      });
      const detect = async () => {
        const video = document.getElementById("mockmate-webcam") as HTMLVideoElement;
        if (video && video.readyState >= 2) await fd.send({ image: video });
        requestAnimationFrame(detect);
      };
      detect();
    } catch (e) { console.error("Face detection:", e); }
  };

  useEffect(() => {
    if (permission !== "granted") return;
    const stored = localStorage.getItem("interview_config");
    if (!stored) { router.push("/interview/setup"); return; }
    const cfg = JSON.parse(stored) as InterviewConfig;
    configRef.current = cfg;
    startRef.current = Date.now();
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now()-startRef.current)/1000)), 1000);
    createSessionInDB(cfg).then(() => {
      if (!startedRef.current) { startedRef.current = true; startInterview(cfg); }
    });
    return () => {
      clearInterval(timerRef.current);
      recognitionRef.current?.abort();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [permission]);

  const createSessionInDB = async (cfg: InterviewConfig) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("sessions").insert({
        user_id: user.id, config: cfg, transcript: [],
        feedback: null, duration_seconds: 0, completed: false,
        company_id: localStorage.getItem("applying_company_id") || null,
        role_id: localStorage.getItem("applying_role_id") || null,
        candidate_name: localStorage.getItem("candidate_name") || cfg.candidateName || null,
        candidate_email: localStorage.getItem("candidate_email") || null,
        proctoring: { flags: [], tab_switches: 0 },
      }).select().single();
      if (data?.id) { sessionIdRef.current = data.id; localStorage.setItem("last_session_id", data.id); }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const statusRef = useRef(status);
  const isRecordingRef = useRef(isRecording);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);
  useEffect(() => {
    let raf: number;
    const animate = () => {
      const s = statusRef.current;
      const rec = isRecordingRef.current;
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const base = rec ? 22 : s==="speaking" ? 30 : s==="thinking" ? 5 : 8;
        const wave = Math.sin(Date.now()/160+i/1.8)*(s==="speaking"?26:rec?18:5);
        bar.style.height = `${Math.max(3,base+wave)}px`;
        bar.style.background = rec ? "#f95e14" : "#00f0ff";
        bar.style.opacity = s==="thinking" ? "0.25" : "0.85";
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.abort(); } catch {}
    recognitionRef.current = null;
    setIsRecording(false);
    setVoiceTranscript("");
  }, []);

  const startListening = useCallback(() => {
    if (isBusyRef.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    stopListening();
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => {
      setIsRecording(false);
      // Restart immediately unless busy - handles Windows cutting off
      if (!isBusyRef.current && !isPlayingRef.current) {
        setTimeout(() => startListening(), 300);
      }
    };
    let accumulatedFinal = "";
    let silenceTimer: any = null;
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) accumulatedFinal += " " + t;
        else interim += t;
      }
      const displayText = (accumulatedFinal + " " + interim).trim();
      if (displayText) {
        setVoiceTranscript(displayText);
        if (isPlayingRef.current) interruptAlex();
      }
      // Clear any existing silence timer
      if (silenceTimer) clearTimeout(silenceTimer);
      // Wait 1.5 seconds of silence before sending
      if (accumulatedFinal.trim()) {
        silenceTimer = setTimeout(() => {
          const toSend = accumulatedFinal.trim();
          if (toSend) {
            setVoiceTranscript("");
            accumulatedFinal = "";
            stopListening();
            interruptAlex();
            sendMessage(toSend);
          }
        }, 1500);
      }
    };
    recognition.onerror = (e: any) => {
      if (e.error !== "aborted" && e.error !== "no-speech") console.error("Speech:", e.error);
      setIsRecording(false);
    };
    try { recognition.start(); } catch {}
  }, [stopListening, interruptAlex]);

  const speakText = useCallback(async (text: string): Promise<void> => {
    isPlayingRef.current = true;
    interruptedRef.current = false;
    setStatus("speaking");
    try {
      const res = await fetch("/api/interview/speak", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS error");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      // Start listening while Alex speaks so we can detect interruptions
      setTimeout(() => {
        if (isPlayingRef.current) startListening();
      }, 500);

      await new Promise<void>((resolve) => {
        audio.onended = () => { URL.revokeObjectURL(url); isPlayingRef.current = false; resolve(); };
        audio.onerror = () => { isPlayingRef.current = false; resolve(); };
        audio.play().catch(() => { isPlayingRef.current = false; resolve(); });
      });
    } catch (e) { console.error("TTS:", e); isPlayingRef.current = false; }

    // Only continue if not interrupted
    if (!interruptedRef.current) {
      setStatus("listening");
      setTimeout(() => startListening(), 1500);
    }
  }, [startListening, interruptAlex]);

  const startInterview = async (cfg: InterviewConfig) => {
    setStatus("thinking");
    isBusyRef.current = true;
    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], config: cfg, systemPrompt: buildInterviewerPrompt(cfg) }),
      });
      if (!res.ok) throw new Error(`Chat error ${res.status}`);
      const data = await res.json();
      const alexMsg: TranscriptEntry = { id: crypto.randomUUID(), role: "interviewer", content: data.reply, timestamp: Date.now() };
      setMessages([alexMsg]);
      messagesRef.current = [alexMsg];
      isBusyRef.current = false;
      await speakText(data.reply);
    } catch (e) { console.error(e); isBusyRef.current = false; setStatus("listening"); startListening(); }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isBusyRef.current || !configRef.current) return;

    // Always interrupt Alex first
    interruptAlex();

    isBusyRef.current = true;
    stopListening();

    const userMsg: TranscriptEntry = { id: crypto.randomUUID(), role: "candidate", content: text.trim(), timestamp: Date.now() };
    const updated = [...messagesRef.current, userMsg];
    setMessages(updated); messagesRef.current = updated;
    setInput(""); setLoading(true); setStatus("thinking");

    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, config: configRef.current, systemPrompt: buildInterviewerPrompt(configRef.current) }),
      });
      if (!res.ok) throw new Error(`Chat error ${res.status}`);
      const data = await res.json();
      const alexMsg: TranscriptEntry = { id: crypto.randomUUID(), role: "interviewer", content: data.reply, timestamp: Date.now() };
      const final = [...updated, alexMsg];
      setMessages(final); messagesRef.current = final;

      if (data.sessionEnded) {
        clearInterval(timerRef.current);
        const dur = Math.floor((Date.now()-startRef.current)/1000);
        if (sessionIdRef.current) {
          try {
            const supabase = createClient();
            await supabase.from("sessions").update({
              transcript: final, duration_seconds: dur, completed: true,
              proctoring: { flags: flagsRef.current, tab_switches: tabSwitches, total_flags: flagsRef.current.length }
            }).eq("id", sessionIdRef.current);
          } catch {}
        }
        // Stop camera before navigating
        streamRef.current?.getTracks().forEach(t => t.stop());
        localStorage.setItem("interview_transcript", JSON.stringify(final));
        localStorage.setItem("interview_config_done", JSON.stringify(configRef.current));
        isBusyRef.current = false; setLoading(false);
        await speakText(data.reply);
        setTimeout(() => router.push("/interview/results"), 500);
        return;
      }
      isBusyRef.current = false; setLoading(false);
      await speakText(data.reply);
    } catch (e) {
      console.error(e);
      isBusyRef.current = false; setLoading(false);
      setStatus("listening");
      startListening();
    }
  }, [speakText, startListening, stopListening, interruptAlex, tabSwitches]);

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
  const formatMsgTime = (ts: number) => new Date(ts).toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const cfg = configRef.current;
  const faceColor = faceCount===0?"#ffb4ab":faceCount===1?"#00dbe9":"#f95e14";

  // PERMISSION SCREEN
  if (permission !== "granted") {
    return (
      <div style={{background:"#0A0C10",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter, sans-serif",color:"#e2e2e8",padding:24}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
        <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#00dbe9,#7000ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 24px",boxShadow:"0 0 40px rgba(0,219,233,0.3)"}}>🎥</div>
          <h1 style={{fontSize:28,fontWeight:700,fontFamily:"Geist, sans-serif",color:"#fff",marginBottom:12}}>Camera & Mic Required</h1>
          <p style={{fontSize:15,color:"#849495",lineHeight:1.6,marginBottom:32}}>
            This is a proctored interview. Both camera and microphone are required to continue.
          </p>
          <div style={{background:"rgba(22,27,34,0.8)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:24,marginBottom:24,textAlign:"left"}}>
            {[
              {icon:"📹",title:"Camera",desc:"Identity verification and proctoring"},
              {icon:"🎤",title:"Microphone",desc:"Capture your voice answers"},
              {icon:"🔒",title:"Privacy",desc:"Video analyzed in real-time, not stored"},
            ].map(({icon,title,desc})=>(
              <div key={title} style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
                <span style={{fontSize:24,flexShrink:0}}>{icon}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#e2e2e8",marginBottom:3}}>{title}</div>
                  <div style={{fontSize:13,color:"#849495"}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
          {permError&&<div style={{padding:"12px 16px",borderRadius:10,background:"rgba(255,70,70,0.08)",border:"1px solid rgba(255,70,70,0.2)",color:"#ff6b6b",fontSize:13,marginBottom:20,textAlign:"left"}}>{permError}</div>}
          <button onClick={requestPermissions} disabled={permission==="requesting"}
            style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:permission==="requesting"?"rgba(0,219,233,0.2)":"linear-gradient(135deg,#00dbe9,#00f0ff)",color:permission==="requesting"?"#849495":"#002022",fontSize:14,fontWeight:700,fontFamily:"JetBrains Mono, monospace",letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>
            {permission==="requesting"?"Requesting Access...":permission==="denied"?"Try Again →":"Allow Camera & Microphone →"}
          </button>
          <p style={{fontSize:11,color:"#849495",marginTop:12,fontFamily:"JetBrains Mono, monospace"}}>If blocked, click the camera icon in your browser address bar</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{background:"#111318",color:"#e2e2e8",minHeight:"100vh",display:"flex",flexDirection:"column",fontFamily:"Inter, sans-serif",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Geist:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes ripple{0%{transform:scale(1);opacity:0.5}100%{transform:scale(2.5);opacity:0}}
        @keyframes slidein{0%{opacity:0;transform:translateY(-8px)}100%{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#3b494b;border-radius:10px}
      `}</style>

      {proctoringWarning&&(
        <div style={{position:"fixed",top:72,left:"50%",transform:"translateX(-50%)",zIndex:100,background:"rgba(255,70,70,0.12)",border:"1px solid rgba(255,70,70,0.35)",borderRadius:10,padding:"10px 20px",fontSize:12,color:"#ff6b6b",fontFamily:"JetBrains Mono, monospace",animation:"slidein 0.3s ease",backdropFilter:"blur(20px)"}}>
          ⚠ {proctoringWarning}
        </div>
      )}

      <header style={{position:"fixed",top:0,width:"100%",zIndex:50,background:"rgba(17,19,24,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"0 24px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:1280,margin:"0 auto",height:64}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#00dbe9,#7000ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#fff"}}>M</div>
            <span style={{fontSize:20,fontWeight:700,color:"#dbfcff",letterSpacing:"-0.02em",fontFamily:"Geist, sans-serif"}}>MockMate</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:isRecording?"#f95e14":status==="speaking"?"#00dbe9":"#849495",animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:12,fontFamily:"JetBrains Mono, monospace",color:isRecording?"#f95e14":status==="speaking"?"#00dbe9":"#849495"}}>
              {isRecording?"RECORDING":status==="speaking"?"ALEX SPEAKING":status==="thinking"?"THINKING":"READY"}
            </span>
            <span style={{fontSize:12,fontFamily:"JetBrains Mono, monospace",color:"#849495",marginLeft:12}}>{formatTime(elapsed)}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:9999,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:faceColor}}/>
              <span style={{fontSize:10,fontFamily:"JetBrains Mono, monospace",color:faceColor}}>
                {faceCount===0?"NO FACE":faceCount===1?"FACE OK":`${faceCount} FACES`}
              </span>
            </div>
            {tabSwitches>0&&<span style={{fontSize:10,fontFamily:"JetBrains Mono, monospace",color:"#ff6b6b",padding:"3px 8px",background:"rgba(255,70,70,0.08)",borderRadius:9999}}>⚠ {tabSwitches} SWITCH</span>}
            {status==="speaking"&&(
              <button onClick={interruptAlex} style={{padding:"5px 12px",borderRadius:9999,fontSize:10,fontFamily:"JetBrains Mono, monospace",background:"rgba(0,219,233,0.1)",border:"1px solid rgba(0,219,233,0.3)",color:"#00dbe9",cursor:"pointer"}}>⏭ SKIP</button>
            )}
            <button onClick={()=>{interruptAlex();streamRef.current?.getTracks().forEach(t=>t.stop());router.push("/dashboard");}} style={{padding:"7px 16px",borderRadius:9999,background:"rgba(255,180,171,0.08)",border:"1px solid rgba(255,180,171,0.25)",color:"#ffb4ab",fontSize:12,fontWeight:600,cursor:"pointer"}}>End</button>
          </div>
        </div>
      </header>

      <main style={{flex:1,display:"flex",marginTop:64,overflow:"hidden"}}>
        {/* Webcam panel */}
        <div style={{width:260,flexShrink:0,background:"rgba(10,12,16,0.9)",borderRight:"1px solid rgba(255,255,255,0.05)",display:"flex",flexDirection:"column",padding:14,gap:10}}>
          <div style={{position:"relative",borderRadius:12,overflow:"hidden",background:"#000",aspectRatio:"4/3"}}>
            <video id="mockmate-webcam" muted playsInline style={{width:"100%",height:"100%",objectFit:"cover",transform:"scaleX(-1)",display:"block"}}/>
            <canvas id="mockmate-canvas" width={640} height={480} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",transform:"scaleX(-1)"}}/>
            <div style={{position:"absolute",bottom:6,left:6,display:"flex",alignItems:"center",gap:4,padding:"2px 7px",borderRadius:9999,background:"rgba(0,0,0,0.75)"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:faceColor,animation:"pulse 1.5s infinite"}}/>
              <span style={{fontSize:8,fontFamily:"JetBrains Mono, monospace",color:faceColor}}>{faceCount===1?"FACE OK":faceCount===0?"NO FACE":"MULTIPLE"}</span>
            </div>
            {isRecording&&(
              <div style={{position:"absolute",top:6,right:6,display:"flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:9999,background:"rgba(249,94,20,0.85)"}}>
                <div style={{width:4,height:4,borderRadius:"50%",background:"#fff",animation:"pulse 0.8s infinite"}}/>
                <span style={{fontSize:8,fontFamily:"JetBrains Mono, monospace",color:"#fff"}}>REC</span>
              </div>
            )}
          </div>

          <div style={{padding:"8px 10px",background:"rgba(22,27,34,0.8)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:9,fontFamily:"JetBrains Mono, monospace",color:"#849495",letterSpacing:"0.08em",marginBottom:4}}>CANDIDATE</div>
            <div style={{fontSize:13,fontWeight:600,color:"#e2e2e8"}}>{cfg?.candidateName||"You"}</div>
            <div style={{fontSize:10,color:"#849495",textTransform:"capitalize",marginTop:2}}>{cfg?.role?.replace(/_/g," ")}</div>
          </div>

          <div style={{padding:"10px",background:"rgba(22,27,34,0.8)",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:9,fontFamily:"JetBrains Mono, monospace",color:"#849495",letterSpacing:"0.08em",marginBottom:8}}>PROCTORING</div>
            {[
              {label:"Tab Switches",value:tabSwitches,bad:tabSwitches>0},
              {label:"Flags",value:proctoringFlags.length,bad:proctoringFlags.length>2},
              {label:"Face",value:faceCount===1?"OK":faceCount===0?"Missing":"Multiple",bad:faceCount!==1},
            ].map(({label,value,bad})=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:10,color:"#849495",fontFamily:"JetBrains Mono, monospace"}}>{label}</span>
                <span style={{fontSize:11,fontWeight:600,fontFamily:"JetBrains Mono, monospace",color:bad?"#ffb4ab":"#00dbe9"}}>{value}</span>
              </div>
            ))}
          </div>

          {proctoringFlags.length>0&&(
            <div style={{padding:"10px",background:"rgba(22,27,34,0.8)",borderRadius:10,border:"1px solid rgba(255,70,70,0.15)",flex:1,overflow:"hidden"}}>
              <div style={{fontSize:9,fontFamily:"JetBrains Mono, monospace",color:"#ff6b6b",letterSpacing:"0.08em",marginBottom:6}}>FLAGS ({proctoringFlags.length})</div>
              {proctoringFlags.slice(-5).reverse().map((f,i)=>(
                <div key={i} style={{fontSize:9,color:"#849495",marginBottom:4,fontFamily:"JetBrains Mono, monospace",lineHeight:1.4}}>
                  <span style={{color:"#ff6b6b"}}>•</span> {f.message}<br/>
                  <span style={{color:"#3a4855"}}>{new Date(f.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"14px 24px 6px",gap:2}}>
            {Array.from({length:50}).map((_,i)=>(
              <div key={i} ref={el=>{if(el)barsRef.current[i]=el}} style={{width:3,borderRadius:9999,background:"#00f0ff",height:8,transition:"height 0.15s ease"}}/>
            ))}
          </div>

          <div style={{textAlign:"center",marginBottom:6}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:9999,
              background:isRecording?"rgba(249,94,20,0.1)":status==="speaking"?"rgba(0,219,233,0.07)":"rgba(255,255,255,0.03)",
              border:`1px solid ${isRecording?"rgba(249,94,20,0.3)":status==="speaking"?"rgba(0,219,233,0.2)":"rgba(255,255,255,0.07)"}`}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:isRecording?"#f95e14":status==="speaking"?"#00dbe9":"#849495",animation:"pulse 1.2s infinite"}}/>
              <span style={{fontSize:10,fontFamily:"JetBrains Mono, monospace",letterSpacing:"0.06em",color:isRecording?"#f95e14":status==="speaking"?"#00dbe9":"#849495"}}>
                {isRecording?"RECORDING — SPEAK NOW":status==="speaking"?"ALEX IS SPEAKING — INTERRUPT ANYTIME":status==="thinking"?"PROCESSING":"MIC ACTIVE — SPEAK ANYTIME"}
              </span>
            </div>
          </div>

          {voiceTranscript&&(
            <div style={{textAlign:"center",marginBottom:4}}>
              <span style={{fontSize:12,color:"#f95e14",fontStyle:"italic",padding:"2px 10px",background:"rgba(249,94,20,0.06)",borderRadius:8}}>"{voiceTranscript}"</span>
            </div>
          )}

          <div style={{flex:1,overflowY:"auto",padding:"6px 18px 8px"}}>
            {messages.length===0&&<div style={{textAlign:"center",color:"#849495",fontSize:14,marginTop:40}}>Connecting to Alex...</div>}
            {messages.map(entry=>(
              <div key={entry.id} style={{display:"flex",gap:9,marginBottom:10,flexDirection:entry.role==="candidate"?"row-reverse":"row"}}>
                <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,
                  background:entry.role==="interviewer"?"linear-gradient(135deg,#00dbe9,#7000ff)":"#f95e14",color:"#fff"}}>
                  {entry.role==="interviewer"?"AL":(cfg?.candidateName?.[0]?.toUpperCase()||"Y")}
                </div>
                <div style={{maxWidth:"74%"}}>
                  <div style={{fontSize:9,fontFamily:"JetBrains Mono, monospace",color:"#5a6870",marginBottom:2,textAlign:entry.role==="candidate"?"right":"left"}}>{formatMsgTime(entry.timestamp)}</div>
                  <div style={{padding:"9px 13px",borderRadius:entry.role==="interviewer"?"3px 13px 13px 13px":"13px 3px 13px 13px",fontSize:14,lineHeight:1.65,
                    background:entry.role==="interviewer"?"rgba(22,27,34,0.95)":"rgba(249,94,20,0.1)",
                    border:`1px solid ${entry.role==="interviewer"?"rgba(255,255,255,0.06)":"rgba(249,94,20,0.2)"}`,
                    color:entry.role==="interviewer"?"#dde8f0":"#ffb59a"}}>
                    {entry.content}
                  </div>
                </div>
              </div>
            ))}
            {loading&&(
              <div style={{display:"flex",gap:9,marginBottom:10}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#00dbe9,#7000ff)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff"}}>AL</div>
                <div style={{padding:"10px 14px",borderRadius:"3px 13px 13px 13px",background:"rgba(22,27,34,0.95)",border:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:4,alignItems:"center"}}>
                  {[0,110,220].map(d=><div key={d} style={{width:5,height:5,borderRadius:"50%",background:"#00dbe9",animation:`bounce 0.85s infinite ${d}ms`}}/>)}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",background:"rgba(12,14,18,0.98)",padding:"10px 18px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{position:"relative",flexShrink:0}}>
                {isRecording&&<div style={{position:"absolute",inset:-5,borderRadius:"50%",border:"1.5px solid #f95e14",animation:"ripple 1s infinite"}}/>}
                <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,
                  background:isRecording?"rgba(249,94,20,0.15)":"rgba(0,219,233,0.06)",
                  border:`1.5px solid ${isRecording?"rgba(249,94,20,0.4)":"rgba(0,219,233,0.15)"}`}}>
                  {isRecording?"🔴":"🎤"}
                </div>
              </div>
              <input value={input}
                onChange={e => {
                  setInput(e.target.value);
                  // Interrupt Alex when user starts typing
                  if (isPlayingRef.current && e.target.value.length === 1) interruptAlex();
                }}
                onKeyDown={e=>{
                  if(e.key==="Enter"&&!e.shiftKey&&input.trim()){
                    e.preventDefault();
                    stopListening();
                    sendMessage(input);
                  }
                }}
                placeholder={isRecording?"Listening — or type to interrupt...":status==="speaking"?"Type to interrupt Alex...":"Speak or type your answer"}
                style={{flex:1,background:"rgba(22,24,28,0.8)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"9px 13px",color:"#e2e2e8",fontSize:13,outline:"none",fontFamily:"Inter, sans-serif"}}
                onFocus={e=>e.target.style.borderColor="rgba(0,219,233,0.35)"}
                onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.07)"}/>
              {input.trim()&&(
                <button onClick={()=>{stopListening();sendMessage(input);}} disabled={loading}
                  style={{padding:"9px 15px",borderRadius:10,background:"#f95e14",border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0}}>
                  Send
                </button>
              )}
            </div>
            <p style={{fontSize:9,color:"#3a4855",fontFamily:"JetBrains Mono, monospace",textAlign:"center",marginTop:5,letterSpacing:"0.08em"}}>
              SPEAK OR TYPE TO INTERRUPT · PROCTORED · {proctoringFlags.length} FLAGS
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
