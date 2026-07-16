"use client";

import dynamic from "next/dynamic";
import { FileText, LampDesk, Move3d } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { DeskFallback } from "@/components/three/desk-fallback";
import { WebGLErrorBoundary } from "@/components/three/webgl-error-boundary";
import { useTheme } from "@/components/theme/theme-provider";
import { ResumeDialog } from "@/components/ui/resume-dialog";
import { portfolio } from "@/content/portfolio";
import { useWebGLSupport } from "@/hooks/use-webgl-support";

const DeskScene = dynamic(
  () =>
    import("@/components/three/desk-scene").then((module) => module.DeskScene),
  { ssr: false, loading: () => <DeskFallback /> },
);

export function HeroStudio() {
  const runtime = useRef<HTMLDivElement>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const webGLSupported = useWebGLSupport();
  const reducedMotion = useReducedMotion() ?? false;
  const active = useInView(runtime, { margin: "20% 0px" });
  const { isDark, theme, toggleTheme } = useTheme();

  const lampLabel = isDark
    ? "Switch the desk lamp off and use light mode"
    : "Switch the desk lamp on and use dark mode";

  return (
    <div
      ref={runtime}
      className="hero-studio"
      role="region"
      aria-label="Interactive 3D developer workstation"
    >
      <div className="hero-studio__viewport">
        <WebGLErrorBoundary fallback={<DeskFallback />}>
          {webGLSupported === false || webGLSupported === null ? (
            <DeskFallback />
          ) : (
            <DeskScene
              active={active}
              reducedMotion={reducedMotion}
              theme={theme}
              onOpenResume={() => setResumeOpen(true)}
              onToggleTheme={toggleTheme}
            />
          )}
        </WebGLErrorBoundary>

        <div className="hero-studio__status" aria-hidden="true">
          <span>app/dashboard.tsx</span>
          <span data-code-loop="active">Typing React</span>
        </div>
      </div>

      <div className="hero-studio__toolbar">
        <p>
          <Move3d aria-hidden="true" size={16} />
          Drag sideways to inspect the studio
        </p>
        <div>
          <button type="button" onClick={() => setResumeOpen(true)}>
            <FileText aria-hidden="true" size={16} />
            Raise résumé
          </button>
          <button type="button" onClick={toggleTheme} aria-label={lampLabel}>
            <LampDesk aria-hidden="true" size={16} />
            Pull desk lamp
          </button>
        </div>
      </div>

      <ResumeDialog
        open={resumeOpen}
        resumeUrl={portfolio.identity.resumeUrl}
        onClose={() => setResumeOpen(false)}
      />
    </div>
  );
}
