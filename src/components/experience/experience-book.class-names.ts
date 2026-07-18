export const experienceBookClassNames = {
  fallbackRoot:
    "experience-fallback page-shell mx-auto w-full max-w-[var(--content-width)] px-[var(--gutter)] py-[clamp(1.75rem,3vw,3rem)]",
  fallbackHeading: "experience-fallback__heading mb-4 max-w-[55rem]",
  fallbackEyebrow:
    "font-mono text-[0.62rem] tracking-[0.08em] text-primary uppercase [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif] [html[lang=fa]_&]:text-[clamp(0.64rem,0.72vw,0.76rem)] [html[lang=fa]_&]:leading-[1.55] [html[lang=fa]_&]:tracking-normal [html[lang=fa]_&]:normal-case",
  fallbackTitle:
    "mt-[0.3rem] text-[clamp(3rem,7vw,6.5rem)] leading-[0.95] font-[520] tracking-[-0.06em] [html[lang=fa]_&]:max-w-[min(100%,16ch)] [html[lang=fa]_&]:break-words [html[lang=fa]_&]:text-[clamp(2.1rem,4.9vw,4.55rem)] [html[lang=fa]_&]:leading-[1.12] [html[lang=fa]_&]:tracking-normal [html[lang=fa]_&]:text-balance",
  fallbackDescription: "mt-[0.3rem] max-w-[36rem] text-muted-foreground",
  fallbackList:
    "grid list-none grid-cols-2 border-t border-s border-border max-[54rem]:grid-cols-1",
  fallbackItem: "border-e border-b border-border",
  fallbackArticle:
    "h-full min-h-[28rem] p-[clamp(1.5rem,3vw,2.6rem)] [html[lang=de]_&]:hyphens-auto [html[lang=de]_&]:[overflow-wrap:anywhere]",
  fallbackIndex:
    "font-mono text-[0.58rem] text-primary [unicode-bidi:plaintext] [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif]",
  fallbackPeriod:
    "mt-[0.4rem] font-mono text-[0.58rem] text-primary [unicode-bidi:plaintext] [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif]",
  fallbackRole:
    "mt-[0.4rem] text-[clamp(1.8rem,3vw,3rem)] leading-none font-[520] tracking-[-0.05em] [html[lang=fa]_&]:max-w-full [html[lang=fa]_&]:break-words [html[lang=fa]_&]:text-[clamp(1.26rem,2.1vw,2.1rem)] [html[lang=fa]_&]:leading-[1.25] [html[lang=fa]_&]:tracking-normal",
  fallbackCompany:
    "mt-[0.4rem] block text-[0.82rem] text-[var(--muted-bright)]",
  fallbackSummary:
    "mt-[0.4rem] text-[0.86rem] leading-[1.65] text-muted-foreground",
  fallbackHighlights:
    "mt-[0.4rem] grid gap-[0.6rem] ps-4 text-[0.78rem] text-muted-foreground",
  root: "experience-book relative h-[var(--book-scroll-height)] min-h-svh",
  stage:
    "experience-book__stage sticky top-0 isolate h-svh min-h-[42rem] overflow-clip [--book-copy-width:min(50vw,47rem)] [--book-scene-left:clamp(21rem,29vw,28rem)] [--experience-book-page-edge:var(--gutter)] focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-primary max-[72rem]:[--book-copy-width:min(53vw,40rem)] max-[72rem]:[--book-scene-left:clamp(18rem,31vw,22rem)] max-[54rem]:min-h-[45rem] max-[54rem]:[--book-copy-width:min(86vw,42rem)] max-[54rem]:[--book-mobile-scene-height:clamp(18.5rem,44svh,25rem)] max-[54rem]:[--book-mobile-scene-top:clamp(15.75rem,33vw,17rem)] max-[54rem]:[--book-scene-left:0rem] max-[38rem]:[--book-mobile-scene-height:clamp(18rem,42svh,22rem)] max-[38rem]:[--book-mobile-scene-top:16rem] min-[72.01rem]:[--book-copy-width:clamp(39rem,44vw,50rem)] min-[72.01rem]:[--book-scene-left:var(--experience-book-heading-width)] min-[72.01rem]:[--experience-book-content-top:calc(var(--header-height)+0.55rem)] min-[72.01rem]:[--experience-book-heading-copy-width:clamp(17rem,20vw,22rem)] min-[72.01rem]:[--experience-book-heading-width:clamp(18rem,31vw,28rem)] min-[92.01rem]:[--experience-book-page-edge:calc((100vw-var(--content-width))/2+var(--gutter))]",
  heading:
    "experience-book__heading page-shell pointer-events-none absolute inset-x-0 top-[calc(var(--header-height)+0.55rem)] z-4 mx-auto w-full max-w-[var(--content-width)] px-[var(--gutter)] min-[72.01rem]:inset-e-auto min-[72.01rem]:start-[var(--experience-book-page-edge)] min-[72.01rem]:m-0 min-[72.01rem]:h-fit min-[72.01rem]:w-[var(--experience-book-heading-copy-width)] min-[72.01rem]:max-w-none min-[72.01rem]:py-0 min-[72.01rem]:ps-0 min-[72.01rem]:pe-[clamp(0.5rem,1vw,1rem)] min-[72.01rem]:top-[var(--experience-book-content-top)]",
  headingEyebrow:
    "flex items-center gap-3 font-mono text-[0.62rem] tracking-[0.1em] text-primary uppercase [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif] [html[lang=fa]_&]:text-[clamp(0.64rem,0.72vw,0.76rem)] [html[lang=fa]_&]:leading-[1.55] [html[lang=fa]_&]:tracking-normal [html[lang=fa]_&]:normal-case",
  headingIndex:
    "grid size-8 shrink-0 place-items-center rounded-full border border-line-strong",
  headingTitle:
    "mt-1 max-w-[7ch] text-[clamp(2.25rem,3.9vw,4.65rem)] leading-[0.92] font-[520] tracking-[-0.065em] text-balance max-[72rem]:text-[clamp(2.3rem,4vw,4rem)] max-[54rem]:max-w-[11ch] max-[54rem]:text-[clamp(2.35rem,8vw,4rem)] max-[38rem]:text-[clamp(2rem,9vw,2.8rem)] [html[lang=fa]_&]:max-w-[min(100%,16ch)] [html[lang=fa]_&]:break-words [html[lang=fa]_&]:text-[clamp(1.58rem,2.73vw,3.26rem)] [html[lang=fa]_&]:leading-[1.12] [html[lang=fa]_&]:tracking-normal",
  headingDescription:
    "mt-1 max-w-80 text-[0.78rem] leading-[1.6] text-muted-foreground max-[54rem]:hidden",
  scene:
    "experience-book__scene absolute top-[clamp(4.5rem,8vh,6rem)] end-0 bottom-[clamp(3rem,6vh,5rem)] start-[var(--book-scene-left)] z-1 overflow-hidden max-[54rem]:inset-x-[clamp(0.75rem,3vw,1.2rem)] max-[54rem]:top-[var(--book-mobile-scene-top)] max-[54rem]:bottom-auto max-[54rem]:h-[var(--book-mobile-scene-height)] min-[72.01rem]:top-[var(--experience-book-content-top)] min-[72.01rem]:end-0 min-[72.01rem]:bottom-[calc(var(--header-height)+1rem)] min-[72.01rem]:start-[var(--experience-book-heading-width)] min-[72.01rem]:m-0 min-[72.01rem]:transform-none min-[72.01rem]:p-0",
  pageCopy:
    "experience-book__page-copy pointer-events-none absolute z-3 grid aspect-[1.4] w-[var(--book-copy-width)] grid-cols-2 overflow-hidden rounded-[0.45rem] text-book-ink [contain:layout_paint]",
  page: "experience-book__page min-w-0 overflow-hidden [overflow-wrap:anywhere] [html[lang=de]_&]:hyphens-auto",
  summaryPage:
    "experience-book__page--left experience-book__page--summary [padding-block:clamp(1.45rem,2.5vw,2.4rem)_clamp(1.35rem,2.3vw,2.2rem)] [padding-inline:clamp(1.7rem,2.8vw,2.7rem)_clamp(1.35rem,2.25vw,2.25rem)] max-[54rem]:[padding-block:clamp(0.9rem,3.3vw,1.4rem)_clamp(0.75rem,2.8vw,1.2rem)] max-[54rem]:[padding-inline:clamp(1rem,3.8vw,1.55rem)_clamp(0.65rem,2.7vw,1.1rem)] min-[72.01rem]:[padding-block:clamp(1.25rem,1.7vw,1.75rem)] min-[72.01rem]:[padding-inline:clamp(1.35rem,2vw,2rem)_clamp(1rem,1.45vw,1.45rem)]",
  highlightsPage:
    "experience-book__page--right experience-book__page--highlights [padding-block:clamp(1.45rem,2.5vw,2.4rem)_clamp(1.35rem,2.3vw,2.2rem)] [padding-inline:clamp(1.55rem,2.45vw,2.35rem)_clamp(1.7rem,2.8vw,2.7rem)] max-[54rem]:[padding-block:clamp(0.85rem,3.1vw,1.3rem)_clamp(0.5rem,1.9vw,0.9rem)] max-[54rem]:[padding-inline:clamp(0.65rem,2.7vw,1.1rem)_clamp(1rem,3.8vw,1.55rem)] min-[72.01rem]:[padding-block:clamp(1.25rem,1.7vw,1.75rem)] min-[72.01rem]:[padding-inline:clamp(1rem,1.45vw,1.45rem)_clamp(1.35rem,2vw,2rem)]",
  folio:
    "experience-book__folio flex items-center justify-between gap-4 border-b border-book-rule pb-3 font-mono text-[clamp(0.55rem,0.55vw,0.64rem)] tracking-[0.06em] text-book-muted uppercase max-[54rem]:gap-[0.35rem] max-[54rem]:pb-[clamp(0.35rem,1.4vw,0.65rem)] max-[54rem]:text-[clamp(0.48rem,1.55vw,0.6rem)] max-[54rem]:tracking-[0.035em] [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif] [html[lang=fa]_&]:text-[clamp(0.64rem,0.72vw,0.76rem)] [html[lang=fa]_&]:leading-[1.55] [html[lang=fa]_&]:tracking-normal [html[lang=fa]_&]:normal-case",
  folioToken: "min-w-0 [unicode-bidi:plaintext]",
  folioPeriod: "min-w-0 text-end [unicode-bidi:plaintext]",
  company:
    "experience-book__company mt-[clamp(0.8rem,1.4vh,1.2rem)] font-mono text-[clamp(0.5rem,0.65vw,0.68rem)] tracking-[0.07em] text-book-accent uppercase max-[54rem]:mt-[clamp(0.4rem,1.5vw,0.7rem)] max-[54rem]:text-[clamp(0.52rem,1.72vw,0.64rem)] [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif] [html[lang=fa]_&]:text-[clamp(0.64rem,0.72vw,0.76rem)] [html[lang=fa]_&]:leading-[1.55] [html[lang=fa]_&]:tracking-normal [html[lang=fa]_&]:normal-case",
  pageTitle:
    "mt-[0.55rem] max-w-[13ch] [font-family:Georgia,'Times_New_Roman',serif] text-[clamp(1.3rem,2.15vw,2.35rem)] leading-none font-medium tracking-[-0.045em] max-[54rem]:mt-[clamp(0.3rem,1.4vw,0.55rem)] max-[54rem]:text-[clamp(1.03rem,4.15vw,1.85rem)] [html[lang=fa]_&]:max-w-full [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif] [html[lang=fa]_&]:text-[clamp(1rem,1.51vw,1.65rem)] [html[lang=fa]_&]:leading-[1.25] [html[lang=fa]_&]:tracking-normal",
  summary:
    "experience-book__summary mt-[clamp(0.75rem,1.4vh,1.2rem)] text-[clamp(0.76rem,0.74vw,0.86rem)] leading-[1.55] text-book-muted max-[54rem]:mt-[clamp(0.4rem,1.6vw,0.75rem)] max-[54rem]:text-[clamp(0.64rem,2.05vw,0.78rem)] max-[54rem]:leading-[1.42] max-[54rem]:text-[color-mix(in_srgb,var(--book-ink)_78%,var(--book-muted))] [html[lang=fa]_&]:leading-[1.65]",
  tags: "experience-book__tags mt-[clamp(0.75rem,1.5vh,1.2rem)] flex flex-wrap gap-[0.32rem] max-[54rem]:mt-[clamp(0.4rem,1.5vw,0.7rem)] max-[54rem]:gap-[0.2rem]",
  tag: "shrink overflow-visible whitespace-normal border-book-rule bg-transparent px-[0.42rem] py-[0.27rem] font-mono text-[clamp(0.5rem,0.48vw,0.56rem)] font-normal text-book-muted transition-none [unicode-bidi:plaintext] max-[54rem]:px-[0.28rem] max-[54rem]:py-[0.16rem] max-[54rem]:text-[clamp(0.43rem,1.38vw,0.52rem)] [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif]",
  chapterLabel:
    "experience-book__chapter-label flex items-center justify-between gap-3 border-b border-book-rule pb-3 font-mono text-[clamp(0.55rem,0.53vw,0.62rem)] tracking-[0.065em] text-book-accent uppercase max-[54rem]:gap-[0.35rem] max-[54rem]:pb-[clamp(0.35rem,1.4vw,0.65rem)] max-[54rem]:text-[clamp(0.48rem,1.55vw,0.6rem)] max-[54rem]:tracking-[0.035em] [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif] [html[lang=fa]_&]:text-[clamp(0.64rem,0.72vw,0.76rem)] [html[lang=fa]_&]:leading-[1.55] [html[lang=fa]_&]:tracking-normal [html[lang=fa]_&]:normal-case",
  chapterTitle: "min-w-0",
  chapterNumber: "min-w-0 text-end text-book-muted max-[38rem]:hidden",
  highlights:
    "mt-[clamp(0.9rem,1.7vh,1.35rem)] grid list-none gap-[clamp(0.35rem,0.7vh,0.65rem)] max-[54rem]:mt-[clamp(0.42rem,1.65vw,0.72rem)] max-[54rem]:gap-[clamp(0.22rem,1vw,0.44rem)]",
  highlight:
    "relative ps-[0.9rem] text-[clamp(0.72rem,0.66vw,0.8rem)] leading-[1.5] text-book-muted max-[54rem]:ps-[clamp(0.55rem,2vw,0.8rem)] max-[54rem]:text-[clamp(0.6rem,1.95vw,0.73rem)] max-[54rem]:leading-[1.38] max-[54rem]:text-[color-mix(in_srgb,var(--book-ink)_78%,var(--book-muted))] [html[lang=fa]_&]:leading-[1.65]",
  navigation:
    "experience-book__navigation page-shell pointer-events-none absolute inset-x-0 bottom-[calc(var(--header-height)+2.5rem)] z-5 mx-auto flex w-full max-w-[var(--content-width)] items-center justify-between px-[var(--gutter)]",
  instruction:
    "experience-book__instruction flex items-center gap-[0.65rem] font-mono text-[0.58rem] tracking-[0.08em] text-muted-foreground uppercase max-[54rem]:hidden [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif] [html[lang=fa]_&]:text-[clamp(0.64rem,0.72vw,0.76rem)] [html[lang=fa]_&]:leading-[1.55] [html[lang=fa]_&]:tracking-normal [html[lang=fa]_&]:normal-case",
  pager:
    "pointer-events-auto me-[clamp(12.5rem,15vw,15rem)] flex items-center gap-[0.7rem] rounded-full border border-border bg-floating-surface p-[0.4rem] shadow-soft backdrop-blur-[14px] max-[54rem]:ms-0 max-[54rem]:me-auto",
  pagerButton:
    "size-10 cursor-pointer rounded-full border-border bg-transparent p-0 text-foreground transition-[border-color,background-color,opacity] duration-[var(--duration-fast)] hover:border-primary hover:bg-accent disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-[0.28] motion-reduce:transition-none",
  pagerCounter:
    "flex items-center gap-[0.55rem] font-mono text-[0.58rem] text-muted-foreground [html[lang=fa]_&]:font-[var(--font-vazirmatn),Tahoma,Arial,sans-serif]",
  pagerActive: "text-primary",
  pagerRule: "h-px w-[1.7rem] bg-line-strong",
  visuallyHidden: "sr-only",
} as const;
