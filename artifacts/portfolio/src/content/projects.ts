import { ProjectCaseStudy } from "@/types";

export const projects: ProjectCaseStudy[] = [
  {
    id: "erossoundx",
    title: "ErosSoundX",
    subtitle: "AI-Assisted Desktop Soundboard & Virtual Audio Platform",
    shortDesc: "Architected and built a desktop soundboard platform using Python, CustomTkinter, FastAPI, and SQLite with cloud synchronization powered by Supabase.",
    overview: "ErosSoundX is a premium desktop audio manager that integrates AI-assisted development (Antigravity IDE) and Spec-Driven Development (SDD) to achieve high-performance virtual microphone routing, remote browser pairing, and audio caching.",
    problem: "Traditional soundboard applications struggle with configuration issues, latency spikes, and lack of real-time mobile remote-control capabilities.",
    solution: "Designed virtual mic routing to transmit audio over voice platforms (Discord), FastAPI/WebSocket connections for mobile controllers, and SQLite-first caching for low-latency playback.",
    architecture: {
      steps: [
        { title: "Python & CustomTkinter UI", desc: "Builds a sleek, responsive desktop wrapper with global hotkeys." },
        { title: "FastAPI & WebSockets", desc: "Allows real-time mobile remote pairing using QR-codes." },
        { title: "Supabase Cloud Sync", desc: "Backs up settings, sound packs, and sessions to Supabase Auth, DB, and Storage." },
        { title: "Audio Caching", desc: "Utilizes Pygame and local caching for low-latency playback." }
      ],
      summary: "Python Client -> local SQLite / Pygame -> WebSockets Remote -> Supabase Cloud Sync"
    },
    metrics: [
      { value: "100%", label: "Declarative virtual routing" },
      { value: "0ms", label: "Zero-latency audio playback caching" },
      { value: "1-Click", label: "QR code device remote pairing" }
    ],
    tags: ["Python", "FastAPI", "SQLite", "Supabase", "WebSockets", "Pygame"],
    techCode: `import pygame\nfrom fastapi import FastAPI, WebSocket\n\napp = FastAPI()\npygame.mixer.init()\n\n@app.websocket("/ws/remote")\nasync def websocket_endpoint(websocket: WebSocket):\n    await websocket.accept()\n    # Remote control pairing logic`,
    githubUrl: "https://github.com/damiencloud",
    color: "from-indigo-600 to-violet-500",
    featured: true,
    category: "desktop-app",
    highlights: ["Implemented virtual mic audio routing", "Asynchronous SQLite caching"],
    challenges: ["Optimizing WebSocket concurrency for remote button-press triggers"],
    lessonsLearned: ["Deepened understanding of socket connections and Python mixer structures"]
  },
  {
    id: "feasibilityiq",
    title: "FeasibilityIQ",
    subtitle: "Email Intelligence Dashboard & Lead Categorization Portal",
    shortDesc: "Developed a full-stack email intelligence dashboard using React, Next.js, and Supabase with automated scoring and lead filtering.",
    overview: "FeasibilityIQ provides real-time email prioritization, synchronizing inbox queries via Gmail API and classifying them using lead classification algorithms.",
    problem: "Sifting through large volumes of incoming inquiries to identify high-feasibility leads is slow and delays response times.",
    solution: "Created an email dashboard that integrates Gmail OAuth 2.0, calculates lead scores, and displays prioritized messages inside a Next.js framework.",
    architecture: {
      steps: [
        { title: "Next.js Frontend", desc: "Features advanced lead sorting lists and filtering filters." },
        { title: "Gmail API Integration", desc: "Syncs inbox queries using OAuth 2.0 keys." },
        { title: "Scoring Engine", desc: "Flags high-feasibility emails on the fly." },
        { title: "Supabase RLS", desc: "Validates security boundaries for user-specific tables." }
      ],
      summary: "Gmail API sync -> Lead Classifiers -> Supabase Database -> Next.js Dashboard"
    },
    metrics: [
      { value: "100%", label: "Inbox lead processing automation" },
      { value: "30%", label: "Faster lead response time" },
      { value: "0", label: "Manual classification errors" }
    ],
    tags: ["React", "Next.js", "Supabase", "PostgreSQL", "Gmail API", "Vercel"],
    techCode: `// Gmail sync lead classifier\nexport async function scoreEmail(content: string) {\n  const feasibilityWords = ["quote", "proposal", "budget", "timeline"];\n  let score = 0;\n  feasibilityWords.forEach(w => { if (content.includes(w)) score += 25; });\n  return Math.min(score, 100);\n}`,
    githubUrl: "https://github.com/damiencloud",
    color: "from-cyan-600 to-blue-500",
    featured: true,
    category: "web-app",
    highlights: ["Gmail API lead synchronization", "Supabase RLS row-level policies"],
    challenges: ["Handling Gmail token expiry securely in server sessions"],
    lessonsLearned: ["OAuth 2.0 token refreshes and secure database policies"]
  }
];
