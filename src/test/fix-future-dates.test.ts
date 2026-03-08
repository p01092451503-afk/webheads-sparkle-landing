import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

test('Fix future dates (after 2026-03-09) in blog posts', () => {
  const filePaths = [
    path.resolve(process.cwd(), 'src/data/blogPosts.ts'),
    path.resolve(process.cwd(), 'src/data/blogPostsJa.ts')
  ];

  // We'll map future dates (03-10 ~ 03-30) backwards from 03-08
  // Each unique future date gets mapped to a unique past date, preserving order
  const futureDateRegex = /date:\s*"2026-03-(1[0-9]|2[0-9]|3[0-1])"/g;

  for (const p of filePaths) {
    let text = fs.readFileSync(p, 'utf-8');

    // Collect all unique future dates
    const uniqueDates = new Set<string>();
    let match;
    const regex = /date:\s*"(2026-03-(1[0-9]|2[0-9]|3[0-1]))"/g;
    while ((match = regex.exec(text)) !== null) {
      uniqueDates.add(match[1]);
    }

    // Sort descending (newest future date first)
    const sorted = Array.from(uniqueDates).sort().reverse();
    console.log(`${path.basename(p)}: found ${sorted.length} unique future dates:`, sorted);

    // Map them: newest future date → most recent past date (03-08), next → 03-07, etc.
    const dateMap: Record<string, string> = {};
    sorted.forEach((d, i) => {
      const day = 8 - i; // 03-08, 03-07, 03-06, ...
      // If we run out of March days, go to February
      let newDate: string;
      if (day >= 1) {
        newDate = `2026-03-${String(day).padStart(2, '0')}`;
      } else {
        const febDay = 28 + day; // day is 0 or negative
        newDate = `2026-02-${String(febDay).padStart(2, '0')}`;
      }
      dateMap[d] = newDate;
    });

    console.log('Date mapping:', dateMap);

    // Replace
    for (const [oldDate, newDate] of Object.entries(dateMap)) {
      text = text.replaceAll(`"${oldDate}"`, `"${newDate}"`);
    }

    fs.writeFileSync(p, text, 'utf-8');
    console.log(`Updated ${path.basename(p)}`);
  }
});
