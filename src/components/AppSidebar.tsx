import { NavLink, useLocation } from "react-router-dom";
import { 
  Shield, 
  BarChart3, 
  History, 
  Scan, 
  Settings, 
  Home,
  FileText,
  Users,
  AlertTriangle
} from "lucide-react";
import logo from "@/assets/logo.png";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Scan & Protect", url: "/scan", icon: Scan },
  { title: "History", url: "/history", icon: History },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const managementItems = [
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Awareness", url: "/educ", icon: Users },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200";

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <img src={logo} alt="Ciphera" className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ciphera
            </h2>
            <p className="text-sm text-gray-500">Data Guard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500 px-3">
            Main
          </h3>
          <nav className="space-y-1">
            {mainItems.map((item) => (
              <NavLink 
                key={item.title}
                to={item.url} 
                end 
                className={getNavClass}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: '500',
                  textDecoration: 'none'
                })}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Management Navigation */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500 px-3">
            Management
          </h3>
          <nav className="space-y-1">
            {managementItems.map((item) => (
              <NavLink 
                key={item.title}
                to={item.url} 
                end 
                className={getNavClass}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: '500',
                  textDecoration: 'none'
                })}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}