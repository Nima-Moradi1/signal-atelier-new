import { useMessages } from "next-intl";
import { materializePortfolio } from "./portfolio";
import type { PortfolioContent } from "@/types/portfolio";

export function usePortfolio(): PortfolioContent {
  const messages = useMessages();
  return materializePortfolio(messages.Portfolio as PortfolioContent);
}
