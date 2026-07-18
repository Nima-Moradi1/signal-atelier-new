import type {
  CapabilityGroup,
  ExperienceItem,
  LinkItem,
  ProjectItem,
} from "@/types/portfolio";

/**
 * Verified portfolio content adapted from Nima Moradirad's résumé.
 * Keep claims factual and review this file first when updating the site.
 */
export const portfolio = {
  identity: {
    name: "Nima Moradirad",
    initials: "NM",
    role: "Senior Frontend Engineer",
    shortRole: "Product engineering · Web + Mobile",
    location: "Tehran, Iran",
    availability: "6+ years across web, mobile, and PWA engineering",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "nimamoradirad@gmail.com",
    resumeUrl: "/nima-moradirad-resume.pdf",
    intro:
      "I build secure, high-performance products across web, Android, and PWA—from React architecture to real-time systems.",
    statement:
      "I build scalable web and mobile products where performance, reliability, and clear design work together.",
  },
  navigation: [
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Work", href: "/#work" },
    { label: "Capabilities", href: "/#capabilities" },
    { label: "Contact", href: "/#contact" },
  ] satisfies LinkItem[],
  signals: ["Scalability", "Performance", "Creativity", "Product engineering"],
  about: {
    eyebrow: "Web + mobile product engineering",
    paragraphs: [
      "I turn React and TypeScript systems into reliable web, Android, and PWA products. Across finance, commerce, government, and real-time platforms, I use clear architecture and AI-assisted workflows to ship faster without giving up engineering judgment.",
    ],
    principles: [
      {
        index: "01",
        title: "Clear boundaries scale",
        text: "Focused domains and shared contracts keep products adaptable.",
      },
      {
        index: "02",
        title: "Performance earns trust",
        text: "Fast rendering, caching, and releases make products feel reliable.",
      },
      {
        index: "03",
        title: "Rigor enables creativity",
        text: "Accessible, validated delivery turns expressive UI into a useful product.",
      },
    ],
  },
  experience: [
    {
      period: "Feb 2025 — Present",
      role: "Senior Frontend Developer",
      company: "Hesabo · Tehran, Iran",
      summary:
        "Shaping frontend architecture and delivery for a B2B financial platform spanning Admin, Employer, Employee, and Support experiences.",
      highlights: [
        "Mentor and onboard engineers around business flows, maintainable code, and domain-driven boundaries.",
        "Develop and maintain Android applications with Capacitor, platform integrations, and custom Java plugins.",
        "Own a customized PWA layer with controlled auto-updates, cache versioning, invalidation, and offline fallbacks.",
        "Improve build performance, XSS defenses, validation, authorization, and real-time WebSocket/SignalR features.",
        "Use Codex and Claude Max for architecture, refactoring, review, testing, documentation, and repeatable delivery workflows.",
      ],
      technologies: [
        "React",
        "TypeScript",
        "Capacitor",
        "Android",
        "PWA",
        "WebSockets",
        "AI-assisted delivery",
      ],
    },
    {
      period: "Mar 2024 — Mar 2025",
      role: "Senior Frontend Engineer",
      company: "Basilica Finance · Tehran, Iran",
      summary:
        "Led frontend delivery for a scalable finance PWA designed for protected user journeys and high request volumes.",
      highlights: [
        "Built protected authentication and product flows with Next.js, TypeScript, Zustand, Tailwind CSS, and MUI.",
        "Delivered Lighthouse-focused performance improvements and maintained release quality through GitHub/GitLab review.",
      ],
      technologies: [
        "Next.js",
        "TypeScript",
        "Zustand",
        "Tailwind CSS",
        "Material UI",
        "PWA",
      ],
    },
    {
      period: "Jan 2023 — Mar 2024",
      role: "Frontend Developer",
      company: "BarnameNegar · Tehran, Iran",
      summary:
        "Built internal government dashboards and panels with server-rendered, REST-connected workflows.",
      highlights: [
        "Delivered Vite and TypeScript applications with SSR, REST APIs, Tailwind CSS, shadcn/ui, and Redux-based state management.",
      ],
      technologies: [
        "Vite",
        "TypeScript",
        "SSR",
        "REST API",
        "Tailwind CSS",
        "shadcn/ui",
        "Redux",
      ],
    },
    {
      period: "Dec 2020 — Sep 2022",
      role: "React Developer",
      company: "KZI",
      summary:
        "Delivered e-commerce and content experiences with React, JavaScript, component libraries, and modern state management.",
      highlights: [
        "Maintained Lighthouse performance and dependable PWA/SPA behavior with Material UI and Redux Toolkit.",
        "Worked across Vite, TypeScript, HeroUI, React Hook Form, Yup, and router-driven application architecture.",
      ],
      technologies: [
        "React",
        "TypeScript",
        "Material UI",
        "Redux Toolkit",
        "PWA",
        "React Hook Form",
        "Yup",
      ],
    },
  ] satisfies ExperienceItem[],
  projects: [
    {
      number: "01",
      title: "XO Arena",
      category: "Real-time multiplayer PWA · Product case study",
      summary:
        "A type-safe multiplayer PWA with live rooms, secure sessions, computer opponents, and mobile install support.",
      contribution:
        "Built shared contracts and a server-validated game engine with Next.js, TypeScript, Express, Socket.IO, Prisma, MySQL, Zod, avatar uploads, and httpOnly sessions.",
      image: "/assets/projects/xo-arena/game-room.webp",
      imageAlt: "XO Arena live game room with a completed Tic-Tac-Toe match",
      technologies: [
        "Next.js",
        "TypeScript",
        "Socket.IO",
        "Prisma",
        "MySQL",
        "PWA",
      ],
      href: "/projects/xo-arena",
      featured: true,
      accent: "lime",
    },
    {
      number: "02",
      title: "Emerald Case",
      category: "Full-stack e-commerce · Oct–Nov 2023",
      summary:
        "A multilingual custom phone-case storefront with image uploads, authentication, checkout, and responsive theming.",
      contribution:
        "Built the product with Next.js and TypeScript, using Prisma and MongoDB for data, Stripe for payments, Resend for email, and Zustand plus Context for client state.",
      image: "/assets/projects/emerald-case/homepage.jpg",
      imageAlt: "Emerald Case storefront showing its custom phone-case builder",
      technologies: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "MongoDB",
        "Stripe",
        "i18n",
      ],
      href: "https://emerald-case.vercel.app/en/",
      featured: true,
      accent: "violet",
    },
    {
      number: "03",
      title: "Hesabo Platform",
      category: "B2B financial platform · Production",
      summary:
        "Four connected Admin, Employer, Employee, and Support surfaces for a production B2B financial platform.",
      contribution:
        "Developed domain-driven interfaces and real-time features across Vite, TypeScript, MobX, React Context, HeroUI, Tailwind CSS, Android delivery, and a controlled PWA cache layer.",
      image: "/assets/projects/hesabo/homepage.jpg",
      imageAlt: "Hesabo website presenting its employee salary access platform",
      technologies: [
        "Vite",
        "TypeScript",
        "MobX",
        "React Context",
        "HeroUI",
        "Capacitor",
      ],
      href: "https://hesabo.com/",
      featured: true,
      accent: "coral",
    },
  ] as ProjectItem[],
  capabilities: [
    {
      label: "01 · Web architecture",
      description:
        "Scalable interfaces, rendering strategies, and domain boundaries for production web products.",
      skills: [
        "React",
        "Next.js",
        "Vite",
        "TypeScript",
        "SSR / CSR / SSG",
        "ISR / PPR",
        "DDD",
        "Module Federation",
      ],
    },
    {
      label: "02 · Mobile & PWA delivery",
      description:
        "Android and installable web experiences with deliberate release and cache behavior.",
      skills: [
        "Capacitor",
        "Android",
        "Java plugins",
        "Service Workers",
        "Safe auto-updates",
        "Cache versioning",
        "Offline fallbacks",
        "Release stability",
      ],
    },
    {
      label: "03 · UI, state & quality",
      description:
        "Adaptable design systems, predictable state, validation, observability, and test coverage.",
      skills: [
        "Tailwind CSS",
        "shadcn/ui",
        "MUI / HeroUI",
        "Zustand",
        "Redux Toolkit",
        "MobX",
        "Unit / E2E testing",
        "Sentry",
      ],
    },
    {
      label: "04 · AI, systems & data",
      description:
        "Human-directed AI workflows, real-time integrations, APIs, and supporting backend systems.",
      skills: [
        "Codex",
        "Claude Max",
        "Node.js",
        "LangChain agents",
        "WebSockets / SignalR",
        "REST / GraphQL",
        "Prisma / SQL / MongoDB",
        "Docker",
      ],
    },
  ] satisfies CapabilityGroup[],
  education: {
    title: "B.Sc. Computer Engineering",
    institution: "Tehran Azad University · 2021 — Present",
    note: "Computer engineering study alongside professional product delivery across web and mobile.",
    languages: [
      "Persian · Native/Bilingual",
      "English · Native/Bilingual",
      "German · Elementary",
    ],
  },
  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/nima-moradi-rad-1380s",
    },
    { label: "GitHub", href: "https://github.com/Nima-Moradi1" },
  ] satisfies LinkItem[],
} as const;

export type PortfolioContent = typeof portfolio;
