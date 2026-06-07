import type { InterviewConfig } from "@/types/interview";

const roleQuestions: Record<string, string[]> = {
  frontend_developer: [
    "Walk me through how the browser renders a page from the moment a user hits Enter to when they see content.",
    "You have a React component re-rendering 60 times per second. How do you debug it and what are the likely causes?",
    "Explain the difference between useMemo and useCallback. When have you actually needed them — not just theory?",
    "A client complains the site is slow on mobile in Karachi but fast in Lahore. How do you approach this?",
    "You're building a form with 20 fields, complex validation, and conditional rendering. What's your architecture?",
    "How does the CSS cascade actually work? Give me a specific example where specificity surprised you.",
    "What's the difference between SSR, SSG, and CSR in Next.js? When would you use each in a Pakistani startup context?",
    "You push code Friday evening and the entire checkout breaks in production. Walk me through exactly what you do.",
  ],
  backend_developer: [
    "A database query that takes 2ms in testing takes 8 seconds in production with real data. Walk me through your debugging process.",
    "Explain the N+1 problem. How have you actually encountered and fixed it?",
    "You're designing an API for a food delivery app that needs to handle 10,000 orders during iftar time. What considerations matter?",
    "How does indexing work in PostgreSQL? When does an index hurt performance instead of helping?",
    "Walk me through exactly what happens when a Node.js server crashes and how you'd prevent data loss.",
    "Explain JWT authentication. What are its weaknesses and how do you mitigate them?",
    "You have a microservice that's been down for 3 minutes. Orders are queuing up. What's your recovery strategy?",
    "How would you design the database schema for a multi-tenant SaaS product where each company sees only their data?",
  ],
  fullstack_developer: [
    "You're building a real-time notification system for a Pakistani e-commerce site. Walk me through your full tech stack decision.",
    "A page loads fine on your machine but takes 12 seconds for a user in Multan on mobile data. Diagnose this.",
    "Explain how you'd handle authentication across a Next.js frontend and a separate Node.js API.",
    "You need to build a feature in 3 days that normally takes a week. What do you cut, what do you keep, and why?",
    "Walk me through a production bug you've fixed. Be specific — what was the symptom, the cause, the fix?",
    "How would you architect a job portal where employers post jobs and candidates apply — in Pakistan's context?",
    "What's your approach to database migrations when the app is already live with 10,000 users?",
    "You're the only developer at a startup. How do you decide what to build next when you have 20 feature requests?",
  ],
  sales_executive: [
    "Tell me about the last deal you lost. What happened and what would you do differently?",
    "You have 50 cold leads and 2 weeks to close at least 5. Walk me through your exact approach.",
    "A prospect says 'your price is too high' — what do you say next? Be specific, not textbook.",
    "How do you handle a client who ghosts you after 3 follow-ups?",
    "Describe a time you had to sell something you personally didn't believe in. How did you handle it?",
    "You're selling software to a Pakistani company whose owner is 60 years old and skeptical of tech. How do you pitch?",
    "What's your process for qualifying a lead? What questions tell you if someone will actually buy?",
    "You just joined a new company and inherit a pipeline with no notes. First week — what do you do?",
  ],
  hr_manager: [
    "Describe a time you had to let someone go. Walk me through the process and how you handled it.",
    "Two senior employees have a serious conflict that's affecting the whole team. It's been going on for 3 weeks. What do you do?",
    "How do you source good candidates in Pakistan when the talent pool for a niche role is very small?",
    "A high performer is clearly burned out but refuses to admit it. How do you approach this?",
    "You need to hire 10 engineers in 2 months for a new project. What's your recruitment plan?",
    "How do you handle a situation where a manager is technically brilliant but terrible with people?",
    "What metrics do you use to measure the effectiveness of your hiring process?",
    "A candidate has a 2-year gap in their CV. How do you approach that conversation?",
  ],
  software_engineer: [
    "Explain how you would design a URL shortener like bit.ly. Start from scratch.",
    "What's the time and space complexity of your most recent algorithm solution? Walk me through it.",
    "You need to process 1 million records daily. How do you design this system?",
    "Explain the SOLID principles — but give me a real example of a time you violated one and what went wrong.",
    "How would you implement rate limiting for an API that serves 100,000 requests per minute?",
    "Walk me through how Git works internally. Not the commands — the actual data model.",
    "You're given a legacy codebase with no tests and no documentation. You need to add a feature. What's your approach?",
    "Design a system to detect duplicate job applications from the same candidate across different email addresses.",
  ],
  mobile_developer: [
    "Walk me through how you'd architect an offline-first mobile app for Pakistan where network is unreliable.",
    "Explain the difference between React Native and Flutter. You've used one — why that choice?",
    "How do you handle app performance on low-end Android devices that are common in Pakistan?",
    "Walk me through how push notifications work end to end on iOS and Android.",
    "A user complains the app drains their battery. How do you diagnose and fix this?",
    "How do you manage state in a mobile app with 20+ screens? What's your architecture?",
    "Explain how you'd implement biometric authentication in a mobile banking app.",
    "Your app crashes on Samsung devices but works on OnePlus. How do you debug this?",
  ],
  data_scientist: [
    "Explain overfitting to me like I'm a business stakeholder, not a data scientist.",
    "You've built a model with 95% accuracy. Your manager is excited. Why are you not?",
    "Walk me through how you'd build a churn prediction model for a Pakistani telecom company.",
    "How do you handle imbalanced datasets? Give me a real scenario where this mattered.",
    "Explain the bias-variance tradeoff. When have you actually had to navigate this?",
    "Your model works great in testing but fails in production after 2 weeks. What happened?",
    "How would you A/B test a recommendation algorithm on an e-commerce platform?",
    "Walk me through feature engineering decisions you've made that actually improved a model.",
  ],
  devops_engineer: [
    "A production server goes down at 2am. Walk me through your exact response process.",
    "Explain how you'd set up a CI/CD pipeline for a Pakistani startup with a small team.",
    "What's the difference between horizontal and vertical scaling? When do you use each?",
    "How do you secure a Kubernetes cluster? What are the most common mistakes teams make?",
    "Walk me through how you'd migrate a monolithic app to microservices without downtime.",
    "Your Docker containers keep running out of memory in production. How do you diagnose this?",
    "Explain how you'd implement blue-green deployment for a critical fintech application.",
    "How do you handle secrets management across multiple environments and services?",
  ],
  data_analyst: [
    "You have 6 months of sales data and your manager asks 'why did revenue drop in March?' Walk me through your analysis.",
    "How do you handle missing data in a dataset? Give me 3 different scenarios with different solutions.",
    "Explain the difference between a left join and an inner join. Give me a business scenario for each.",
    "You've built a dashboard that shows sales are up 20%. Your manager says 'so what?' How do you respond?",
    "Walk me through a time your analysis was wrong. What happened and what did you learn?",
    "How would you measure whether a new feature in a Pakistani fintech app is actually working?",
    "You have correlation between two variables. Your manager wants to act on it immediately. What do you tell them?",
    "How do you explain a complex statistical finding to a non-technical CEO?",
  ],
};

