import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { apiService } from "@/lib/api";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function DashboardLayout({ children, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:z-40`}>
        <AppSidebar onClose={() => setSidebarOpen(false)} />
      </div>
    
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">Security Dashboard</h1>
              <p className="text-sm text-muted-foreground">Monitor and protect your sensitive data</p>
            </div>
            
            {/* Mobile title */}
            <div className="sm:hidden">
              <h1 className="text-lg font-semibold text-foreground">Ciphera</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-3">
            <ThemeToggle />
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-accent text-accent-foreground text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 bg-gradient-to-br from-background via-background to-accent/5">
          {children}
        </main>
      </div>
    </div>
  );
}