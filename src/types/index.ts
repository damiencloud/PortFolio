export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  description: string;
  resumeUrl: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  portfolioUrl: string;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: string;
  };
  favicon: string;
  logo: string;
  contactForm?: {
    provider: "web3forms" | "formspree" | "simulated";
    accessKeyOrId: string;
  };
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  highlightWords: string[];
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export interface AboutContent {
  sectionLabel: string;
  sectionTitle: string;
  heading: string;
  paragraphs: string[];
  metrics: {
    value: number;
    suffix?: string;
    label: string;
  }[];
  details: {
    label: string;
    value: string;
    color: string;
  }[];
}

export type SkillCategory =
  | "languages"
  | "frontend"
  | "backend"
  | "database"
  | "cloud"
  | "devops"
  | "monitoring"
  | "security"
  | "frameworks"
  | "tools";

export interface Skill {
  name: string;
  category: SkillCategory;
  level: number; // Percentage 0 - 100
  years?: number;
  featured: boolean;
  color: string;
  texture?: string;
}

export interface SkillCategoryInfo {
  id: SkillCategory | "all";
  label: string;
  iconName: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  date: string;
  type: string;
  bullets: string[];
  tags: string[];
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  subtitle: string;
  shortDesc: string;
  overview: string;
  problem: string;
  solution: string;
  architecture: {
    steps: { title: string; desc: string }[];
    summary: string;
  };
  metrics: { value: string; label: string }[];
  tags: string[];
  techCode: string;
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  category: string;
  screenshots?: string[];
  highlights?: string[];
  challenges?: string[];
  lessonsLearned?: string[];
  color: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  date: string;
  gpa?: string;
  description: string;
  courses: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl: string;
  color: string;
  accent: string;
}

export interface SocialLink {
  platform: string;
  username: string;
  url: string;
  iconName: string;
}

export interface NavLink {
  label: string;
  href: string;
  iconName?: string;
}