const behavioralQuestions = [
  "Tell me about a time you disagreed with your manager. What did you do?",
  "Describe the most difficult project you've worked on. What made it difficult and how did you get through it?",
  "Give me an example of when you had to learn something completely new under pressure.",
  "Tell me about a time you made a serious mistake at work. How did you handle it?",
  "Describe a situation where you had to work with someone you didn't get along with.",
  "Tell me about a time you had to deliver bad news to a client or manager.",
  "Give me an example of when you went above and beyond what was expected of you.",
  "Describe a time when you had to make a decision with incomplete information.",
];

const pressureQuestions: Record<string, string[]> = {
  frontend_developer: [
    "Be honest — what part of frontend development do you find genuinely hard and still struggle with?",
    "I've interviewed 20 frontend developers this week. Why should I pick you specifically?",
  ],
  backend_developer: [
    "If I looked at your code right now, what would embarrass you?",
    "What's the biggest scaling mistake you've made and what did it cost?",
  ],
  fullstack_developer: [
    "Are you actually strong in both frontend and backend or do you lean heavily toward one? Be honest.",
    "If I gave you a production system right now with no handover, how long before you'd be confident making changes?",
  ],
  sales_executive: [
    "Sell me this pen. No — actually sell it. I'm a busy CEO, I have 30 seconds.",
    "What's your actual close rate? Be specific, not rounded up.",
  ],
  mobile_developer: [
    "iOS or Android — which do you actually prefer developing for and why? Be honest.",
    "If I opened your GitHub right now, what would I find that you're not proud of?",
  ],
  data_scientist: [
    "How many of your models have actually been deployed to production and are still running?",
    "What's the most embarrassing wrong prediction your model ever made?",
  ],
  devops_engineer: [
    "Tell me about the worst outage you've caused. What happened?",
    "If I audited your last infrastructure setup, what would concern me?",
  ],
  default: [
    "What's the one thing about your work that you know needs improvement but haven't fixed yet?",
    "If your last manager was here right now, what would they say is your biggest weakness?",
  ],
};

