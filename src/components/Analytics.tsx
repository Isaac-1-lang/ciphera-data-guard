import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api'
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
  const [metrics, setMetrics] = useState<any | null>(null)
  const [scanTrends, setScanTrends] = useState<Array<{ date: string; scans: number; alerts: number }>>([])
  const [threatTypeData, setThreatTypeData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [hourlyActivityData, setHourlyActivityData] = useState<Array<{ hour: string; scans: number }>>([])
  const [severityDistribution, setSeverityDistribution] = useState<Array<{ name: string; value: number }>>([])

  // Build datasets from backend

  const load = async () => {
    setIsLoading(true)
    try {
      const [security, threats, performance, dashboard] = await Promise.all([
        apiService.getAnalytics({ period: timeRange, type: 'security' }),
        apiService.getAnalytics({ period: timeRange, type: 'threats' }),
        apiService.getAnalytics({ period: timeRange, type: 'performance' }),
        apiService.getDashboardData(),
      ])

      setMetrics(security)
      setLastUpdated(new Date())

      // Trends by date (scans and alerts)
      const scansByDate = new Map<string, { scans: number; alerts: number }>()
      ;(dashboard?.trends?.scans || []).forEach((row: any) => {
        scansByDate.set(row._id, { scans: row.count, alerts: 0 })
      })
      ;(dashboard?.trends?.alerts || []).forEach((row: any) => {
        const prev = scansByDate.get(row._id) || { scans: 0, alerts: 0 }
        scansByDate.set(row._id, { ...prev, alerts: row.count })
      })
      const mergedTrend = Array.from(scansByDate.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, v]) => ({ date, scans: v.scans, alerts: v.alerts }))
      setScanTrends(mergedTrend)

      // Threat types pie
      const typeToCount: Record<string, number> = {}
      ;(threats?.threatBreakdown || []).forEach((item: any) => {
        const type = item._id?.type || 'Unknown'
        typeToCount[type] = (typeToCount[type] || 0) + (item.count || 0)
      })
      const palette = ['#111827', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB']
      const typesData = Object.entries(typeToCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, value], idx) => ({ name, value: value as number, color: palette[idx % palette.length] }))
      setThreatTypeData(typesData)

      // Hourly activity
      const hourly = (performance?.throughput || []).map((row: any) => ({ hour: row._id, scans: row.count }))
      setHourlyActivityData(hourly)

      // Severity distribution
      const sevMap: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 }
      ;(threats?.severityCounts || []).forEach((row: any) => {
        const sev = (row._id || '').toLowerCase()
        if (sev in sevMap) {
          sevMap[sev] = row.count || 0
        }
      })
      setSeverityDistribution([
        { name: 'Critical', value: sevMap.critical },
        { name: 'High', value: sevMap.high },
        { name: 'Medium', value: sevMap.medium },
        { name: 'Low', value: sevMap.low },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [timeRange])

  const handleRefresh = () => {
    load()
  }

  // Export analytics report to PDF
  const exportAnalyticsToPDF = () => {
    if (!metrics && !threatTypeData.length && !scanTrends.length) {
      return
    }

    try {
      // Create a new window for the report
      const reportWindow = window.open('', '_blank')
      if (!reportWindow) {
        return
      }

      // Generate HTML content for the report
      const reportHTML = generateAnalyticsReportHTML()
      
      reportWindow.document.write(reportHTML)
      reportWindow.document.close()
      
      // Wait for content to load then print
      reportWindow.onload = () => {
        setTimeout(() => {
          reportWindow.print()
        }, 500)
      }
    } catch (error) {
      console.error('Failed to export analytics:', error)
    }
  }

  // Generate HTML content for the analytics report
  const generateAnalyticsReportHTML = () => {
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()
    
    const threatTypeRows = threatTypeData.map((item, index) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">${item.name}</td>
        <td style="padding: 12px; text-align: center;">
          <span style="
            background: ${item.color}; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 11px; 
            font-weight: bold;
          ">
            ${item.value}
          </span>
        </td>
      </tr>
    `).join('')

    const scanTrendRows = scanTrends.map((item, index) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: center;">${item.date}</td>
        <td style="padding: 12px; text-align: center;">${item.scans}</td>
        <td style="padding: 12px; text-align: center;">${item.alerts}</td>
      </tr>
    `).join('')

    const severityRows = severityDistribution.map((item, index) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">${item.name}</td>
        <td style="padding: 12px; text-align: center;">
          <span style="
            background: ${item.name === 'Critical' ? '#dc2626' : 
                         item.name === 'High' ? '#7c3aed' : 
                         item.name === 'Medium' ? '#f59e0b' : '#10b981'}; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 11px; 
            font-weight: bold;
          ">
            ${item.value}
          </span>
        </td>
      </tr>
    `).join('')

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Analytics Report - Ciphera Data Guard</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
          .summary { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 15px 0; }
          .summary-item { text-align: center; }
          .summary-number { font-size: 24px; font-weight: bold; color: #1f2937; }
          .summary-label { color: #6b7280; font-size: 12px; text-transform: uppercase; margin-top: 5px; }
          .table-container { margin: 30px 0; overflow-x: auto; }
          table { width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; }
          th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #e5e7eb; }
          td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          .section { margin: 25px 0; }
          .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
          @media print { body { margin: 20px; } .header { page-break-after: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🛡️ CIPHERA DATA GUARD</div>
          <h1>Analytics Report</h1>
          <p>Generated on ${currentDate} at ${currentTime}</p>
          <p>Time Range: ${timeRange === '24h' ? 'Last 24 Hours' : timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'Last 90 Days'}</p>
        </div>

        <div class="summary">
          <h2 style="margin-bottom: 20px; color: #1f2937;">Key Metrics</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-number">${metrics?.totalScans || 0}</div>
              <div class="summary-label">Total Scans</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${metrics?.threatsDetected || 0}</div>
              <div class="summary-label">Threats Detected</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${metrics?.avgResponseTime || 0}ms</div>
              <div class="summary-label">Avg Response Time</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${metrics?.successRate || 0}%</div>
              <div class="summary-label">Success Rate</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Threat Type Distribution</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 70%;">Threat Type</th>
                  <th style="width: 30%; text-align: center;">Count</th>
                </tr>
              </thead>
              <tbody>
                ${threatTypeRows}
              </tbody>
            </table>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Scan Trends</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 33%; text-align: center;">Date</th>
                  <th style="width: 33%; text-align: center;">Scans</th>
                  <th style="width: 34%; text-align: center;">Alerts</th>
                </tr>
              </thead>
              <tbody>
                ${scanTrendRows}
              </tbody>
            </table>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Threat Severity Distribution</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 70%;">Severity Level</th>
                  <th style="width: 30%; text-align: center;">Count</th>
                </tr>
              </thead>
              <tbody>
                ${severityRows}
              </tbody>
            </table>
          </div>
        </div>

        <div class="footer">
          <p>This report was generated by Ciphera Data Guard - Your trusted data protection solution</p>
          <p>For questions or support, please contact your system administrator</p>
        </div>
      </body>
      </html>
    `
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-4 lg:p-8 max-w-7xl space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 border-b border-gray-200 pb-4 lg:pb-6">
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8 text-black" />
              <h1 className="text-2xl lg:text-4xl font-bold text-black">Analytics & Overview</h1>
            </div>
            <p className="text-gray-600 text-sm lg:text-lg">
              Monitor prompt scanning activity and security insights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
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
            <Button 
              onClick={exportAnalyticsToPDF}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2">
                  <p className="text-gray-600 text-xs lg:text-sm font-medium">Total Scans</p>
                  <p className="text-2xl lg:text-3xl font-bold text-black">{metrics?.totalScans}</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-xs lg:text-sm font-medium">0%</span>
                  </div>
                </div>
                <div className="bg-black bg-opacity-10 p-2 lg:p-3 rounded-lg">
                  <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm font-medium">Sensitive data Detected</p>
                  <p className="text-3xl font-bold text-black">{metrics?.threatsDetected ?? 0}</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    <span className="text-red-600 text-sm font-medium">0%</span>
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
                  <p className="text-3xl font-bold text-black">{metrics?.cleanScans ?? 0}</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">0%</span>
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
                  <p className="text-3xl font-bold text-black">{metrics?.avgResponseTime ? `${metrics.avgResponseTime}ms` : '0ms'}</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">0%</span>
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
                Daily scanning activity and valuable detections over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={scanTrends}>
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
                  <Area type="monotone" dataKey="alerts" stroke="#dc2626" fill="#dc2626" fillOpacity={0.1} strokeWidth={2} />
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
                <LineChart data={[{date: new Date().toISOString(), critical: severityDistribution.find(s=>s.name==='Critical')?.value || 0, high: severityDistribution.find(s=>s.name==='High')?.value || 0, medium: severityDistribution.find(s=>s.name==='Medium')?.value || 0, low: severityDistribution.find(s=>s.name==='Low')?.value || 0}] }>
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
            <CardTitle className="text-lg lg:text-xl text-black flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Scan Activity
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm lg:text-base">
              Latest prompt scanning results and detections
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm lg:text-base">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-3 lg:p-4 font-semibold text-black whitespace-nowrap">Timestamp</th>
                    <th className="text-left p-3 lg:p-4 font-semibold text-black whitespace-nowrap">Prompt Type</th>
                    <th className="text-left p-3 lg:p-4 font-semibold text-black whitespace-nowrap">Status</th>
                    <th className="text-left p-3 lg:p-4 font-semibold text-black whitespace-nowrap">Severity</th>
                    <th className="text-left p-3 lg:p-4 font-semibold text-black whitespace-nowrap">Response Time</th>
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
                      <td className="p-3 lg:p-4 text-gray-600 font-mono text-xs lg:text-sm whitespace-nowrap">{item.time}</td>
                      <td className="p-3 lg:p-4 text-black whitespace-nowrap">{item.type}</td>
                      <td className="p-3 lg:p-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Clean' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 lg:p-4 whitespace-nowrap">
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
                      <td className="p-3 lg:p-4 text-gray-600 font-mono text-xs lg:text-sm whitespace-nowrap">{item.responseTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 lg:py-8 border-t border-gray-200">
          <p className="text-gray-500 text-xs lg:text-sm">
            Last updated: {lastUpdated.toLocaleString()} • Data refreshed every 30 seconds
          </p>
        </div>
      </div>
    </div>
  )
}