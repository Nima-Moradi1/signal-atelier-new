export const localeSwitcherClassNames = {
  trigger:
    "group locale-switcher inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-[color-mix(in_srgb,var(--floating-surface)_88%,transparent)] px-2.5 text-[var(--muted-bright)] shadow-[inset_0_1px_color-mix(in_srgb,var(--paper)_7%,transparent)] backdrop-blur-[12px] transition-[border-color,background-color] duration-150 hover:border-line-strong hover:bg-floating-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[state=open]:border-primary/55 data-[state=open]:bg-floating-surface motion-reduce:transition-none",
  icon: "size-3.5 text-muted-foreground group-data-[state=open]:text-primary",
  activeMark:
    "min-w-[1.25rem] text-center font-mono text-[0.58rem] font-[700] tracking-[0.04em] [direction:ltr] [unicode-bidi:isolate]",
  chevron:
    "locale-switcher__chevron size-3 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none",
  content:
    "z-[160] min-w-[11rem] origin-[var(--radix-dropdown-menu-content-transform-origin)] overflow-hidden rounded-xl border border-line-strong bg-[color-mix(in_srgb,var(--floating-surface)_96%,transparent)] p-1.5 shadow-[0_1rem_3rem_rgb(0_0_0/30%),inset_0_1px_color-mix(in_srgb,var(--paper)_7%,transparent)] backdrop-blur-[18px] transition-[opacity,transform] duration-150 data-[state=closed]:scale-[0.96] data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 motion-reduce:transition-none",
  label:
    "px-2.5 pt-1 pb-1.5 font-mono text-[0.52rem] tracking-[0.1em] text-muted-foreground uppercase",
  option:
    "group/option flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-[var(--muted-bright)] outline-none transition-colors duration-100 hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground aria-[current=page]:text-foreground motion-reduce:transition-none",
  optionMark:
    "grid size-7 shrink-0 place-items-center rounded-md border border-border bg-background font-mono text-[0.54rem] font-[700] tracking-[0.03em] text-muted-foreground [direction:ltr] [unicode-bidi:isolate] group-aria-[current=page]/option:border-primary/50 group-aria-[current=page]/option:bg-primary group-aria-[current=page]/option:text-primary-foreground",
  optionName: "min-w-0 flex-1 text-start text-[0.78rem] font-[520]",
  check: "shrink-0 text-primary opacity-0 data-[active=true]:opacity-100",
} as const;
