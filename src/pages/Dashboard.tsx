import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Scan,
  BarChart3,
  Clock,
  Users,
  Eye,
  Zap,
  Lock,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDashboardData();
        setDashboard(data);
      } catch (e) {
        // ignore in UI for now
      } finally {
        setLoading(false);
      }
    };
    load();
    loadStats();
  }, []);

    const loadStats = async () => {
    try {
      const response = await apiService.getScanStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };
  const loadHistoryData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getScanHistory(currentPage, 10);
      setHistoryData(response.docs || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load scan history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get user's display name (firstName + lastName or username as fallback)
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.lastName}`;
    }
    return user?.username || user?.firstName || user?.lastName || 'User';
  };

  // Get user's initials for avatar
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4 lg:p-6 space-y-6 lg:space-y-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 lg:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-48 lg:w-72 h-48 lg:h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 lg:w-96 h-64 lg:h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm w-fit">
              <Shield className="h-6 w-6 lg:h-8 lg:w-8" />
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-4xl font-bold mb-2">
                  Welcome back, <span className="text-yellow-300">{getDisplayName()}</span>!
                </h1>
                <p className="text-blue-100 text-base lg:text-lg">Your data security fortress is running smoothly today</p>
              </div>
              <Avatar className="h-12 w-12 lg:h-16 lg:w-16 border-2 border-white/30 shadow-lg flex-shrink-0">
                <AvatarImage src="" alt={getDisplayName()} />
                <AvatarFallback className="bg-white/20 text-white text-lg lg:text-xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4 mt-6">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-4 lg:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Scan className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              Quick Security Scan
            </Button>
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/20 border-white/30 px-4 lg:px-6 py-3 rounded-xl">
              <Activity className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              View Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Scans Card */}
        <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Total Scans</CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
              <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {/* Display total scans count from the database */}
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{stats?.totalScans ?? 0}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-xs lg:text-sm font-medium">{dashboard ? `${dashboard.performance?.throughput ?? 0}/day` : '—'}</span>
              </div>
              <span className="text-xs lg:text-sm text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Data Protected Card */}
        <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Data Protected</CardTitle>
            <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
              <Lock className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {/* From the database */}
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{(() => {
              const completed = dashboard?.overview?.completedScans ?? 0;
              const clean = dashboard?.overview?.cleanScans ?? 0;
              if (completed === 0) return '0%';
              const pct = Math.round((clean / completed) * 100);
              return `${pct}%`;
            })()}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-xs lg:text-sm font-medium">{dashboard?.overview ? `${dashboard.overview.cleanScans ?? 0} clean` : '—'}</span>
              </div>
              <span className="text-xs lg:text-sm text-gray-500">accuracy improvement</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts Card */}
        <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
            <div className="p-2 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
              <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {/* From the databases */}
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{dashboard?.overview?.activeAlerts ?? 0}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-orange-600">
                <ArrowDownRight className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-xs lg:text-sm font-medium">{dashboard?.overview ? `${dashboard.overview.criticalAlerts ?? 0} critical` : '—'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Score Card */}
        <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Security Score</CardTitle>
            <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
              <Target className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {/* From the db */}
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{dashboard?.overview?.securityScore ?? 0}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-xs lg:text-sm font-medium text-gray-700">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 xl:col-span-2 border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                  </div>
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2 text-sm lg:text-base">
                  Latest security scans and data protection events
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 w-fit">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            {/* Featured recent activity from DB */}
            <div className="space-y-3 lg:space-y-4">
              {(dashboard?.recentActivity ?? []).map((item: any) => (
                <div key={item.id} className="group flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className={`p-2 lg:p-3 rounded-xl bg-blue-100 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <Scan className={`h-4 w-4 lg:h-5 lg:w-5 text-blue-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mb-1">
                      <Badge variant={item.threatCount > 0 ? "secondary" : "default"} className="font-medium text-xs lg:text-sm w-fit">
                        {item.type}
                      </Badge>
                      <span className="text-xs lg:text-sm text-gray-500 font-medium">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600">{item.content}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                    <ArrowUpRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Score & Progress */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="text-center border-b border-gray-100">
            <CardTitle className="flex items-center justify-center gap-3 text-lg lg:text-xl mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
              </div>
              Security Score
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm lg:text-base">
              Overall data protection rating
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 space-y-4 lg:space-y-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  {dashboard?.overview?.securityScore ? `${dashboard.overview.securityScore}%` : '0%'}
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-4 w-4 lg:h-6 lg:w-6 text-yellow-500 animate-pulse" />
                </div>
              </div>
              <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm font-semibold rounded-full">
                Excellent
              </Badge>
            </div>
            
            <div className="space-y-4 lg:space-y-5">
              <div>
                <div className="flex justify-between text-xs lg:text-sm mb-2 lg:mb-3">
                  <span className="font-medium text-gray-700">Email Protection</span>
                  <span className="font-semibold text-green-600">98%</span>
                </div>
                <Progress value={98} className="h-2 lg:h-3 bg-gray-200" />
              </div>
              
              <div>
                <div className="flex justify-between text-xs lg:text-sm mb-2 lg:mb-3">
                  <span className="font-medium text-gray-700">API Security</span>
                  <span className="font-semibold text-blue-600">95%</span>
                </div>
                <Progress value={95} className="h-2 lg:h-3 bg-gray-200" />
              </div>
              
              <div>
                <div className="flex justify-between text-xs lg:text-sm mb-2 lg:mb-3">
                  <span className="font-medium text-gray-700">Document Scanning</span>
                  <span className="font-semibold text-orange-600">87%</span>
                </div>
                <Progress value={87} className="h-2 lg:h-3 bg-gray-200" />
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 lg:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm lg:text-base">
              <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
              View Report
            </Button>
          </CardContent>
        </Card>

        {/* User Profile Section */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg lg:text-xl">
              <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                <Users className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600" />
              </div>
              Your Profile
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm lg:text-base">
              Account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
              <Avatar className="h-16 w-16 lg:h-20 lg:w-20 border-4 border-indigo-100 shadow-lg flex-shrink-0">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-lg lg:text-2xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{getDisplayName()}</h3>
                <Badge variant="outline" className="border-indigo-200 text-indigo-700 text-xs lg:text-sm mt-1">
                  {user?.role || 'User'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-xs lg:text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700">Account Status</div>
                <div className="text-green-600 font-semibold">
                  {user?.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700">Last Login</div>
                <div className="text-gray-600">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 gap-2">
              <Button variant="outline" size="sm" className="w-full h-10 lg:h-11 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700">
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button 
                size="sm"
                className="w-full h-10 lg:h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                onClick={() => navigate('/settings')}
              >
                <Zap className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-600">
              Common security tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex-col gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <Scan className="h-8 w-8" />
                <span className="font-semibold">Scan New Content</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-3 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <BarChart3 className="h-8 w-8" />
                <span className="font-semibold">View Analytics</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-3 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200 hover:border-orange-300 text-orange-700 hover:text-orange-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <AlertTriangle className="h-8 w-8" />
                <span className="font-semibold">Check Alerts</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-3 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 hover:border-green-300 text-green-700 hover:text-green-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <Users className="h-8 w-8" />
                <span className="font-semibold">Team Overview</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              System Status
            </CardTitle>
            <CardDescription className="text-gray-600">
              Current security system health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "AI Scanner Engine", status: "operational", uptime: "99.9%" },
                { name: "Data Encryption", status: "operational", uptime: "100%" },
                { name: "Threat Detection", status: "operational", uptime: "99.8%" },
                { name: "API Gateway", status: "operational", uptime: "99.7%" },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-gray-700">{service.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">{service.status}</div>
                    <div className="text-xs text-gray-500">{service.uptime} uptime</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}