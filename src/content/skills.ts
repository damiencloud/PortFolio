import { Skill, SkillCategory, SkillCategoryInfo } from "@/types";

export const skillCategories: SkillCategoryInfo[] = [
  { id: "all", label: "All Tech Stack", iconName: "GitBranch" },
  { id: "languages", label: "Languages", iconName: "Code2" },
  { id: "frontend", label: "Frontend", iconName: "Layout" },
  { id: "backend", label: "Backend & DB", iconName: "Server" },
  { id: "cloud", label: "Cloud & DevOps", iconName: "Cloud" },
];

export const skills: Skill[] = [
  // Languages
  { name: "Python", category: "languages", level: 85, featured: true, color: "from-blue-500 to-yellow-500" },
  { name: "JavaScript", category: "languages", level: 80, featured: true, color: "from-yellow-400 to-yellow-600" },
  { name: "HTML & CSS", category: "languages", level: 90, featured: false, color: "from-orange-500 to-blue-500" },
  { name: "SQL", category: "languages", level: 75, featured: false, color: "from-sky-500 to-indigo-650" },

  // Frontend
  { name: "React.js", category: "frontend", level: 82, featured: true, color: "from-cyan-400 to-sky-600" },
  { name: "Next.js", category: "frontend", level: 80, featured: true, color: "from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-500" },
  { name: "Tailwind CSS", category: "frontend", level: 88, featured: true, color: "from-cyan-500 to-teal-400" },

  // Backend & DB
  { name: "Django", category: "backend", level: 78, featured: true, color: "from-green-700 to-emerald-600" },
  { name: "PostgreSQL", category: "backend", level: 75, featured: true, color: "from-blue-600 to-sky-700" },
  { name: "SQLite", category: "backend", level: 80, featured: false, color: "from-sky-600 to-indigo-600" },
  { name: "Supabase", category: "backend", level: 80, featured: true, color: "from-emerald-500 to-green-600" },

  // Cloud & DevOps
  { name: "AWS (Lightsail, EC2)", category: "cloud", level: 75, featured: true, color: "from-orange-500 to-amber-500" },
  { name: "Git & GitHub", category: "cloud", level: 85, featured: false, color: "from-neutral-700 to-neutral-500 dark:from-neutral-300 dark:to-neutral-500" },
  { name: "Github Actions", category: "cloud", level: 70, featured: true, color: "from-indigo-600 to-purple-500" },
];

export const marqueeSkillsRow1 = [
  "Python",
  "JavaScript",
  "React.js",
  "Next.js",
  "Django",
  "Tailwind CSS",
  "Supabase",
];

export const marqueeSkillsRow2 = [
  "PostgreSQL",
  "SQLite",
  "AWS",
  "Git",
  "GitHub Actions",
  "Vercel",
  "SQL",
];
