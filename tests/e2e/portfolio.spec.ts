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

  if ((await page.locator(".hero-studio__viewport canvas").count()) === 0) {
    test.skip(true, "WebGL is unavailable in this browser runtime.");
  }

  await expect(page.locator(".resume-touch-hint")).toHaveCSS(
    "animation-name",
    "resume-touch-float",
  );
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

test("renders a controllable workstation with reliable resume and lamp actions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(page.locator(".hero__scene")).toHaveCount(0);
  const studio = page.getByRole("region", {
    name: "Interactive 3D developer workstation",
  });
  await expect(studio).toBeVisible();
  await expect(page.locator("[data-code-loop='active']")).toHaveText(
    "Typing React",
  );

  const viewport = page.locator(".hero-studio__viewport");
  const canvas = viewport.locator("canvas");
  const hasWorkstationCanvas = (await canvas.count()) > 0;
  let expectedThemeAfterToolbar = "light";
  if (hasWorkstationCanvas) {
    await expect(canvas).toHaveCSS("touch-action", "pan-y");
    const beforeDrag = await viewport.screenshot();
    const bounds = await viewport.boundingBox();
    expect(bounds).not.toBeNull();
    if (bounds) {
      await page.mouse.move(
        bounds.x + bounds.width * 0.58,
        bounds.y + bounds.height * 0.5,
      );
      await page.mouse.down();
      await page.mouse.move(
        bounds.x + bounds.width * 0.37,
        bounds.y + bounds.height * 0.52,
        { steps: 10 },
      );
      await page.mouse.up();
      await page.waitForTimeout(250);
      const afterDrag = await viewport.screenshot();
      expect(beforeDrag.equals(afterDrag)).toBe(false);
    }

    const pullTarget = viewport.locator(".desk-lamp__pull-target");
    await expect(pullTarget).toHaveCount(1);
    await expect(pullTarget).toHaveCSS("touch-action", "none");
    const pullBounds = await pullTarget.boundingBox();
    expect(pullBounds).not.toBeNull();
    if (pullBounds) {
      await page.mouse.move(
        pullBounds.x + pullBounds.width / 2,
        pullBounds.y + pullBounds.height / 2,
      );
      await page.mouse.down();
      await page.mouse.move(
        pullBounds.x + pullBounds.width / 2,
        pullBounds.y + pullBounds.height / 2 + 36,
        { steps: 6 },
      );
      await page.mouse.up();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        "light",
      );
      expectedThemeAfterToolbar = "dark";
    }
  }

  await page.getByRole("button", { name: "Raise résumé" }).click();
  const dialog = page.getByRole("dialog", {
    name: "Nima Moradirad — Résumé",
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("img", {
      name: "Preview of Nima Moradirad's one-page résumé",
    }),
  ).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(
    dialog.getByRole("link", { name: /Open full size/i }),
  ).toHaveAttribute("href", "/nima-moradirad-resume.pdf");

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

  await page
    .getByRole("button", {
      name: /Switch the desk lamp/i,
    })
    .click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    expectedThemeAfterToolbar,
  );
});

