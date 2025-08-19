import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
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
  Zap,
  RefreshCw
} from 'lucide-react';

export default function ReportsComponent() {
  const [selectedReport, setSelectedReport] = useState<string>('security');
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

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

  // Load report data from API
  const loadReportData = async () => {
    setIsLoading(true);
    try {
      const [analytics, dashboard] = await Promise.all([
        apiService.getAnalytics({ type: selectedReport, period: dateRange }),
        apiService.getDashboardData()
      ]);
      
      // Process and structure the data for reports
      const processedData = {
    security: {
          totalScans: dashboard?.overview?.totalScans || 0,
          threatsDetected: dashboard?.overview?.scansWithThreats || 0,
          cleanScans: dashboard?.overview?.cleanScans || 0,
          detectionRate: dashboard?.overview?.totalScans > 0 
            ? Math.round(((dashboard.overview.totalScans - dashboard.overview.scansWithThreats) / dashboard.overview.totalScans) * 100)
            : 100,
          avgResponseTime: analytics?.avgResponseTime ? `${analytics.avgResponseTime}ms` : '0ms',
          topThreats: (dashboard?.threatDistribution || []).map((threat: any) => ({
            type: threat._id || 'Unknown',
            count: threat.count || 0,
            percentage: dashboard.overview.totalScans > 0 
              ? Math.round((threat.count / dashboard.overview.totalScans) * 100)
              : 0
          })).slice(0, 4)
    },
    threats: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      trend: '0%',
          topSources: (analytics?.threatBreakdown || []).map((threat: any) => ({
            source: threat._id?.type || 'Unknown',
            count: threat.count || 0,
            percentage: analytics.totalThreats > 0 
              ? Math.round((threat.count / analytics.totalThreats) * 100)
              : 0
          })).slice(0, 4)
    },
    performance: {
          avgScanTime: dashboard?.performance?.avgScanTime ? `${dashboard.performance.avgScanTime}ms` : '0ms',
          throughput: `${dashboard?.performance?.throughput || 0} scans/hour`,
          uptime: dashboard?.performance?.uptime || 99.9,
          errorRate: dashboard?.performance?.errorRate || 0,
          peakHours: (analytics?.throughput || []).map((hour: any) => ({
            hour: `${hour._id}:00`,
            scans: hour.count || 0
          })).slice(0, 5)
        }
      };
      
      setReportData(processedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentReportData = () => {
    return reportData?.[selectedReport as keyof typeof reportData] || {
      totalScans: 0,
      threatsDetected: 0,
      cleanScans: 0,
      detectionRate: 0,
      avgResponseTime: '0ms',
      topThreats: [],
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      trend: '0%',
      topSources: [],
      avgScanTime: '0ms',
      throughput: '0 scans/hour',
      uptime: 0,
      errorRate: 0,
      peakHours: []
    };
  };

  // Load data when component mounts or when report type/date range changes
  useEffect(() => {
    loadReportData();
  }, [selectedReport, dateRange]);

  // Initial data load
  useEffect(() => {
    loadReportData();
  }, []);

  // Export report to PDF
  const exportReport = () => {
    if (!reportData) {
      alert('No report data available to export');
      return;
    }

    try {
      // Create a new window for the report
      const reportWindow = window.open('', '_blank');
      if (!reportWindow) {
        alert('Please allow popups to export the report');
        return;
      }

      // Generate HTML content for the report
      const reportHTML = generateReportHTML();
      
      reportWindow.document.write(reportHTML);
      reportWindow.document.close();
      
      // Wait for content to load then print
      reportWindow.onload = () => {
        setTimeout(() => {
          reportWindow.print();
        }, 500);
      };
    } catch (error) {
      console.error('Failed to export report:', error);
      alert('Failed to export report');
    }
  };

  // Generate HTML content for the PDF report
  const generateReportHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const currentData = getCurrentReportData();
    
    let detailedContent = '';
    
    if (selectedReport === 'security') {
      detailedContent = `
        <div style="margin: 20px 0;">
          <h3 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Top Threat Categories</h3>
          ${currentData.topThreats.map((threat: any) => `
            <div style="margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 5px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 500;">${threat.type}</span>
                <div style="text-align: right;">
                  <span style="font-size: 18px; font-weight: bold;">${threat.count}</span>
                  <span style="color: #6b7280; margin-left: 10px;">(${threat.percentage}%)</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (selectedReport === 'threats') {
      detailedContent = `
        <div style="margin: 20px 0;">
          <h3 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Threat Sources</h3>
          ${currentData.topSources.map((source: any) => `
            <div style="margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 5px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 500;">${source.source}</span>
                <div style="text-align: right;">
                  <span style="font-size: 18px; font-weight: bold;">${source.count}</span>
                  <span style="color: #6b7280; margin-left: 10px;">(${source.percentage}%)</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (selectedReport === 'performance') {
      detailedContent = `
        <div style="margin: 20px 0;">
          <h3 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Peak Activity Hours</h3>
          ${currentData.peakHours.map((hour: any) => `
            <div style="margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 5px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 500;">${hour.hour}</span>
                <span style="font-size: 18px; font-weight: bold;">${hour.scans} scans</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report - Ciphera Data Guard</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
          .summary { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 15px 0; }
          .summary-item { text-align: center; }
          .summary-number { font-size: 24px; font-weight: bold; color: #1f2937; }
          .summary-label { color: #6b7280; font-size: 12px; text-transform: uppercase; margin-top: 5px; }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          @media print { body { margin: 20px; } .header { page-break-after: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🛡️ CIPHERA DATA GUARD</div>
          <h1>${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report</h1>
          <p>Generated on ${currentDate} at ${currentTime}</p>
          <p>Time Range: ${dateRange === '24h' ? 'Last 24 Hours' : dateRange === '7d' ? 'Last 7 Days' : dateRange === '30d' ? 'Last 30 Days' : 'Last 90 Days'}</p>
        </div>

        <div class="summary">
          <h2 style="margin-bottom: 20px; color: #1f2937;">Key Metrics</h2>
          <div class="summary-grid">
            ${selectedReport === 'security' ? `
              <div class="summary-item">
                <div class="summary-number">${currentData.totalScans}</div>
                <div class="summary-label">Total Scans</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${currentData.threatsDetected}</div>
                <div class="summary-label">Threats Detected</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${currentData.cleanScans}</div>
                <div class="summary-label">Clean Scans</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${currentData.detectionRate}%</div>
                <div class="summary-label">Detection Rate</div>
              </div>
            ` : selectedReport === 'threats' ? `
              <div class="summary-item">
                <div class="summary-number">${currentData.critical}</div>
                <div class="summary-label">Critical</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${currentData.high}</div>
                <div class="summary-label">High</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${currentData.medium}</div>
                <div class="summary-label">Medium</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${currentData.low}</div>
                <div class="summary-label">Low</div>
              </div>
            ` : `
              <div class="summary-item">
                <div class="summary-number">${currentData.avgScanTime}</div>
                <div class="summary-label">Avg Scan Time</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${currentData.throughput}</div>
                <div class="summary-label">Throughput</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${currentData.uptime}%</div>
                <div class="summary-label">Uptime</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">${currentData.errorRate}%</div>
                <div class="summary-label">Error Rate</div>
              </div>
            `}
          </div>
        </div>

        ${detailedContent}

        <div class="footer">
          <p>This report was generated by Ciphera Data Guard - Your trusted data protection solution</p>
          <p>For questions or support, please contact your system administrator</p>
        </div>
      </body>
      </html>
    `;
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
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        )}
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => (
          <Card 
            key={report.id}
            className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
              selectedReport === report.id ? 'ring-2 ring-blue-500' : ''
            } ${isLoading && selectedReport === report.id ? 'opacity-75' : ''}`}
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
              <Button 
                variant="outline" 
                className="px-6 py-2 rounded-xl"
                onClick={loadReportData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl"
                onClick={exportReport}
                disabled={isLoading || !reportData}
              >
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
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      getCurrentReportData().totalScans
                    )}
                  </h3>
                  <p className="text-gray-600">Total Scans</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-orange-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      getCurrentReportData().threatsDetected
                    )}
                  </h3>
                  <p className="text-gray-600">Threats Detected</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      getCurrentReportData().cleanScans
                    )}
                  </h3>
                  <p className="text-gray-600">Clean Scans</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      `${getCurrentReportData().detectionRate}%`
                    )}
                  </h3>
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
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      getCurrentReportData().critical
                    )}
                  </h3>
                  <p className="text-gray-600">Critical</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-orange-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      getCurrentReportData().high
                    )}
                  </h3>
                  <p className="text-gray-600">High</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-yellow-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      getCurrentReportData().medium
                    )}
                  </h3>
                  <p className="text-gray-600">Medium</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      getCurrentReportData().trend
                    )}
                  </h3>
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
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      getCurrentReportData().avgScanTime
                    )}
                  </h3>
                  <p className="text-gray-600">Avg Scan Time</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      getCurrentReportData().throughput
                    )}
                  </h3>
                  <p className="text-gray-600">Throughput</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-4">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      `${getCurrentReportData().uptime}%`
                    )}
                  </h3>
                  <p className="text-gray-600">Uptime</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-red-100 rounded-xl w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-16 rounded mx-auto"></div>
                    ) : (
                      `${getCurrentReportData().errorRate}%`
                    )}
                  </h3>
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
              {isLoading && (
                <div className="ml-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                </div>
              )}
            </CardTitle>
            <CardDescription className="text-gray-600">
              In-depth breakdown of {selectedReport} data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedReport === 'security' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Top Threat Categories</h4>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="animate-pulse bg-gray-300 w-4 h-4 rounded-full"></div>
                          <div className="animate-pulse bg-gray-300 h-4 w-32 rounded"></div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="animate-pulse bg-gray-300 h-6 w-8 rounded"></div>
                          <div className="animate-pulse bg-gray-300 h-4 w-16 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                <div className="space-y-3">
                    {getCurrentReportData().topThreats.length > 0 ? (
                      getCurrentReportData().topThreats.map((threat, index) => (
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
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No threat data available</p>
                    )}
                </div>
                )}
              </div>
            )}

            {selectedReport === 'threats' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Threat Sources</h4>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="animate-pulse bg-gray-300 w-4 h-4 rounded-full"></div>
                          <div className="animate-pulse bg-gray-300 h-4 w-32 rounded"></div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="animate-pulse bg-gray-300 h-6 w-8 rounded"></div>
                          <div className="animate-pulse bg-gray-300 h-4 w-16 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                <div className="space-y-3">
                    {getCurrentReportData().topSources.length > 0 ? (
                      getCurrentReportData().topSources.map((source, index) => (
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
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No threat source data available</p>
                    )}
                </div>
                )}
              </div>
            )}

            {selectedReport === 'performance' && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Peak Activity Hours</h4>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="animate-pulse bg-gray-300 w-4 h-4 rounded-full"></div>
                          <div className="animate-pulse bg-gray-300 h-4 w-20 rounded"></div>
                        </div>
                        <div className="animate-pulse bg-gray-300 h-6 w-24 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                <div className="space-y-3">
                    {getCurrentReportData().peakHours.length > 0 ? (
                      getCurrentReportData().peakHours.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                        <span className="font-medium text-gray-800">{hour.hour}</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-800">{hour.scans} scans</span>
                    </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No peak activity data available</p>
                    )}
                </div>
                )}
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
              <Button 
                variant="outline" 
                className="px-8 py-3 rounded-xl"
                onClick={exportReport}
                disabled={isLoading || !reportData}
              >
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
