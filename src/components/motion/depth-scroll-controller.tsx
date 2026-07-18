"use client";

import { useEffect, useRef } from "react";

const SECTION_SELECTOR = "[data-depth-section]";
const TRANSITION_RANGE = 0.56;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function bellCurve(progress: number) {
  return 4 * progress * (1 - progress);
}

export function DepthScrollController() {
  const portal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(SECTION_SELECTOR),
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    function resetSection(section: HTMLElement) {
      section.dataset.depthPhase = "settled";
      section.style.removeProperty("--depth-opacity");
      section.style.removeProperty("--depth-scale");
      section.style.removeProperty("--depth-z");
      section.style.removeProperty("--depth-y");
      section.style.removeProperty("--depth-rotate-x");
      section.style.removeProperty("--depth-blur");
    }

    function update() {
      animationFrame = 0;

      if (reducedMotion.matches) {
        sections.forEach(resetSection);
        portal.current?.style.setProperty("--depth-portal-strength", "0");
        return;
      }

      const viewportHeight = Math.max(window.innerHeight, 1);
      const travel = viewportHeight * TRANSITION_RANGE;
      let portalStrength = 0;

      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();

        if (bounds.top >= viewportHeight || bounds.bottom <= 0) {
          section.dataset.depthPhase = "dormant";
          return;
        }

        const entrance = clamp((viewportHeight - bounds.top) / travel);
        const exitThreshold = Math.min(viewportHeight, bounds.height);
        const exit = clamp((exitThreshold - bounds.bottom) / travel);
        const entranceDepth = 1 - entrance;
        const opacity = Math.max(0.035, Math.min(entrance, 1 - exit));
        // Keep the perspective treatment inside the section's own geometry.
        // Positive Z and a scale above 1 used to expand an exiting page-shell
        // beyond the viewport, which was especially visible as RTL side drift.
        const scale = 0.96 + entrance * 0.04;
        const translateZ = entranceDepth * -96;
        const translateY = entranceDepth * 24 - exit * 12;
        const rotateX = entranceDepth * 1.4;
        const blur = entranceDepth * 4 + exit * 3;

        section.style.setProperty("--depth-opacity", opacity.toFixed(4));
        section.style.setProperty("--depth-scale", scale.toFixed(4));
        section.style.setProperty("--depth-z", `${translateZ.toFixed(2)}px`);
        section.style.setProperty("--depth-y", `${translateY.toFixed(2)}px`);
        section.style.setProperty(
          "--depth-rotate-x",
          `${rotateX.toFixed(3)}deg`,
        );
        section.style.setProperty("--depth-blur", `${blur.toFixed(2)}px`);

        if (entrance < 0.999) {
          section.dataset.depthPhase = "entering";
        } else if (exit > 0.001) {
          section.dataset.depthPhase = "exiting";
        } else {
          section.dataset.depthPhase = "settled";
        }

        portalStrength = Math.max(
          portalStrength,
          bellCurve(entrance),
          bellCurve(exit),
        );
      });

      portal.current?.style.setProperty(
        "--depth-portal-strength",
        portalStrength.toFixed(4),
      );
    }

    function scheduleUpdate() {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(update);
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    sections.forEach((section) => resizeObserver.observe(section));

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    reducedMotion.addEventListener("change", scheduleUpdate);
    update();

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
      sections.forEach(resetSection);
    };
  }, []);

  return <div ref={portal} className="depth-portal" aria-hidden="true" />;
}
