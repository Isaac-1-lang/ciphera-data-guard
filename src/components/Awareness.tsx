import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock,
  Award,
  Target,
  TrendingUp,
  Shield,
  AlertTriangle,
  Lightbulb,
  Star,
  Lock
} from 'lucide-react';

export default function AwarenessComponent() {
  const [selectedModule, setSelectedModule] = useState<string>('phishing');

  const trainingModules = [
    {
      id: 'phishing',
      title: 'Phishing Awareness',
      description: 'Learn to identify and avoid phishing attempts',
      duration: '15 min',
      difficulty: 'Beginner',
      progress: 1,
      completed: true,
      icon: AlertTriangle,
      color: 'from-red-600 to-pink-600',
      bgColor: 'from-red-100 to-pink-100'
    },
    {
      id: 'data-protection',
      title: 'Data Protection Basics',
      description: 'Understanding sensitive data and protection methods',
      duration: '20 min',
      difficulty: 'Beginner',
      progress: 100,
      completed: true,
      icon: Shield,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'from-blue-100 to-indigo-100'
    },
    {
      id: 'password-security',
      title: 'Password Security',
      description: 'Creating and managing secure passwords',
      duration: '12 min',
      difficulty: 'Intermediate',
      progress: 60,
      completed: false,
      icon: Lock,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-100 to-emerald-100'
    },
    {
      id: 'social-engineering',
      title: 'Social Engineering',
      description: 'Recognizing manipulation tactics',
      duration: '18 min',
      difficulty: 'Advanced',
      progress: 0,
      completed: false,
      icon: Users,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'from-purple-100 to-pink-100'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Completed your first training module',
      icon: Star,
      earned: true,
      date: '2024-01-10'
    },
    {
      id: 2,
      title: 'Security Champion',
      description: 'Completed 3 training modules',
      icon: Award,
      earned: true,
      date: '2024-01-12'
    },
    {
      id: 3,
      title: 'Knowledge Seeker',
      description: 'Spent 1 hour in training',
      icon: BookOpen,
      earned: false,
      date: null
    }
  ];

  const tips = [
    'Never share passwords or sensitive information via email',
    'Always verify sender addresses before clicking links',
    'Use unique passwords for different accounts',
    'Enable two-factor authentication when available',
    'Regularly update your security knowledge',
    'Report suspicious activities immediately'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Security Awareness
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Enhance your security knowledge through interactive training modules and best practices
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">4</h3>
            <p className="text-gray-600">Total Modules</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">0</h3>
            <p className="text-gray-600">Completed</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-orange-100 rounded-xl w-fit mx-auto mb-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">60 min</h3>
            <p className="text-gray-600">Total Time</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-4">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">1%</h3>
            <p className="text-gray-600">Overall Progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Training Modules */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            Training Modules
          </CardTitle>
          <CardDescription className="text-gray-600">
            Complete modules to improve your security awareness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trainingModules.map((module) => (
              <Card 
                key={module.id}
                className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  selectedModule === module.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedModule(module.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-gradient-to-br ${module.bgColor} rounded-xl`}>
                      <module.icon className={`h-8 w-8 bg-gradient-to-r ${module.color} bg-clip-text text-transparent`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{module.title}</h3>
                        {module.completed && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{module.description}</p>
                      
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {module.duration}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {module.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-800">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2 bg-gray-200" />
                      </div>
                      
                      <div className="mt-4">
                        {module.completed ? (
                          <Button variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </Button>
                        ) : (
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                            <Play className="h-4 w-4 mr-2" />
                            {module.progress > 0 ? 'Continue' : 'Start'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Module Details */}
      {selectedModule && (
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
              Module Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {trainingModules.find(m => m.id === selectedModule)?.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {trainingModules.find(m => m.id === selectedModule)?.description}
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Learning Objectives</h4>
                    <ul className="text-blue-700 space-y-1 text-sm">
                      <li>• Understand common security threats</li>
                      <li>• Learn prevention techniques</li>
                      <li>• Practice real-world scenarios</li>
                      <li>• Develop security mindset</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">What You'll Learn</h4>
                    <ul className="text-green-700 space-y-1 text-sm">
                      <li>• Threat identification methods</li>
                      <li>• Best practices for protection</li>
                      <li>• Incident response procedures</li>
                      <li>• Security tools and resources</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Module Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{trainingModules.find(m => m.id === selectedModule)?.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Difficulty:</span>
                        <span className="font-medium">{trainingModules.find(m => m.id === selectedModule)?.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium">{trainingModules.find(m => m.id === selectedModule)?.progress}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3">
                  <Play className="h-5 w-5 mr-2" />
                  Launch Module
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements and Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              Achievements
            </CardTitle>
            <CardDescription className="text-gray-600">
              Track your learning milestones and accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    achievement.earned 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <achievement.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <p className="text-xs text-green-600 mt-1">
                        Earned on {achievement.date}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                <Lightbulb className="h-6 w-6 text-green-600" />
              </div>
              Security Tips
            </CardTitle>
            <CardDescription className="text-gray-600">
              Quick reminders for maintaining security awareness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-blue-800">{tip}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Daily Challenge</h4>
              <p className="text-sm text-blue-700 mb-3">
                Review one security tip and apply it to your daily routine
              </p>
              <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Take Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
