import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  TrendingUp,
  AlertTriangle,
  Shield,
  Users,
  Clock,
  Eye,
  Mail,
  Zap
} from 'lucide-react';

export default function ReportsComponent() {
  const [selectedReport, setSelectedReport] = useState<string>('security');
  const [dateRange, setDateRange] = useState('7d');

  const reportTypes = [
    {
      id: 'security',
      title: 'Security Overview',
      description: 'Comprehensive security metrics and threat analysis',
      icon: Shield,
      color: 'from-blue-600 to-purple-600',
      bgColor: 'from-blue-100 to-purple-100'
    },
    {
      id: 'threats',
      title: 'Threat Analysis',
      description: 'Detailed breakdown of detected threats and patterns',
      icon: AlertTriangle,
      color: 'from-orange-600 to-red-600',
      bgColor: 'from-orange-100 to-red-100'
    },
    {
      id: 'performance',
      title: 'Performance Metrics',
      description: 'System performance and scanning efficiency data',
      icon: TrendingUp,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-100 to-emerald-100'
    },
    {
      id: 'compliance',
      title: 'Compliance Report',
      description: 'Regulatory compliance and audit trail information',
      icon: FileText,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'from-purple-100 to-pink-100'
    }
  ];

  const mockReportData = {
    security: {
      totalScans: 1247,
      threatsDetected: 89,
      cleanScans: 1158,
      detectionRate: 98.7,
      avgResponseTime: '142ms',
      topThreats: [
        { type: 'Personal Information', count: 45, percentage: 50.6 },
        { type: 'Financial Data', count: 23, percentage: 25.8 },
        { type: 'Credentials', count: 12, percentage: 13.5 },
        { type: 'Other', count: 9, percentage: 10.1 }
      ]
    },
    threats: {
      critical: 12,
      high: 34,
      medium: 28,
      low: 15,
      trend: '+8.2%',
      topSources: [
        { source: 'Email Content', count: 38, percentage: 42.7 },
        { source: 'Document Uploads', count: 25, percentage: 28.1 },
        { source: 'API Calls', count: 18, percentage: 20.2 },
        { source: 'Chat Inputs', count: 8, percentage: 9.0 }
      ]
    },
    performance: {
      avgScanTime: '140ms',
      throughput: '485 scans/hour',
      uptime: 99.9,
      errorRate: 0.1,
      peakHours: [
        { hour: '09:00', scans: 65 },
        { hour: '10:00', scans: 78 },
        { hour: '11:00', scans: 82 },
        { hour: '14:00', scans: 75 },
        { hour: '15:00', scans: 68 }
      ]
    }
  };

  const getCurrentReportData = () => {
    return mockReportData[selectedReport as keyof typeof mockReportData];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Generate comprehensive reports and gain insights into your data security performance
        </p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => (
          <Card 
            key={report.id}
            className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
              selectedReport === report.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <CardContent className="p-6 text-center">
              <div className={`p-3 bg-gradient-to-br ${report.bgColor} rounded-xl w-fit mx-auto mb-4`}>
                <report.icon className={`h-8 w-8 bg-gradient-to-r ${report.color} bg-clip-text text-transparent`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600">{report.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Controls */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-700">Date Range:</span>
              </div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="px-6 py-2 rounded-xl">
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl">
                <Download className="h-5 w-5 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {selectedReport === 'security' && (
            <>
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().totalScans}</h3>
                  <p className="text-gray-600">Total Scans</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-orange-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().threatsDetected}</h3>
                  <p className="text-gray-600">Threats Detected</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().cleanScans}</h3>
                  <p className="text-gray-600">Clean Scans</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().detectionRate}%</h3>
                  <p className="text-gray-600">Detection Rate</p>
                </CardContent>
              </Card>
            </>
          )}

          {selectedReport === 'threats' && (
            <>
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-red-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().critical}</h3>
                  <p className="text-gray-600">Critical</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-orange-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().high}</h3>
                  <p className="text-gray-600">High</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-yellow-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().medium}</h3>
                  <p className="text-gray-600">Medium</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().trend}</h3>
                  <p className="text-gray-600">Trend</p>
                </CardContent>
              </Card>
            </>
          )}

          {selectedReport === 'performance' && (
            <>
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-4">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().avgScanTime}</h3>
                  <p className="text-gray-600">Avg Scan Time</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().throughput}</h3>
                  <p className="text-gray-600">Throughput</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-4">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().uptime}%</h3>
                  <p className="text-gray-600">Uptime</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-red-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{getCurrentReportData().errorRate}%</h3>
                  <p className="text-gray-600">Error Rate</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Detailed Analysis */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              Detailed Analysis
            </CardTitle>
            <CardDescription className="text-gray-600">
              In-depth breakdown of {selectedReport} data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedReport === 'security' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Top Threat Categories</h4>
                <div className="space-y-3">
                  {getCurrentReportData().topThreats.map((threat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-gray-800">{threat.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-800">{threat.count}</span>
                        <span className="text-sm text-gray-500">({threat.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedReport === 'threats' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Threat Sources</h4>
                <div className="space-y-3">
                  {getCurrentReportData().topSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                        <span className="font-medium text-gray-800">{source.source}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-800">{source.count}</span>
                        <span className="text-sm text-gray-500">({source.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedReport === 'performance' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Peak Activity Hours</h4>
                <div className="space-y-3">
                  {getCurrentReportData().peakHours.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                        <span className="font-medium text-gray-800">{hour.hour}</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-800">{hour.scans} scans</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Actions */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Eye className="h-5 w-5 mr-2" />
                View Full Report
              </Button>
              <Button variant="outline" className="px-8 py-3 rounded-xl">
                <Mail className="h-5 w-5 mr-2" />
                Schedule Report
              </Button>
              <Button variant="outline" className="px-8 py-3 rounded-xl">
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="px-8 py-3 rounded-xl">
                <Download className="h-5 w-5 mr-2" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
