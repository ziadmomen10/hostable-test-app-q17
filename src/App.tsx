import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { GeoLocationProvider } from "@/contexts/GeoLocationContext";
import UserPresenceProvider from "@/components/UserPresenceProvider";
import AdminLayout from "@/components/AdminLayout";
import Index from "./pages/Index";
import AdminE2ETestPage from "./pages/admin/AdminE2ETestPage";

import NotFound from "./pages/NotFound";
import DynamicPage from "./pages/DynamicPage";
import AdminDashboardOverview from "./pages/admin/AdminDashboardOverview";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminCurrenciesPage from "./pages/admin/AdminCurrenciesPage";
import AdminPagesPage from "./pages/admin/AdminPagesPage";
import AdminPageEditor from "./pages/admin/AdminPageEditor";
import AdminPackagesPage from "./pages/admin/AdminPackagesPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminDocumentationPage from "./pages/admin/documentation/AdminDocumentationPage";
import AdminSEOPage from "./pages/admin/AdminSEOPage";
import AdminActivityPage from "./pages/admin/AdminActivityPage";
import AdminRolesPage from "./pages/admin/AdminRolesPage";
import AdminCareersPage from "./pages/admin/AdminCareersPage";

import VpsHostingPage from "./pages/VpsHostingPage";
import JobPostPage from "./pages/JobPostPage";
import DesignV2Page from "./pages/DesignV2Page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <React.StrictMode>
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <I18nProvider>
                <CurrencyProvider>
                  <GeoLocationProvider>
                    <Sonner />
                    <UserPresenceProvider>
                      <BrowserRouter>
                        <Routes>
                      <Route path="/" element={<Index />} />
                      
                      <Route path="/vps-hosting" element={<VpsHostingPage />} />
                      <Route path="/design-v2" element={<DesignV2Page />} />
                      <Route path="/careers/:slug" element={<JobPostPage />} />
                      
                      {/* Direct admin routes without wrapper to prevent navigation interference */}
                      <Route path="/a93jf02kd92ms71x8qp4" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardOverview />} />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="currencies" element={<AdminCurrenciesPage />} />
                        <Route path="pages" element={<AdminPagesPage />} />
                        <Route path="packages" element={<AdminPackagesPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                        <Route path="profile" element={<AdminProfilePage />} />
                        <Route path="pages/edit/:pageId" element={<AdminPageEditor />} />
                        <Route path="seo" element={<AdminSEOPage />} />
                        <Route path="seo/:pageId" element={<AdminSEOPage />} />
                        
                        <Route path="documentation" element={<AdminDocumentationPage />} />
                        <Route path="documentation/:category" element={<AdminDocumentationPage />} />
                        <Route path="documentation/:category/:article" element={<AdminDocumentationPage />} />
                        <Route path="activity" element={<AdminActivityPage />} />
                        <Route path="roles" element={<AdminRolesPage />} />
                        <Route path="careers" element={<AdminCareersPage />} />
                        <Route path="e2e-test" element={<AdminE2ETestPage />} />
                      </Route>
                      
                      <Route path="/404" element={<NotFound />} />
                      {/* Move dynamic page route to end to prevent conflicts */}
                      <Route path="*" element={<DynamicPage />} />
                        </Routes>
                      </BrowserRouter>
                    </UserPresenceProvider>
                  </GeoLocationProvider>
                </CurrencyProvider>
              </I18nProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  </React.StrictMode>
  );
};

export default App;