import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Damien Joseph Martin",
  title: "Damien Joseph Martin — Aspiring Full Stack Developer",
  tagline: "Aspiring Full Stack Developer",
  description: "Aspiring Full Stack Developer with a strong foundation in Python, JavaScript, React, Next.js, Django, HTML, CSS, and Tailwind CSS. Passionate about building modern web applications, integrating AI solutions, and developing user-centric software.",
  resumeUrl: "/resume.pdf",
  email: "damienjosephmartin10@gmail.com",
  location: "Kochi / Bangalore, India",
  github: "https://github.com/damiencloud",
  linkedin: "https://linkedin.com/in/damien-joseph-martin-15428a34a",
  portfolioUrl: "https://github.com/damiencloud",
  themeColors: {
    primary: "#6366f1", // Indigo
    secondary: "#8b5cf6", // Violet
    accent: "#06b6d4", // Cyan
  },
  seo: {
    metaTitle: "Damien Joseph Martin — Aspiring Full Stack Developer",
    metaDescription: "Damien Joseph Martin — Aspiring Full Stack Developer. Strong foundation in Python, JavaScript, React, Next.js, Django, HTML, CSS, and Tailwind CSS.",
    keywords: ["Python", "JavaScript", "React", "Next.js", "Django", "Full Stack Developer", "AI Integration", "Software Developer"],
  },
  openGraph: {
    title: "Damien Joseph Martin — Aspiring Full Stack Developer",
    description: "Building modern web applications, integrating AI solutions, and developing user-centric software.",
    image: "/og-image.jpg",
    type: "website",
  },
  favicon: "/favicon.ico",
  logo: "DM",
  contactForm: {
    provider: "web3forms", // Web3Forms direct email delivery
    accessKeyOrId: "YOUR_ACCESS_KEY_HERE", // Enter access key from web3forms.com
  },
};
