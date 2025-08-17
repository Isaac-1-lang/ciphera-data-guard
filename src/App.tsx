import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

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
          <BrowserRouter>
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/" element={<Auth onLogin={handleLogin} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route 
                  path="/" 
                  element={<Navigate to="/dashboard" replace />} 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <Dashboard />
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/scan" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <ScanComponent/>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/history" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <HistoryComponent/>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <AnalyticsDashboard/>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <ReportsComponent/>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/educ" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <AwarenessComponent/>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/alerts" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <AlertsComponent/>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <SettingsPage/>
                    </DashboardLayout>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
