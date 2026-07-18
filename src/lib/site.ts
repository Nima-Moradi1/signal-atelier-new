const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (deploymentHost
    ? deploymentHost.startsWith("http")
      ? deploymentHost
      : `https://${deploymentHost}`
    : "https://nimamoradirad.com");

export const siteUrl = configuredSiteUrl.replace(/\/$/, "");
