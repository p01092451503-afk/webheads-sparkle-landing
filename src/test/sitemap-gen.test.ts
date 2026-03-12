import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { extractBlogIds, generateSitemapXml } from "../../scripts/generate-sitemap";

describe("sitemap generation", () => {
  it("should generate sitemap with blog posts and write to public/sitemap.xml", () => {
    const root = process.cwd();
    const blogIds = extractBlogIds(root);
    
    console.log(`Found ${blogIds.length} blog post IDs`);
    expect(blogIds.length).toBeGreaterThan(0);
    
    const xml = generateSitemapXml(blogIds);
    
    // Write to public/sitemap.xml
    const publicPath = path.join(root, "public/sitemap.xml");
    fs.writeFileSync(publicPath, xml, "utf-8");
    
    // Verify it contains blog posts
    expect(xml).toContain("/blog/channel-talk-lms-integration-cs-response-time-80-reduction");
    expect(xml).toContain("/blog/");
    
    console.log(`✅ Sitemap written with blog posts`);
  });
});