export function buildInterviewerPrompt(config: InterviewConfig): string {
  const role = config.role?.replace(/_/g, " ") || "software professional";
  const roleKey = config.role || "software_engineer";

  const questions = roleQuestions[roleKey] || roleQuestions["software_engineer"];
  const pressure = pressureQuestions[roleKey] || pressureQuestions["default"];
  const behavioral = behavioralQuestions;

  // Pick 3-4 technical, 1-2 behavioral, 1 pressure
  const selectedTech = questions.slice(0, 4).join("\n- ");
  const selectedBehavioral = behavioral.slice(0, 2).join("\n- ");
  const selectedPressure = pressure[0];

  const pressureStyle = config.pressure === "strict"
    ? `You are a tough, direct interviewer. Challenge every vague answer. Say things like:
- "That's textbook, give me a real example from your work"
- "You're being too generic, what specifically did YOU do?"
- "That doesn't answer my question, let me ask again"
- "I've heard that answer 10 times today, what makes yours different?"
Never accept surface-level answers. Push back hard but stay professional.`
    : `You are professional and direct but give the candidate space to think. You are warm but not soft — you expect real, specific answers.`;

  const lang = config.language === "mix"
    ? `Mix Urdu and English naturally like a real Pakistani interviewer. Use phrases like "Theek hai", "Acha bata", "Dekho yaar", "Bilkul", "Samajh aaya?" naturally within English sentences. Don't force it — use it where it flows naturally.`
    : config.language === "urdu"
    ? `Conduct the interview in Roman Urdu throughout.`
    : `Conduct the interview in English only.`;

  const companyContext = config.company === "software_house"
    ? "a software house in Pakistan"
    : config.company === "startup"
    ? "a Pakistani tech startup"
    : config.company === "corporate"
    ? "a corporate company in Pakistan"
    : "a Pakistani company";

  return `You are Alex, a senior interviewer at ${companyContext}. You are interviewing ${config.candidateName} for a ${role} position. You have 15 years of experience interviewing candidates and you can immediately tell when someone is giving rehearsed answers versus real experience.

${pressureStyle}

${lang}

CRITICAL RULES — follow these exactly:
- You are a REAL HUMAN interviewer. Never sound like an AI. No robotic phrasing.
- Ask ONE question at a time. Never stack questions.
- React SPECIFICALLY to what the candidate just said. Never give generic acknowledgments.
- If they mention a specific technology, project, metric, or decision — follow up on THAT specifically before moving on.
- Never say "Great answer!", "Excellent!", "That's wonderful" — real interviewers don't do this.
- Never break character. Never reveal you are AI.
- Keep your responses SHORT — 1-3 sentences max before asking your question.
- Sound conversational, not like you're reading from a script.

ADAPTIVE FOLLOW-UP RULES (most important):
When the candidate says ANYTHING specific, dig into it:
- They mention a technology → "Why that specifically? What alternatives did you consider?"
- They mention a number/metric → "How did you measure that? What was the baseline?"
- They mention a team → "What was your specific role vs others?"
- They mention a challenge → "Walk me through exactly what you did step by step"
- They give a vague answer → "That's quite general — give me a specific example from your actual work"
- They seem nervous or unsure → ${config.pressure === "strict" ? "Push harder — 'I need a concrete answer'" : "Give them a moment — 'Take your time, walk me through it'"}

QUESTION BANK FOR THIS INTERVIEW:
Technical questions to choose from:
- ${selectedTech}

Behavioral questions to choose from:
- ${selectedBehavioral}

Pressure question (ask near the end):
- ${selectedPressure}

INTERVIEW FLOW:
1. Opening: "Hey ${config.candidateName}, thanks for coming in. So tell me about yourself — keep it relevant to the ${role} role, what should I know about you?"
2. Based on their answer, ask 1 follow-up on something specific they mentioned
3. Ask 3-4 technical questions from the bank above — adapt based on their experience level
4. Ask 1-2 behavioral questions
5. Ask the pressure question
6. Ask: "Do you have any questions for us?"
7. After their response say EXACTLY: "That brings us to the end of our interview. Thanks ${config.candidateName}, we'll be in touch soon. Good luck."

EXPERIENCE CALIBRATION:
- If they mention strong projects and specific metrics → increase technical depth
- If they seem junior or nervous → use simpler follow-ups but still push for specifics
- If they give textbook answers → immediately challenge with "Give me a real example from YOUR experience"

Remember: The best interviewers make candidates forget they're being interviewed. Be human.`;
}
