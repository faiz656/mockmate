export type InterviewRole =
  | "frontend_developer"
  | "backend_developer"
  | "fullstack_developer"
  | "mobile_developer"
  | "data_scientist"
  | "devops_engineer"
  | "ui_ux_designer";

export type ExperienceLevel = "fresh" | "1_2_years" | "3_5_years";

export type InterviewType = "technical" | "hr" | "behavioral" | "mixed";

export type Language = "english" | "urdu" | "mix";

export type PressureMode = "friendly" | "strict";

export type CompanyType =
  | "software_house"
  | "startup"
  | "multinational"
  | "remote";

export interface InterviewConfig {
  role: InterviewRole;
  experience: ExperienceLevel;
  type: InterviewType;
  language: Language;
  pressure: PressureMode;
  company: CompanyType;
  candidateName: string;
}

export interface TranscriptEntry {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
  timestamp: number;
}

export interface FeedbackScores {
  overall: number;
  communication: number;
  technical_depth: number;
  star_method: number;
  confidence: number;
  filler_words: number;
  structure: number;
}

export interface SessionFeedback {
  scores: FeedbackScores;
  strengths: string[];
  improvements: string[];
  best_answer: string;
  weakest_answer: string;
  summary: string;
}

export interface Session {
  id: string;
  user_id: string;
  config: InterviewConfig;
  transcript: TranscriptEntry[];
  feedback: SessionFeedback | null;
  duration_seconds: number;
  created_at: string;
  completed: boolean;
}

export interface Question {
  id: string;
  type: "technical" | "behavioral" | "pressure" | "pakistan_context" | "icebreaker";
  content: string;
  role: InterviewRole;
  experience: ExperienceLevel;
}
