export const motionTokens = {
  duration: {
    fast: 0.18,
    base: 0.42,
    slow: 0.78,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1] as const,
    exit: [0.7, 0, 0.84, 0] as const,
  },
  stagger: 0.08,
} as const;
