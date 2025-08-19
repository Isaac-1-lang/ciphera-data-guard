import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
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
  ChevronDown,
  Save,
  Loader2
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
  const { toast } = useToast()
  
  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)
  
  // Feature toggles
  const [telemetryEnabled, setTelemetryEnabled] = useState(true)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [crashReportsEnabled, setCrashReportsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  
  // Profile settings
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  // App settings
  const [language, setLanguage] = useState('English')
  const [timezone, setTimezone] = useState('UTC-5 (EST)')
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const user = await apiService.getProfile()
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setEmail(user.email || '')
      setUsername(user.username || '')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      })
    }
  }

  const handleToggle = (setting: string, value: boolean) => {
    toast({
      title: "Setting Updated",
      description: `${setting} has been ${value ? 'enabled' : 'disabled'}`,
    })
  }

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in first name and last name",
        variant: "destructive",
      })
      return
    }

    setIsLoadingProfile(true)
    try {
      const updatedUser = await apiService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      
      // Update local state with the response
      setFirstName(updatedUser.firstName)
      setLastName(updatedUser.lastName)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    setIsLoadingPassword(true)
    try {
      await apiService.changePassword({
        currentPassword,
        newPassword,
      })
      
      toast({
        title: "Success",
        description: "Password updated successfully",
      })
      
      // Clear password fields
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingPassword(false)
    }
  }

  const handleExportData = () => {
    toast({
      title: "Export Initiated",
      description: "Data export initiated. You will receive an email when ready.",
    })
  }

  const handleDeleteData = () => {
    toast({
      title: "Deletion Initiated",
      description: "Data deletion process initiated. This may take up to 30 days to complete.",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-8 max-w-5xl space-y-8">
        {/* Header */}
        <div className="space-y-6 border-b border-gray-200 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black">Settings</h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage your account preferences, privacy settings, and application configuration.
              </p>
            </div>
          </div>
          
          {/* User Info Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {firstName && lastName ? `${firstName} ${lastName}` : 'User Profile'}
                </h2>
                <p className="text-gray-600">{email || 'Loading...'}</p>
                <p className="text-sm text-gray-500">Account ID: {username || 'Loading...'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Member since</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>
          </div>
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
                <Label className="text-black font-semibold">First Name *</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="border-gray-300 focus:border-black focus:ring-black"
                  disabled={isLoadingProfile}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black font-semibold">Last Name *</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="border-gray-300 focus:border-black focus:ring-black"
                  disabled={isLoadingProfile}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                 <Label className="text-black font-semibold">Email Address</Label>
                 <Input
                   value={email}
                   disabled
                   className="border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                 />
                 <p className="text-xs text-gray-500">Email cannot be changed directly. Contact support for email changes.</p>
                 <Button 
                   variant="outline" 
                   size="sm"
                   className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50"
                   onClick={() => toast({
                     title: "Email Change",
                     description: "Please contact support to change your email address.",
                   })}
                 >
                   Request Email Change
                 </Button>
               </div>
              <div className="space-y-2">
                <Label className="text-black font-semibold">Username</Label>
                <Input
                  value={username}
                  disabled
                  className="border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">Username cannot be changed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleSaveProfile}
                className="bg-black text-white hover:bg-gray-800 font-semibold"
                disabled={isLoadingProfile}
              >
                {isLoadingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile Changes
                  </>
                )}
              </Button>
              {isLoadingProfile && (
                <p className="text-sm text-gray-500">Updating profile...</p>
              )}
            </div>
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
                <Label className="text-black font-semibold">Current Password *</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="border-gray-300 focus:border-black focus:ring-black pr-10"
                    disabled={isLoadingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={isLoadingPassword}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-black font-semibold">New Password *</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="border-gray-300 focus:border-black focus:ring-black pr-10"
                      disabled={isLoadingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      disabled={isLoadingPassword}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Password must be at least 8 characters long
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-black font-semibold">Confirm New Password *</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="border-gray-300 focus:border-black focus:ring-black"
                    disabled={isLoadingPassword}
                  />
                  {newPassword && confirmPassword && (
                    <div className="text-xs">
                      {newPassword === confirmPassword ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Passwords match
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handlePasswordChange}
                className="bg-black text-white hover:bg-gray-800 font-semibold"
                disabled={!currentPassword || !newPassword || !confirmPassword || isLoadingPassword}
              >
                {isLoadingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
              {isLoadingPassword && (
                <p className="text-sm text-gray-500">Updating password...</p>
              )}
            </div>
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