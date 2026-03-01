import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import FloatingNav from "./components/FloatingNav";


import PageTracker from "./components/PageTracker";

const LmsPage = lazy(() => import("./pages/LmsPage"));
const HostingPage = lazy(() => import("./pages/HostingPage"));
const ChatbotPage = lazy(() => import("./pages/ChatbotPage"));
const AppDevPage = lazy(() => import("./pages/AppDevPage"));
const ContentPage = lazy(() => import("./pages/ContentPage"));
const DrmPage = lazy(() => import("./pages/DrmPage"));
const ChannelPage = lazy(() => import("./pages/ChannelPage"));
const PgPage = lazy(() => import("./pages/PgPage"));
const MaintenancePage = lazy(() => import("./pages/MaintenancePage"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  
  return (
    <>
      {!isAdmin && <Header />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingNav />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PageTracker />
        <Layout>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/" element={<LmsPage />} />
              <Route path="/lms" element={<LmsPage />} />
              <Route path="/hosting" element={<HostingPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/app-dev" element={<AppDevPage />} />
              <Route path="/content" element={<ContentPage />} />
              <Route path="/drm" element={<DrmPage />} />
              <Route path="/channel" element={<ChannelPage />} />
              <Route path="/pg" element={<PgPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* <Route path="/about" element={<AboutPage />} /> */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
