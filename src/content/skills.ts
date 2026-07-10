import { Skill } from "@/types";

export const skillCategories = [
  { id: "all", label: "All Tech Stack", iconName: "GitBranch" },
  { id: "languages", label: "Languages", iconName: "Code2" },
  { id: "frontend", label: "Frontend", iconName: "Layout" },
  { id: "backend", label: "Backend & DB", iconName: "Server" },
  { id: "cloud", label: "Cloud & DevOps", iconName: "Cloud" },
];

export const skills: Skill[] = [
  // Languages (5 keys)
  { name: "Python", category: "languages", level: 85, featured: true, color: "from-blue-500 to-yellow-500", texture: "/assets/logos/python.svg" },
  { name: "JavaScript", category: "languages", level: 80, featured: true, color: "from-yellow-400 to-yellow-600", texture: "/assets/logos/javascript.svg" },
  { name: "TypeScript", category: "languages", level: 85, featured: true, color: "from-blue-600 to-sky-500", texture: "/assets/logos/typescript.svg" },
  { name: "HTML5", category: "languages", level: 90, featured: false, color: "from-orange-500 to-red-500", texture: "/assets/logos/html5.svg" },
  { name: "CSS3", category: "languages", level: 88, featured: false, color: "from-blue-500 to-indigo-600", texture: "/assets/logos/css3.svg" },

  // Frontend (5 keys)
  { name: "React.js", category: "frontend", level: 82, featured: true, color: "from-cyan-400 to-sky-600", texture: "/assets/logos/react.svg" },
  { name: "Next.js", category: "frontend", level: 80, featured: true, color: "from-neutral-800 to-neutral-600", texture: "/assets/logos/nextdotjs.svg" },
  { name: "Tailwind CSS", category: "frontend", level: 88, featured: true, color: "from-cyan-500 to-teal-400", texture: "/assets/logos/tailwindcss.svg" },
  { name: "Vite", category: "frontend", level: 80, featured: false, color: "from-purple-500 to-indigo-500", texture: "/assets/logos/vite.svg" },
  { name: "Framer Motion", category: "frontend", level: 78, featured: false, color: "from-purple-600 to-pink-500", texture: "/assets/logos/framer.svg" },

  // Backend & Database (5 keys)
  { name: "GSAP", category: "frontend", level: 75, featured: false, color: "from-green-500 to-emerald-650", texture: "/assets/logos/greensock.svg" },
  { name: "Node.js", category: "backend", level: 80, featured: true, color: "from-green-600 to-emerald-500", texture: "/assets/logos/nodedotjs.svg" },
  { name: "Express", category: "backend", level: 78, featured: false, color: "from-neutral-700 to-neutral-500", texture: "/assets/logos/express.svg" },
  { name: "PostgreSQL", category: "backend", level: 75, featured: true, color: "from-blue-600 to-sky-700", texture: "/assets/logos/postgresql.svg" },
  { name: "MySQL", category: "backend", level: 75, featured: false, color: "from-sky-500 to-indigo-650", texture: "/assets/logos/mysql.svg" },

  // Cloud & DevOps (5 keys)
  { name: "MongoDB", category: "backend", level: 75, featured: false, color: "from-green-600 to-emerald-700", texture: "/assets/logos/mongodb.svg" },
  { name: "Docker", category: "cloud", level: 75, featured: true, color: "from-blue-500 to-sky-400", texture: "/assets/logos/docker.svg" },
  { name: "AWS", category: "cloud", level: 75, featured: true, color: "from-orange-500 to-amber-500", texture: "/assets/logos/amazonwebservices.svg" },
  { name: "Git", category: "cloud", level: 85, featured: false, color: "from-orange-600 to-red-500", texture: "/assets/logos/git.svg" },
  { name: "GitHub", category: "cloud", level: 82, featured: false, color: "from-neutral-800 to-neutral-700", texture: "/assets/logos/github.svg" },
];

export const marqueeSkillsRow1 = [
  "Python",
  "JavaScript",
  "React.js",
  "Next.js",
  "Tailwind CSS",
  "Vite",
  "Node.js",
];

export const marqueeSkillsRow2 = [
  "TypeScript",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "AWS",
  "Git",
  "Docker",
];
