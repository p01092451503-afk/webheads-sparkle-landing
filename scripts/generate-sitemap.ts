/**
 * Sitemap Generator Script
 * Run: npx tsx scripts/generate-sitemap.ts
 * Generates public/sitemap.xml with all blog post URLs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Dynamically import blog posts
async function main() {
  const blogDataPath = path.join(ROOT, "src/data/blogPosts.ts");
  const content = fs.readFileSync(blogDataPath, "utf-8");

  // Extract all IDs from blogPostsKo array (between "export const blogPostsKo" and "export const blogPostsEn")
  const koSection = content.split("export const blogPostsEn")[0];
  const idRegex = /id:\s*"([^"]+)"/g;
  const blogIds: string[] = [];
  let match;
  while ((match = idRegex.exec(koSection)) !== null) {
    blogIds.push(match[1]);
  }

  const BASE_URL = "https://service.webheads.co.kr";
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    { loc: "/", changefreq: "weekly", priority: "1.0" },
    { loc: "/lms", changefreq: "weekly", priority: "1.0" },
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
    { loc: "/overview", changefreq: "monthly", priority: "0.6" },
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

  const urls = staticPages.map(
    (p) => `  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  );

  // Add blog post URLs
  for (const id of blogIds) {
    urls.push(`  <url>
    <loc>${BASE_URL}/blog/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  const outPath = path.join(ROOT, "public/sitemap.xml");
  fs.writeFileSync(outPath, sitemap, "utf-8");
  console.log(`✅ Sitemap generated: ${blogIds.length} blog posts + ${staticPages.length} static pages = ${urls.length} total URLs`);
}

main().catch(console.error);
