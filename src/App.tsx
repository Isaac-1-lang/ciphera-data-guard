import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import  SettingsPage from "@/components/Settings";
import AnalyticsDashboard from "@/components/Analytics";
import HistoryComponent from "./components/History";
import ReportsComponent from "./components/Reports";
import ScanComponent from "./components/Scan";
import AwarenessComponent from "./components/Awareness";
import AlertsComponent from "./components/Alerts";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout onLogout={logout}>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/scan"
            element={
              <DashboardLayout onLogout={logout}>
                <ScanComponent />
              </DashboardLayout>
            }
          />
          <Route
            path="/history"
            element={
              <DashboardLayout onLogout={logout}>
                <HistoryComponent />
              </DashboardLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <DashboardLayout onLogout={logout}>
                <AnalyticsDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <DashboardLayout onLogout={logout}>
                <ReportsComponent />
              </DashboardLayout>
            }
          />
          <Route
            path="/educ"
            element={
              <DashboardLayout onLogout={logout}>
                <AwarenessComponent />
              </DashboardLayout>
            }
          />
          <Route
            path="/alerts"
            element={
              <DashboardLayout onLogout={logout}>
                <AlertsComponent />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout onLogout={logout}>
                <SettingsPage />
              </DashboardLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
};
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};


export default App;
