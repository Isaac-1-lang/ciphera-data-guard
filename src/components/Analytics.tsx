import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Eye,
  Clock,
  Users,
  FileText,
  Activity,
  Download,
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react'

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Dummy data for charts
  const scanTrendData = [
    { date: '2024-01-01', scans: 45, threats: 8, clean: 37 },
    { date: '2024-01-02', scans: 52, threats: 12, clean: 40 },
    { date: '2024-01-03', scans: 48, threats: 6, clean: 42 },
    { date: '2024-01-04', scans: 61, threats: 15, clean: 46 },
    { date: '2024-01-05', scans: 55, threats: 9, clean: 46 },
    { date: '2024-01-06', scans: 67, threats: 18, clean: 49 },
    { date: '2024-01-07', scans: 74, threats: 14, clean: 60 },
  ]

  const threatTypeData = [
    { name: 'Malicious Prompts', value: 35, color: '#000000' },
    { name: 'Data Extraction', value: 28, color: '#404040' },
    { name: 'Injection Attacks', value: 22, color: '#808080' },
    { name: 'Social Engineering', value: 15, color: '#C0C0C0' },
  ]

  const hourlyActivityData = [
    { hour: '00', scans: 12 }, { hour: '01', scans: 8 }, { hour: '02', scans: 5 },
    { hour: '03', scans: 3 }, { hour: '04', scans: 4 }, { hour: '05', scans: 7 },
    { hour: '06', scans: 15 }, { hour: '07', scans: 28 }, { hour: '08', scans: 42 },
    { hour: '09', scans: 65 }, { hour: '10', scans: 78 }, { hour: '11', scans: 82 },
    { hour: '12', scans: 91 }, { hour: '13', scans: 85 }, { hour: '14', scans: 92 },
    { hour: '15', scans: 88 }, { hour: '16', scans: 75 }, { hour: '17', scans: 68 },
    { hour: '18', scans: 45 }, { hour: '19', scans: 35 }, { hour: '20', scans: 28 },
    { hour: '21', scans: 22 }, { hour: '22', scans: 18 }, { hour: '23', scans: 15 },
  ]

  const severityTrendData = [
    { date: '2024-01-01', critical: 2, high: 6, medium: 12, low: 8 },
    { date: '2024-01-02', critical: 4, high: 8, medium: 15, low: 11 },
    { date: '2024-01-03', critical: 1, high: 5, medium: 10, low: 9 },
    { date: '2024-01-04', critical: 6, high: 9, medium: 18, low: 14 },
    { date: '2024-01-05', critical: 3, high: 6, medium: 14, low: 12 },
    { date: '2024-01-06', critical: 8, high: 10, medium: 22, low: 16 },
    { date: '2024-01-07', critical: 5, high: 9, medium: 19, low: 18 },
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setLastUpdated(new Date())
    }, 2000)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-8 max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 border-b border-gray-200 pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-black" />
              <h1 className="text-4xl font-bold text-black">Analytics Dashboard</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Monitor prompt scanning activity and security insights.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent border-none text-sm font-medium focus:outline-none"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-black text-black hover:bg-gray-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm font-medium">Total Scans</p>
                  <p className="text-3xl font-bold text-black">1,247</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">+12.5%</span>
                  </div>
                </div>
                <div className="bg-black bg-opacity-10 p-3 rounded-lg">
                  <Eye className="h-8 w-8 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm font-medium">Threats Detected</p>
                  <p className="text-3xl font-bold text-black">89</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    <span className="text-red-600 text-sm font-medium">+8.2%</span>
                  </div>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm font-medium">Clean Prompts</p>
                  <p className="text-3xl font-bold text-black">1,158</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">+15.1%</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm font-medium">Avg Response Time</p>
                  <p className="text-3xl font-bold text-black">142ms</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">-5.3%</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Scan Trends */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl text-black flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Scan Activity Trends
              </CardTitle>
              <CardDescription className="text-gray-600">
                Daily scanning activity and threat detection over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={scanTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#666"
                  />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #000',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="scans" 
                    stroke="#000" 
                    fill="#000" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="threats" 
                    stroke="#dc2626" 
                    fill="#dc2626" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Threat Distribution */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl text-black flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Threat Type Distribution
              </CardTitle>
              <CardDescription className="text-gray-600">
                Breakdown of detected threat categories
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={threatTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {threatTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #000',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {threatTypeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-sm font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Hourly Activity */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl text-black flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hourly Scan Activity
              </CardTitle>
              <CardDescription className="text-gray-600">
                Scanning patterns throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #000',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="scans" 
                    fill="#000" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Threat Severity Trends */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-xl text-black flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Threat Severity Trends
              </CardTitle>
              <CardDescription className="text-gray-600">
                Security threat levels over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={severityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#666"
                  />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #000',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="critical" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="high" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="medium" 
                    stroke="#eab308" 
                    strokeWidth={3}
                    dot={{ fill: '#eab308', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="low" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-4 gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded" />
                  <span className="text-xs text-gray-600">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded" />
                  <span className="text-xs text-gray-600">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded" />
                  <span className="text-xs text-gray-600">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-xs text-gray-600">Low</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Table */}
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-xl text-black flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Scan Activity
            </CardTitle>
            <CardDescription className="text-gray-600">
              Latest prompt scanning results and detections
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-black">Timestamp</th>
                    <th className="text-left p-4 font-semibold text-black">Prompt Type</th>
                    <th className="text-left p-4 font-semibold text-black">Status</th>
                    <th className="text-left p-4 font-semibold text-black">Severity</th>
                    <th className="text-left p-4 font-semibold text-black">Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: '14:23:15', type: 'Text Analysis', status: 'Threat Detected', severity: 'High', responseTime: '156ms' },
                    { time: '14:22:48', type: 'Code Injection', status: 'Clean', severity: '-', responseTime: '89ms' },
                    { time: '14:22:31', type: 'Data Extraction', status: 'Threat Detected', severity: 'Critical', responseTime: '203ms' },
                    { time: '14:22:12', type: 'Text Analysis', status: 'Clean', severity: '-', responseTime: '145ms' },
                    { time: '14:21:55', type: 'Social Engineering', status: 'Threat Detected', severity: 'Medium', responseTime: '178ms' },
                    { time: '14:21:33', type: 'Text Analysis', status: 'Clean', severity: '-', responseTime: '124ms' },
                  ].map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 text-gray-600 font-mono text-sm">{item.time}</td>
                      <td className="p-4 text-black">{item.type}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Clean' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {item.severity !== '-' ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                            item.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.severity}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600 font-mono text-sm">{item.responseTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Last updated: {lastUpdated.toLocaleString()} • Data refreshed every 30 seconds
          </p>
        </div>
      </div>
    </div>
  )
}