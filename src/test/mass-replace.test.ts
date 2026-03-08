import { test } from 'vitest';
import fs from 'fs';
import path from 'path';

test('Mass replace WEBHEADS', () => {
  const filePaths = [
    path.resolve(process.cwd(), 'src/data/blogPosts.ts'),
    path.resolve(process.cwd(), 'src/data/blogPostsJa.ts')
  ];
  
  for (const p of filePaths) {
    try {
      const text = fs.readFileSync(p, 'utf-8');
      const newText = text.replace(/WEBHEADS(?!\(웹헤즈\))/g, 'WEBHEADS(웹헤즈)');
      fs.writeFileSync(p, newText, 'utf-8');
      console.log(`Updated ${p}`);
    } catch (e) {
      console.error(`Failed on ${p}:`, e);
    }
  }
});
