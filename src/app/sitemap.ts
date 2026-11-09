import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/responsible-gaming"].map((p) => ({ url: `${siteConfig.url}${p}`, lastModified: new Date() }));
}
