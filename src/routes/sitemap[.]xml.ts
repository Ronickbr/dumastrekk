import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://dumastrekk.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/destinos", changefreq: "weekly", priority: "0.9" },
          { path: "/calendario", changefreq: "weekly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/produtos", changefreq: "weekly", priority: "0.7" },
          { path: "/sobre", changefreq: "monthly", priority: "0.6" },
          { path: "/sustentabilidade", changefreq: "monthly", priority: "0.6" },
          { path: "/contato", changefreq: "monthly", priority: "0.5" },
        ];

        const [destinos, posts, produtos] = await Promise.all([
          supabase.from("destinos").select("slug, updated_at, created_at"),
          supabase.from("blog_posts").select("slug, created_at").eq("publicado", true),
          supabase.from("produtos").select("slug, created_at").eq("ativo", true),
        ]);

        const dynamicEntries: SitemapEntry[] = [
          ...((destinos.data ?? []) as any[]).map((d) => ({
            path: `/destinos/${d.slug}`,
            lastmod: (d.updated_at ?? d.created_at)?.slice(0, 10),
            changefreq: "monthly" as const,
            priority: "0.8",
          })),
          ...((posts.data ?? []) as any[]).map((p) => ({
            path: `/blog/${p.slug}`,
            lastmod: p.created_at?.slice(0, 10),
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...((produtos.data ?? []) as any[]).map((p) => ({
            path: `/produtos/${p.slug}`,
            lastmod: p.created_at?.slice(0, 10),
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];

        const urls = [...staticEntries, ...dynamicEntries].map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
