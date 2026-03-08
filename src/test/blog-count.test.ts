import { describe, it, expect } from 'vitest';
import { blogPostsKo, blogPostsEn } from '@/data/blogPosts';
import { blogPostsJa } from '@/data/blogPostsJa';

describe('Blog post count sync', () => {
  it('should have the same number of posts in all languages', () => {
    console.log(`KO: ${blogPostsKo.length}, EN: ${blogPostsEn.length}, JA: ${blogPostsJa.length}`);
    const enIds = new Set(blogPostsEn.map(p => p.id));
    const jaIds = new Set(blogPostsJa.map(p => p.id));
    const koIds = new Set(blogPostsKo.map(p => p.id));
    const missingInEn = blogPostsKo.filter(p => !enIds.has(p.id)).map(p => p.id);
    const missingInJa = blogPostsKo.filter(p => !jaIds.has(p.id)).map(p => p.id);
    console.log('Missing in EN:', missingInEn);
    console.log('Missing in JA:', missingInJa);
    expect(blogPostsKo.length).toBe(blogPostsEn.length);
    expect(blogPostsKo.length).toBe(blogPostsJa.length);
  });
});
