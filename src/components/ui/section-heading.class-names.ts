export const sectionHeadingClassNames = {
  root: "section-heading mb-[clamp(0.75rem,1.5vw,1.5rem)] grid grid-cols-[minmax(12rem,0.62fr)_minmax(0,1.38fr)] gap-[clamp(0.5rem,1.75vw,2rem)] [&>*]:min-w-0 max-[54rem]:grid-cols-1 max-[54rem]:gap-[0.65rem] max-[54rem]:mb-[0.75rem]",
  meta: "section-heading__meta flex items-start  gap-[0.8rem] pt-[0.15rem] font-mono text-[0.66rem] tracking-[0.1em] text-muted-foreground uppercase [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif] [html[lang=fa]_&]:text-[clamp(0.64rem,0.72vw,0.76rem)] [html[lang=fa]_&]:leading-[1.55] [html[lang=fa]_&]:tracking-normal [html[lang=fa]_&]:normal-case",
  index: "text-primary text-lg",
  copy: "section-heading__copy",
  title:
    "max-w-[16ch] text-[clamp(2.35rem,4.15vw,4.8rem)] leading-[0.98] font-[530] tracking-[-0.065em] text-balance max-[38rem]:text-[clamp(2.3rem,11.5vw,3.6rem)] [html[lang=fa]_&]:max-w-[min(100%,18ch)] [html[lang=fa]_&]:text-[clamp(1.65rem,2.91vw,3.36rem)] [html[lang=fa]_&]:leading-[1.16] [html[lang=fa]_&]:tracking-normal [html[lang=fa]_&]:text-start [html[lang=fa]_&]:break-words max-[38rem]:[html[lang=fa]_&]:text-[clamp(1.61rem,8.05vw,2.52rem)]",
  description:
    "mt-[0.25rem] max-w-[41rem] text-base leading-[1.7] text-muted-foreground",
} as const;
