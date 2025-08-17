import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Mock history data
  const historyData = [
    {
      id: 1,
      timestamp: '2024-01-15 14:30:25',
      type: 'Text Scan',
      content: 'Email content analysis for marketing campaign',
      status: 'completed',
      threats: 2,
      severity: 'high',
      scanTime: '1.8s',
      size: '2.3 KB'
    },
    {
      id: 2,
      timestamp: '2024-01-15 13:45:12',
      type: 'File Scan',
      content: 'financial_report_2024.pdf',
      status: 'completed',
      threats: 1,
      severity: 'critical',
      scanTime: '4.2s',
      size: '2.1 MB'
    },
    {
      id: 3,
      timestamp: '2024-01-15 12:20:08',
      type: 'Text Scan',
      content: 'API prompt for customer service bot',
      status: 'completed',
      threats: 0,
      severity: 'none',
      scanTime: '0.9s',
      size: '856 B'
    },
    {
      id: 4,
      timestamp: '2024-01-15 11:15:33',
      type: 'File Scan',
      content: 'employee_data.xlsx',
      status: 'completed',
      threats: 3,
      severity: 'high',
      scanTime: '3.7s',
      size: '1.8 MB'
    },
    {
      id: 5,
      timestamp: '2024-01-15 10:30:45',
      type: 'Text Scan',
      content: 'Social media post content',
      status: 'completed',
      threats: 1,
      severity: 'medium',
      scanTime: '1.2s',
      size: '1.2 KB'
    }
  ];

  const toggleExpanded = (id: number) => {
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

  const filteredData = historyData.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'threats' && item.threats > 0) ||
                         (selectedFilter === 'clean' && item.threats === 0);
    return matchesSearch && matchesFilter;
  });

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
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">1,247</h3>
            <p className="text-gray-600">Total Scans</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">892</h3>
            <p className="text-gray-600">Clean Scans</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 rounded-xl w-fit mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">355</h3>
            <p className="text-gray-600">Threats Detected</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-4">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">2.1s</h3>
            <p className="text-gray-600">Avg Scan Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search scan history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Scans</option>
                <option value="threats">With Threats</option>
                <option value="clean">Clean Scans</option>
              </select>
              
              <Button variant="outline" className="px-6 py-3 rounded-xl">
                <Filter className="h-5 w-5 mr-2" />
                Advanced
              </Button>
              
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl">
                <Download className="h-5 w-5 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            Recent Scans
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your latest data protection activities and results
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2">
            {filteredData.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Main Row */}
                <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div className="text-left">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge variant="outline" className="font-medium">
                              {item.type}
                            </Badge>
                            {getSeverityBadge(item.severity)}
                          </div>
                          <p className="font-medium text-gray-800">{item.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {item.timestamp}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {item.scanTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {item.size}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{item.threats}</div>
                        <div className="text-sm text-gray-500">threats</div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(item.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        {expandedItems.has(item.id) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedItems.has(item.id) && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Scan Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Scan ID:</span>
                            <span className="font-mono">#{item.id.toString().padStart(6, '0')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="capitalize">{item.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Scan Time:</span>
                            <span>{item.scanTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">File Size:</span>
                            <span>{item.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Actions</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
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
