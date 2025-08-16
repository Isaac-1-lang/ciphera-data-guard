import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Scan,
  BarChart3,
  Clock,
  Users
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Welcome back!</h2>
          <p className="text-muted-foreground">Here's what's happening with your data security today.</p>
        </div>
        <Button variant="hero" size="lg" className="gap-2">
          <Scan className="h-5 w-5" />
          Quick Scan
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Protected</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+2.1%</span> accuracy improvement
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-warning">2 high priority</span> items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest scans and security events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2 min ago", action: "Email content scanned", status: "success", items: "3 sensitive items masked" },
                { time: "15 min ago", action: "API prompt analyzed", status: "warning", items: "1 potential exposure detected" },
                { time: "1 hour ago", action: "Document upload protected", status: "success", items: "5 SSN numbers replaced" },
                { time: "3 hours ago", action: "Chat conversation secured", status: "success", items: "Credit card data masked" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={activity.status === "success" ? "default" : "secondary"}>
                        {activity.action}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{activity.items}</p>
                  </div>
                  <CheckCircle className={`h-4 w-4 ${activity.status === "success" ? "text-success" : "text-warning"}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Score */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Security Score
            </CardTitle>
            <CardDescription>
              Overall data protection rating
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">94</div>
              <Badge variant="default" className="bg-success text-success-foreground">
                Excellent
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Email Protection</span>
                  <span className="text-success">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>API Security</span>
                  <span className="text-accent">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Document Scanning</span>
                  <span className="text-warning">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </div>

            <Button variant="outline" className="w-full">
              View Detailed Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="security" className="h-20 flex-col gap-2">
              <Scan className="h-6 w-6" />
              Scan New Content
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              View Analytics
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              Check Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}