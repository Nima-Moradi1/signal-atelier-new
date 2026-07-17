import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "public");

function size(path: string) {
  return statSync(resolve(root, path)).size;
}

describe("optimized portfolio assets", () => {
  it("ships compact XO Arena screenshots and poster", () => {
    for (const file of [
      "landing.webp",
      "lobby.webp",
      "game-room.webp",
      "profile.webp",
      "video-poster.webp",
    ]) {
      expect(size(`assets/projects/xo-arena/${file}`)).toBeLessThan(100_000);
    }
  });

  it("ships fast-start-ready video alternatives within the route budget", () => {
    expect(size("assets/projects/xo-arena/xo-arena-preview.mp4")).toBeLessThan(
      500_000,
    );
    expect(size("assets/projects/xo-arena/xo-arena-preview.webm")).toBeLessThan(
      500_000,
    );
  });

  it("includes one optimized résumé preview and a one-page source PDF", () => {
    expect(size("assets/nima-moradirad-resume-preview.webp")).toBeLessThan(
      300_000,
    );
    expect(
      existsSync(resolve(root, "assets/nima-moradirad-resume-preview.png")),
    ).toBe(false);
    expect(
      existsSync(
        resolve(root, "assets/nima-moradirad-resume-preview-page-2.png"),
      ),
    ).toBe(false);
    expect(size("nima-moradirad-resume.pdf")).toBeGreaterThan(1_000_000);
    expect(size("nima-moradirad-resume.pdf")).toBeLessThan(3_000_000);
    const source = readFileSync(
      resolve(root, "nima-moradirad-resume.pdf"),
      "latin1",
    );
    expect(source.match(/\/Type\s*\/Page\b/g)).toHaveLength(1);
  });
});
