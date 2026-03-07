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
import LmsPage from "./pages/LmsPage";
import HostingPage from "./pages/HostingPage";
import ChatbotPage from "./pages/ChatbotPage";
import AppDevPage from "./pages/AppDevPage";
import ContentPage from "./pages/ContentPage";
import DrmPage from "./pages/DrmPage";
import ChannelPage from "./pages/ChannelPage";
import PgPage from "./pages/PgPage";
import MaintenancePage from "./pages/MaintenancePage";
import ServiceRequestPage from "./pages/ServiceRequestPage";
import PricingPage from "./pages/PricingPage";
import SmsKakaoPage from "./pages/SmsKakaoPage";

import BlogPage from "./pages/BlogPage";
import EventPage from "./pages/EventPage";
import OverviewPage from "./pages/OverviewPage";
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
              <Route path="/app" element={<AppDevPage />} />
              <Route path="/content" element={<ContentPage />} />
              <Route path="/drm" element={<DrmPage />} />
              <Route path="/channel" element={<ChannelPage />} />
              <Route path="/pg" element={<PgPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/service-request" element={<ServiceRequestPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/sms-kakao" element={<SmsKakaoPage />} />
              
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/event" element={<EventPage />} />
              <Route path="/overview" element={<OverviewPage />} />
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
