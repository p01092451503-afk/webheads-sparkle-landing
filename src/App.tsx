import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import HostingPage from "./pages/HostingPage";
import ChatbotPage from "./pages/ChatbotPage";
import AppDevPage from "./pages/AppDevPage";
import ContentPage from "./pages/ContentPage";
import DrmPage from "./pages/DrmPage";
import ChannelPage from "./pages/ChannelPage";
import PgPage from "./pages/PgPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/hosting" element={<HostingPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/app-dev" element={<AppDevPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/drm" element={<DrmPage />} />
            <Route path="/channel" element={<ChannelPage />} />
            <Route path="/pg" element={<PgPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
