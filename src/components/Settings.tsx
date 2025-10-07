import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  AlertTriangle, 
  Database, 
  Shield, 
  Settings, 
  User, 
  Bell, 
  Moon, 
  Globe, 
  Download,
  Upload,
  Eye,
  EyeOff,
  Check,
  X,
  ChevronDown
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function SettingsPage() {
  const [telemetryEnabled, setTelemetryEnabled] = useState(true)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [crashReportsEnabled, setCrashReportsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  // Profile settings
  const [fullName, setFullName] = useState('NIYOBYOSE Isaac')
  const [email, setEmail] = useState('isaprecieux112@gmail.com')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  // App settings
  const [language, setLanguage] = useState('English')
  const [timezone, setTimezone] = useState('UTC-5 (EST)')
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')

  const handleToggle = (setting: string, value: boolean) => {
    setToastMessage(`${setting} has been ${value ? 'enabled' : 'disabled'}`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSaveProfile = () => {
    setToastMessage('Profile settings saved successfully')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setToastMessage('Passwords do not match')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    setToastMessage('Password updated successfully')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleExportData = () => {
    setToastMessage('Data export initiated. You will receive an email when ready.')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleDeleteData = () => {
    setToastMessage('Data deletion process initiated. This may take up to 30 days to complete.')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 5000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-black text-white px-6 py-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      <div className="container mx-auto p-8 max-w-5xl space-y-8">
        {/* Header */}
        <div className="space-y-3 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-black" />
            <h1 className="text-4xl font-bold text-black">Settings</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your account preferences, privacy settings, and application configuration.
          </p>
        </div>

        {/* Profile Settings */}
        <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-black" />
              <CardTitle className="text-2xl text-black">Profile Settings</CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-base mt-2">
              Update your personal information and account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-black font-semibold">Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black font-semibold">Email Address</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>
            <Button 
              onClick={handleSaveProfile}
              className="bg-black text-white hover:bg-gray-800 font-semibold"
            >
              Save Profile Changes
            </Button>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-black" />
              <CardTitle className="text-2xl text-black">Password & Security</CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-base mt-2">
              Change your password and manage security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 bg-white">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-black font-semibold">Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border-gray-300 focus:border-black focus:ring-black pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-black font-semibold">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-gray-300 focus:border-black focus:ring-black pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-black font-semibold">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              </div>
            </div>
            <Button 
              onClick={handlePasswordChange}
              className="bg-black text-white hover:bg-gray-800 font-semibold"
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-black" />
              <CardTitle className="text-2xl text-black">Notifications</CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-base mt-2">
              Manage how and when you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 bg-white">
            <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="space-y-2 flex-1">
                <Label className="text-lg font-semibold text-black">Enable Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications about important updates and activities</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={(checked) => {
                  setNotificationsEnabled(checked)
                  handleToggle('Notifications', checked)
                }}
                className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300"
              />
            </div>
            
            <Separator className="bg-gray-200" />
            
            <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="space-y-2 flex-1">
                <Label className="text-lg font-semibold text-black">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={(checked) => {
                  setEmailNotifications(checked)
                  handleToggle('Email Notifications', checked)
                }}
                disabled={!notificationsEnabled}
                className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300"
              />
            </div>
            
            <Separator className="bg-gray-200" />
            
            <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="space-y-2 flex-1">
                <Label className="text-lg font-semibold text-black">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={(checked) => {
                  setPushNotifications(checked)
                  handleToggle('Push Notifications', checked)
                }}
                disabled={!notificationsEnabled}
                className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Application Preferences */}
        <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-black" />
              <CardTitle className="text-2xl text-black">Application Preferences</CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-base mt-2">
              Customize your application experience and regional settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-black font-semibold">Language</Label>
                <div className="relative">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Chinese</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-black font-semibold">Timezone</Label>
                <div className="relative">
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white"
                  >
                    <option>UTC-5 (EST)</option>
                    <option>UTC-8 (PST)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (CET)</option>
                    <option>UTC+8 (CST)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-black font-semibold">Date Format</Label>
                <div className="relative">
                  <select 
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black appearance-none bg-white"
                  >
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                    <option>DD-MM-YYYY</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <Separator className="bg-gray-200" />
            
            <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="space-y-2 flex-1">
                <Label className="text-lg font-semibold text-black">Auto-Save</Label>
                <p className="text-sm text-gray-600">Automatically save your work and preferences</p>
              </div>
              <Switch
                checked={autoSaveEnabled}
                onCheckedChange={(checked) => {
                  setAutoSaveEnabled(checked)
                  handleToggle('Auto-Save', checked)
                }}
                className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Telemetry */}
        <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-black" />
              <CardTitle className="text-2xl text-black">Privacy & Telemetry</CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-base mt-2">
              Control what data is collected to improve the privacy detection service.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 bg-white">
            <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="space-y-2 flex-1">
                <Label className="text-lg font-semibold text-black">Basic Telemetry</Label>
                <p className="text-sm text-gray-600">Allow collection of anonymous usage statistics to improve detection accuracy</p>
              </div>
              <Switch
                checked={telemetryEnabled}
                onCheckedChange={(checked) => {
                  setTelemetryEnabled(checked)
                  handleToggle('Basic Telemetry', checked)
                }}
                className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300"
              />
            </div>
            
            <Separator className="bg-gray-200" />
            
            <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="space-y-2 flex-1">
                <Label className="text-lg font-semibold text-black">Advanced Analytics</Label>
                <p className="text-sm text-gray-600">Enable detailed analytics for detection patterns and performance metrics</p>
              </div>
              <Switch
                checked={analyticsEnabled}
                onCheckedChange={(checked) => {
                  setAnalyticsEnabled(checked)
                  handleToggle('Advanced Analytics', checked)
                }}
                className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300"
              />
            </div>
            
            <Separator className="bg-gray-200" />
            
            <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="space-y-2 flex-1">
                <Label className="text-lg font-semibold text-black">Crash Reports</Label>
                <p className="text-sm text-gray-600">Automatically send crash reports to help diagnose and fix issues</p>
              </div>
              <Switch
                checked={crashReportsEnabled}
                onCheckedChange={(checked) => {
                  setCrashReportsEnabled(checked)
                  handleToggle('Crash Reports', checked)
                }}
                className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-2 border-black shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="bg-black text-white border-b border-black">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-white" />
              <CardTitle className="text-2xl text-white">Data Management</CardTitle>
            </div>
            <CardDescription className="text-gray-200 text-base mt-2">
              Export, import, or delete your account data and information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-start gap-3">
                  <Download className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                  <div className="space-y-3 flex-1">
                    <h4 className="text-lg font-bold text-black">Export Data</h4>
                    <p className="text-sm text-gray-700">
                      Download a copy of all your data in a portable format.
                    </p>
                    <Button 
                      onClick={handleExportData}
                      variant="outline" 
                      className="bg-white border-black text-black hover:bg-gray-50 font-semibold w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export My Data
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-start gap-3">
                  <Upload className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                  <div className="space-y-3 flex-1">
                    <h4 className="text-lg font-bold text-black">Import Data</h4>
                    <p className="text-sm text-gray-700">
                      Import your data from a previously exported file.
                    </p>
                    <Button 
                      variant="outline" 
                      className="bg-white border-black text-black hover:bg-gray-50 font-semibold w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-2 border-black rounded-lg p-6 bg-gray-50">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-black">Delete All Data</h4>
                    <p className="text-gray-700 leading-relaxed">
                      This will permanently delete all your privacy detection data, settings, and account information. 
                      This action cannot be undone and may take up to 30 days to complete.
                    </p>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800 font-semibold"
                      >
                        Delete My Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white border-2 border-black">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-black text-xl">Confirm Data Deletion</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                          Are you absolutely sure you want to delete all your data? This action cannot be undone and will permanently remove all your privacy detection data, settings, and account information.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteData}
                          className="bg-black text-white hover:bg-gray-800 font-semibold"
                        >
                          Delete Data
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Settings last updated: {new Date().toLocaleDateString()} • Version 2.1.0
          </p>
        </div>
      </div>
    </div>
  )
}