"use client";

import dynamic from "next/dynamic";
import {
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { BookFallback } from "@/components/experience/book-fallback";
import { MobileExperienceReader } from "@/components/experience/mobile-experience-reader";
import { WebGLErrorBoundary } from "@/components/three/webgl-error-boundary";
import { useWebGLSupport } from "@/hooks/use-webgl-support";
import { useCompactViewport } from "@/hooks/use-compact-viewport";
import type { ExperienceItem } from "@/types/portfolio";

const ExperienceBookScene = dynamic(
  () =>
    import("@/components/experience/experience-book-scene").then(
      (module) => module.ExperienceBookScene,
    ),
  { ssr: false, loading: () => <BookFallback /> },
);

type ExperienceBookProps = {
  experiences: readonly ExperienceItem[];
};

function ExperienceListFallback({ experiences }: ExperienceBookProps) {
  return (
    <div className="experience-fallback page-shell">
      <div className="experience-fallback__heading">
        <span>02 · Professional trajectory</span>
        <h2 id="experience-title">A career path written in four chapters.</h2>
        <p>
          The 3D reader is replaced with a motion-safe edition on this device.
        </p>
      </div>
      <ol>
        {experiences.map((experience, index) => (
          <li key={`${experience.company}-${experience.period}`}>
            <article>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{experience.period}</p>
              <h3>{experience.role}</h3>
              <strong>{experience.company}</strong>
              <p>{experience.summary}</p>
              <ul>
                {experience.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ExperienceBook({ experiences }: ExperienceBookProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const compactViewport = useCompactViewport();
  const webGLSupported = useWebGLSupport();

  if (compactViewport) {
    return <MobileExperienceReader experiences={experiences} />;
  }

  if (webGLSupported === false || reducedMotion) {
    return <ExperienceListFallback experiences={experiences} />;
  }

  return (
    <DesktopExperienceBook
      experiences={experiences}
      reducedMotion={reducedMotion}
      webGLSupported={webGLSupported}
    />
  );
}

type DesktopExperienceBookProps = ExperienceBookProps & {
  reducedMotion: boolean;
  webGLSupported: boolean | null;
};

function DesktopExperienceBook({
  experiences,
  reducedMotion,
  webGLSupported,
}: DesktopExperienceBookProps) {
  const root = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activePage, setActivePage] = useState(0);
  const isInView = useInView(root, { margin: "15% 0px" });
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    progressRef.current = progress;
    const page = Math.min(
      experiences.length - 1,
      Math.round(progress * Math.max(experiences.length - 1, 1)),
    );
    setActivePage((currentPage) => (currentPage === page ? currentPage : page));
  });

  function goToPage(page: number) {
    const node = root.current;
    if (!node) return;
    const nextPage = Math.max(0, Math.min(experiences.length - 1, page));
    const rootTop = window.scrollY + node.getBoundingClientRect().top;
    const travel = Math.max(node.offsetHeight - window.innerHeight, 0);
    const progress = nextPage / Math.max(experiences.length - 1, 1);
    window.scrollTo({
      top: rootTop + travel * progress,
      behavior: "auto",
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      goToPage(activePage + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      goToPage(activePage - 1);
    }
  }

  const activeExperience = experiences[activePage];
  const readerStyle = {
    "--book-scroll-height": `${experiences.length * 32}svh`,
  } as CSSProperties;

  return (
    <div
      ref={root}
      className="experience-book"
      style={readerStyle}
      onKeyDown={handleKeyDown}
    >
      <div
        className="experience-book__stage"
        role="region"
        aria-label="Scroll-controlled experience book"
        tabIndex={0}
        data-depth-plane
      >
        <header className="experience-book__heading page-shell">
          <p>
            <span>02</span>
            Professional trajectory
          </p>
          <h2 id="experience-title">A career, bound in chapters.</h2>
          <p>
            Scroll to turn the pages. Use arrow keys when the reader is focused.
          </p>
        </header>

        <div className="experience-book__scene" aria-hidden="true">
          <WebGLErrorBoundary fallback={<BookFallback />}>
            {webGLSupported === null ? (
              <BookFallback />
            ) : (
              <ExperienceBookScene
                active={isInView}
                pageCount={experiences.length}
                progressRef={progressRef}
                reducedMotion={reducedMotion}
                theme={theme}
              />
            )}
          </WebGLErrorBoundary>
        </div>

        <article
          className="experience-book__page-copy"
          key={`${activeExperience.company}-${activeExperience.period}`}
          aria-hidden="true"
        >
          <div className="experience-book__page experience-book__page--left">
            <div className="experience-book__folio">
              <span>{String(activePage + 1).padStart(2, "0")}</span>
              <span>{activeExperience.period}</span>
            </div>
            <p className="experience-book__company">
              {activeExperience.company}
            </p>
            <h3>{activeExperience.role}</h3>
            <p className="experience-book__summary">
              {activeExperience.summary}
            </p>
            <div className="experience-book__tags">
              {activeExperience.technologies.slice(0, 5).map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          </div>
          <div className="experience-book__page experience-book__page--right">
            <div className="experience-book__chapter-label">
              <span>Selected signals</span>
              <span>Chapter {String(activePage + 1).padStart(2, "0")}</span>
            </div>
            <ul>
              {activeExperience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </article>

        <div className="experience-book__navigation page-shell">
          <div className="experience-book__instruction" aria-hidden="true">
            <ArrowDown size={15} />
            Scroll to turn
          </div>
          <div className="experience-book__pager">
            <button
              type="button"
              onClick={() => goToPage(activePage - 1)}
              disabled={activePage === 0}
              aria-label="Previous experience"
            >
              <ArrowLeft aria-hidden="true" size={17} />
            </button>
            <p aria-live="polite">
              <span>{String(activePage + 1).padStart(2, "0")}</span>
              <i aria-hidden="true" />
              <span>{String(experiences.length).padStart(2, "0")}</span>
            </p>
            <button
              type="button"
              onClick={() => goToPage(activePage + 1)}
              disabled={activePage === experiences.length - 1}
              aria-label="Next experience"
            >
              <ArrowRight aria-hidden="true" size={17} />
            </button>
          </div>
        </div>

        <ol className="sr-only">
          {experiences.map((experience) => (
            <li key={`${experience.company}-${experience.period}`}>
              <article>
                <p>{experience.period}</p>
                <h3>{experience.role}</h3>
                <p>{experience.company}</p>
                <p>{experience.summary}</p>
                <ul>
                  {experience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
