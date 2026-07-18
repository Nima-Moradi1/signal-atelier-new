type RtlScrollMode = "negative" | "reverse" | "default";

let detectedRtlMode: RtlScrollMode | undefined;

function getRtlScrollMode(): RtlScrollMode {
  if (detectedRtlMode || typeof document === "undefined") {
    return detectedRtlMode ?? "negative";
  }

  const viewport = document.createElement("div");
  const content = document.createElement("div");
  viewport.dir = "rtl";
  viewport.style.cssText =
    "position:absolute;inset-inline-start:-9999px;width:4px;height:1px;overflow:scroll;visibility:hidden";
  content.style.width = "8px";
  content.style.height = "1px";
  viewport.append(content);
  document.body.append(viewport);

  if (viewport.scrollLeft > 0) {
    detectedRtlMode = "default";
  } else {
    viewport.scrollLeft = 1;
    detectedRtlMode = viewport.scrollLeft === 0 ? "negative" : "reverse";
  }

  viewport.remove();
  return detectedRtlMode;
}

function maxScrollLeft(element: HTMLElement): number {
  return Math.max(element.scrollWidth - element.clientWidth, 0);
}

/** Returns a positive offset measured from inline-start in either direction. */
export function getLogicalScrollLeft(
  element: HTMLElement,
  isRtl: boolean,
): number {
  if (!isRtl) return element.scrollLeft;

  switch (getRtlScrollMode()) {
    case "negative":
      return -element.scrollLeft;
    case "reverse":
      return element.scrollLeft;
    case "default":
      return maxScrollLeft(element) - element.scrollLeft;
  }
}

/** Scrolls to a positive offset measured from inline-start in either direction. */
export function scrollToLogicalLeft(
  element: HTMLElement,
  logicalLeft: number,
  behavior: ScrollBehavior = "auto",
) {
  const maximum = maxScrollLeft(element);
  const clamped = Math.max(0, Math.min(maximum, logicalLeft));
  const isRtl = getComputedStyle(element).direction === "rtl";

  if (!isRtl) {
    element.scrollTo({ left: clamped, behavior });
    return;
  }

  const physicalLeft =
    getRtlScrollMode() === "negative"
      ? -clamped
      : getRtlScrollMode() === "reverse"
        ? clamped
        : maximum - clamped;
  element.scrollTo({ left: physicalLeft, behavior });
}
