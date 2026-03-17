import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://liberelo.com"
  const routes = [
    "",
    "/about",
    "/how-it-works",
    "/pricing",
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
    "/agreement",
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }))
}
