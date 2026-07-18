import englishPortfolio from "@/messages/en/portfolio.json";
import type { PortfolioContent } from "@/types/portfolio";

const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "nimamoradirad@gmail.com";

export function materializePortfolio(
  localizedContent: PortfolioContent,
): PortfolioContent {
  return {
    ...localizedContent,
    identity: {
      ...localizedContent.identity,
      email: contactEmail,
    },
  };
}

/** English remains the compatibility default for non-localized server code/tests. */
export const portfolio = materializePortfolio(
  englishPortfolio as PortfolioContent,
);

export type { PortfolioContent } from "@/types/portfolio";
