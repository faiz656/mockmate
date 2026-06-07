insert into public.questions (type, role, experience, content, company_type) values
-- Fullstack fresh
('icebreaker', 'fullstack_developer', 'fresh', 'Tell me about yourself and what made you choose full stack development.', 'any'),
('technical', 'fullstack_developer', 'fresh', 'Explain the difference between REST and GraphQL. Which one would you use and why?', 'any'),
('technical', 'fullstack_developer', 'fresh', 'What is the difference between server-side rendering and client-side rendering in Next.js?', 'any'),
('technical', 'fullstack_developer', 'fresh', 'How does useState differ from useEffect in React? Give a real-world example of each.', 'any'),
('technical', 'fullstack_developer', 'fresh', 'Explain the concept of database indexing. When would you use it?', 'any'),
('behavioral', 'fullstack_developer', 'fresh', 'Tell me about a project you built from scratch. What was the hardest part?', 'any'),
('behavioral', 'fullstack_developer', 'fresh', 'Describe a time you had a bug you could not fix for hours. How did you eventually solve it?', 'any'),
('pressure', 'fullstack_developer', 'fresh', 'If your production database goes down at 2am and you are the only developer available, walk me through exactly what you do.', 'any'),
('pakistan_context', 'fullstack_developer', 'fresh', 'Many Pakistani software houses use MERN or MEAN stack. Are you comfortable working in both and what is your stronger side?', 'software_house'),

-- Frontend fresh
('technical', 'frontend_developer', 'fresh', 'What is the virtual DOM and how does React use it for performance?', 'any'),
('technical', 'frontend_developer', 'fresh', 'Explain CSS specificity. What happens when two rules conflict?', 'any'),
('behavioral', 'frontend_developer', 'fresh', 'Show me a project in your portfolio and explain one technical decision you made.', 'any'),
('pressure', 'frontend_developer', 'fresh', 'A client says the website looks broken on mobile. You have 30 minutes before their launch. What do you do?', 'any'),

-- Backend fresh
('technical', 'backend_developer', 'fresh', 'What is the difference between authentication and authorization? How would you implement JWT auth?', 'any'),
('technical', 'backend_developer', 'fresh', 'Explain what happens when you type a URL and press Enter. Focus on the backend side.', 'any'),
('pressure', 'backend_developer', 'fresh', 'Your API is returning 500 errors for 20% of requests in production. Walk me through your debugging process.', 'any');
