import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';
import { 
  Upload, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Scan,
  Download,
  Eye,
  Lock,
  Zap,
  Clock,
  BarChart3
} from 'lucide-react';

export default function ScanComponent() {
  const [scanType, setScanType] = useState<'text' | 'file'>('text');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<any>(null);
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load stats when component mounts
  const loadStats = async () => {
    try {
      const response = await apiService.getScanStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, []);

  const handleTextScan = async () => {
    if (!textInput.trim()) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call backend API
      const result = await apiService.scanText(textInput);
      
      clearInterval(progressInterval);
      setScanProgress(100);
      
      setTimeout(() => {
        setIsScanning(false);
        setScanResults({
          ...result,
          scanTime: `${Math.max(1, Math.round(result.scanTime / 1000))}s`,
          textLength: textInput.length
        });
        // Refresh stats after scan completion
        loadStats();
      }, 500);

      toast({
        title: "Scan Complete",
        description: "Text scan completed successfully!",
      });
    } catch (error) {
      setIsScanning(false);
      setScanProgress(0);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Failed to scan text",
        variant: "destructive",
      });
    }
  };

  const handleFileScan = async () => {
    if (!selectedFile) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 8;
        });
      }, 300);

      // Call backend API
      const result = await apiService.scanFile(selectedFile);
      
      clearInterval(progressInterval);
      setScanProgress(100);
      
      setTimeout(() => {
        setIsScanning(false);
        setScanResults({
          ...result,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          scanTime: `${Math.max(1, Math.round(result.scanTime / 1000))}s`
        });
        // Refresh stats after scan completion
        loadStats();
      }, 500);

      toast({
        title: "Scan Complete",
        description: "File scan completed successfully!",
      });
    } catch (error) {
      setIsScanning(false);
      setScanProgress(0);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Failed to scan file",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setScanType('file');
    }
  };

  const resetScan = () => {
    setScanResults(null);
    setTextInput('');
    setSelectedFile(null);
    setScanProgress(0);
    // Refresh stats when resetting
    loadStats();
  };

  // Export scan results to PDF
  const exportToPDF = () => {
    if (!scanResults) return;

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
      const reportHTML = generateReportHTML();
      
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
        description: "Report opened in new window. Use browser print to save as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };

  // Generate HTML content for the PDF report
  const generateReportHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    const threatsSection = scanResults.threats && scanResults.threats.length > 0 
      ? scanResults.threats.map((threat: any, index: number) => `
        <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="background: ${threat.severity === 'critical' ? '#dc2626' : threat.severity === 'high' ? '#7c3aed' : '#f59e0b'}; color: white; padding: 4px 8px; border-radius: 3px; font-size: 12px; font-weight: bold;">
                ${threat.severity.toUpperCase()}
              </span>
              <span style="margin-left: 10px; font-weight: bold;">${threat.type}</span>
            </div>
            <span style="font-size: 18px; font-weight: bold;">${threat.count}</span>
          </div>
          ${threat.details ? `<p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${threat.details}</p>` : ''}
        </div>
      `).join('')
      : '<p style="color: #059669; font-weight: bold;">✓ No threats detected! Your content appears to be clean.</p>';

    const recommendationsSection = scanResults.recommendations && scanResults.recommendations.length > 0
      ? scanResults.recommendations.map((rec: string, index: number) => `
        <div style="margin: 5px 0; padding: 8px; background: #f3f4f6; border-left: 3px solid #3b82f6; border-radius: 3px;">
          <span style="color: #3b82f6;">●</span> ${rec}
        </div>
      `).join('')
      : '<p style="color: #6b7280;">No specific recommendations available.</p>';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Scan Report - ${scanResults.fileName || 'Text Scan'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
          .scan-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0; }
          .info-item { display: flex; justify-content: space-between; }
          .section { margin: 25px 0; }
          .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
          .threat-item { margin: 10px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .recommendation-item { margin: 8px 0; padding: 12px; background: #f3f4f6; border-left: 4px solid #3b82f6; border-radius: 4px; }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          @media print { body { margin: 20px; } .header { page-break-after: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🛡️ CIPHERA DATA GUARD</div>
          <h1>Security Scan Report</h1>
          <p>Generated on ${currentDate} at ${currentTime}</p>
        </div>

        <div class="scan-info">
          <h2 class="section-title">Scan Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span><strong>Scan Type:</strong></span>
              <span>${scanResults.fileName ? 'File Scan' : 'Text Scan'}</span>
            </div>
            <div class="info-item">
              <span><strong>Content:</strong></span>
              <span>${scanResults.fileName || 'Text Content'}</span>
            </div>
            <div class="info-item">
              <span><strong>Scan Time:</strong></span>
              <span>${scanResults.scanTime}</span>
            </div>
            <div class="info-item">
              <span><strong>File Size:</strong></span>
              <span>${scanResults.fileSize ? formatFileSize(scanResults.fileSize) : scanResults.textLength ? `${scanResults.textLength} characters` : 'N/A'}</span>
            </div>
            <div class="info-item">
              <span><strong>Threats Detected:</strong></span>
              <span>${scanResults.threats ? scanResults.threats.length : 0}</span>
            </div>
            <div class="info-item">
              <span><strong>Status:</strong></span>
              <span style="color: ${scanResults.threats && scanResults.threats.length > 0 ? '#dc2626' : '#059669'}; font-weight: bold;">
                ${scanResults.threats && scanResults.threats.length > 0 ? '⚠️ Threats Detected' : '✅ Clean'}
              </span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Threat Analysis</h2>
          ${threatsSection}
        </div>

        <div class="section">
          <h2 class="section-title">Security Recommendations</h2>
          ${recommendationsSection}
        </div>

        <div class="footer">
          <p>This report was generated by Ciphera Data Guard - Your trusted data protection solution</p>
          <p>For questions or support, please contact your system administrator</p>
        </div>
      </body>
      </html>
    `;
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Export statistics to PDF
  const exportStatsToPDF = () => {
    if (!stats) {
      toast({
        title: "Export Failed",
        description: "No statistics available to export",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a new window for the stats report
      const reportWindow = window.open('', '_blank');
      if (!reportWindow) {
        toast({
          title: "Export Failed",
          description: "Please allow popups to export the report",
          variant: "destructive",
        });
        return;
      }

      // Generate HTML content for the stats report
      const statsHTML = generateStatsHTML();
      
      reportWindow.document.write(statsHTML);
      reportWindow.document.close();
      
      // Wait for content to load then print
      reportWindow.onload = () => {
        setTimeout(() => {
          reportWindow.print();
        }, 500);
      };

      toast({
        title: "Export Started",
        description: "Statistics report opened in new window. Use browser print to save as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate statistics report",
        variant: "destructive",
      });
    }
  };

  // Generate HTML content for the statistics report
  const generateStatsHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Scan Statistics Report - Ciphera Data Guard</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
          .stat-card { background: #f9fafb; padding: 25px; border-radius: 12px; text-align: center; border: 1px solid #e5e7eb; }
          .stat-number { font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
          .stat-label { color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
          .section { margin: 25px 0; }
          .section-title { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
          .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          @media print { body { margin: 20px; } .header { page-break-after: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🛡️ CIPHERA DATA GUARD</div>
          <h1>Scan Statistics Report</h1>
          <p>Generated on ${currentDate} at ${currentTime}</p>
        </div>

        <div class="section">
          <h2 class="section-title">Overview Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${stats.totalScans || 0}</div>
              <div class="stat-label">Total Scans</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.completedScans || 0}</div>
              <div class="stat-label">Completed Scans</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.scansWithThreats || 0}</div>
              <div class="stat-label">Scans with Threats</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.cleanScans || 0}</div>
              <div class="stat-label">Clean Scans</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Performance Metrics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${stats.completionRate || 0}%</div>
              <div class="stat-label">Completion Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.threatRate || 0}%</div>
              <div class="stat-label">Threat Detection Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.avgScanTime ? `${stats.avgScanTime}ms` : '0ms'}</div>
              <div class="stat-label">Average Scan Time</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${stats.uptime || '99.9'}%</div>
              <div class="stat-label">System Uptime</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This report was generated by Ciphera Data Guard - Your trusted data protection solution</p>
          <p>For questions or support, please contact your system administrator</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-accent/10 p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-primary to-primary-glow rounded-2xl">
            <Scan className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Scan & Protect
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Secure your data by scanning text and files for sensitive information before sharing
        </p>
      </div>

      {/* Scan Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text Scanner */}
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Text Scanner
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Scan text content for sensitive information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter or paste text to scan for sensitive information..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[200px] resize-none"
              disabled={isScanning}
            />
            <Button 
              onClick={handleTextScan}
              disabled={isScanning || !textInput.trim()}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isScanning ? (
                <>
                  <Scan className="h-5 w-5 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Scan Text
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* File Scanner */}
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              File Scanner
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Upload and scan documents for hidden sensitive data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent transition-colors duration-300 cursor-pointer"
              onClick={() => {
                if (!isScanning) fileInputRef.current?.click();
              }}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  {selectedFile ? selectedFile.name : 'Drop file here or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOC, DOCX, TXT, and image files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  className="hidden"
                  disabled={isScanning}
                />
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  disabled={isScanning}
                  onClick={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }}
                >
                  Choose File
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleFileScan}
              disabled={isScanning || !selectedFile}
              className="w-full bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-success-foreground font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isScanning ? (
                <>
                  <Scan className="h-5 w-5 mr-2 animate-spin" />
                  Scanning File...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Scan File
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scan Progress */}
      {isScanning && (
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Scan className="h-8 w-8 text-accent animate-spin" />
                <h3 className="text-xl font-semibold text-foreground">Scanning in Progress...</h3>
              </div>
              <Progress value={scanProgress} className="h-3 bg-muted" />
              <p className="text-muted-foreground">{scanProgress}% Complete</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Results */}
      {scanResults && (
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              Scan Results
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Analysis completed in {scanResults.scanTime}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Threats Detected */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Threats Detected
              </h4>
              <div className="space-y-3">
                {scanResults.threats && scanResults.threats.length > 0 ? (
                  scanResults.threats.map((threat: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={threat.severity === 'critical' ? 'destructive' : threat.severity === 'high' ? 'secondary' : 'outline'}
                          className="font-semibold"
                        >
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="font-medium text-foreground">{threat.type}</p>
                          <p className="text-sm text-muted-foreground">{threat.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{threat.count}</p>
                        <p className="text-sm text-muted-foreground">items</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                    <p className="text-green-800 dark:text-green-200 font-medium">No threats detected! Your content appears to be clean.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" />
                Security Recommendations
              </h4>
              <div className="space-y-2">
                {scanResults.recommendations && scanResults.recommendations.length > 0 ? (
                  scanResults.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-foreground">{rec}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg border border-border">
                    <p className="text-muted-foreground">No specific recommendations available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Eye className="h-5 w-5 mr-2" />
                View Detailed Report
              </Button>
              <Button variant="outline" onClick={exportToPDF} className="px-6 py-3 rounded-xl">
                <Download className="h-5 w-5 mr-2" />
                Export Results
              </Button>
              <Button variant="outline" onClick={resetScan} className="px-6 py-3 rounded-xl">
                <Zap className="h-5 w-5 mr-2" />
                New Scan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Quick Stats</h2>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={loadStats}
            className="px-4 py-2 rounded-xl"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh Stats
          </Button>
          <Button 
            variant="outline" 
            onClick={exportStatsToPDF}
            className="px-4 py-2 rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Stats
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {stats ? stats.totalScans : (
                <div className="animate-pulse bg-muted h-8 w-16 rounded mx-auto"></div>
              )}
            </h3>
            <p className="text-muted-foreground">Total Scans Today</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {stats ? `${stats.completionRate}%` : (
                <div className="animate-pulse bg-muted h-8 w-16 rounded mx-auto"></div>
              )}
            </h3>
            <p className="text-muted-foreground">Completion Rate</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl w-fit mx-auto mb-4">
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {stats ? (stats.avgScanTime ? `${stats.avgScanTime}ms` : '0ms') : (
                <div className="animate-pulse bg-muted h-8 w-16 rounded mx-auto"></div>
              )}
            </h3>
            <p className="text-muted-foreground">Average Scan Time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
