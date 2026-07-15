import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("does not emit deprecated Three.js warnings", async ({ page }) => {
  const deprecatedWarnings: string[] = [];

  page.on("console", (message) => {
    const text = message.text();
    if (
      text.includes("PCFSoftShadowMap has been deprecated") ||
      text.includes("Clock: This module has been deprecated")
    ) {
      deprecatedWarnings.push(text);
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  if ((await page.locator("canvas").count()) === 0) {
    test.skip(true, "WebGL is unavailable in this browser runtime.");
  }

  expect(deprecatedWarnings).toEqual([]);
});

test("renders the portfolio narrative and navigation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /I build digital systems with signal/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore selected work" }).click();
  await expect(page.locator("#work")).toBeInViewport();
  await expect(
    page.getByRole("heading", { name: "Emerald Case" }),
  ).toBeVisible();
});

test("pull-chain control changes and remembers the room theme", async ({
  page,
}) => {
  const runtimeWarnings: string[] = [];
  page.on("console", (message) => {
    if (message.text().includes("Too many active WebGL contexts")) {
      runtimeWarnings.push(message.text());
    }
  });

  await page.goto("/");

  const lampByName = page.getByRole("button", {
    name: /Turn the reading lamp off and switch to light mode/i,
  });
  await expect(lampByName).toBeVisible();
  const lamp = page.locator(".theme-lamp__pull");
  const lampBox = await lamp.boundingBox();
  expect(lampBox).not.toBeNull();
  if (!lampBox) return;

  const pullX = lampBox.x + lampBox.width / 2;
  const pullY = lampBox.y + lampBox.height / 2;
  const pointerTarget = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.className,
    { x: pullX, y: pullY },
  );
  expect(pointerTarget).toContain("theme-lamp__pull");

  await page.mouse.move(pullX, pullY);
  await page.mouse.down();
  await page.mouse.move(pullX, pullY + 8, { steps: 3 });
  await page.mouse.up();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.mouse.move(pullX, pullY);
  await page.mouse.down();
  await page.mouse.move(pullX, pullY + 40, { steps: 8 });
  const pullOffset = await lamp.evaluate((button) =>
    button.style.getPropertyValue("--pull-offset"),
  );
  expect(Number.parseFloat(pullOffset)).toBeGreaterThan(20);
  await page.mouse.up();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(lamp).toHaveCSS("cursor", "grab");

  for (let toggle = 0; toggle < 2; toggle += 1) {
    await lamp.click();
  }
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const lostContexts = await page.locator("canvas").evaluateAll(
    (canvases) =>
      canvases.filter((canvas) => {
        const context = (canvas as HTMLCanvasElement).getContext("webgl2");
        return context?.isContextLost() ?? false;
      }).length,
  );
  expect(lostContexts).toBe(0);
  expect(runtimeWarnings).toEqual([]);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("keeps the experience book clear of headings and the floating lamp", async ({
  page,
}) => {
  async function scrollExperienceIntoPlace() {
    await page.goto("/#experience");
    await page.addStyleTag({
      content: "html { scroll-behavior: auto !important; }",
    });
    await page.locator("#experience").evaluate((section) => {
      window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY);
    });
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await scrollExperienceIntoPlace();

  const desktopHeading = await page
    .locator(".experience-book__heading h2")
    .boundingBox();
  const desktopScene = await page
    .locator(".experience-book__scene")
    .boundingBox();
  const desktopCopy = await page
    .locator(".experience-book__page-copy")
    .boundingBox();
  const desktopLamp = await page.locator(".theme-lamp").boundingBox();

  expect(desktopHeading).not.toBeNull();
  expect(desktopScene).not.toBeNull();
  expect(desktopCopy).not.toBeNull();
  expect(desktopLamp).not.toBeNull();
  if (!desktopHeading || !desktopScene || !desktopCopy || !desktopLamp) return;

  expect(desktopScene.x).toBeGreaterThan(
    desktopHeading.x + desktopHeading.width,
  );
  expect(desktopCopy.x + desktopCopy.width).toBeLessThanOrEqual(
    desktopLamp.x + 2,
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await scrollExperienceIntoPlace();

  const mobileHeading = await page
    .locator(".experience-book__heading h2")
    .boundingBox();
  const mobileScene = await page
    .locator(".experience-book__scene")
    .boundingBox();
  const mobileCopy = await page
    .locator(".experience-book__page-copy")
    .boundingBox();
  const mobileLamp = await page.locator(".theme-lamp").boundingBox();

  expect(mobileHeading).not.toBeNull();
  expect(mobileScene).not.toBeNull();
  expect(mobileCopy).not.toBeNull();
  expect(mobileLamp).not.toBeNull();
  if (!mobileHeading || !mobileScene || !mobileCopy || !mobileLamp) return;

  expect(mobileScene.y).toBeGreaterThanOrEqual(
    mobileHeading.y + mobileHeading.height,
  );
  expect(mobileCopy.y).toBeGreaterThanOrEqual(
    mobileScene.y + mobileScene.height,
  );
  expect(mobileCopy.y + mobileCopy.height).toBeLessThanOrEqual(
    mobileLamp.y + 1,
  );
});

test("experience reader exposes scroll and button-driven page navigation", async ({
  page,
}) => {
  await page.goto("/#experience");

  await expect(
    page.getByRole("heading", { name: /A career, bound in chapters/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next experience" }).click();
  await expect(page.locator(".experience-book__page-copy h3")).toHaveText(
    "Senior Frontend Engineer",
  );
});

test("exposes accessible form validation", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send the signal" }).click();

  await expect(
    page.getByText(/Please enter at least 2 characters/i),
  ).toBeVisible();
  await expect(page.getByText(/Please enter a valid email/i)).toBeVisible();
});

test("has no automatically detectable serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .disableRules(["color-contrast"])
    .analyze();

  expect(
    results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});
