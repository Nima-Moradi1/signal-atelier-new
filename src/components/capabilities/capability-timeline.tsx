"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type UIEvent,
} from "react";
import type { CapabilityGroup } from "@/types/portfolio";

type Education = {
  title: string;
  institution: string;
  note: string;
  languages: readonly string[];
};

type CapabilityTimelineProps = {
  groups: readonly CapabilityGroup[];
  education: Education;
};

export function CapabilityTimeline({
  groups,
  education,
}: CapabilityTimelineProps) {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [travel, setTravel] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shortViewport, setShortViewport] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;
  const nativeTimeline = reducedMotion || shortViewport;
  const itemCount = groups.length + 1;
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end end"],
    trackContentSize: true,
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  useLayoutEffect(() => {
    const viewportNode = viewport.current;
    const trackNode = track.current;
    if (!viewportNode || !trackNode) return;

    const measure = () => {
      setTravel(Math.max(trackNode.scrollWidth - viewportNode.clientWidth, 0));
    };

    const observer = new ResizeObserver(measure);
    observer.observe(viewportNode);
    observer.observe(trackNode);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-height: 671px)");
    const update = () => setShortViewport(query.matches);
    query.addEventListener("change", update);
    update();
    return () => query.removeEventListener("change", update);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (nativeTimeline) return;
    const index = Math.min(
      itemCount - 1,
      Math.round(progress * (itemCount - 1)),
    );
    setActiveIndex((current) => (current === index ? current : index));
  });

  function goTo(index: number) {
    const nextIndex = Math.max(0, Math.min(itemCount - 1, index));
    const progress = nextIndex / Math.max(itemCount - 1, 1);

    if (nativeTimeline) {
      viewport.current?.scrollTo({
        left: progress * travel,
        behavior: "auto",
      });
      setActiveIndex(nextIndex);
      return;
    }

    const rootNode = root.current;
    if (!rootNode) return;
    const rootTop = window.scrollY + rootNode.getBoundingClientRect().top;
    const verticalTravel = Math.max(
      rootNode.offsetHeight - window.innerHeight,
      0,
    );
    window.scrollTo({
      top: rootTop + verticalTravel * progress,
      behavior: "smooth",
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(itemCount - 1);
    }
  }

  function handleNativeScroll(event: UIEvent<HTMLDivElement>) {
    if (!nativeTimeline || travel <= 0) return;
    const progress = event.currentTarget.scrollLeft / travel;
    const index = Math.min(
      itemCount - 1,
      Math.round(progress * (itemCount - 1)),
    );
    setActiveIndex((current) => (current === index ? current : index));
  }

  const timelineStyle = {
    "--capability-scroll-height": nativeTimeline
      ? "auto"
      : `calc(100svh + ${travel}px)`,
  } as CSSProperties;

  return (
    <div
      ref={root}
      className="capability-timeline"
      data-motion={nativeTimeline ? "native" : "depth-linked"}
      data-active-index={activeIndex}
      style={timelineStyle}
    >
      <div
        className="capability-timeline__stage"
        role="region"
        aria-label="Horizontal engineering capabilities timeline"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-depth-plane
      >
        <header className="capability-timeline__chrome page-shell">
          <div>
            <span>Horizontal signal path</span>
            <p>Scroll to travel across each engineering discipline.</p>
          </div>
          <div className="capability-timeline__controls">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous capability group"
            >
              <ArrowLeft aria-hidden="true" size={17} />
            </button>
            <p aria-live="polite">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <i aria-hidden="true" />
              <span>{String(itemCount).padStart(2, "0")}</span>
            </p>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === itemCount - 1}
              aria-label="Next capability group"
            >
              <ArrowRight aria-hidden="true" size={17} />
            </button>
          </div>
        </header>

        <div
          ref={viewport}
          className="capability-timeline__viewport"
          onScroll={handleNativeScroll}
        >
          <motion.ol
            ref={track}
            className="capability-timeline__track"
            style={nativeTimeline ? undefined : { x }}
          >
            {groups.map((group, index) => (
              <li key={group.label} className="capability-timeline__item">
                <article className="capability-row capability-timeline__card">
                  <div className="capability-timeline__node" aria-hidden="true">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="capability-timeline__copy">
                    <span>{group.label}</span>
                    <h3>{group.label.split("·").at(-1)?.trim()}</h3>
                    <p>{group.description}</p>
                  </div>
                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}

            <li className="capability-timeline__item">
              <aside className="education-card capability-timeline__education">
                <div className="education-card__signal" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div>
                  <span>Education & languages</span>
                  <h3>{education.title}</h3>
                  <p>{education.institution}</p>
                </div>
                <div className="education-card__details">
                  <p>{education.note}</p>
                  <ul aria-label="Languages">
                    {education.languages.map((language) => (
                      <li key={language}>{language}</li>
                    ))}
                  </ul>
                </div>
              </aside>
            </li>
          </motion.ol>
        </div>

        <nav
          className="capability-timeline__steps"
          aria-label="Capability groups"
        >
          {Array.from({ length: itemCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show ${index === itemCount - 1 ? "education" : `capability group ${index + 1}`}`}
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={() => goTo(index)}
            >
              <span />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
