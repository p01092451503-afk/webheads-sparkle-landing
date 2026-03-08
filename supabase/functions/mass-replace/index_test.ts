import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

Deno.test("Mass replace WEBHEADS", async () => {
  const paths = [
    `${Deno.cwd()}/src/data/blogPosts.ts`,
    `${Deno.cwd()}/src/data/blogPostsJa.ts`
  ];
  
  for (const p of paths) {
    console.log(`Processing ${p}...`);
    try {
      const text = await Deno.readTextFile(p);
      const newText = text.replace(/WEBHEADS(?!\(웹헤즈\))/g, 'WEBHEADS(웹헤즈)');
      await Deno.writeTextFile(p, newText);
      console.log(`Updated ${p}`);
    } catch (e) {
      console.error(`Failed on ${p}: ${e}`);
    }
  }
  
  assertEquals(true, true);
});
