import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

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
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Scan & Protect</h2>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/history" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">History</h2>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Reports</h2>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/team" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Team</h2>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/alerts" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Alerts</h2>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </DashboardLayout>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <DashboardLayout onLogout={handleLogout}>
                      <div className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Settings</h2>
                        <p className="text-muted-foreground">Coming soon...</p>
                      </div>
                    </DashboardLayout>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
