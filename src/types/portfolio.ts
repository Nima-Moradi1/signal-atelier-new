export type LinkItem = {
  id: string;
  label: string;
  href: string;
};

export type ExperienceItem = {
  id: string;
  period: string;
  role: string;
  company: string;
  summary: string;
  highlights: string[];
  technologies: string[];
};

export type ProjectItem = {
  id: string;
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
  id: string;
  index: string;
  title: string;
  label: string;
  description: string;
  skills: string[];
};

export type PortfolioContent = {
  identity: {
    name: string;
    initials: string;
    role: string;
    shortRole: string;
    location: string;
    availability: string;
    email: string;
    resumeUrl: string;
    resumePreview: string;
    intro: string;
    statement: string;
  };
  navigation: LinkItem[];
  signals: string[];
  about: {
    eyebrow: string;
    paragraphs: string[];
    principles: Array<{
      id: string;
      index: string;
      title: string;
      text: string;
    }>;
  };
  experience: ExperienceItem[];
  projects: ProjectItem[];
  capabilities: CapabilityGroup[];
  education: {
    title: string;
    institution: string;
    note: string;
    languages: string[];
  };
  socialLinks: LinkItem[];
};
