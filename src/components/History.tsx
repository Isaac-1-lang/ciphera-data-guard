import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function HistoryComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadHistoryData();
    loadStats();
  }, [currentPage]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  const loadHistoryData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getScanHistory(currentPage, 5); // Limit to 5 scans per page
      setHistoryData(response.docs || []);
      setTotalPages(response.totalPages || 1);
      setTotalDocs(response.totalDocs || 0);
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

  const loadStats = async () => {
    try {
      const response = await apiService.getScanStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Export scan history to PDF
  const exportHistoryToPDF = () => {
    if (!historyData || historyData.length === 0) {
      toast({
        title: "Export Failed",
        description: "No scan history available to export",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a new window for the report
      const reportWindow = window.open('', '_blank');
      if (!reportWindow) {
        toast({
          title: "Export Failed",
          description: "Please allow popups to export the report",
          variant: "destructive",
        });
        return;
      }

      // Generate HTML content for the report
      const reportHTML = generateHistoryReportHTML();
      
      reportWindow.document.write(reportHTML);
      reportWindow.document.close();
      
      // Wait for content to load then print
      reportWindow.onload = () => {
        setTimeout(() => {
          reportWindow.print();
        }, 500);
      };

      toast({
        title: "Export Started",
        description: "History report opened in new window. Use browser print to save as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate history report",
        variant: "destructive",
      });
    }
  };

  // Generate HTML content for the history report
  const generateHistoryReportHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    const historyRows = historyData.map((item: any, index: number) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">
          <div style="font-weight: 500;">${item.type}</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
            ${item.content || item.fileName || 'N/A'}
          </div>
        </td>
        <td style="padding: 12px; text-align: center;">
          <span style="
            background: ${item.highestSeverity === 'critical' ? '#dc2626' : 
                         item.highestSeverity === 'high' ? '#7c3aed' : 
                         item.highestSeverity === 'medium' ? '#f59e0b' : 
                         item.highestSeverity === 'low' ? '#10b981' : '#6b7280'}; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 11px; 
            font-weight: bold;
          ">
            ${item.highestSeverity?.toUpperCase() || 'CLEAN'}
          </span>
        </td>
        <td style="padding: 12px; text-align: center;">
          <span style="font-weight: bold; font-size: 16px;">${item.threats?.length || 0}</span>
        </td>
        <td style="padding: 12px; text-align: center;">
          <span style="
            background: ${item.status === 'completed' ? '#10b981' : 
                         item.status === 'failed' ? '#dc2626' : '#f59e0b'}; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 11px; 
            font-weight: bold;
          ">
            ${item.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </td>
        <td style="padding: 12px; text-align: center;">
          ${new Date(item.createdAt).toLocaleDateString()}
        </td>
        <td style="padding: 12px; text-align: center;">
          ${item.scanTime ? `${item.scanTime}ms` : 'N/A'}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Scan History Report - Ciphera Data Guard</title>
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
          @media print { body { margin: 20px; } .header { page-break-after: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🛡️ CIPHERA DATA GUARD</div>
          <h1>Scan History Report</h1>
          <p>Generated on ${currentDate} at ${currentTime}</p>
        </div>

        <div class="summary">
          <h2 style="margin-bottom: 20px; color: #1f2937;">Summary Statistics</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-number">${stats?.totalScans || 0}</div>
              <div class="summary-label">Total Scans</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${stats?.cleanScans || 0}</div>
              <div class="summary-label">Clean Scans</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${stats?.scansWithThreats || 0}</div>
              <div class="summary-label">Threats Detected</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">${stats?.avgScanTime ? `${stats.avgScanTime}ms` : '0ms'}</div>
              <div class="summary-label">Avg Scan Time</div>
            </div>
          </div>
        </div>

        <div class="table-container">
          <h2 style="margin-bottom: 20px; color: #1f2937;">Detailed Scan History</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Content/File</th>
                <th style="width: 15%; text-align: center;">Severity</th>
                <th style="width: 12%; text-align: center;">Threats</th>
                <th style="width: 15%; text-align: center;">Status</th>
                <th style="width: 15%; text-align: center;">Date</th>
                <th style="width: 18%; text-align: center;">Scan Time</th>
              </tr>
            </thead>
            <tbody>
              ${historyRows}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>This report was generated by Ciphera Data Guard - Your trusted data protection solution</p>
          <p>For questions or support, please contact your system administrator</p>
        </div>
      </body>
      </html>
    `;
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="font-semibold">CRITICAL</Badge>;
      case 'high':
        return <Badge variant="secondary" className="font-semibold">HIGH</Badge>;
      case 'medium':
        return <Badge variant="outline" className="font-semibold border-orange-300 text-orange-700">MEDIUM</Badge>;
      case 'low':
        return <Badge variant="outline" className="font-semibold border-yellow-300 text-yellow-700">LOW</Badge>;
      default:
        return <Badge variant="outline" className="font-semibold border-green-300 text-green-700">CLEAN</Badge>;
    }
  };

  const filteredData =Array.isArray(historyData) ? historyData.filter(item => {
    const matchesSearch = (item.content || item.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.type || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'threats' && (item.threats?.length || 0) > 0) ||
                         (selectedFilter === 'clean' && (item.threats?.length || 0) === 0);
    return matchesSearch && matchesFilter;
  }): [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-accent/10 p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-primary to-primary-glow rounded-2xl">
            <History className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Scan History
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Review your data protection history and analyze security patterns over time
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{stats?.totalScans || 0}</h3>
            <p className="text-muted-foreground">Total Scans</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{stats?.cleanScans || 0}</h3>
            <p className="text-muted-foreground">Clean Scans</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl w-fit mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{stats?.scansWithThreats || 0}</h3>
            <p className="text-muted-foreground">Threats Detected</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-fit mx-auto mb-4">
              <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{stats?.avgScanTime ? `${stats.avgScanTime}ms` : '0ms'}</h3>
            <p className="text-muted-foreground">Avg Scan Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search scan history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-accent bg-background"
              >
                <option value="all">All Scans</option>
                <option value="threats">With Threats</option>
                <option value="clean">Clean Scans</option>
              </select>
              
              <Button variant="outline" className="px-6 py-3 rounded-xl">
                <Filter className="h-5 w-5 mr-2" />
                Advanced
              </Button>
              
              <Button 
                onClick={exportHistoryToPDF}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground px-6 py-3 rounded-xl"
              >
                <Download className="h-5 w-5 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            Recent Scans
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your latest data protection activities and results
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading scan history...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No scan history found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredData.map((item) => (
                <div key={item._id || item.id} className="border border-border rounded-xl overflow-hidden">
                  {/* Main Row */}
                  <div className="p-4 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <div className="text-left">
                            <div className="flex items-center gap-3 mb-1">
                              <Badge variant="outline" className="font-medium">
                                {item.type}
                              </Badge>
                              {getSeverityBadge(item.highestSeverity || 'none')}
                            </div>
                            <p className="font-medium text-foreground">{item.content || item.fileName}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(item.scanTime || item.createdAt).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {item.scanTime ? `${item.scanTime}ms` : 'N/A'}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {item.fileSize || item.textLength || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">{item.threats?.length || 0}</div>
                          <div className="text-sm text-muted-foreground">threats</div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(item._id || item.id)}
                          className="p-2 hover:bg-muted rounded-lg"
                        >
                          {expandedItems.has(item._id || item.id) ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedItems.has(item._id || item.id) && (
                    <div className="border-t border-border bg-muted/30 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Scan Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Scan ID:</span>
                              <span className="font-mono">#{(item._id || item.id).toString().slice(-6)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <span className="capitalize">{item.status}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Scan Time:</span>
                              <span>{item.scanTime ? `${item.scanTime}ms` : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">File Size:</span>
                              <span>{item.fileSize || item.textLength || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Threat Count:</span>
                              <span>{item.threatCount || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Highest Severity:</span>
                              <span className="capitalize">{item.highestSeverity || 'none'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Actions</h4>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Download Report
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Threats Section - Show when threats are detected */}
                      {item.threats && item.threats.length > 0 && (
                        <div className="col-span-1 md:col-span-2">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Threats Detected
                          </h4>
                          <div className="space-y-3">
                            {item.threats.map((threat: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                  <Badge 
                                    variant={threat.severity === 'critical' ? 'destructive' : threat.severity === 'high' ? 'secondary' : 'outline'}
                                    className="font-semibold"
                                  >
                                    {threat.severity.toUpperCase()}
                                  </Badge>
                                  <div>
                                    <p className="font-medium text-foreground">{threat.type}</p>
                                    {threat.details && (
                                      <p className="text-sm text-muted-foreground">{threat.details}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-foreground">{threat.count}</p>
                                  <p className="text-sm text-muted-foreground">items</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="px-3 py-2 rounded-lg"
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {/* Generate page numbers dynamically */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              // Show current page, first page, last page, and pages around current
              const shouldShow = 
                pageNumber === 1 || 
                pageNumber === totalPages || 
                Math.abs(pageNumber - currentPage) <= 1;
              
              if (shouldShow) {
                return (
                                     <Button
                     key={pageNumber}
                     variant={pageNumber === currentPage ? "default" : "outline"}
                     size="sm"
                     className={`px-3 py-2 rounded-lg ${
                       pageNumber === currentPage 
                         ? "bg-primary text-primary-foreground" 
                         : ""
                     }`}
                     onClick={() => handlePageChange(pageNumber)}
                     disabled={isLoading}
                   >
                     {pageNumber}
                   </Button>
                );
              } else if (
                (pageNumber === currentPage - 2 && currentPage > 3) ||
                (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return <span key={pageNumber} className="px-2 text-muted-foreground">...</span>;
              }
              return null;
            })}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="px-3 py-2 rounded-lg"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Page Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {((currentPage - 1) * 5) + 1} to {Math.min(currentPage * 5, totalDocs)} of {totalDocs} scans
      </div>
    </div>
  );
}
