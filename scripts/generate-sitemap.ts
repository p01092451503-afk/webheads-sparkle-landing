/**
 * Vite plugin to auto-generate sitemap.xml from blog post data at build time.
 * Also usable standalone: npx tsx scripts/generate-sitemap.ts
 */
import fs from "fs";
import path from "path";

const BASE_URL = "https://service.webheads.co.kr";

const STATIC_PAGES = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/lms", changefreq: "weekly", priority: "0.9" },
  { loc: "/hosting", changefreq: "monthly", priority: "0.9" },
  { loc: "/maintenance", changefreq: "monthly", priority: "0.9" },
  { loc: "/chatbot", changefreq: "monthly", priority: "0.9" },
  { loc: "/app", changefreq: "monthly", priority: "0.8" },
  { loc: "/content", changefreq: "monthly", priority: "0.8" },
  { loc: "/drm", changefreq: "monthly", priority: "0.7" },
  { loc: "/channel", changefreq: "monthly", priority: "0.7" },
  { loc: "/pg", changefreq: "monthly", priority: "0.7" },
  { loc: "/sms-kakao", changefreq: "monthly", priority: "0.7" },
  { loc: "/pricing", changefreq: "monthly", priority: "0.8" },
  { loc: "/event", changefreq: "weekly", priority: "0.8" },
  { loc: "/service-request", changefreq: "monthly", priority: "0.6" },
  /* /overview is now redirected to / */
  { loc: "/blog", changefreq: "weekly", priority: "0.8" },
  { loc: "/support", changefreq: "monthly", priority: "0.5" },
  { loc: "/lms-development", changefreq: "monthly", priority: "0.9" },
  { loc: "/corporate-lms", changefreq: "monthly", priority: "0.9" },
  { loc: "/elearning-platform-development", changefreq: "monthly", priority: "0.9" },
  { loc: "/employee-training-system", changefreq: "monthly", priority: "0.9" },
  { loc: "/online-education-site", changefreq: "monthly", priority: "0.9" },
  { loc: "/live-class-solution", changefreq: "monthly", priority: "0.9" },
  { loc: "/guides", changefreq: "weekly", priority: "0.8" },
];

export function extractBlogIds(projectRoot: string): string[] {
  const blogDataPath = path.join(projectRoot, "src/data/blogPosts.ts");
  const content = fs.readFileSync(blogDataPath, "utf-8");
  // Extract IDs only from blogPostsKo section
  const koSection = content.split("export const blogPostsEn")[0];
  const idRegex = /id:\s*"([^"]+)"/g;
  const ids: string[] = [];
  let match;
  while ((match = idRegex.exec(koSection)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

export function generateSitemapXml(blogIds: string[]): string {
  const today = new Date().toISOString().split("T")[0];

  const hreflangs = (loc: string) =>
    `    <xhtml:link rel="alternate" hreflang="ko" href="${loc}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`;

  const urls = STATIC_PAGES.map(
    (p) => {
      const loc = `${BASE_URL}${p.loc}`;
      return `  <url>
    <loc>${loc}</loc>
${hreflangs(loc)}
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`;
    }
  );

  for (const id of blogIds) {
    const loc = `${BASE_URL}/blog/${id}`;
    urls.push(`  <url>
    <loc>${loc}</loc>
${hreflangs(loc)}
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

// Vite plugin
export function sitemapPlugin() {
  return {
    name: "generate-sitemap",
    closeBundle() {
      try {
        const root = process.cwd();
        const blogIds = extractBlogIds(root);
        const xml = generateSitemapXml(blogIds);
        const outPath = path.join(root, "dist/sitemap.xml");
        fs.writeFileSync(outPath, xml, "utf-8");
        console.log(`✅ Sitemap: ${STATIC_PAGES.length} pages + ${blogIds.length} blog posts = ${STATIC_PAGES.length + blogIds.length} URLs`);
      } catch (e) {
        console.warn("⚠️ Sitemap generation skipped:", e);
      }
    },
  };
}

// Standalone execution: update public/sitemap.xml directly
if (process.argv[1]?.endsWith('generate-sitemap.ts')) {
  const root = process.cwd();
  const blogIds = extractBlogIds(root);
  const xml = generateSitemapXml(blogIds);
  const publicPath = path.join(root, "public/sitemap.xml");
  fs.writeFileSync(publicPath, xml, "utf-8");
  console.log(`✅ public/sitemap.xml 업데이트: ${STATIC_PAGES.length} pages + ${blogIds.length} blog posts`);
}
