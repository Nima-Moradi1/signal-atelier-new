import { describe, expect, it } from "vitest";
import { portfolio } from "@/content/portfolio";

describe("updated professional portfolio content", () => {
  it("uses the 2026 professional identity and hero signals", () => {
    expect(portfolio.identity.role).toBe("Senior Frontend Engineer");
    expect(portfolio.identity.availability).toContain("6+ years");
    expect(portfolio.signals).toEqual([
      "Scalability",
      "Performance",
      "Creativity",
      "Product engineering",
    ]);
  });

  it("reflects the updated employment dates and delivery scope", () => {
    expect(portfolio.experience[0]).toMatchObject({
      period: "Feb 2025 — Present",
      role: "Senior Frontend Developer",
      company: "Hesabo · Tehran, Iran",
    });
    expect(portfolio.experience[0].highlights.join(" ")).toMatch(/Capacitor/i);
    expect(portfolio.experience[0].highlights.join(" ")).toMatch(
      /cache versioning/i,
    );
    expect(portfolio.experience[0].highlights.join(" ")).toMatch(
      /Codex and Claude Max/i,
    );
    expect(portfolio.experience[3].period).toBe("Dec 2020 — Sep 2022");
  });

  it("promotes XO Arena and retains the two current selected products", () => {
    expect(portfolio.projects.map((project) => project.title)).toEqual([
      "XO Arena",
      "Emerald Case",
      "Hesabo Platform",
    ]);
    expect(portfolio.projects[0]).toMatchObject({
      href: "/projects/xo-arena",
      technologies: expect.arrayContaining(["Socket.IO", "Prisma", "MySQL"]),
    });
  });

  it("covers web, mobile, quality, AI, systems, and in-progress education", () => {
    expect(portfolio.capabilities).toHaveLength(4);
    expect(portfolio.capabilities.flatMap((group) => group.skills)).toEqual(
      expect.arrayContaining([
        "Module Federation",
        "Java plugins",
        "Unit / E2E testing",
        "LangChain agents",
        "Docker",
      ]),
    );
    expect(portfolio.education.institution).toBe(
      "Tehran Azad University · 2021 — Present",
    );
  });
});
