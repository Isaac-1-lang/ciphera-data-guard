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

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyData, setHistoryData] = useState<any[]>([]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6 space-y-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Shield className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, <span className="text-yellow-300">{getDisplayName()}</span>!
                </h1>
                <p className="text-blue-100 text-lg">Your data security fortress is running smoothly today</p>
              </div>
              <Avatar className="h-16 w-16 border-2 border-white/30 shadow-lg">
                <AvatarImage src="" alt={getDisplayName()} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Scan className="h-5 w-5 mr-2" />
              Quick Security Scan
            </Button>
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/20 border-white/30 px-6 py-3 rounded-xl">
              <Activity className="h-5 w-5 mr-2" />
              View Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Scans Card */}
        <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Total Scans</CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {/* Display total scans count from the database */}
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats?.totalScans ?? 0}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">{dashboard ? `${dashboard.performance?.throughput ?? 0}/day` : '—'}</span>
              </div>
              <span className="text-sm text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Data Protected Card */}
        <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Data Protected</CardTitle>
            <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
              <Lock className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {/* From the database */}
            <div className="text-3xl font-bold text-gray-900 mb-2">{(() => {
              const completed = dashboard?.overview?.completedScans ?? 0;
              const clean = dashboard?.overview?.cleanScans ?? 0;
              if (completed === 0) return '0%';
              const pct = Math.round((clean / completed) * 100);
              return `${pct}%`;
            })()}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">{dashboard?.overview ? `${dashboard.overview.cleanScans ?? 0} clean` : '—'}</span>
              </div>
              <span className="text-sm text-gray-500">accuracy improvement</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts Card */}
        <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
            <div className="p-2 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {/* From the databases */}
            <div className="text-3xl font-bold text-gray-900 mb-2">{dashboard?.overview?.activeAlerts ?? 0}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-orange-600">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-sm font-medium">{dashboard?.overview ? `${dashboard.overview.criticalAlerts ?? 0} critical` : '—'}</span>
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
              <Target className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {/* From the db */}
            <div className="text-3xl font-bold text-gray-900 mb-2">{dashboard?.overview?.securityScore ?? 0}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Recent Activity */}
        <Card className="xl:col-span-2 border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Latest security scans and data protection events
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Featured recent activity from DB */}
            <div className="space-y-4">
              {(dashboard?.recentActivity ?? []).map((item: any) => (
                <div key={item.id} className="group flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className={`p-3 rounded-xl bg-blue-100 group-hover:scale-110 transition-transform duration-300`}>
                    <Scan className={`h-5 w-5 text-blue-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant={item.threatCount > 0 ? "secondary" : "default"} className="font-medium">
                        {item.type}
                      </Badge>
                      <span className="text-sm text-gray-500 font-medium">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.content}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
            <CardTitle className="flex items-center justify-center gap-3 text-xl mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              Security Score
            </CardTitle>
            <CardDescription className="text-gray-600">
              Overall data protection rating
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  {dashboard?.overview?.securityScore ? `${dashboard.overview.securityScore}%` : '0%'}
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
                </div>
              </div>
              <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-semibold rounded-full">
                Excellent
              </Badge>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium text-gray-700">Email Protection</span>
                  <span className="font-semibold text-green-600">98%</span>
                </div>
                <Progress value={98} className="h-3 bg-gray-200" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium text-gray-700">API Security</span>
                  <span className="font-semibold text-blue-600">95%</span>
                </div>
                <Progress value={95} className="h-3 bg-gray-200" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium text-gray-700">Document Scanning</span>
                  <span className="font-semibold text-orange-600">87%</span>
                </div>
                <Progress value={87} className="h-3 bg-gray-200" />
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Eye className="h-4 w-4 mr-2" />
              View Report
            </Button>
          </CardContent>
        </Card>

        {/* User Profile Section */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              Your Profile
            </CardTitle>
            <CardDescription className="text-gray-600">
              Account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20 border-4 border-indigo-100 shadow-lg">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                
                <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                  {user?.role || 'User'}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
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
            
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
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