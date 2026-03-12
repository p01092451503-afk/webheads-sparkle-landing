import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";

const PuppeteerRenderer = vitePrerender.PuppeteerRenderer;

const prerenderRoutes = [
  '/', '/lms', '/hosting', '/chatbot', '/app', '/content',
  '/drm', '/channel', '/pg', '/maintenance', '/pricing',
  '/sms-kakao', '/blog', '/event', '/overview', '/guides',
  '/lms-development', '/corporate-lms', '/elearning-platform-development',
  '/employee-training-system', '/online-education-site', '/live-class-solution'
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && vitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: prerenderRoutes,
      renderer: new PuppeteerRenderer({
        renderAfterDocumentEvent: 'render-event',
        timeout: 5000,
      }),
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
