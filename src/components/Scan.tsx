import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

  const handleTextScan = async () => {
    if (!textInput.trim()) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Mock scan results
          setScanResults({
            status: 'completed',
            threats: [
              { type: 'Personal Information', severity: 'high', count: 2, details: 'Email addresses and phone numbers detected' },
              { type: 'Financial Data', severity: 'critical', count: 1, details: 'Credit card number pattern identified' }
            ],
            recommendations: [
              'Mask email addresses before sharing',
              'Remove or encrypt financial information',
              'Use generic placeholders for sensitive data'
            ],
            scanTime: '2.3 seconds',
            textLength: textInput.length
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileScan = async () => {
    if (!selectedFile) return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate file scanning
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          // Mock file scan results
          setScanResults({
            status: 'completed',
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            threats: [
              { type: 'Document Metadata', severity: 'medium', count: 3, details: 'Author and creation date exposed' },
              { type: 'Hidden Content', severity: 'low', count: 1, details: 'Comments and revision history found' }
            ],
            recommendations: [
              'Remove document metadata before sharing',
              'Sanitize hidden content and comments',
              'Convert to clean format if possible'
            ],
            scanTime: '4.1 seconds'
          });
          return 100;
        }
        return prev + 8;
      });
    }, 300);
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
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent transition-colors duration-300">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  {selectedFile ? selectedFile.name : 'Drop file here or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOC, DOCX, TXT, and image files
                </p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  className="hidden"
                  id="file-upload"
                  disabled={isScanning}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" disabled={isScanning}>
                    Choose File
                  </Button>
                </label>
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
                {scanResults.threats.map((threat: any, index: number) => (
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
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" />
                Security Recommendations
              </h4>
              <div className="space-y-2">
                {scanResults.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Eye className="h-5 w-5 mr-2" />
                View Detailed Report
              </Button>
              <Button variant="outline" className="px-6 py-3 rounded-xl">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">1,247</h3>
            <p className="text-muted-foreground">Total Scans Today</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">98.7%</h3>
            <p className="text-muted-foreground">Detection Accuracy</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl w-fit mx-auto mb-4">
              <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">2.3s</h3>
            <p className="text-muted-foreground">Average Scan Time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