test("uses six depth portals while keeping section anchors and reduced motion safe", async ({
  page,
}) => {
  await page.goto("/");
  await page.addStyleTag({
    content: "html { scroll-behavior: auto !important; }",
  });

  await expect(page.locator("[data-depth-section]")).toHaveCount(6);
  await expect(page.locator("#top")).toHaveAttribute(
    "data-depth-phase",
    "settled",
  );

  const about = page.locator("#about");
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const aboutTop = await about.evaluate(
    (section) => section.getBoundingClientRect().top + window.scrollY,
  );
  await page.evaluate(
    ({ top, height }) => window.scrollTo(0, top - height * 0.72),
    { top: aboutTop, height: viewportHeight },
  );
  await page.waitForTimeout(100);

  await expect(about).toHaveAttribute("data-depth-phase", "entering");
  const transition = await about.evaluate((section) => {
    const plane = section.querySelector<HTMLElement>("[data-depth-plane]");
    if (!plane) return null;
    const style = getComputedStyle(plane);
    return {
      opacity: Number.parseFloat(style.opacity),
      transform: style.transform,
    };
  });
  expect(transition).not.toBeNull();
  expect(transition?.opacity).toBeGreaterThan(0.2);
  expect(transition?.opacity).toBeLessThan(0.8);
  expect(transition?.transform).not.toBe("none");

  await page.evaluate((top) => window.scrollTo(0, top), aboutTop);
  await page.waitForTimeout(100);
  await expect(about).toHaveAttribute("data-depth-phase", "settled");
  await expect(about.locator("[data-depth-plane]")).toHaveCSS(
    "transform",
    "none",
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(
    ({ top, height }) => window.scrollTo(0, top - height * 0.72),
    { top: aboutTop, height: viewportHeight },
  );
  await page.waitForTimeout(100);
  await expect(about.locator("[data-depth-plane]")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.locator(".depth-portal")).toHaveCSS("display", "none");
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
    ({ x, y }) =>
      document
        .elementFromPoint(x, y)
        ?.closest(".theme-lamp__pull")
        ?.getAttribute("class"),
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

  await lamp.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".site-header .theme-lamp")).toHaveCount(1);

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

test("typesets experience copy across both physical book pages", async ({
  page,
}) => {
  async function scrollExperienceIntoPlace() {
    await page.goto("/#experience");
    await page.addStyleTag({
      content: "html { scroll-behavior: auto !important; }",
    });
    const section = page.locator("#experience");
    await section.evaluate((section) => {
      window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY);
    });
    await expect(section).toHaveAttribute("data-depth-phase", "settled");
    await expect(page.locator(".experience-book__heading h2")).toBeVisible();
    await expect(page.locator(".experience-book__scene")).toBeVisible();
    await expect(page.locator(".experience-book__page-copy")).toBeVisible();
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
  const desktopPages = page.locator(".experience-book__page");

  expect(desktopHeading).not.toBeNull();
  expect(desktopScene).not.toBeNull();
  expect(desktopCopy).not.toBeNull();
  await expect(desktopPages).toHaveCount(2);
  if (!desktopHeading || !desktopScene || !desktopCopy) return;

  expect(desktopScene.x).toBeGreaterThan(
    desktopHeading.x + desktopHeading.width,
  );
  expect(desktopCopy.x).toBeGreaterThanOrEqual(desktopScene.x - 2);
  expect(desktopCopy.x + desktopCopy.width).toBeLessThanOrEqual(
    desktopScene.x + desktopScene.width + 2,
  );
  expect(desktopCopy.y).toBeGreaterThanOrEqual(desktopScene.y - 2);
  expect(desktopCopy.y + desktopCopy.height).toBeLessThanOrEqual(
    desktopScene.y + desktopScene.height + 2,
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
  const mobilePages = page.locator(".experience-book__page");

  expect(mobileHeading).not.toBeNull();
  expect(mobileScene).not.toBeNull();
  expect(mobileCopy).not.toBeNull();
  await expect(mobilePages).toHaveCount(2);
  if (!mobileHeading || !mobileScene || !mobileCopy) return;

  expect(mobileScene.y).toBeGreaterThanOrEqual(
    mobileHeading.y + mobileHeading.height + 12,
  );
  expect(mobileScene.x).toBeGreaterThanOrEqual(10);
  expect(mobileScene.x + mobileScene.width).toBeLessThanOrEqual(380);
  expect(mobileCopy.x).toBeGreaterThanOrEqual(20);
  expect(mobileCopy.x + mobileCopy.width).toBeLessThanOrEqual(370);
  expect(mobileCopy.y).toBeGreaterThanOrEqual(mobileScene.y - 2);
  expect(mobileCopy.y + mobileCopy.height).toBeLessThanOrEqual(
    mobileScene.y + mobileScene.height + 2,
  );

  const pageOverflow = await mobilePages.evaluateAll((pages) =>
    pages.map((bookPage) => ({
      horizontal: bookPage.scrollWidth - bookPage.clientWidth,
      vertical: bookPage.scrollHeight - bookPage.clientHeight,
    })),
  );
  expect(pageOverflow).toEqual([
    { horizontal: 0, vertical: 0 },
    { horizontal: 0, vertical: 0 },
  ]);

  await expect(page.locator(".experience-book__page-copy")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  const mobileCopySizes = await page.evaluate(() => ({
    summary: Number.parseFloat(
      getComputedStyle(document.querySelector(".experience-book__summary")!)
        .fontSize,
    ),
    highlight: Number.parseFloat(
      getComputedStyle(
        document.querySelector(".experience-book__page--right li")!,
      ).fontSize,
    ),
  }));
  expect(mobileCopySizes.summary).toBeGreaterThanOrEqual(9.5);
  expect(mobileCopySizes.highlight).toBeGreaterThanOrEqual(8.75);

  for (const role of [
    "Senior Frontend Engineer",
    "Frontend Developer",
    "React Developer",
  ]) {
    await page.getByRole("button", { name: "Next experience" }).click();
    await expect(page.locator(".experience-book__page-copy h3")).toHaveText(
      role,
    );
    const chapterOverflow = await mobilePages.evaluateAll((pages) =>
      pages.map((bookPage) => bookPage.scrollHeight - bookPage.clientHeight),
    );
    expect(chapterOverflow).toEqual([0, 0]);
  }
});

test("keeps the mobile glass navbar readable with adjacent lamp access", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const header = page.locator(".site-header");
  const lamp = page.locator(".theme-lamp");
  const menu = page.locator(".site-header__menu-button");
  await expect(header).toBeVisible();
  const [headerBox, lampBox, menuBox] = await Promise.all([
    header.boundingBox(),
    lamp.boundingBox(),
    menu.boundingBox(),
  ]);

  expect(headerBox).not.toBeNull();
  expect(lampBox).not.toBeNull();
  expect(menuBox).not.toBeNull();
  if (!headerBox || !lampBox || !menuBox) return;

  expect(
    await header.evaluate((node) => getComputedStyle(node).backgroundImage),
  ).not.toBe("none");
  const headerFilters = await header.evaluate((node) => {
    const style = getComputedStyle(node);
    return [
      style.getPropertyValue("backdrop-filter"),
      style.getPropertyValue("-webkit-backdrop-filter"),
    ];
  });
  expect(headerFilters.join(" ")).toContain("blur");
  expect(lampBox.x + lampBox.width).toBeLessThanOrEqual(menuBox.x + 2);

  const pullBox = await page.locator(".theme-lamp__pull").boundingBox();
  expect(pullBox).not.toBeNull();
  if (!pullBox) return;
  expect(pullBox.y + pullBox.height).toBeGreaterThan(
    headerBox.y + headerBox.height,
  );
  const pendulum = page.locator(".theme-lamp__pendulum");
  const handle = page.locator(".theme-lamp__handle");
  await expect(pendulum).toHaveCount(1);
  await expect(handle).toHaveCount(1);
  await expect(page.locator(".theme-lamp__cord")).toHaveCount(1);
  await expect(pendulum).toHaveCSS("animation-name", "lamp-cord-pendulum");
  const attachmentGap = await pendulum.evaluate((element) => {
    const pullHandle = element.querySelector<HTMLElement>(
      ".theme-lamp__handle",
    );
    return pullHandle
      ? Math.abs(element.clientHeight - pullHandle.offsetTop)
      : Number.POSITIVE_INFINITY;
  });
  expect(attachmentGap).toBeLessThanOrEqual(1);

  async function measureSwingDistance() {
    return pendulum.evaluate((element) => {
      const handle = element.querySelector<HTMLElement>(".theme-lamp__handle");
      const animation = element.getAnimations()[0];
      if (!handle || !animation) return 0;
      const duration = Number(animation.effect?.getTiming().duration);
      animation.pause();
      animation.currentTime = 0;
      const left = handle.getBoundingClientRect().x;
      animation.currentTime = duration / 2;
      const right = handle.getBoundingClientRect().x;
      animation.play();
      return Math.abs(right - left);
    });
  }

  expect(await measureSwingDistance()).toBeGreaterThanOrEqual(10);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(pendulum).toHaveCSS("animation-name", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await menu.click();
  const mobileNav = page.locator(".mobile-nav");
  await expect(mobileNav).toHaveAttribute("data-open", "true");
  const mobileNavBox = await mobileNav.boundingBox();
  expect(mobileNavBox).not.toBeNull();
  if (!mobileNavBox) return;
  expect(mobileNavBox.x).toBeLessThanOrEqual(0);
  expect(mobileNavBox.y).toBeLessThanOrEqual(0);
  expect(mobileNavBox.width).toBeGreaterThanOrEqual(390);
  expect(mobileNavBox.height).toBeGreaterThanOrEqual(843.5);
  await expect(mobileNav).toHaveCSS("position", "fixed");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  expect(
    await mobileNav.evaluate((node) => getComputedStyle(node).backgroundImage),
  ).toContain("linear-gradient");
  expect(
    await mobileNav.evaluate((node) =>
      getComputedStyle(node).getPropertyValue("backdrop-filter"),
    ),
  ).toContain("blur");

  await page.keyboard.press("Escape");
  await expect(mobileNav).toHaveAttribute("data-open", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("gives light mode a dimensional page and project visual system", async ({
  page,
}) => {
  await page.goto("/");
  const lamp = page.locator(".theme-lamp__pull");
  const box = await lamp.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + 40, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const bodyBackground = await page
    .locator("body")
    .evaluate((node) => getComputedStyle(node).backgroundImage);
  expect(bodyBackground).toContain("radial-gradient");
  expect(bodyBackground).toContain("linear-gradient");

  const projectVisual = page.locator(".project-card__visual").first();
  const projectBackground = await projectVisual.evaluate(
    (node) => getComputedStyle(node).backgroundImage,
  );
  expect(projectBackground).toContain("linear-gradient");
  expect(projectBackground).not.toContain("rgb(13, 16, 14)");

  const headerGlass = await page
    .locator("html")
    .evaluate((node) =>
      getComputedStyle(node).getPropertyValue("--header-glass").trim(),
    );
  expect(headerGlass).toBe("rgba(214, 218, 195, 0.66)");

  await page.locator("#capabilities").scrollIntoViewIfNeeded();
  await expect(page.locator(".site-header")).toHaveAttribute(
    "data-scrolled",
    "true",
  );
  expect(
    await page
      .locator(".site-header")
      .evaluate((node) => getComputedStyle(node).backgroundImage),
  ).toContain("linear-gradient");
});

test("compacts capabilities and presents the completed education signal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#capabilities");
  await page.addStyleTag({
    content: "html { scroll-behavior: auto !important; }",
  });
  const timelineTop = await page
    .locator(".capability-timeline")
    .evaluate(
      (element) => element.getBoundingClientRect().top + window.scrollY,
    );
  await page.evaluate((top) => window.scrollTo(0, top), timelineTop);
  await page.waitForTimeout(120);

  const firstSkills = page.locator(".capability-row").first().locator("li");
  const firstFourBoxes = await firstSkills.evaluateAll((skills) =>
    skills.slice(0, 4).map((skill) => {
      const bounds = skill.getBoundingClientRect();
      return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };
    }),
  );
  expect(firstFourBoxes).toHaveLength(4);
  const [first, second, third, fourth] = firstFourBoxes;
  expect(second.y).toBeCloseTo(first.y, 0);
  expect(third.y).toBeCloseTo(first.y, 0);
  expect(fourth.y).toBeGreaterThan(first.y + first.height - 1);

  await expect(page.locator(".education-card__signal span").first()).toHaveCSS(
    "animation-name",
    "education-signal-pulse",
  );
  await expect(
    page.getByText("Tehran Azad University · Sep 2021 — Jul 15, 2026"),
  ).toBeAttached();
});

test("moves capabilities across a finite horizontal timeline", async ({
  page,
}) => {
  await page.goto("/");
  await page.addStyleTag({
    content: "html { scroll-behavior: auto !important; }",
  });

  const timeline = page.locator(".capability-timeline");
  const track = page.locator(".capability-timeline__track");
  await expect(timeline).toHaveAttribute("data-motion", "depth-linked");
  await expect(page.locator(".capability-timeline__item")).toHaveCount(4);

  await expect
    .poll(() =>
      timeline.evaluate((element) =>
        Math.max(
          (element as HTMLElement).offsetHeight - window.innerHeight,
          0,
        ),
      ),
    )
    .toBeGreaterThan(300);
  const travel = await timeline.evaluate((element) =>
    Math.max((element as HTMLElement).offsetHeight - window.innerHeight, 0),
  );
  const timelineTop = await timeline.evaluate(
    (element) => element.getBoundingClientRect().top + window.scrollY,
  );

  async function forceScroll(target: number) {
    await expect
      .poll(() =>
        page.evaluate((nextTop) => {
          document.documentElement.style.scrollBehavior = "auto";
          document.body.style.scrollBehavior = "auto";
          window.scrollTo(0, nextTop);
          return Math.abs(window.scrollY - nextTop);
        }, target),
      )
      .toBeLessThan(3);
  }

  await forceScroll(timelineTop + travel * 0.56);

  await expect(timeline).toHaveAttribute("data-active-index", "2");
  await expect(page.locator(".capability-timeline__stage")).toHaveCSS(
    "position",
    "sticky",
  );
  const horizontalOffset = await track.evaluate((element) => {
    const transform = getComputedStyle(element).transform;
    return transform === "none" ? 0 : new DOMMatrix(transform).m41;
  });
  expect(horizontalOffset).toBeLessThan(-100);

  await forceScroll(timelineTop + travel);
  await expect(timeline).toHaveAttribute("data-active-index", "3");
  await expect(
    page.getByText("Tehran Azad University · Sep 2021 — Jul 15, 2026"),
  ).toBeVisible();

  const documentOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(documentOverflow).toBe(0);
});

test("keeps the horizontal timeline usable in short viewports", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 600 });
  await page.goto("/");

  const timeline = page.locator(".capability-timeline");
  const viewport = page.locator(".capability-timeline__viewport");
  await expect(timeline).toHaveAttribute("data-motion", "native");
  await expect(page.locator(".capability-timeline__stage")).toHaveCSS(
    "position",
    "relative",
  );
  await expect(viewport).toHaveCSS("overflow-x", "auto");

  await viewport.evaluate((element) => {
    element.scrollTo({ left: element.scrollWidth, behavior: "auto" });
  });
  await expect(timeline).toHaveAttribute("data-active-index", "3");
  await expect(
    page.getByText("Tehran Azad University · Sep 2021 — Jul 15, 2026"),
  ).toBeAttached();
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
