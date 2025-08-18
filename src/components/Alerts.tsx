import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Clock, 
  Filter,
  Search,
  Eye,
  Shield,
  X,
  Zap,
  AlertCircle,
  Info,
  XCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AlertsComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedAlerts, setExpandedAlerts] = useState<Set<number>>(new Set());

  const alerts = [
    {
      id: 1,
      title: 'Suspicious Login Attempt',
      description: 'Multiple failed login attempts detected from unknown IP address',
      severity: 'high',
      status: 'active',
      timestamp: '2024-01-15 14:30:25',
      category: 'Authentication',
      source: '192.168.1.100',
      affectedUsers: 1,
      priority: 'urgent'
    },
    {
      id: 2,
      title: 'Data Exfiltration Attempt',
      description: 'Large file transfer detected to external destination',
      severity: 'critical',
      status: 'investigating',
      timestamp: '2024-01-15 13:45:12',
      category: 'Data Loss',
      source: 'Internal Network',
      affectedUsers: 3,
      priority: 'immediate'
    },
    {
      id: 3,
      title: 'Malware Detection',
      description: 'Suspicious file behavior detected during scan',
      severity: 'medium',
      status: 'resolved',
      timestamp: '2024-01-15 12:20:08',
      category: 'Malware',
      source: 'File Upload',
      affectedUsers: 1,
      priority: 'high'
    },
    {
      id: 4,
      title: 'Unusual API Activity',
      description: 'Abnormal API call patterns detected',
      severity: 'low',
      status: 'monitoring',
      timestamp: '2024-01-15 11:15:33',
      category: 'API Security',
      source: 'API Gateway',
      affectedUsers: 0,
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Configuration Drift',
      description: 'Security settings modified outside of approved process',
      severity: 'medium',
      status: 'active',
      timestamp: '2024-01-15 10:30:45',
      category: 'Configuration',
      source: 'Admin Panel',
      affectedUsers: 5,
      priority: 'high'
    }
  ];

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedAlerts(newExpanded);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="font-semibold">CRITICAL</Badge>;
      case 'high':
        return <Badge variant="secondary" className="font-semibold">HIGH</Badge>;
      case 'medium':
        return <Badge variant="outline" className="font-semibold border-yellow-300 text-yellow-700">MEDIUM</Badge>;
      case 'low':
        return <Badge variant="outline" className="font-semibold border-blue-300 text-blue-700">LOW</Badge>;
      default:
        return <Badge variant="outline" className="font-semibold">UNKNOWN</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive" className="font-semibold">ACTIVE</Badge>;
      case 'investigating':
        return <Badge variant="secondary" className="font-semibold">INVESTIGATING</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="font-semibold border-green-300 text-green-700">RESOLVED</Badge>;
      case 'monitoring':
        return <Badge variant="outline" className="font-semibold border-blue-300 text-blue-700">MONITORING</Badge>;
      default:
        return <Badge variant="outline" className="font-semibold">UNKNOWN</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate':
        return 'text-red-600 bg-red-100';
      case 'urgent':
        return 'text-orange-600 bg-orange-100';
      case 'high':
        return 'text-yellow-600 bg-yellow-100';
      case 'medium':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && alert.status === 'active') ||
                         (selectedFilter === 'resolved' && alert.status === 'resolved') ||
                         (selectedFilter === 'critical' && alert.severity === 'critical');
    return matchesSearch && matchesFilter;
  });

  const alertStats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    resolved: alerts.filter(a => a.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Security Alerts
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Monitor and respond to security incidents and potential threats in real-time
        </p>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-red-100 rounded-xl w-fit mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{alertStats.total -5}</h3>
            <p className="text-gray-600">Total Alerts</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 rounded-xl w-fit mx-auto mb-4">
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{alertStats.active - 2}</h3>
            <p className="text-gray-600">Active Alerts</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-red-100 rounded-xl w-fit mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{alertStats.critical - 1}</h3>
            <p className="text-gray-600">Critical</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{alertStats.resolved - 1}</h3>
            <p className="text-gray-600">Resolved</p>
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
                placeholder="Search alerts..."
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
                <option value="all">All Alerts</option>
                <option value="active">Active Only</option>
                <option value="resolved">Resolved</option>
                <option value="critical">Critical Only</option>
              </select>
              
              <Button variant="outline" className="px-6 py-3 rounded-xl">
                <Filter className="h-5 w-5 mr-2" />
                Advanced
              </Button>
              
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl">
                <Zap className="h-5 w-5 mr-2" />
                New Alert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl">
              <Bell className="h-6 w-6 text-red-600" />
            </div>
            Security Alerts
          </CardTitle>
          <CardDescription className="text-gray-600">
            Real-time security incidents requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Main Alert Row */}
                <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(alert.severity)}
                        <div className="text-left">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                            {getSeverityBadge(alert.severity)}
                            {getStatusBadge(alert.status)}
                          </div>
                          <p className="text-gray-600 mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {alert.timestamp}
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-4 w-4" />
                              {alert.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" />
                              {alert.source}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(alert.priority)}`}>
                          {alert.priority.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {alert.affectedUsers} user{alert.affectedUsers !== 1 ? 's' : ''} affected
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(alert.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        {expandedAlerts.has(alert.id) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Alert Details */}
                {expandedAlerts.has(alert.id) && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Alert Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Alert ID:</span>
                            <span className="font-mono">#{alert.id.toString().padStart(6, '0')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Severity:</span>
                            <span className="capitalize">{alert.severity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="capitalize">{alert.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Priority:</span>
                            <span className="capitalize">{alert.priority}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Actions</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                            <Eye className="h-4 w-4 mr-2" />
                            Investigate
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolve
                          </Button>
                          <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                            <Clock className="h-4 w-4 mr-2" />
                            Snooze
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            <X className="h-4 w-4 mr-2" />
                            Dismiss
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

      {/* Quick Actions */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Acknowledge All
            </Button>
            <Button variant="outline" className="px-8 py-3 rounded-xl">
              <Eye className="h-5 w-5 mr-2" />
              View History
            </Button>
            <Button variant="outline" className="px-8 py-3 rounded-xl">
              <Shield className="h-5 w-5 mr-2" />
              Security Rules
            </Button>
            <Button variant="outline" className="px-8 py-3 rounded-xl">
              <Zap className="h-5 w-5 mr-2" />
              Auto-Response
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
