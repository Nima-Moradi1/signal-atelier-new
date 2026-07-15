"use client";

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type MagneticLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  download?: boolean;
};

export function MagneticLink({
  href,
  children,
  className,
  external = false,
  download = false,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();

  function handlePointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
    ref.current?.style.setProperty("--magnetic-x", `${x}px`);
    ref.current?.style.setProperty("--magnetic-y", `${y}px`);
  }

  function resetPosition() {
    ref.current?.style.setProperty("--magnetic-x", "0px");
    ref.current?.style.setProperty("--magnetic-y", "0px");
  }

  return (
    <motion.a
      ref={ref}
      className={cn("magnetic-link", className)}
      href={href}
      download={download}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      aria-label={
        external ? `${String(children)} (opens in a new tab)` : undefined
      }
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.7} />
    </motion.a>
  );
}
