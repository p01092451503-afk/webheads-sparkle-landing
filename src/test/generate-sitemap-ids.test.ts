import { describe, it } from 'vitest';
import { blogPostsKo } from '@/data/blogPosts';

describe('Extract blog IDs for sitemap', () => {
  it('prints all blog IDs', () => {
    const ids = blogPostsKo.map(p => p.id);
    console.log('BLOG_IDS_START');
    console.log(JSON.stringify(ids));
    console.log('BLOG_IDS_END');
    console.log(`Total: ${ids.length}`);
  });
});
