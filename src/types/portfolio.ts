export type LinkItem = {
  label: string;
  href: string;
};

export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  summary: string;
  highlights: string[];
  technologies: string[];
};

export type ProjectItem = {
  number: string;
  title: string;
  category: string;
  summary: string;
  contribution: string;
  image: string;
  imageAlt: string;
  technologies: string[];
  href?: string;
  featured: boolean;
  accent: "lime" | "violet" | "coral";
};

export type CapabilityGroup = {
  label: string;
  description: string;
  skills: string[];
};
