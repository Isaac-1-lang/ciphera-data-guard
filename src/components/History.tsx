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
  const { toast } = useToast();

  useEffect(() => {
    loadHistoryData();
    loadStats();
  }, [currentPage]);

  const loadHistoryData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getScanHistory(currentPage, 10);
      setHistoryData(response.docs || response.data || []);
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
            <h3 className="text-2xl font-bold text-foreground mb-2">{stats?.threatsDetected || 0}</h3>
            <p className="text-muted-foreground">Threats Detected</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-fit mx-auto mb-4">
              <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{stats?.avgScanTime || '0ms'}</h3>
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
              
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground px-6 py-3 rounded-xl">
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
          <Button variant="outline" size="sm" className="px-3 py-2 rounded-lg">
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="px-3 py-2 rounded-lg bg-blue-600 text-white border-blue-600">
              1
            </Button>
            <Button variant="outline" size="sm" className="px-3 py-2 rounded-lg">
              2
            </Button>
            <Button variant="outline" size="sm" className="px-3 py-2 rounded-lg">
              3
            </Button>
          </div>
          <Button variant="outline" size="sm" className="px-3 py-2 rounded-lg">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
