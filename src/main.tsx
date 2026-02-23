import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <App />
    </ThemeProvider>
  </HelmetProvider>
);
